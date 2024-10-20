package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/abdulrafay-07/task-manager/pkg/models"
	"github.com/abdulrafay-07/task-manager/pkg/utils"
	"github.com/gorilla/mux"
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
		return
	}

	if len(tasks) == 0 {
		utils.SendJSONResponse(w, http.StatusNotFound, utils.Response{
			Success: false,
			Message: "No tasks found!",
		})
		return
	}

	utils.SendJSONResponse(w, http.StatusOK, utils.Response{
		Success: true,
		Message: "Tasks found successfully!",
		Data:    tasks,
	})
}

func GetTaskById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id := vars["id"]

	task, err := models.GetTaskById(id)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, utils.Response{
			Success: false,
			Message: "Task not found!",
		})
		return
	}

	utils.SendJSONResponse(w, http.StatusOK, utils.Response{
		Success: true,
		Message: "Task found successfully!",
		Data:    task,
	})
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id := vars["id"]

	_, err := models.GetTaskById(id)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, utils.Response{
			Success: false,
			Message: "Task not found!",
		})
		return
	}

	err = models.DeleteTask(id)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, utils.Response{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	utils.SendJSONResponse(w, http.StatusOK, utils.Response{
		Success: true,
		Message: "Task deleted successfully!",
	})
}

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	existingTask, err := models.GetTaskById(id)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusNotFound, utils.Response{
			Success: false,
			Message: "Task not found!",
		})
		return
	}

	var updatedTask models.Task

	err = json.NewDecoder(r.Body).Decode(&updatedTask)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, utils.Response{
			Success: false,
			Message: "Invalid request body!",
		})
		return
	}

	// update fields
	if updatedTask.Title != "" {
		existingTask.Title = updatedTask.Title
	}
	if updatedTask.Description != "" {
		existingTask.Description = updatedTask.Description
	}
	if updatedTask.Status != "" {
		existingTask.Status = updatedTask.Status
	}

	// update task
	err = existingTask.UpdateTask()
	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, utils.Response{
			Success: false,
			Message: "Error updating task: " + err.Error(),
		})
		return
	}

	utils.SendJSONResponse(w, http.StatusOK, utils.Response{
		Success: true,
		Message: "Task updated successfully!",
		Data:    existingTask,
	})
}
