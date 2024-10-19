package routes

import (
	"github.com/gorilla/mux"
)

func SetupTaskRoutes(router *mux.Router) {
	router.HandleFunc("/task", GetTask).Methods("GET")
	router.HandleFunc("/task", CreateTask).Methods("POST")
	router.HandleFunc("/task/{id}", DeleteTask).Methods("DELETE")
	router.HandleFunc("/task/{id}", UpdateTask).Methods("PUT")
	router.HandleFunc("/task/{id}", GetTaskById).Methods("GET")
}
