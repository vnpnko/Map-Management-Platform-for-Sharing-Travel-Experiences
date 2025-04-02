package controllers

import (
	"context"
	"github.com/gofiber/fiber/v2"

	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/config"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GetMaps retrieves all maps.
func GetMaps(c *fiber.Ctx) error {
	var maps []models.Map
	cursor, err := config.DB.Collection("maps").Find(context.Background(), bson.M{})
	if err != nil {
		return err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var m models.Map
		if err := cursor.Decode(&m); err != nil {
			return err
		}
		maps = append(maps, m)
	}
	return c.Status(fiber.StatusOK).JSON(maps)
}

// GetMap retrieves a specific map by its ID.
func GetMap(c *fiber.Ctx) error {
	mapID := c.Params("id")
	if mapID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Map ID is required",
		})
	}

	var m models.Map
	err := config.DB.Collection("maps").FindOne(context.Background(), bson.M{"_id": mapID}).Decode(&m)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Map not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(m)
}

// CreateMap creates a new map.
func CreateMap(c *fiber.Ctx) error {
	var mapData models.Map
	if err := c.BodyParser(&mapData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate the input fields
	if mapData.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Map name is required",
		})
	}

	if mapData.Description == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Map description is required",
		})
	}

	// Set default empty places if not provided
	if mapData.Places == nil {
		mapData.Places = []string{}
	}

	// Insert the map into the database
	_, err := config.DB.Collection("maps").InsertOne(context.Background(), mapData)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create map",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(mapData)
}

// DeleteMap deletes a specific map by its ID.
func DeleteMap(c *fiber.Ctx) error {
	mapID := c.Params("id")
	if mapID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Map ID is required",
		})
	}

	filter := bson.M{"_id": mapID}
	_, err := config.DB.Collection("maps").DeleteOne(context.Background(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not delete map",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

// AddMapLike adds a like to the map.
func AddMapLike(c *fiber.Ctx) error {
	var body struct {
		MapID  string `json:"mapId"`
		UserID string `json:"userId"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	userObjID, err := primitive.ObjectIDFromHex(body.UserID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}

	filter := bson.M{"_id": body.MapID}
	update := bson.M{
		"$addToSet": bson.M{
			"likes": userObjID,
		},
	}

	_, err = config.DB.Collection("maps").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not add like to map",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

// RemoveMapLike removes a like from the map.
func RemoveMapLike(c *fiber.Ctx) error {
	var body struct {
		MapID  string `json:"mapId"`
		UserID string `json:"userId"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	userObjID, err := primitive.ObjectIDFromHex(body.UserID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}

	filter := bson.M{"_id": body.MapID}
	update := bson.M{
		"$pull": bson.M{
			"likes": userObjID,
		},
	}

	_, err = config.DB.Collection("maps").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not remove like from map",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

// AddPlaceToMap adds a place to a specific map
func AddPlaceToMap(c *fiber.Ctx) error {
	// Parse request body to get map and place IDs
	var body struct {
		MapID   string `json:"mapId"`
		PlaceID string `json:"placeId"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate map and place IDs
	if body.MapID == "" || body.PlaceID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Both map ID and place ID are required",
		})
	}

	// Ensure the place is not already added to the map
	filter := bson.M{"_id": body.MapID, "places": body.PlaceID}
	var mapData models.Map
	err := config.DB.Collection("maps").FindOne(context.Background(), filter).Decode(&mapData)
	if err == nil {
		// Place is already added, no need to add it again
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Place is already added to the map",
		})
	}

	// Update the map by adding the place ID
	update := bson.M{
		"$addToSet": bson.M{
			"places": body.PlaceID,
		},
	}
	_, err = config.DB.Collection("maps").UpdateOne(context.Background(), bson.M{"_id": body.MapID}, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not add place to map",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

// RemovePlaceFromMap removes a place from a specific map
func RemovePlaceFromMap(c *fiber.Ctx) error {
	// Parse request body to get map and place IDs
	var body struct {
		MapID   string `json:"mapId"`
		PlaceID string `json:"placeId"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate map and place IDs
	if body.MapID == "" || body.PlaceID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Both map ID and place ID are required",
		})
	}

	// Check if the place exists in the map's places
	filter := bson.M{"_id": body.MapID, "places": body.PlaceID}
	var mapData models.Map
	err := config.DB.Collection("maps").FindOne(context.Background(), filter).Decode(&mapData)
	if err != nil {
		// Place is not in the map
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Place not found in the map",
		})
	}

	// Remove the place ID from the map
	update := bson.M{
		"$pull": bson.M{
			"places": body.PlaceID,
		},
	}
	_, err = config.DB.Collection("maps").UpdateOne(context.Background(), bson.M{"_id": body.MapID}, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not remove place from map",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}
