package models

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type TaskStatus string

const (
	NotStarted TaskStatus = "not_started"
	InProgress TaskStatus = "in_progress"
	Done       TaskStatus = "done"
)

type Task struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	Status      TaskStatus         `bson:"status" json:"status"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updated_at"`
}

var taskCollection *mongo.Collection

// sets the mongodb collection for tasks
func SetTaskCollection(database *mongo.Database) {
	taskCollection = database.Collection("tasks")
}

func (t *Task) CreateTask() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	t.ID = primitive.NewObjectID()
	t.CreatedAt = time.Now()
	t.UpdatedAt = time.Now()

	if t.Status == "" {
		t.Status = NotStarted
	}

	_, err := taskCollection.InsertOne(ctx, t)
	if err != nil {
		return err
	}

	return nil
}

func GetTasks() ([]Task, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var tasks []Task

	cursor, err := taskCollection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var task Task
		cursor.Decode(&task)
		tasks = append(tasks, task)
	}

	return tasks, nil
}

func GetTaskById(id string) (Task, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var task Task

	objID, _ := primitive.ObjectIDFromHex(id)

	err := taskCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&task)

	return task, err
}

func DeleteTask(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objID, _ := primitive.ObjectIDFromHex(id)

	_, err := taskCollection.DeleteOne(ctx, bson.M{"_id": objID})

	return err
}

func (t *Task) UpdateTask() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	t.UpdatedAt = time.Now()

	update := bson.M{
		"$set": bson.M{
			"title":       t.Title,
			"description": t.Description,
			"status":      t.Status,
			"updated_at":  t.UpdatedAt,
		},
	}

	_, err := taskCollection.UpdateOne(ctx, bson.M{"_id": t.ID}, update)

	return err
}
