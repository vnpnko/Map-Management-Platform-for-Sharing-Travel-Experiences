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
	api.Get("/users/get/ids", controllers.GetUsersIDs)
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

	//auth := api.Group("/auth")
	//auth.Post("/login", controllers.LoginUser)
	//auth.Post("/signup", controllers.CreateUser)

	//users := api.Group("/users")
	//users.Get("/", controllers.GetUsers)
	//users.Get("/get/ids", controllers.GetUsersIDs)
	//users.Get("/id/:id", controllers.GetUserByID)
	//users.Get("/username/:username", controllers.GetUserByUsername)
	//users.Patch("/:id", controllers.UpdateUserData)
	//users.Delete("/:id", controllers.DeleteUser)

	//users.Patch("/follow", controllers.UpdateUserFollow)
	//users.Patch("/unfollow", controllers.UpdateUserUnfollow)

	//userPlaces := users.Group("/places")
	//userPlaces.Patch("/add", controllers.AddPlaceToUser)
	//userPlaces.Patch("/remove", controllers.RemovePlaceFromUser)

	//userMaps := users.Group("/maps")
	//userMaps.Patch("/add", controllers.AddMapToUser)
	//userMaps.Patch("/remove", controllers.RemoveMapFromUser)

	// Place routes
	api.Get("/places", controllers.GetPlaces)
	api.Get("/places/:id", controllers.GetPlace)
	api.Get("/places/get/ids", controllers.GetPlacesIDs)
	api.Post("/createPlace", controllers.CreatePlace)
	api.Delete("/places/:id", controllers.DeletePlace)
	api.Patch("/places/addPlaceLike", controllers.AddPlaceLike)
	api.Patch("/places/removePlaceLike", controllers.RemovePlaceLike)

	//places := api.Group("/places")
	//places.Get("/", controllers.GetPlaces)
	//places.Get("/:id", controllers.GetPlace)
	//places.Get("/get/ids", controllers.GetPlacesIDs)
	//places.Post("/", controllers.CreatePlace)
	//places.Delete("/:id", controllers.DeletePlace)
	//places.Patch("/:id/addLike", controllers.AddPlaceLike)
	//places.Patch("/:id/removeLike", controllers.RemovePlaceLike)

	// Map routes
	api.Get("/maps", controllers.GetMaps)
	api.Get("/maps/:id", controllers.GetMap)
	api.Get("/maps/get/ids", controllers.GetMapsIDs)
	api.Post("/createMap", controllers.CreateMap)
	api.Delete("/maps/:id", controllers.DeleteMap)
	api.Patch("/maps/addMapLike", controllers.AddMapLike)
	api.Patch("/maps/removeMapLike", controllers.RemoveMapLike)
	api.Patch("/maps/addPlace", controllers.AddPlaceToMap)
	api.Patch("/maps/removePlace", controllers.RemovePlaceFromMap)

	//maps := api.Group("/maps")
	//maps.Get("/", controllers.GetMaps)
	//maps.Get("/:id", controllers.GetMap)
	//maps.Get("/get/ids", controllers.GetMapsIDs)
	//maps.Post("/", controllers.CreateMap)
	//maps.Delete("/:id", controllers.DeleteMap)
	//maps.Patch("/:id/addLike", controllers.AddMapLike)
	//maps.Patch("/:id/removeLike", controllers.RemoveMapLike)
	//maps.Patch("/:id/addPlace", controllers.AddPlaceToMap)
	//maps.Patch("/:id/removePlace", controllers.RemovePlaceFromMap)
}
