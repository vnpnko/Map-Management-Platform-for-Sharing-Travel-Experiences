package controllers

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/config"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/dbhelpers"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"sort"
)

func GetPlaces(c *fiber.Ctx) error {
	searchTerm := c.Query("search")

	var filter bson.M
	if searchTerm != "" {
		filter = bson.M{
			"name": bson.M{"$regex": searchTerm, "$options": "i"},
		}
	} else {
		filter = bson.M{}
	}

	var places []models.Place
	cursor, err := config.DB.Collection("places").Find(context.Background(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			UseToastError:   "Database error",
			Details: err.UseToastError(),
		})
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var place models.Place
		if err := cursor.Decode(&place); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
				UseToastError:   "Failed to decode place",
				Details: err.UseToastError(),
			})
		}
		places = append(places, place)
	}
	return c.Status(fiber.StatusOK).JSON(places)
}

func GetPlace(c *fiber.Ctx) error {
	placeID := c.Params("id")
	if placeID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			UseToastError: "Place ID is required",
		})
	}

	var place models.Place
	err := config.DB.Collection("places").
		FindOne(context.Background(), bson.M{"_id": placeID}).
		Decode(&place)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(ErrorResponse{
			UseToastError:   "Place not found",
			Details: err.UseToastError(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(place)
}

func CreatePlace(c *fiber.Ctx) error {
	var place models.Place
	if err := c.BodyParser(&place); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			UseToastError:   "Invalid request body",
			Details: err.UseToastError(),
		})
	}

	_, err := config.DB.Collection("places").
		InsertOne(context.Background(), place)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			UseToastError:   "Could not create place",
			Details: err.UseToastError(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(place)
}

func DeletePlace(c *fiber.Ctx) error {
	placeID := c.Params("id")
	if placeID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			UseToastError: "Place ID is required",
		})
	}

	filter := bson.M{"_id": placeID}
	_, err := config.DB.Collection("places").DeleteOne(context.Background(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			UseToastError:   "Could not delete place",
			Details: err.UseToastError(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func AddPlaceLike(c *fiber.Ctx) error {
	placeID := c.Params("placeId")
	userID := c.Params("userId")

	if placeID == "" || userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			UseToastError: "placeId and userId are required",
		})
	}

	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			UseToastError:   "Invalid user ID format",
			Details: err.UseToastError(),
		})
	}

	filter := bson.M{"_id": placeID}
	update := bson.M{
		"$addToSet": bson.M{
			"likes": userObjID,
		},
	}

	_, err = config.DB.Collection("places").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			UseToastError:   "Could not add like to place",
			Details: err.UseToastError(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true})
}

func RemovePlaceLike(c *fiber.Ctx) error {
	placeID := c.Params("placeId")
	userID := c.Params("userId")

	if placeID == "" || userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			UseToastError: "placeId and userId are required",
		})
	}

	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			UseToastError:   "Invalid user ID format",
			Details: err.UseToastError(),
		})
	}

	filter := bson.M{"_id": placeID}
	update := bson.M{
		"$pull": bson.M{
			"likes": userObjID,
		},
	}

	_, err = config.DB.Collection("places").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			UseToastError:   "Could not remove like from place",
			Details: err.UseToastError(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true})
}

func GetPlacesIDs(c *fiber.Ctx) error {
	search := c.Query("search")
	var filter interface{}
	if search != "" {
		filter = bson.M{
			"name": bson.M{
				"$regex":   search,
				"$options": "i",
			},
		}
	} else {
		filter = bson.D{}
	}

	ids, err := dbhelpers.GetItemIDs[string](config.DB.Collection("places"), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			UseToastError:   "Failed to fetch place IDs",
			Details: err.UseToastError(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(ids)
}

func GetRecommendedPlaces(c *fiber.Ctx) error {
	userIDHex := c.Params("userId")
	userID, err := primitive.ObjectIDFromHex(userIDHex)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}

	// 1. Get current user
	var currentUser models.User
	if err := config.DB.Collection("users").FindOne(context.Background(), bson.M{"_id": userID}).Decode(&currentUser); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// 2. Get all users that this user is following
	cursor, err := config.DB.Collection("users").Find(context.Background(), bson.M{
		"_id": bson.M{"$in": currentUser.Following},
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch following users"})
	}

	var followedUsers []models.User
	if err := cursor.All(context.Background(), &followedUsers); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to decode followed users"})
	}

	// 3. Count how often each place is liked
	placeFrequency := make(map[string]int)
	for _, u := range followedUsers {
		for _, placeID := range u.Places {
			placeFrequency[placeID]++
		}
	}

	// 4. Exclude places already liked by the current user
	exclude := make(map[string]struct{})
	for _, placeID := range currentUser.Places {
		exclude[placeID] = struct{}{}
	}

	type ScoredPlace struct {
		ID    string
		Score int
	}

	var scored []ScoredPlace
	for id, count := range placeFrequency {
		if _, alreadyLiked := exclude[id]; alreadyLiked {
			continue
		}
		scored = append(scored, ScoredPlace{ID: id, Score: count})
	}

	// 5. Sort by score descending
	sort.Slice(scored, func(i, j int) bool {
		return scored[i].Score > scored[j].Score
	})

	// 6. Prepare top 10 place IDs
	topPlaceIDs := []string{}
	for i := 0; i < len(scored) && i < 3; i++ {
		topPlaceIDs = append(topPlaceIDs, scored[i].ID)
	}

	if len(topPlaceIDs) == 0 {
		return c.JSON([]models.Place{})
	}

	// 7. Query places collection by string IDs
	cursor, err = config.DB.Collection("places").Find(context.Background(), bson.M{
		"_id": bson.M{"$in": topPlaceIDs},
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch places"})
	}

	var places []models.Place
	if err := cursor.All(context.Background(), &places); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to decode places"})
	}

	return c.JSON(places)
}
