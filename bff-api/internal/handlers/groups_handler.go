package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/maxiking445/bff-api/internal/common"
	groupService "github.com/maxiking445/bff-api/internal/services"
)

// GroupsHandler @Summary Groups Endpoint
// @Description Returns Groups and count of how many messages a user has
// @Produce json
// @Success 200 {array} models.Group "List of groups wiht message count"
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
