package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Location struct {
	Lat float64 `json:"lat" bson:"lat"`
	Lng float64 `json:"lng" bson:"lng"`
}

type Place struct {
	ID               string               `json:"_id,omitempty" bson:"_id,omitempty"`
	Name             string               `json:"name" bson:"name"`
	URL              string               `json:"url" bson:"url"`
	Likes            []primitive.ObjectID `json:"likes" bson:"likes"`
	Location         Location             `json:"location" bson:"location"`
	FormattedAddress string               `json:"formattedAddress,omitempty" bson:"formattedAddress,omitempty"`
	Types            []string             `json:"types,omitempty" bson:"types,omitempty"`
	PhotoURL         string               `json:"photoUrl,omitempty" bson:"photoUrl,omitempty"`
}
