package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type ScoredUser struct {
	User  User
	Score float64
}

type User struct {
	ID        primitive.ObjectID   `json:"_id,omitempty" bson:"_id,omitempty"`
	Name      string               `json:"name" bson:"name"`
	Username  string               `json:"username" bson:"username"`
	Password  string               `json:"password" bson:"password"`
	Followers []primitive.ObjectID `json:"followers" bson:"followers"`
	Following []primitive.ObjectID `json:"following" bson:"following"`
	Places    []string             `json:"places" bson:"places"`
	Maps      []primitive.ObjectID `json:"maps" bson:"maps"`
}
