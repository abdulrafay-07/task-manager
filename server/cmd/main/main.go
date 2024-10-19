package main

import (
	"net/http"

	"github.com/abdulrafay-07/task-manager/pkg/routes"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	routes.SetupTaskRoutes(r)

	http.ListenAndServe(":80", r)
}
