package utils

import "sort"

// Generic scoring + sorting function for any item type
func ScoreAndSortItems[T comparable](items []T, exclude map[T]struct{}, limit int) []T {
	freq := make(map[T]int)
	for _, item := range items {
		if _, skip := exclude[item]; skip {
			continue
		}
		freq[item]++
	}

	type scored struct {
		ID    T
		Score int
	}

	var scoredItems []scored
	for id, score := range freq {
		scoredItems = append(scoredItems, scored{ID: id, Score: score})
	}

	sort.Slice(scoredItems, func(i, j int) bool {
		return scoredItems[i].Score > scoredItems[j].Score
	})

	result := make([]T, 0, len(scoredItems))
	for i := 0; i < len(scoredItems) && i < limit; i++ {
		result = append(result, scoredItems[i].ID)
	}
	return result
}
