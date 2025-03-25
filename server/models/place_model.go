package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Place struct {
	ID    primitive.ObjectID   `json:"_id,omitempty" bson:"_id,omitempty"`
	Name  string               `json:"name"`
	URL   string               `json:"url"`
	Likes []primitive.ObjectID `json:"likes"`
}
