package handlers

import (
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/maxiking445/bff-api/internal/common"
)

// AvatarHandler @Summary Avatar Endpoint
// @Description Gets Avatar for CONTACT, Group or Avatar by ID
// @Produce image/png
// @Param       type  query    string  true  "CONTACT, GROUP or AVATAR"  Enums(CONTACT,GROUP,AVATAR)
// @Param       id    path     string  true  "ID"
// @Success 200 {file} file "Image"
// @Router /avatar/{id} [get]
func AvatarHandler(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 || pathParts[len(pathParts)-2] != "avatar" {
		http.Error(w, "Wrong Path. Must be /avatar/{id}", http.StatusBadRequest)
		return
	}

	id := pathParts[len(pathParts)-1] // Letzter Teil = ID
	if id == "" {
		http.Error(w, "ID required", http.StatusBadRequest)
		return
	}

	// Type als Query-Parameter
	typ := r.URL.Query().Get("type")
	if typ == "" {
		http.Error(w, "Type required (CONTACT, GROUP or AVATAR)", http.StatusBadRequest)
		return
	}

	dir := typ // "CONTACT", "GROUP" or "AVATAR"
	avatarPath := ""
	if dir == "CONTACT" {
		avatarPath = common.ProfilePicContact + id
	}
	if dir == "GROUP" {
		avatarPath = common.ProfilePicGroup + id
	}
	if dir == "AVATAR" {
		avatarPath = common.ProfilePicAvatar
	}

	avatarData, err := os.ReadFile(avatarPath)
	if err != nil {
		if typ == "AVATAR" {
			avatarData, err = os.ReadFile(common.ProfilePicPlaceholder)
			if err != nil {
				http.Error(w, "Placeholder not found", http.StatusInternalServerError)
				return
			}
		} else {
			http.Error(w, "No Picture Found", http.StatusNotFound)
			return
		}
	}

	w.Header().Set("Content-Type", "image/jpeg")
	w.Header().Set("Content-Length", strconv.Itoa(len(avatarData)))
	w.Write(avatarData)
}
