package main

import (
	"log"
	"net/http"
	"os"

	"spending-tracker/backend/internal/server"
	"spending-tracker/backend/internal/storage"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	store := storage.NewMemoryStore()
	r := server.NewRouter(store)

	log.Printf("Spending Tracker backend running on :%s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
