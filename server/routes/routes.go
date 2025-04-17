package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/controllers"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Authentication
	auth := api.Group("/auth")
	auth.Post("/login", controllers.LoginUser)
	auth.Post("/signup", controllers.CreateUser)

	// User routes
	users := api.Group("/users")
	users.Get("/", controllers.GetUsers)
	users.Get("/username/:username", controllers.GetUserByUsername)
	users.Get("/id/:id", controllers.GetUserByID)
	users.Get("/get/ids", controllers.GetUsersIDs)
	users.Get("/recommended/:userId", controllers.GetRecommendedUsers)

	users.Post("/:followerId/following/:followeeId", controllers.FollowUser)
	users.Delete("/:followerId/following/:followeeId", controllers.UnfollowUser)

	users.Post("/:userId/places/:placeId", controllers.AddPlaceToUser)
	users.Delete("/:userId/places/:placeId", controllers.RemovePlaceFromUser)

	users.Post("/:userId/maps/:mapId", controllers.AddMapToUser)
	users.Delete("/:userId/maps/:mapId", controllers.RemoveMapFromUser)

	users.Patch("/:id", controllers.UpdateUserData)
	users.Delete("/:id", controllers.DeleteUser)

	// Place routes
	places := api.Group("/places")
	places.Get("/", controllers.GetPlaces)
	places.Get("/:id", controllers.GetPlace)
	places.Get("/get/ids", controllers.GetPlacesIDs)

	places.Post("/", controllers.CreatePlace)
	places.Delete("/:id", controllers.DeletePlace)

	places.Post("/:placeId/likes/:userId", controllers.AddPlaceLike)
	places.Delete("/:placeId/likes/:userId", controllers.RemovePlaceLike)

	// Map routes
	maps := api.Group("/maps")
	maps.Get("/", controllers.GetMaps)
	maps.Get("/:id", controllers.GetMap)
	maps.Get("/get/ids", controllers.GetMapsIDs)

	maps.Post("/", controllers.CreateMap)
	maps.Delete("/:id", controllers.DeleteMap)

	maps.Post("/:mapId/likes/:userId", controllers.AddMapLike)
	maps.Delete("/:mapId/likes/:userId", controllers.RemoveMapLike)

	maps.Post("/:mapId/places/:placeId", controllers.AddPlaceToMap)
	maps.Delete("/:mapId/places/:placeId", controllers.RemovePlaceFromMap)
}
