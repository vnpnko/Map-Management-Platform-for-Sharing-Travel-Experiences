package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Place struct {
	ID    string               `json:"_id,omitempty" bson:"_id,omitempty"`
	Name  string               `json:"name" bson:"name"`
	URL   string               `json:"url" bson:"url"`
	Likes []primitive.ObjectID `json:"likes" bson:"likes"`
}
