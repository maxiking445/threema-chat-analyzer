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

// GroupTimelineHandler @Summary Groups Timeline Endpoint
// @Summary      Sums up messages from each person in group during one day
// @Description  Returns the daily number of messages per user for a group.
// @Accept       json
// @Produce      json
// @Param        group  query     string  true  "Name of group (CSV-Name)"
// @Success      200    {array}   models.GroupTimeline
// @Failure      400    {string}  string  "group missing"
// @Failure      500    {string}  string  "internal server error"
// @Router       /groups/timeline [get]
func GroupTimelineHandler(w http.ResponseWriter, r *http.Request) {
	group := r.URL.Query().Get("group")
	if group == "" {
		http.Error(w, "group missing", http.StatusBadRequest)
		return
	}

	csvPath := "data/group_message_" + group + ".csv"

	timelines, err := groupService.BuildGroupTimelinesFromCSV(csvPath, group)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(timelines)
}
