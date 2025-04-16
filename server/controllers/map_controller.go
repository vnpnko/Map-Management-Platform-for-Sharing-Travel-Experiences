package controllers

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/dbhelpers"

	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/config"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetMaps(c *fiber.Ctx) error {
	searchTerm := c.Query("search")

	var filter bson.M
	if searchTerm != "" {
		filter = bson.M{
			"$or": []bson.M{
				{"name": bson.M{"$regex": searchTerm, "$options": "i"}},
				{"description": bson.M{"$regex": searchTerm, "$options": "i"}},
			},
		}
	} else {
		filter = bson.M{}
	}

	var maps []models.Map
	cursor, err := config.DB.Collection("maps").Find(context.Background(), filter)
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
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Map places are required",
		})
	}

	if mapData.Likes == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Map likes are required",
		})
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

// AddMapLike - POST /maps/:mapId/likes/:userId
func AddMapLike(c *fiber.Ctx) error {
	// Extract route params
	mapIDStr := c.Params("mapId")
	userIDStr := c.Params("userId")

	if mapIDStr == "" || userIDStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Both mapId and userId are required",
		})
	}

	// Convert to ObjectID (assuming your map and user IDs are stored as ObjectIDs)
	mapObjID, err := primitive.ObjectIDFromHex(mapIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid map ID format",
		})
	}
	userObjID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}

	filter := bson.M{"_id": mapObjID}
	update := bson.M{"$addToSet": bson.M{"likes": userObjID}}

	_, err = config.DB.Collection("maps").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not add like to map",
		})
	}

	// Return the updated map
	var updatedMap models.Map
	if err := config.DB.Collection("maps").
		FindOne(context.Background(), filter).
		Decode(&updatedMap); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Map not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedMap)
}

// RemoveMapLike - DELETE /maps/:mapId/likes/:userId
func RemoveMapLike(c *fiber.Ctx) error {
	mapIDStr := c.Params("mapId")
	userIDStr := c.Params("userId")

	if mapIDStr == "" || userIDStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Both mapId and userId are required",
		})
	}

	mapObjID, err := primitive.ObjectIDFromHex(mapIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid map ID format",
		})
	}
	userObjID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}

	filter := bson.M{"_id": mapObjID}
	update := bson.M{"$pull": bson.M{"likes": userObjID}}

	_, err = config.DB.Collection("maps").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not remove like from map",
		})
	}

	// Return the updated map
	var updatedMap models.Map
	if err := config.DB.Collection("maps").
		FindOne(context.Background(), filter).
		Decode(&updatedMap); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Map not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedMap)
}

// AddPlaceToMap - POST /maps/:mapId/places/:placeId
func AddPlaceToMap(c *fiber.Ctx) error {
	mapIDStr := c.Params("mapId")
	placeIDStr := c.Params("placeId")

	if mapIDStr == "" || placeIDStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Both mapId and placeId are required",
		})
	}

	// Convert mapID to ObjectID if your DB uses ObjectID
	mapObjID, err := primitive.ObjectIDFromHex(mapIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid map ID format",
		})
	}

	// If placeId is also an ObjectID, do the same
	// but from your code snippet, placeId is a string field in your DB.
	// So we keep it as a string.

	filter := bson.M{"_id": mapObjID}
	update := bson.M{
		"$addToSet": bson.M{"places": placeIDStr},
	}

	_, err = config.DB.Collection("maps").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update map",
		})
	}

	// Return the updated map
	var updatedMap models.Map
	if err := config.DB.Collection("maps").
		FindOne(context.Background(), filter).
		Decode(&updatedMap); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Could not add place to map; map not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedMap)
}

// RemovePlaceFromMap - DELETE /maps/:mapId/places/:placeId
func RemovePlaceFromMap(c *fiber.Ctx) error {
	mapIDStr := c.Params("mapId")
	placeIDStr := c.Params("placeId")

	if mapIDStr == "" || placeIDStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Both mapId and placeId are required",
		})
	}

	mapObjID, err := primitive.ObjectIDFromHex(mapIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid map ID format",
		})
	}

	filter := bson.M{"_id": mapObjID}
	update := bson.M{
		"$pull": bson.M{"places": placeIDStr},
	}

	_, err = config.DB.Collection("maps").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update map",
		})
	}

	var updatedMap models.Map
	if err := config.DB.Collection("maps").
		FindOne(context.Background(), filter).
		Decode(&updatedMap); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Could not remove place from map; map not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedMap)
}

func GetMapsIDs(c *fiber.Ctx) error {
	search := c.Query("search")
	var filter interface{}
	if search != "" {
		filter = bson.M{
			"$or": []bson.M{
				{"name": bson.M{"$regex": search, "$options": "i"}},
				{"description": bson.M{"$regex": search, "$options": "i"}},
			},
		}
	} else {
		filter = bson.D{}
	}

	ids, err := dbhelpers.GetItemIDs[primitive.ObjectID](config.DB.Collection("maps"), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch map IDs",
		})
	}
	// Return a plain array of IDs.
	return c.Status(fiber.StatusOK).JSON(ids)
}
