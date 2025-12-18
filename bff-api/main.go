package main

import (
	"fmt"
	"net/http"

	_ "github.com/maxiking445/bff-api/docs"
	handlers "github.com/maxiking445/bff-api/internal/handlers"
	httpSwagger "github.com/swaggo/http-swagger"
)

// @title BFF API
// @version 1.0
// @host localhost:8080
// @BasePath /

func main() {
	http.HandleFunc("/groups", handlers.GroupsHandler)
	http.HandleFunc("/user", handlers.TestHandler)
	http.HandleFunc("/swagger/", httpSwagger.WrapHandler)
	fmt.Println("Server: http://localhost:8080/swagger/index.html")
	http.ListenAndServe(":8080", nil)
}
