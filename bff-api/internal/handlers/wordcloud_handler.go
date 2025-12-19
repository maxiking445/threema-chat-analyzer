package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/maxiking445/bff-api/internal/common"
	service "github.com/maxiking445/bff-api/internal/services"
)

// WordsHandler GoDoc
// @Summary      Get most frequent words
// @Description  Reads all CSV files named `message_*.csv` from `/data`, analyzes the `body` column,
// @Description  counts all words across all rows and returns the most frequent words as JSON.
// @Produce      json
// @Param        limit  query     int  false  "Maximum number of words to return (default 100)"  minimum(1)
// @Failure      400    {string}  string      "Invalid request parameters"
// @Failure      404    {string}  string      "No message files found"
// @Failure      500    {string}  string      "Internal server error while reading or parsing files"
// @Router       /wordcloud [get]
func WordsHandler(w http.ResponseWriter, r *http.Request) {
	limit := 100
	if l := r.URL.Query().Get("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil && v > 0 {
			limit = v
		}
	}

	files, err := filepath.Glob(common.UserMessagesPath)
	if err != nil {
		http.Error(w, "failed to list data files", http.StatusInternalServerError)
		return
	}
	if len(files) == 0 {
		http.Error(w, "no message files found", http.StatusNotFound)
		return
	}

	results, err := service.GetWordCount(files, limit)
	if err != nil {
		log.Printf("GetWordCount error: %v", err)
		http.Error(w, "failed to calculate word counts", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(results); err != nil {
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
		return
	}

}
