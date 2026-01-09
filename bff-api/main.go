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
	mux := http.NewServeMux()

	mux.HandleFunc("/wordcloud", handlers.WordsHandler)
	mux.HandleFunc("/wordcloud/", handlers.WordsHandler)

	mux.HandleFunc("/upload-zip", handlers.UploadZipHandler)
	mux.HandleFunc("/delete-zip", handlers.DeleteDataHandler)
	mux.HandleFunc("/avatar/", handlers.AvatarHandler)

	mux.HandleFunc("/contacts", handlers.ContactsHandler)
	mux.HandleFunc("/contacts/", handlers.ContactsHandler)
	mux.HandleFunc("/contacts/timeline", handlers.ContactTimelineHandler)

	mux.HandleFunc("/groups/timeline", handlers.GroupTimelineHandler)
	mux.HandleFunc("/groups", handlers.GroupsHandler)
	mux.HandleFunc("/users", handlers.UserHandler)
	mux.Handle("/swagger/", httpSwagger.WrapHandler)

	fmt.Println("Server: http://localhost:8080/swagger/index.html")
	http.ListenAndServe(":8080", cors(mux))
}

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Vary", "Origin")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE")
		w.Header().Set("Access-Control-Allow-Headers",
			"Content-Type, Authorization, X-Zip-Password, X-Requested-With")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
