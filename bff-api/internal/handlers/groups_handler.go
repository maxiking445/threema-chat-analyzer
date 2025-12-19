package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/maxiking445/bff-api/internal/common"
	groupService "github.com/maxiking445/bff-api/internal/services"
)

// GroupsHandler @Summary Test Endpoint
// @Description Einfacher Test
// @Produce plain
// @Success 200 {string} string "Test OK"
// @Router /groups [get]
func GroupsHandler(w http.ResponseWriter, r *http.Request) {
	groups, err := groupService.LoadGroupsWithMessageCounts(common.GroupPath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(groups)
}
