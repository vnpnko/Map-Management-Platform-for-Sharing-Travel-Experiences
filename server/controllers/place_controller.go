package controllers

import (
	"context"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/dbhelpers"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/gofiber/fiber/v2"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/config"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/models"
	"go.mongodb.org/mongo-driver/bson"
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

	var place models.Place
	err := config.DB.Collection("places").
		FindOne(context.Background(), bson.M{"_id": placeID}).
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

	_, err := config.DB.Collection("places").
		InsertOne(context.Background(), place)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create place",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(place)
}

func DeletePlace(c *fiber.Ctx) error {
	placeID := c.Params("id")
	if placeID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Place ID is required",
		})
	}

	filter := bson.M{"_id": placeID}
	_, err := config.DB.Collection("places").DeleteOne(context.Background(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not delete place",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

// AddPlaceLike - POST /places/:placeId/likes/:userId
func AddPlaceLike(c *fiber.Ctx) error {
	// 1. Parse params
	placeID := c.Params("placeId")
	userID := c.Params("userId")

	if placeID == "" || userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "placeId and userId are required",
		})
	}

	// 2. Convert userID to ObjectID if needed, or numeric if your user IDs are numeric
	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}

	// 3. Build the filter & update
	filter := bson.M{"_id": placeID}
	update := bson.M{
		"$addToSet": bson.M{
			"likes": userObjID,
		},
	}

	// 4. Update the place document
	_, err = config.DB.Collection("places").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not add like to place",
		})
	}

	// 5. Return success or the updated place (if you want)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true})
}

// RemovePlaceLike - DELETE /places/:placeId/likes/:userId
func RemovePlaceLike(c *fiber.Ctx) error {
	placeID := c.Params("placeId")
	userID := c.Params("userId")

	if placeID == "" || userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "placeId and userId are required",
		})
	}

	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
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
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not remove like from place",
		})
	}

	// Return success or the updated doc
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
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch place IDs",
		})
	}
	return c.Status(fiber.StatusOK).JSON(ids)
}
