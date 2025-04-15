package dbhelpers

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetItemIDs[ID any](collection *mongo.Collection, filter interface{}) ([]ID, error) {
	ctx := context.Background()
	projection := bson.D{{Key: "_id", Value: 1}}
	cursor, err := collection.Find(ctx, filter, options.Find().SetProjection(projection))
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []struct {
		ID ID `bson:"_id"`
	}
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}

	ids := make([]ID, len(results))
	for i, r := range results {
		ids[i] = r.ID
	}
	return ids, nil
}
