package handlers

import (
	"encoding/json"
	"net/http"

	contactService "github.com/maxiking445/bff-api/internal/services"
)

// ContactsHandler retrieves a list of contacts with their message counts
// @Summary Get all contacts with message counts
// @Description Fetches all contacts along with their message counts from the database
// @Tags Contacts
// @Accept json
// @Produce json
// @Success 200 {object} []models.Contact "Successfully loaded contacts"
// @Router /contacts [get]
func ContactsHandler(w http.ResponseWriter, r *http.Request) {
	contacts, err := contactService.LoadContacts()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(contacts)
}
