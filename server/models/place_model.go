package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Place struct {
	ID    string               `json:"_id"`
	Name  string               `json:"name"`
	URL   string               `json:"url"`
	Likes []primitive.ObjectID `json:"likes"`
}
