package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/abdulrafay-07/task-manager/pkg/auth"
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
		Data: map[string]string{
			"id":         user.ID.String(),
			"name":       user.Name,
			"email":      user.Email,
			"created_at": user.CreatedAt.String(),
		},
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

	token, err := auth.GenerateToken(user.ID.Hex())
	if err != nil {
		utils.SendJSONResponse(w, http.StatusInternalServerError, utils.Response{
			Success: false,
			Message: "Error generating token",
		})
		return
	}

	utils.SendJSONResponse(w, http.StatusOK, utils.Response{
		Success: true,
		Message: "Login successful!",
		Data: map[string]string{
			"user_id":    user.ID.Hex(),
			"username":   user.Name,
			"user_email": user.Email,
			"token":      token,
		},
	})
}

func VerifyToken(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string)

	user, err := models.GetUserById(userID)
	if err != nil {
		utils.SendJSONResponse(w, http.StatusUnauthorized, utils.Response{
			Success: false,
			Message: "Invalid token",
		})
		return
	}

	utils.SendJSONResponse(w, http.StatusOK, utils.Response{
		Success: true,
		Message: "Token is valid",
		Data:    user,
	})
}
