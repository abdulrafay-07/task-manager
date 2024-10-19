package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/abdulrafay-07/task-manager/pkg/models"
	"github.com/abdulrafay-07/task-manager/pkg/utils"
)

func CreateTask(w http.ResponseWriter, r *http.Request) {
	var task models.Task

	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, utils.Response{
			Success: false,
			Message: "Invalid request body!",
		})
		return
	}

	// validate fields
	validationErr := utils.ValidateTaskFields(task)
	if validationErr != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, utils.Response{
			Success: false,
			Message: validationErr.Error(),
		})
		return
	}

	// create task
	err = task.CreateTask()
	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, utils.Response{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	utils.SendJSONResponse(w, http.StatusCreated, utils.Response{
		Success: true,
		Message: "Task created successfully!",
		Data:    task,
	})
}

func GetTasks(w http.ResponseWriter, r *http.Request) {
	tasks, err := models.GetTasks()
	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, utils.Response{
			Success: false,
			Message: "Something went wrong!",
		})
	}

	if len(tasks) == 0 {
		utils.SendJSONResponse(w, http.StatusNotFound, utils.Response{
			Success: false,
			Message: "No tasks found!",
		})
	}

	utils.SendJSONResponse(w, http.StatusOK, utils.Response{
		Success: true,
		Message: "Tasks found successfully!",
		Data:    tasks,
	})
}
