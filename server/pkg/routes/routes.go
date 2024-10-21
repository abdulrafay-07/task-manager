package routes

import (
	"github.com/abdulrafay-07/task-manager/pkg/controllers"
	"github.com/abdulrafay-07/task-manager/pkg/middleware"
	"github.com/gorilla/mux"
)

func SetupTaskRoutes(router *mux.Router) {
	router.HandleFunc("/task", middleware.AuthMiddleware(controllers.GetTasks)).Methods("GET")
	router.HandleFunc("/task", middleware.AuthMiddleware(controllers.CreateTask)).Methods("POST")
	router.HandleFunc("/task/{id}", middleware.AuthMiddleware(controllers.DeleteTask)).Methods("DELETE")
	router.HandleFunc("/task/{id}", middleware.AuthMiddleware(controllers.UpdateTask)).Methods("PUT")
	router.HandleFunc("/task/{id}", middleware.AuthMiddleware(controllers.GetTaskById)).Methods("GET")
}

func SetupAuthRoutes(router *mux.Router) {
	router.HandleFunc("/auth/register", controllers.RegisterUser).Methods("POST")
	router.HandleFunc("/auth/login", controllers.LoginUser).Methods("POST")
}
