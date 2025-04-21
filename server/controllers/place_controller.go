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
			Error:   "Database error",
			Details: err.Error(),
		})
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var place models.Place
		if err := cursor.Decode(&place); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
				Error:   "Failed to decode place",
				Details: err.Error(),
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
			Error: "Place ID is required",
		})
	}

	var place models.Place
	err := config.DB.Collection("places").
		FindOne(context.Background(), bson.M{"_id": placeID}).
		Decode(&place)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(ErrorResponse{
			Error:   "Place not found",
			Details: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(place)
}

func CreatePlace(c *fiber.Ctx) error {
	var place models.Place
	if err := c.BodyParser(&place); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid request body",
			Details: err.Error(),
		})
	}

	_, err := config.DB.Collection("places").
		InsertOne(context.Background(), place)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Could not create place",
			Details: err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(place)
}

func DeletePlace(c *fiber.Ctx) error {
	placeID := c.Params("id")
	if placeID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "Place ID is required",
		})
	}

	filter := bson.M{"_id": placeID}
	_, err := config.DB.Collection("places").DeleteOne(context.Background(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Could not delete place",
			Details: err.Error(),
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
			Error: "placeId and userId are required",
		})
	}

	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid user ID format",
			Details: err.Error(),
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
			Error:   "Could not add like to place",
			Details: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true})
}

func RemovePlaceLike(c *fiber.Ctx) error {
	placeID := c.Params("placeId")
	userID := c.Params("userId")

	if placeID == "" || userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "placeId and userId are required",
		})
	}

	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid user ID format",
			Details: err.Error(),
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
			Error:   "Could not remove like from place",
			Details: err.Error(),
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
			Error:   "Failed to fetch place IDs",
			Details: err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(ids)
}

func GetRecommendedPlaces(c *fiber.Ctx) error {
	userID, err := primitive.ObjectIDFromHex(c.Params("userId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID format"})
	}

	var currentUser models.User
	if err := config.DB.Collection("users").FindOne(context.Background(), bson.M{"_id": userID}).Decode(&currentUser); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	if len(currentUser.Following) == 0 {
		return c.JSON([]models.Place{})
	}

	cursor, err := config.DB.Collection("users").Find(context.Background(), bson.M{
		"_id": bson.M{"$in": currentUser.Following},
	})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch followed users"})
	}

	var followedUsers []models.User
	if err := cursor.All(context.Background(), &followedUsers); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to decode followed users"})
	}

	placeFrequency := map[string]int{}
	for _, user := range followedUsers {
		for _, id := range user.Places {
			placeFrequency[id]++
		}
	}

	exclude := make(map[string]struct{})
	for _, pid := range currentUser.Places {
		exclude[pid] = struct{}{}
	}

	candidateIDs := utils.FilterCandidates(placeFrequency, exclude)

	if len(candidateIDs) == 0 {
		return c.JSON([]models.Place{})
	}

	cursor, err = config.DB.Collection("places").Find(context.Background(), bson.M{
		"_id": bson.M{"$in": candidateIDs},
	})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch places"})
	}

	var candidates []models.Place
	if err := cursor.All(context.Background(), &candidates); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to decode places"})
	}

	scored := make([]models.ScoredPlace, 0)
	for _, place := range candidates {
		freq := placeFrequency[place.ID]
		score := utils.ComputeScore(freq, len(place.Likes))
		scored = append(scored, models.ScoredPlace{Place: place, Score: score})
	}

	sort.Slice(scored, func(i, j int) bool {
		return scored[i].Score > scored[j].Score
	})

	top := make([]models.Place, 0, 3)
	for i := 0; i < len(scored) && i < 3; i++ {
		top = append(top, scored[i].Place)
	}

	return c.JSON(top)
}
