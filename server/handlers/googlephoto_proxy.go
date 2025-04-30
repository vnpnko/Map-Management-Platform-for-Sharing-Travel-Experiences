package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/vnpnko/Map-Management-Platform-for-Sharing-Travel-Experiences/dto"
	"io"
	"net/http"
)

func RegisterGooglePhotoProxy(app *fiber.App) {
	app.Get("/api/proxy/googlephoto", func(c *fiber.Ctx) error {
		photoURL := c.Query("url")

		resp, err := http.Get(photoURL)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
				Error:   "Failed to reach Google Photos",
				Details: err.Error(),
			})
		}
		defer resp.Body.Close()

		if resp.StatusCode != fiber.StatusOK {
			return c.Status(resp.StatusCode).JSON(dto.ErrorResponse{
				Error:   "Failed to fetch the photo",
				Details: resp.Status,
			})
		}

		c.Set("Content-Type", resp.Header.Get("Content-Type"))
		c.Set("Cache-Control", "public, max-age=86400")

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
				Error:   "Failed to reach Google Photos",
				Details: err.Error(),
			})
		}

		return c.Send(body)
	})
}
