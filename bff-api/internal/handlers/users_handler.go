package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/maxiking445/bff-api/internal/common"
	service "github.com/maxiking445/bff-api/internal/services"
)

// UserHandler @Summary User list
// @Description Returns all identities from identity.csv
// @Produce json
// @Success 200 {array} models.Identity
// @Router /users [get]
func UserHandler(w http.ResponseWriter, r *http.Request) {
	identities, err := service.LoadIdentitiesFromCSV(common.UserContactsPath)
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
