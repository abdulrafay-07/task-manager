package main

import (
	"log"
	"net/http"

	"github.com/abdulrafay-07/task-manager/pkg/database"
	"github.com/abdulrafay-07/task-manager/pkg/models"
	"github.com/abdulrafay-07/task-manager/pkg/routes"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
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

	// configure CORS options
	corsOptions := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := corsOptions.Handler(r)

	http.ListenAndServe(":80", handler)
}
