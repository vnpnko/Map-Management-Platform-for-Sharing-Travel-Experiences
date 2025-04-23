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
	username := c.Params("username")
	if username == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid username",
			Details: "Username parameter is required",
		})
	}

	var mapData models.Map
	if err := c.BodyParser(&mapData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid request body",
			Details: err.Error(),
		})
	}

	if mapData.Name == "" {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Could not create map",
			Details: "Map name is required",
		})
	}

	if mapData.Description == "" {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Could not create map",
			Details: "Map description is required",
		})
	}

	if len(mapData.Places) < 2 {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Could not create map",
			Details: "Map must have at least 2 places",
		})
	}

	mapData.CreatorUsername = username

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
	mapID := c.Params("mapId")
	userID := c.Params("userId")
	if mapID == "" || userID == "" {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Could not like map",
			Details: "mapId and userId required",
		})
	}

	mapObjID, err := primitive.ObjectIDFromHex(mapID)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Could not like map",
			Details: "invalid mapId",
		})
	}

	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Could not like map",
			Details: "invalid userId",
		})
	}

	session, err := config.DB.Client().StartSession()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Could not like map",
			Details: "could not start session",
		})
	}
	defer session.EndSession(context.Background())

	txn := func(sc mongo.SessionContext) (interface{}, error) {
		if _, err := config.DB.Collection("maps").
			UpdateOne(sc,
				bson.M{"_id": mapObjID},
				bson.M{"$addToSet": bson.M{"likes": userObjID}},
			); err != nil {
			return nil, err
		}
		if _, err := config.DB.Collection("users").
			UpdateOne(sc,
				bson.M{"_id": userObjID},
				bson.M{"$addToSet": bson.M{"maps": mapObjID}},
			); err != nil {
			return nil, err
		}
		return nil, nil
	}

	if _, err := session.WithTransaction(context.Background(), txn); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Could not like map",
			Details: "transaction failed",
		})
	}

	var updatedUser models.User
	if err := config.DB.Collection("users").
		FindOne(context.Background(), bson.M{"_id": userObjID}).
		Decode(&updatedUser); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Could not like map",
			Details: "could not fetch updated user",
		})
	}

	return c.JSON(updatedUser)
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
		return c.Status(http.StatusNotFound).JSON(ErrorResponse{
			Error:   "Map not found",
			Details: err.Error(),
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
	userID, err := primitive.ObjectIDFromHex(c.Params("userId"))
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error:   "Invalid user ID format",
			Details: err.Error(),
		})
	}

	var currentUser models.User
	if err := config.DB.Collection("users").FindOne(context.Background(), bson.M{"_id": userID}).Decode(&currentUser); err != nil {
		return c.Status(http.StatusNotFound).JSON(ErrorResponse{
			Error:   "User not found",
			Details: err.Error(),
		})
	}

	if len(currentUser.Following) == 0 {
		return c.JSON([]models.Map{})
	}

	cursor, err := config.DB.Collection("users").Find(context.Background(), bson.M{
		"_id": bson.M{"$in": currentUser.Following},
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Failed to fetch followed users",
			Details: err.Error(),
		})
	}

	var followedUsers []models.User
	if err := cursor.All(context.Background(), &followedUsers); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Failed to decode followed users",
			Details: err.Error(),
		})
	}

	mapFrequency := map[primitive.ObjectID]int{}
	for _, user := range followedUsers {
		for _, id := range user.Maps {
			mapFrequency[id]++
		}
	}

	exclude := make(map[primitive.ObjectID]struct{})
	for _, id := range currentUser.Maps {
		exclude[id] = struct{}{}
	}

	candidateIDs := utils.FilterCandidates(mapFrequency, exclude)

	if len(candidateIDs) == 0 {
		return c.JSON([]models.Map{})
	}

	cursor, err = config.DB.Collection("maps").Find(context.Background(), bson.M{
		"_id": bson.M{"$in": candidateIDs},
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Failed to fetch maps",
			Details: err.Error(),
		})
	}

	var candidates []models.Map
	if err := cursor.All(context.Background(), &candidates); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
			Error:   "Failed to decode maps",
			Details: err.Error(),
		})
	}

	scored := make([]models.ScoredMap, 0)
	for _, m := range candidates {
		freq := mapFrequency[m.ID]
		score := utils.ComputeScore(freq, len(m.Likes))
		scored = append(scored, models.ScoredMap{Map: m, Score: score})
	}

	sort.Slice(scored, func(i, j int) bool {
		return scored[i].Score > scored[j].Score
	})

	top := make([]models.Map, 0, 3)
	for i := 0; i < len(scored) && i < 3; i++ {
		top = append(top, scored[i].Map)
	}

	return c.JSON(top)
}
