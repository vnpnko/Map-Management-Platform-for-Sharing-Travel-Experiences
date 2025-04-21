package utils

import (
	"math"
)

func ComputeScore(freq int, likes int) float64 {
	return float64(freq)*0.7 + math.Log(float64(likes)+1)*0.3
}

func FilterCandidates[T comparable](frequency map[T]int, exclude map[T]struct{}) []T {
	result := make([]T, 0)
	for id := range frequency {
		if _, skip := exclude[id]; !skip {
			result = append(result, id)
		}
	}
	return result
}
