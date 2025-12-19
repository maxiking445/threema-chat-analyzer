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
	http.Handle("/upload-zip", cors(http.HandlerFunc(handlers.UploadZipHandler)))
	http.Handle("/delete-zip", cors(http.HandlerFunc(handlers.DeleteDataHandler)))

	http.HandleFunc("/avatar/", handlers.AvatarHandler)
	http.HandleFunc("/wordcloud/", handlers.WordsHandler)
	http.HandleFunc("/groups", handlers.GroupsHandler)
	http.HandleFunc("/users", handlers.UserHandler)
	http.HandleFunc("/swagger/", httpSwagger.WrapHandler)
	fmt.Println("Server: http://localhost:8080/swagger/index.html")
	http.ListenAndServe(":8080", nil)
}

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
