package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID        primitive.ObjectID   `json:"_id,omitempty" bson:"_id,omitempty"`
	Name      string               `json:"name"`
	Email     string               `json:"email"`
	Username  string               `json:"username"`
	Password  string               `json:"password"`
	Followers []primitive.ObjectID `json:"followers"`
	Following []primitive.ObjectID `json:"following"`
	Places    []primitive.ObjectID `json:"places"`
}
