package handlers

import (
	"github.com/gofiber/fiber/v2"
	"io"
	"net/http"
)

func RegisterGooglePhotoProxy(app *fiber.App) {
	app.Get("/api/proxy/googlephoto", func(c *fiber.Ctx) error {
		photoURL := c.Query("url")

		resp, err := http.Get(photoURL)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to fetch image from Google",
			})
		}
		defer resp.Body.Close()

		if resp.StatusCode != fiber.StatusOK {
			return c.Status(resp.StatusCode).JSON(fiber.Map{
				"error": "Google responded with error",
			})
		}

		c.Set("Content-Type", resp.Header.Get("Content-Type"))
		c.Set("Cache-Control", "public, max-age=86400")

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to read image body",
			})
		}

		return c.Send(body)
	})
}
