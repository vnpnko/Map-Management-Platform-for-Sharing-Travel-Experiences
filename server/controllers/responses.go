package controllers

type ErrorResponse struct {
	UseToastError   string `json:"error"`
	Details string `json:"details,omitempty"`
}
