package main

import (
	"log"
	"net/http"

	"github.com/abdulrafay-07/task-manager/pkg/database"
	"github.com/abdulrafay-07/task-manager/pkg/routes"
	"github.com/gorilla/mux"
)

func main() {
	// connect to the database
	err := database.ConnectDB()
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	r := mux.NewRouter()

	routes.SetupTaskRoutes(r)

	http.ListenAndServe(":80", r)
}
