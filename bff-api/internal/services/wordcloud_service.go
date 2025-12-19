package services

import (
	"encoding/csv"
	"log"
	"os"
	"regexp"
	"sort"
	"strings"

	model "github.com/maxiking445/bff-api/internal/models"
)

func GetWordCount(files []string, limit int) ([]model.WordCount, error) {
	wordCounts := make(map[string]int)

	for _, f := range files {
		if err := countWordsInFile(f, wordCounts, true); err != nil {
			log.Printf("error reading %s: %v", f, err)
		}
	}

	// Map -> Slice and sort
	results := make([]model.WordCount, 0, len(wordCounts))
	for w, c := range wordCounts {
		results = append(results, model.WordCount{Word: w, Count: c})
	}
	sort.Slice(results, func(i, j int) bool {
		if results[i].Count == results[j].Count {
			return results[i].Word < results[j].Word
		}
		return results[i].Count > results[j].Count
	})

	// shorten with limit
	if limit < len(results) {
		results = results[:limit]
	}
	return results, nil
}

func countWordsInFile(path string, wordCounts map[string]int, showOnlyUserWords bool) error {
	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()

	r := csv.NewReader(f)
	r.ReuseRecord = true

	records, err := r.ReadAll()
	if err != nil {
		return err
	}
	if len(records) == 0 {
		return nil
	}

	header := records[0]
	bodyIdx := -1
	for i, col := range header {
		if col == "body" {
			bodyIdx = i
			break
		}
	}
	if bodyIdx == -1 {
		return nil //
	}

	// Regex, to limit to only words
	wordRegexp := regexp.MustCompile(`[A-Za-z0-9ÄÖÜäöüß]+`)

	for _, row := range records[1:] {
		if bodyIdx >= len(row) {
			continue
		}
		text := row[bodyIdx]
		text = strings.ToLower(text)

		if strings.Contains(text, "image") {
			continue
		}

		if showOnlyUserWords {
			if strings.Contains(row[5], "READ") {
				continue
			}
		}

		urlRegexp := regexp.MustCompile(`^(https?://|www\.)\S+$`)
		if urlRegexp.MatchString(text) {
			continue
		}

		words := wordRegexp.FindAllString(text, -1)
		for _, w := range words {
			if w == "" {
				continue
			}
			wordCounts[w]++
		}
	}

	return nil
}
