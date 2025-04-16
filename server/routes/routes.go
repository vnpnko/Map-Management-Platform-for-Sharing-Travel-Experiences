package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/controllers"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	auth := api.Group("/auth")
	auth.Post("/login", controllers.LoginUser)
	auth.Post("/signup", controllers.CreateUser)

	users := api.Group("/users")
	users.Get("/", controllers.GetUsers)
	users.Get("/username/:username", controllers.GetUserByUsername)
	users.Get("/id/:id", controllers.GetUserByID)
	users.Get("/get/ids", controllers.GetUsersIDs)
	users.Patch("/follow", controllers.UpdateUserFollow)
	users.Patch("/unfollow", controllers.UpdateUserUnfollow)
	users.Patch("/:id", controllers.UpdateUserData)
	users.Delete("/:id", controllers.DeleteUser)

	userPlaces := users.Group("/places")
	userPlaces.Patch("/add", controllers.AddPlaceToUser)
	userPlaces.Patch("/remove", controllers.RemovePlaceFromUser)

	userMaps := users.Group("/maps")
	userMaps.Patch("/add", controllers.AddMapToUser)
	userMaps.Patch("/remove", controllers.RemoveMapFromUser)

	places := api.Group("/places")
	places.Get("/", controllers.GetPlaces)
	places.Get("/:id", controllers.GetPlace)
	places.Get("/get/ids", controllers.GetPlacesIDs)
	places.Post("/", controllers.CreatePlace)
	places.Delete("/:id", controllers.DeletePlace)
	places.Patch("/addLike", controllers.AddPlaceLike)
	places.Patch("/removeLike", controllers.RemovePlaceLike)

	maps := api.Group("/maps")
	maps.Get("/", controllers.GetMaps)
	maps.Get("/:id", controllers.GetMap)
	maps.Get("/get/ids", controllers.GetMapsIDs)
	maps.Post("/", controllers.CreateMap)
	maps.Delete("/:id", controllers.DeleteMap)
	maps.Patch("/addLike", controllers.AddMapLike)
	maps.Patch("/removeLike", controllers.RemoveMapLike)
	maps.Patch("/addPlace", controllers.AddPlaceToMap)
	maps.Patch("/removePlace", controllers.RemovePlaceFromMap)

}
