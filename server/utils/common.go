package utils

import "go.mongodb.org/mongo-driver/bson/primitive"

// IntersectCount returns the number of elements shared between two slices of ObjectIDs.
func IntersectCount(a, b []primitive.ObjectID) int {
	m := make(map[primitive.ObjectID]struct{}, len(a))
	for _, id := range a {
		m[id] = struct{}{}
	}

	count := 0
	for _, id := range b {
		if _, exists := m[id]; exists {
			count++
		}
	}
	return count
}
