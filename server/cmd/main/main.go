package main

import (
	"log"
	"net/http"

	"github.com/abdulrafay-07/task-manager/pkg/database"
	"github.com/abdulrafay-07/task-manager/pkg/models"
	"github.com/abdulrafay-07/task-manager/pkg/routes"
	"github.com/gorilla/mux"
)

func main() {
	// connect to the database
	db, err := database.ConnectDB()
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	models.SetTaskCollection(db)
	models.SetUserCollection(db)

	r := mux.NewRouter()

	routes.SetupTaskRoutes(r)
	routes.SetupAuthRoutes(r)

	http.ListenAndServe(":80", r)
}
