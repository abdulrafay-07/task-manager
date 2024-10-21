package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/abdulrafay-07/task-manager/pkg/models"
	"github.com/abdulrafay-07/task-manager/pkg/utils"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, utils.Response{
			Success: false,
			Message: "Invalid request body!",
		})
		return
	}

	// hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, utils.Response{
			Success: false,
			Message: "Error hashing password!",
		})
		return
	}

	user.Password = string(hashedPassword)

	err = user.CreateUser()
	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, utils.Response{
			Success: false,
			Message: "Error creating user!",
		})
		return
	}

	utils.SendJSONResponse(w, http.StatusCreated, utils.Response{
		Success: true,
		Message: "User registered successfully!",
		Data:    user,
	})
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&credentials)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusBadRequest, utils.Response{
			Success: false,
			Message: "Invalid request body!",
		})
		return
	}

	// get user
	user, err := models.GetUserByEmail(credentials.Email)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusUnauthorized, utils.Response{
			Success: false,
			Message: "Invalid email or password!",
		})
		return
	}

	// compare password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password))
	if err != nil {
		utils.SendJSONResponse(w, http.StatusUnauthorized, utils.Response{
			Success: false,
			Message: "Invalid email or password!",
		})
		return
	}

	// TODO: generate jwt token

	utils.SendJSONResponse(w, http.StatusOK, utils.Response{
		Success: true,
		Message: "Login successful!",
		Data:    user,
	})
}
