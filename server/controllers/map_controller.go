package controllers

import (
	"context"
	"github.com/gofiber/fiber/v2"

	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/config"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetMaps(c *fiber.Ctx) error {
	var maps []models.Map
	cursor, err := config.DB.Collection("maps").Find(context.Background(), bson.M{})
	if err != nil {
		return err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var mapData models.Map
		if err := cursor.Decode(&mapData); err != nil {
			return err
		}
		maps = append(maps, mapData)
	}
	return c.Status(fiber.StatusOK).JSON(maps)
}

func GetMap(c *fiber.Ctx) error {
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

	var mapData models.Map
	err = config.DB.Collection("maps").FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&mapData)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Map not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(mapData)
}

func CreateMap(c *fiber.Ctx) error {
	var mapData models.Map
	if err := c.BodyParser(&mapData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

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

	if mapData.Places == nil {
		mapData.Places = []string{}
	}
	if mapData.Likes == nil {
		mapData.Likes = []primitive.ObjectID{}
	}

	res, err := config.DB.Collection("maps").InsertOne(context.Background(), mapData)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create map",
		})
	}

	mapData.ID = res.InsertedID.(primitive.ObjectID)
	return c.Status(fiber.StatusCreated).JSON(mapData)
}

func DeleteMap(c *fiber.Ctx) error {
	mapID := c.Params("id")
	if mapID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Map ID is required",
		})
	}

	objectID, err := primitive.ObjectIDFromHex(mapID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid map ID format",
		})
	}

	filter := bson.M{"_id": objectID}
	_, err = config.DB.Collection("maps").DeleteOne(context.Background(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not delete map",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func AddMapLike(c *fiber.Ctx) error {
	var body struct {
		MapID  primitive.ObjectID `json:"mapId"`
		UserID primitive.ObjectID `json:"userId"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if body.MapID == primitive.NilObjectID || body.UserID == primitive.NilObjectID {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Both map ID and user ID are required",
		})
	}

	filter := bson.M{"_id": body.MapID}
	update := bson.M{
		"$addToSet": bson.M{
			"likes": body.UserID,
		},
	}

	_, err := config.DB.Collection("maps").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not add like to map",
		})
	}

	var updatedMap models.User
	err = config.DB.Collection("maps").
		FindOne(context.Background(), filter).
		Decode(&updatedMap)
	if err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": "Map not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedMap)
}

func RemoveMapLike(c *fiber.Ctx) error {
	var body struct {
		MapID  primitive.ObjectID `json:"mapId"`
		UserID primitive.ObjectID `json:"userId"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if body.MapID == primitive.NilObjectID || body.UserID == primitive.NilObjectID {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Both map ID and user ID are required",
		})
	}

	filter := bson.M{"_id": body.MapID}
	update := bson.M{
		"$pull": bson.M{
			"likes": body.UserID,
		},
	}

	_, err := config.DB.Collection("maps").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not remove like from map",
		})
	}

	var updatedMap models.User
	err = config.DB.Collection("maps").
		FindOne(context.Background(), filter).
		Decode(&updatedMap)
	if err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": "Map not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedMap)
}

func AddPlaceToMap(c *fiber.Ctx) error {
	var body struct {
		MapID   primitive.ObjectID `json:"mapId"`
		PlaceID string             `json:"placeId"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if body.MapID == primitive.NilObjectID || body.PlaceID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Both map ID and place ID are required",
		})
	}

	filter := bson.M{"_id": body.MapID}
	update := bson.M{
		"$addToSet": bson.M{
			"places": body.PlaceID,
		},
	}

	_, err := config.DB.Collection("maps").
		UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update map",
		})
	}

	var updatedMap models.Map
	err = config.DB.Collection("maps").
		FindOne(context.Background(), filter).
		Decode(&updatedMap)
	if err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": "Could not add place to map",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedMap)
}

func RemovePlaceFromMap(c *fiber.Ctx) error {
	var body struct {
		MapID   primitive.ObjectID `json:"mapId"`
		PlaceID string             `json:"placeId"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if body.MapID == primitive.NilObjectID || body.PlaceID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Both map ID and place ID are required",
		})
	}

	filter := bson.M{"_id": body.MapID}
	update := bson.M{
		"$pull": bson.M{"places": body.PlaceID},
	}

	_, err := config.DB.Collection("maps").
		UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update map",
		})
	}

	var updatedMap models.Map
	err = config.DB.Collection("maps").
		FindOne(context.Background(), filter).
		Decode(&updatedMap)
	if err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": "Could not remove place to map",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedMap)
}
