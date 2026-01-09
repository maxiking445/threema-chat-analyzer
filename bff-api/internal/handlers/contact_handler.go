package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/maxiking445/bff-api/internal/common"
	contactService "github.com/maxiking445/bff-api/internal/services"
)

// ContactsHandler retrieves a list of contacts with their message counts
// @Summary Get all contacts with message counts
// @Description Fetches all contacts along with their message counts from the database
// @Accept json
// @Produce json
// @Success 200 {object} []models.Contact "Successfully loaded contacts"
// @Router /contacts/ [get]
func ContactsHandler(w http.ResponseWriter, r *http.Request) {
	contacts, err := contactService.LoadContacts()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(contacts)
}

// ContactTimelineHandler @Summary Groups Timeline Endpoint
// @Summary      Sums up messages from each person in contact during one day
// @Description  Returns the daily number of messages per user.
// @Accept       json
// @Produce      json
// @Param        userId  query     string  true  "ID of contact (CSV-Name)"
// @Success      200    {array}   models.ContactTimeline
// @Failure      400    {string}  string  "contact missing"
// @Failure      500    {string}  string  "internal server error"
// @Router       /contacts/timeline [get]
func ContactTimelineHandler(w http.ResponseWriter, r *http.Request) {
	contact := r.URL.Query().Get("userId")
	if contact == "" {
		http.Error(w, "contact missing", http.StatusBadRequest)
		return
	}
	ident := contactService.LoadIdentityByUserID(contact)
	csvPath := common.UserMessagePath + ident.IdentityID + ".csv"

	timelines, err := contactService.BuildContactTimelinesFromCSV(csvPath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(timelines)
}
