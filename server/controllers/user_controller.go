package controllers

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/config"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/dbhelpers"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetUsers(c *fiber.Ctx) error {
	searchTerm := c.Query("search")

	var filter bson.M
	if searchTerm != "" {
		filter = bson.M{
			"$or": []bson.M{
				{"name": bson.M{"$regex": searchTerm, "$options": "i"}},
				{"username": bson.M{"$regex": searchTerm, "$options": "i"}},
			},
		}
	} else {
		filter = bson.M{}
	}

	var users []models.User
	cursor, err := config.DB.Collection("users").Find(context.Background(), filter)
	if err != nil {
		return err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			return err
		}
		users = append(users, user)
	}
	return c.Status(fiber.StatusOK).JSON(users)
}

func GetUserByID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid ID format",
		})
	}

	var user models.User
	err = config.DB.Collection("users").
		FindOne(context.Background(), bson.M{"_id": objectID}).
		Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}
	return c.Status(fiber.StatusOK).JSON(user)
}

func GetUserByUsername(c *fiber.Ctx) error {
	username := c.Params("username")
	if username == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Username is required",
		})
	}
	var user models.User
	err := config.DB.Collection("users").
		FindOne(context.Background(), bson.M{"username": username}).
		Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}
	return c.Status(fiber.StatusOK).JSON(user)
}

func CreateUser(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if user.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email is required"})
	}
	if user.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Name is required"})
	}
	if user.Username == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Username is required"})
	}
	if user.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Password is required"})
	}

	if user.Followers == nil {
		user.Followers = []primitive.ObjectID{}
	}
	if user.Following == nil {
		user.Following = []primitive.ObjectID{}
	}
	if user.Places == nil {
		user.Places = []string{}
	}
	if user.Maps == nil {
		user.Maps = []primitive.ObjectID{}
	}

	res, err := config.DB.Collection("users").InsertOne(context.Background(), user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create user",
		})
	}

	user.ID = res.InsertedID.(primitive.ObjectID)
	return c.Status(fiber.StatusCreated).JSON(user)
}

func LoginUser(c *fiber.Ctx) error {
	var payload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	filter := bson.M{
		"email":    payload.Email,
		"password": payload.Password,
	}

	var user models.User
	err := config.DB.Collection("users").FindOne(context.Background(), filter).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	// Successful login
	return c.Status(fiber.StatusCreated).JSON(user)
}

// FollowUser implements POST /users/:followerId/following/:followeeId
func FollowUser(c *fiber.Ctx) error {
	followerIDHex := c.Params("followerId")
	followeeIDHex := c.Params("followeeId")

	// Validate IDs
	followerObjID, err := primitive.ObjectIDFromHex(followerIDHex)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid follower ID format",
		})
	}
	followeeObjID, err := primitive.ObjectIDFromHex(followeeIDHex)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid followee ID format",
		})
	}
	if followerObjID == followeeObjID {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User cannot follow themselves",
		})
	}

	// Start a Mongo transaction
	session, err := config.DB.Client().StartSession()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not start session",
		})
	}
	defer session.EndSession(context.Background())

	callback := func(sc mongo.SessionContext) (interface{}, error) {
		// 1) Add followee to follower's "following" array
		filterFollower := bson.M{"_id": followerObjID}
		updateFollower := bson.M{"$addToSet": bson.M{"following": followeeObjID}}
		if _, err := config.DB.Collection("users").UpdateOne(sc, filterFollower, updateFollower); err != nil {
			return nil, err
		}

		// 2) Add follower to followee's "followers" array
		filterFollowee := bson.M{"_id": followeeObjID}
		updateFollowee := bson.M{"$addToSet": bson.M{"followers": followerObjID}}
		if _, err := config.DB.Collection("users").UpdateOne(sc, filterFollowee, updateFollowee); err != nil {
			return nil, err
		}

		return nil, nil
	}

	_, err = session.WithTransaction(context.Background(), callback)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Transaction failed: " + err.Error(),
		})
	}

	// Return the updated follower so front-end can see the new 'following' array
	var updatedUser models.User
	filterFollower := bson.M{"_id": followerObjID}
	if err := config.DB.Collection("users").
		FindOne(context.Background(), filterFollower).
		Decode(&updatedUser); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Follower user not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedUser)
}

// UnfollowUser implements DELETE /users/:followerId/following/:followeeId
func UnfollowUser(c *fiber.Ctx) error {
	followerIDHex := c.Params("followerId")
	followeeIDHex := c.Params("followeeId")

	// Validate IDs
	followerObjID, err := primitive.ObjectIDFromHex(followerIDHex)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid follower ID format",
		})
	}
	followeeObjID, err := primitive.ObjectIDFromHex(followeeIDHex)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid followee ID format",
		})
	}
	if followerObjID == followeeObjID {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User cannot unfollow themselves",
		})
	}

	session, err := config.DB.Client().StartSession()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not start session",
		})
	}
	defer session.EndSession(context.Background())

	callback := func(sc mongo.SessionContext) (interface{}, error) {
		// 1) Remove followee from follower's "following" array
		filterFollower := bson.M{"_id": followerObjID}
		updateFollower := bson.M{"$pull": bson.M{"following": followeeObjID}}
		if _, err := config.DB.Collection("users").UpdateOne(sc, filterFollower, updateFollower); err != nil {
			return nil, err
		}

		// 2) Remove follower from followee's "followers" array
		filterFollowee := bson.M{"_id": followeeObjID}
		updateFollowee := bson.M{"$pull": bson.M{"followers": followerObjID}}
		if _, err := config.DB.Collection("users").UpdateOne(sc, filterFollowee, updateFollowee); err != nil {
			return nil, err
		}
		return nil, nil
	}

	_, err = session.WithTransaction(context.Background(), callback)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Transaction failed: " + err.Error(),
		})
	}

	// Return the updated follower user after removing the followee
	var updatedUser models.User
	filterFollower := bson.M{"_id": followerObjID}
	if err := config.DB.Collection("users").
		FindOne(context.Background(), filterFollower).
		Decode(&updatedUser); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Follower user not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedUser)
}

func UpdateUserData(c *fiber.Ctx) error {
	var body struct {
		UserID   primitive.ObjectID `json:"id"`
		Username string             `json:"username"`
		Name     string             `json:"name"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	if body.Username == "" || body.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Username and name are required",
		})
	}

	filter := bson.M{"_id": body.UserID}
	update := bson.M{
		"$set": bson.M{
			"username": body.Username,
			"name":     body.Name,
		},
	}

	_, err := config.DB.Collection("users").
		UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user data",
		})
	}

	var updatedUser models.User
	err = config.DB.Collection("users").
		FindOne(context.Background(), filter).
		Decode(&updatedUser)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}
	return c.Status(fiber.StatusOK).JSON(updatedUser)
}

func DeleteUser(c *fiber.Ctx) error {
	userID := c.Params("id")
	if userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User ID is required",
		})
	}

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}

	filter := bson.M{"_id": objectID}
	_, err = config.DB.Collection("users").DeleteOne(context.Background(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not delete user",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func AddPlaceToUser(c *fiber.Ctx) error {
	// 1. Extract userId and placeId from path params
	userIdStr := c.Params("userId")
	placeIdStr := c.Params("placeId")

	// If your user IDs are MongoDB ObjectIDs:
	// userObjID, err := primitive.ObjectIDFromHex(userIdStr)
	// If your user IDs are numeric, do: userId, err := strconv.Atoi(userIdStr)
	// For now, let's assume they're ObjectIDs
	userObjID, err := primitive.ObjectIDFromHex(userIdStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}
	if placeIdStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Place ID is required",
		})
	}

	// 2. Construct filter & update
	filter := bson.M{"_id": userObjID}
	update := bson.M{"$addToSet": bson.M{"places": placeIdStr}}

	// 3. Perform the update
	if _, err := config.DB.Collection("users").
		UpdateOne(context.Background(), filter, update); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user",
		})
	}

	// 4. Return the updated user
	var updatedUser models.User
	if err := config.DB.Collection("users").
		FindOne(context.Background(), filter).
		Decode(&updatedUser); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedUser)
}

func RemovePlaceFromUser(c *fiber.Ctx) error {
	userIdStr := c.Params("userId")
	placeIdStr := c.Params("placeId")

	// If numeric IDs: userId, err := strconv.Atoi(userIdStr)
	userObjID, err := primitive.ObjectIDFromHex(userIdStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}
	if placeIdStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Place ID is required",
		})
	}

	filter := bson.M{"_id": userObjID}
	update := bson.M{"$pull": bson.M{"places": placeIdStr}}

	if _, err := config.DB.Collection("users").
		UpdateOne(context.Background(), filter, update); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user",
		})
	}

	var updatedUser models.User
	if err := config.DB.Collection("users").
		FindOne(context.Background(), filter).
		Decode(&updatedUser); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedUser)
}

func AddMapToUser(c *fiber.Ctx) error {
	userIDStr := c.Params("userId")
	mapIDStr := c.Params("mapId")

	// If your userID is a Mongo ObjectID:
	userObjID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}
	// If your map ID is also an ObjectID, do the same:
	mapObjID, err := primitive.ObjectIDFromHex(mapIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid map ID format",
		})
	}

	// Filter by user _id, and add this map to their "maps" array
	filter := bson.M{"_id": userObjID}
	update := bson.M{
		"$addToSet": bson.M{"maps": mapObjID},
	}

	if _, err := config.DB.Collection("users").
		UpdateOne(context.Background(), filter, update); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user",
		})
	}

	// Return the updated user
	var updatedUser models.User
	if err := config.DB.Collection("users").
		FindOne(context.Background(), filter).
		Decode(&updatedUser); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedUser)
}

func RemoveMapFromUser(c *fiber.Ctx) error {
	userIDStr := c.Params("userId")
	mapIDStr := c.Params("mapId")

	userObjID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}
	mapObjID, err := primitive.ObjectIDFromHex(mapIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid map ID format",
		})
	}

	filter := bson.M{"_id": userObjID}
	update := bson.M{
		"$pull": bson.M{"maps": mapObjID},
	}

	if _, err := config.DB.Collection("users").
		UpdateOne(context.Background(), filter, update); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user",
		})
	}

	var updatedUser models.User
	if err := config.DB.Collection("users").
		FindOne(context.Background(), filter).
		Decode(&updatedUser); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedUser)
}

func GetUsersIDs(c *fiber.Ctx) error {
	search := c.Query("search")
	var filter interface{}
	if search != "" {
		filter = bson.M{
			"$or": []bson.M{
				{"name": bson.M{"$regex": search, "$options": "i"}},
				{"username": bson.M{"$regex": search, "$options": "i"}},
			},
		}
	} else {
		filter = bson.D{}
	}

	ids, err := dbhelpers.GetItemIDs[primitive.ObjectID](config.DB.Collection("users"), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch user IDs",
		})
	}
	return c.Status(fiber.StatusOK).JSON(ids)
}
