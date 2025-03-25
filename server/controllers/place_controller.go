package controllers

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/gofiber/fiber/v2"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/config"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/models"
	"go.mongodb.org/mongo-driver/bson"
)

func GetPlaces(c *fiber.Ctx) error {
	var places []models.Place
	cursor, err := config.DB.Collection("places").Find(context.Background(), bson.M{})
	if err != nil {
		return err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var place models.Place
		if err := cursor.Decode(&place); err != nil {
			return err
		}
		places = append(places, place)
	}
	return c.Status(fiber.StatusOK).JSON(places)
}

func GetPlace(c *fiber.Ctx) error {
	placeID := c.Params("id")
	if placeID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Place ID is required",
		})
	}

	objID, err := primitive.ObjectIDFromHex(placeID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid place ID format",
		})
	}

	var place models.Place
	err = config.DB.Collection("places").
		FindOne(context.Background(), bson.M{"_id": objID}).
		Decode(&place)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Place not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(place)
}

func CreatePlace(c *fiber.Ctx) error {
	var place models.Place
	if err := c.BodyParser(&place); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if place.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Place name is required",
		})
	}
	if place.URL == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Place URL is required",
		})
	}

	// If not provided, ensure Likes is an empty slice
	if place.Likes == nil {
		place.Likes = []primitive.ObjectID{}
	}

	insertResult, err := config.DB.Collection("places").
		InsertOne(context.Background(), place)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create place",
		})
	}

	place.ID = insertResult.InsertedID.(primitive.ObjectID)
	return c.Status(fiber.StatusCreated).JSON(place)
}

func DeletePlace(c *fiber.Ctx) error {
	placeID := c.Params("id")
	if placeID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Place ID is required",
		})
	}

	objID, err := primitive.ObjectIDFromHex(placeID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid place ID format",
		})
	}

	// Delete the place from the DB
	filter := bson.M{"_id": objID}
	_, err = config.DB.Collection("places").DeleteOne(context.Background(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not delete place",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func AddPlaceLike(c *fiber.Ctx) error {
	var body struct {
		PlaceID string `json:"placeId"`
		UserID  string `json:"userId"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	placeObjID, err := primitive.ObjectIDFromHex(body.PlaceID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid place ID format",
		})
	}
	userObjID, err := primitive.ObjectIDFromHex(body.UserID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}

	// Add the user's ID to the place's Likes array (if not already present)
	filter := bson.M{"_id": placeObjID}
	update := bson.M{
		"$addToSet": bson.M{
			"likes": userObjID,
		},
	}

	_, err = config.DB.Collection("places").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not add like to place",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

// PATCH /api/places/removeLike
func RemovePlaceLike(c *fiber.Ctx) error {
	var body struct {
		PlaceID string `json:"placeId"`
		UserID  string `json:"userId"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	placeObjID, err := primitive.ObjectIDFromHex(body.PlaceID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid place ID format",
		})
	}
	userObjID, err := primitive.ObjectIDFromHex(body.UserID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}

	filter := bson.M{"_id": placeObjID}
	update := bson.M{
		"$pull": bson.M{
			"likes": userObjID,
		},
	}

	_, err = config.DB.Collection("places").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not remove like from place",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}
