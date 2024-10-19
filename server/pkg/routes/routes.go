package routes

import (
	"github.com/abdulrafay-07/task-manager/pkg/controllers"
	"github.com/gorilla/mux"
)

func SetupTaskRoutes(router *mux.Router) {
	router.HandleFunc("/task", controllers.GetTasks).Methods("GET")
	router.HandleFunc("/task", controllers.CreateTask).Methods("POST")
	// router.HandleFunc("/task/{id}", DeleteTask).Methods("DELETE")
	// router.HandleFunc("/task/{id}", UpdateTask).Methods("PUT")
	// router.HandleFunc("/task/{id}", GetTaskById).Methods("GET")
}
