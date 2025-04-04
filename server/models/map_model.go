package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Map struct {
	ID          primitive.ObjectID   `json:"_id,omitempty" bson:"_id,omitempty"`
	Name        string               `json:"name" bson:"name"`
	Description string               `json:"description" bson:"description"`
	Places      []string             `json:"places" bson:"places"`
	Likes       []primitive.ObjectID `json:"likes" bson:"likes"`
}
