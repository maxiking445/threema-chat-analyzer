package handlers

import (
	"fmt"
	"net/http"
)

// @Summary Test Endpoint
// @Description Einfacher Test
// @Produce plain
// @Success 200 {string} string "Test OK"
// @Router /user [get]
func TestHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Test OK!")
}
