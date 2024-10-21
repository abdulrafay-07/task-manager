package utils

import (
	"fmt"
	"strings"

	"github.com/abdulrafay-07/task-manager/pkg/models"
)

func ValidateTaskFields(task models.Task) error {
	if strings.TrimSpace(task.UserID.String()) == "" {
		return fmt.Errorf("User ID is required")
	}

	if strings.TrimSpace(task.Title) == "" {
		return fmt.Errorf("title is required")
	}

	if strings.TrimSpace(task.Description) == "" {
		return fmt.Errorf("description is required")
	}

	if task.Status == "" {
		return fmt.Errorf("status is required")
	}

	return nil
}
