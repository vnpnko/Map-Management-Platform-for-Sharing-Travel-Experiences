package controllers

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/config"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/dbhelpers"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/models"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"sort"
	"strings"
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

	user.Name = strings.TrimSpace(user.Name)
	user.Username = strings.TrimSpace(user.Username)
	user.Password = strings.TrimSpace(user.Password)

	if user.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "Full name is required",
			Type:  "name",
		})
	}

	if user.Username == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "Username is required",
			Type:  "username",
		})
	}

	if user.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "Password is required",
			Type:  "password",
		})
	}

	if len(user.Password) < 6 {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "Password must be at least 6 characters",
			Type:  "password",
		})
	}

	var existing models.User
	err := config.DB.Collection("users").FindOne(context.Background(), bson.M{"username": user.Username}).Decode(&existing)
	if err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "Username already exists",
			Type:  "username",
		})
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
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			Error: "Could not create user",
		})
	}

	user.ID = res.InsertedID.(primitive.ObjectID)
	return c.Status(fiber.StatusCreated).JSON(user)
}

func LoginUser(c *fiber.Ctx) error {
	var payload struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "Invalid request body",
		})
	}

	payload.Username = strings.TrimSpace(payload.Username)
	payload.Password = strings.TrimSpace(payload.Password)

	if payload.Username == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "Username is required",
			Type:  "username",
		})
	}
	if payload.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "Password is required",
			Type:  "password",
		})
	}

	filter := bson.M{
		"username": payload.Username,
		"password": payload.Password,
	}

	var user models.User
	err := config.DB.Collection("users").FindOne(context.Background(), filter).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(ErrorResponse{
			Error: "Invalid credentials",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(user)
}

func FollowUser(c *fiber.Ctx) error {
	followerIDHex := c.Params("followerId")
	followeeIDHex := c.Params("followeeId")

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

	session, err := config.DB.Client().StartSession()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not start session",
		})
	}
	defer session.EndSession(context.Background())

	callback := func(sc mongo.SessionContext) (interface{}, error) {
		filterFollower := bson.M{"_id": followerObjID}
		updateFollower := bson.M{"$addToSet": bson.M{"following": followeeObjID}}
		if _, err := config.DB.Collection("users").UpdateOne(sc, filterFollower, updateFollower); err != nil {
			return nil, err
		}

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

func UnfollowUser(c *fiber.Ctx) error {
	followerIDHex := c.Params("followerId")
	followeeIDHex := c.Params("followeeId")

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
		filterFollower := bson.M{"_id": followerObjID}
		updateFollower := bson.M{"$pull": bson.M{"following": followeeObjID}}
		if _, err := config.DB.Collection("users").UpdateOne(sc, filterFollower, updateFollower); err != nil {
			return nil, err
		}

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
		Name     string             `json:"name"`
		Username string             `json:"username"`
		Password string             `json:"password"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	filter := bson.M{"_id": body.UserID}
	update := bson.M{
		"$set": bson.M{
			"name":     body.Name,
			"username": body.Username,
			"password": body.Password,
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
	userIdStr := c.Params("userId")
	placeIdStr := c.Params("placeId")

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
	update := bson.M{"$addToSet": bson.M{"places": placeIdStr}}

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

func RemovePlaceFromUser(c *fiber.Ctx) error {
	userIdStr := c.Params("userId")
	placeIdStr := c.Params("placeId")

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
		"$addToSet": bson.M{"maps": mapObjID},
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

func GetRecommendedUsers(c *fiber.Ctx) error {
	userID, err := primitive.ObjectIDFromHex(c.Params("userId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID format"})
	}

	var currentUser models.User
	if err := config.DB.Collection("users").FindOne(context.Background(), bson.M{"_id": userID}).Decode(&currentUser); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	if len(currentUser.Following) == 0 {
		return c.JSON([]models.User{})
	}

	cursor, err := config.DB.Collection("users").Find(context.Background(), bson.M{
		"_id": bson.M{"$in": currentUser.Following},
	})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch followings"})
	}

	var followedUsers []models.User
	if err := cursor.All(context.Background(), &followedUsers); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to decode users"})
	}

	userFrequency := map[primitive.ObjectID]int{}
	for _, user := range followedUsers {
		for _, id := range user.Following {
			userFrequency[id]++
		}
	}

	exclude := make(map[primitive.ObjectID]struct{})
	for _, fid := range currentUser.Following {
		exclude[fid] = struct{}{}
	}
	exclude[userID] = struct{}{}

	candidateIDs := utils.FilterCandidates(userFrequency, exclude)

	if len(candidateIDs) == 0 {
		return c.JSON([]models.User{})
	}

	cursor, err = config.DB.Collection("users").Find(context.Background(), bson.M{
		"_id": bson.M{"$in": candidateIDs},
	})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch users"})
	}

	var candidates []models.User
	if err := cursor.All(context.Background(), &candidates); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to decode candidate users"})
	}

	scored := make([]models.ScoredUser, 0)
	for _, user := range candidates {
		freq := userFrequency[user.ID]
		score := utils.ComputeScore(freq, len(user.Followers))
		scored = append(scored, models.ScoredUser{User: user, Score: score})
	}

	sort.Slice(scored, func(i, j int) bool {
		return scored[i].Score > scored[j].Score
	})

	top := make([]models.User, 0, 3)
	for i := 0; i < len(scored) && i < 3; i++ {
		top = append(top, scored[i].User)
	}

	return c.JSON(top)
}
