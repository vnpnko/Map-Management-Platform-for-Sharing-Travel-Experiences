package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/controllers"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// User routes
	api.Get("/users", controllers.GetUsers)
	api.Get("/users/username/:username", controllers.GetUserByUsername)
	api.Get("/users/id/:id", controllers.GetUserByID)
	api.Post("/login", controllers.LoginUser)
	api.Post("/signup", controllers.CreateUser)
	api.Patch("/follow", controllers.UpdateUserFollow)
	api.Patch("/unfollow", controllers.UpdateUserUnfollow)
	api.Patch("/users/:id/update", controllers.UpdateUserData)
	api.Delete("/users/:id", controllers.DeleteUser)
	api.Patch("/users/addMap", controllers.AddMapToUser)
	api.Patch("/users/removeMap", controllers.RemoveMapFromUser)
	api.Patch("/users/addPlace", controllers.AddPlaceToUser)
	api.Patch("/users/removePlace", controllers.RemovePlaceFromUser)

	// Place routes
	api.Get("/places", controllers.GetPlaces)
	api.Get("/places/:id", controllers.GetPlace)
	api.Post("/createPlace", controllers.CreatePlace)
	api.Delete("/places/:id", controllers.DeletePlace)
	api.Patch("/places/addPlaceLike", controllers.AddPlaceLike)
	api.Patch("/places/removePlaceLike", controllers.RemovePlaceLike)

	// Map routes
	api.Get("/maps", controllers.GetMaps)
	api.Get("/maps/:id", controllers.GetMap)
	api.Post("/createMap", controllers.CreateMap)
	api.Delete("/maps/:id", controllers.DeleteMap)
	api.Patch("/maps/addMapLike", controllers.AddMapLike)
	api.Patch("/maps/removeMapLike", controllers.RemoveMapLike)
	api.Patch("/maps/addPlace", controllers.AddPlaceToMap)
	api.Patch("/maps/removePlace", controllers.RemovePlaceFromMap)
}
