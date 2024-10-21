package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/abdulrafay-07/task-manager/pkg/auth"
	"github.com/abdulrafay-07/task-manager/pkg/utils"
)

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			utils.SendJSONResponse(w, http.StatusUnauthorized, utils.Response{
				Success: false,
				Message: "Missing authorization header",
			})
			return
		}

		bearerToken := strings.Split(authHeader, " ")
		if len(bearerToken) != 2 {
			utils.SendJSONResponse(w, http.StatusUnauthorized, utils.Response{
				Success: false,
				Message: "Invalid authorization header format",
			})
			return
		}

		claims, err := auth.ValidateToken(bearerToken[1])
		if err != nil {
			utils.SendJSONResponse(w, http.StatusUnauthorized, utils.Response{
				Success: false,
				Message: "Invalid or expired token",
			})
			return
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, "user_id", claims.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
