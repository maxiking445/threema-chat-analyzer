package handlers

import (
	"encoding/json"
	"net/http"

	service "github.com/maxiking445/bff-api/internal/services"
)

// @Summary User list
// @Description Gibt alle User aus dem identity.csv zurück
// @Produce json
// @Success 200 {array} models.Identity
// @Router /users [get]
func UserHandler(w http.ResponseWriter, r *http.Request) {
	identities, err := service.LoadIdentitiesFromCSV("data/contacts.csv")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(identities); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
