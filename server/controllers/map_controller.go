package controllers

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/config"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/dbhelpers"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
	"sort"
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
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Database error",
			Details: err.Error(),
		})
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var mapData models.Map
		if err := cursor.Decode(&mapData); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
				Error:   "Failed to decode map",
				Details: err.Error(),
			})
		}
		maps = append(maps, mapData)
	}
	return c.Status(fiber.StatusOK).JSON(maps)
}

func GetMap(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "ID is required",
		})
	}

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid ID format",
			Details: err.Error(),
		})
	}

	var mapData models.Map
	err = config.DB.Collection("maps").FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&mapData)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(ErrorResponse{
			Error:   "Map not found",
			Details: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(mapData)
}

func CreateMap(c *fiber.Ctx) error {
	var mapData models.Map
	if err := c.BodyParser(&mapData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid request body",
			Details: err.Error(),
		})
	}

	if mapData.Name == "" {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error: "Map name is required",
		})
	}

	if mapData.Description == "" {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error: "Map description is required",
		})
	}

	if mapData.Places == nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error: "Map places are required",
		})
	}

	if mapData.Likes == nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error: "Map likes are required",
		})
	}

	res, err := config.DB.Collection("maps").InsertOne(context.Background(), mapData)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Could not create map",
			Details: err.Error(),
		})
	}

	mapData.ID = res.InsertedID.(primitive.ObjectID)
	return c.Status(fiber.StatusCreated).JSON(mapData)
}

func DeleteMap(c *fiber.Ctx) error {
	mapID := c.Params("id")
	if mapID == "" {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error: "Map ID is required",
		})
	}

	objectID, err := primitive.ObjectIDFromHex(mapID)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid map ID format",
			Details: err.Error(),
		})
	}

	filter := bson.M{"_id": objectID}
	_, err = config.DB.Collection("maps").DeleteOne(context.Background(), filter)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Could not delete map",
			Details: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func AddMapLike(c *fiber.Ctx) error {
	// Extract route params
	mapIDStr := c.Params("mapId")
	userIDStr := c.Params("userId")

	if mapIDStr == "" || userIDStr == "" {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error: "Both mapId and userId are required",
		})
	}

	// Convert to ObjectID (assuming your map and user IDs are stored as ObjectIDs)
	mapObjID, err := primitive.ObjectIDFromHex(mapIDStr)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid map ID format",
			Details: err.Error(),
		})
	}
	userObjID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid user ID format",
			Details: err.Error(),
		})
	}

	filter := bson.M{"_id": mapObjID}
	update := bson.M{"$addToSet": bson.M{"likes": userObjID}}

	_, err = config.DB.Collection("maps").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Could not add like to map",
			Details: err.Error(),
		})
	}

	var updatedMap models.Map
	if err := config.DB.Collection("maps").
		FindOne(context.Background(), filter).
		Decode(&updatedMap); err != nil {
		return c.Status(http.StatusNotFound).JSON(ErrorResponse{
			Error:   "Map not found",
			Details: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedMap)
}

func RemoveMapLike(c *fiber.Ctx) error {
	mapIDStr := c.Params("mapId")
	userIDStr := c.Params("userId")

	if mapIDStr == "" || userIDStr == "" {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error: "Both mapId and userId are required",
		})
	}

	mapObjID, err := primitive.ObjectIDFromHex(mapIDStr)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid map ID format",
			Details: err.Error(),
		})
	}
	userObjID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid user ID format",
			Details: err.Error(),
		})
	}

	filter := bson.M{"_id": mapObjID}
	update := bson.M{"$pull": bson.M{"likes": userObjID}}

	_, err = config.DB.Collection("maps").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Could not remove like from map",
			Details: err.Error(),
		})
	}

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

func AddPlaceToMap(c *fiber.Ctx) error {
	mapIDStr := c.Params("mapId")
	placeIDStr := c.Params("placeId")

	if mapIDStr == "" || placeIDStr == "" {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error: "Both mapId and placeId are required",
		})
	}

	mapObjID, err := primitive.ObjectIDFromHex(mapIDStr)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid map ID format",
			Details: err.Error(),
		})
	}

	filter := bson.M{"_id": mapObjID}
	update := bson.M{
		"$addToSet": bson.M{"places": placeIDStr},
	}

	_, err = config.DB.Collection("maps").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Failed to update map",
			Details: err.Error(),
		})
	}

	var updatedMap models.Map
	if err := config.DB.Collection("maps").
		FindOne(context.Background(), filter).
		Decode(&updatedMap); err != nil {
		return c.Status(http.StatusNotFound).JSON(ErrorResponse{
			Error:   "Could not add place to map; map not found",
			Details: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(updatedMap)
}

func RemovePlaceFromMap(c *fiber.Ctx) error {
	mapIDStr := c.Params("mapId")
	placeIDStr := c.Params("placeId")

	if mapIDStr == "" || placeIDStr == "" {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error: "Both mapId and placeId are required",
		})
	}

	mapObjID, err := primitive.ObjectIDFromHex(mapIDStr)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid map ID format",
			Details: err.Error(),
		})
	}

	filter := bson.M{"_id": mapObjID}
	update := bson.M{
		"$pull": bson.M{"places": placeIDStr},
	}

	_, err = config.DB.Collection("maps").UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Failed to update map",
			Details: err.Error(),
		})
	}

	var updatedMap models.Map
	if err := config.DB.Collection("maps").
		FindOne(context.Background(), filter).
		Decode(&updatedMap); err != nil {
		return c.Status(http.StatusNotFound).JSON(ErrorResponse{
			Error:   "Could not remove place from map; map not found",
			Details: err.Error(),
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
		return c.Status(http.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Failed to fetch map IDs",
			Details: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(ids)
}

func GetRecommendedMaps(c *fiber.Ctx) error {
	userIDHex := c.Params("userId")
	userID, err := primitive.ObjectIDFromHex(userIDHex)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}

	// 1. Fetch current user
	var currentUser models.User
	if err := config.DB.Collection("users").FindOne(context.Background(), bson.M{"_id": userID}).Decode(&currentUser); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// 2. Fetch all users the current user follows
	cursor, err := config.DB.Collection("users").Find(context.Background(), bson.M{
		"_id": bson.M{"$in": currentUser.Following},
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch followed users"})
	}

	var followedUsers []models.User
	if err := cursor.All(context.Background(), &followedUsers); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to decode followed users"})
	}

	// 3. Count map frequency
	mapFrequency := make(map[primitive.ObjectID]int)
	for _, u := range followedUsers {
		for _, mapID := range u.Maps {
			mapFrequency[mapID]++
		}
	}

	// 4. Exclude maps the user already likes
	exclude := make(map[primitive.ObjectID]struct{})
	for _, mapID := range currentUser.Maps {
		exclude[mapID] = struct{}{}
	}

	type ScoredMap struct {
		ID    primitive.ObjectID
		Score int
	}

	var scored []ScoredMap
	for id, count := range mapFrequency {
		if _, alreadyLiked := exclude[id]; alreadyLiked {
			continue
		}
		scored = append(scored, ScoredMap{ID: id, Score: count})
	}

	// 5. Sort by score
	sort.Slice(scored, func(i, j int) bool {
		return scored[i].Score > scored[j].Score
	})

	// 6. Take top 10 map IDs
	topMapIDs := []primitive.ObjectID{}
	for i := 0; i < len(scored) && i < 3; i++ {
		topMapIDs = append(topMapIDs, scored[i].ID)
	}

	if len(topMapIDs) == 0 {
		return c.JSON([]models.Map{})
	}

	// 7. Fetch map documents
	cursor, err = config.DB.Collection("maps").Find(context.Background(), bson.M{
		"_id": bson.M{"$in": topMapIDs},
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch maps"})
	}

	var maps []models.Map
	if err := cursor.All(context.Background(), &maps); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to decode maps"})
	}

	return c.JSON(maps)
}
