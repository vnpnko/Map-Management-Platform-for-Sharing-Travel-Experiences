package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/controllers"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// User routes
	api.Get("/users", controllers.GetUsers)
	api.Get("/users/:username", controllers.GetUser)
	api.Post("/signup", controllers.CreateUser)
	api.Post("/login", controllers.LoginUser)
	api.Patch("/follow", controllers.UpdateUserFollow)
	api.Delete("/users/:id", controllers.DeleteUser)

	// Place routes
	api.Get("/places", controllers.GetPlaces)
	api.Get("/places/:id", controllers.GetPlace)
	api.Post("/createPlace", controllers.CreatePlace)
	api.Delete("/places/:id", controllers.DeletePlace)
	api.Patch("/places/addLike", controllers.AddPlaceLike)
	api.Patch("/places/removeLike", controllers.RemovePlaceLike)
}
