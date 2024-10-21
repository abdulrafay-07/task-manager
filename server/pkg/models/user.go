package models

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name      string             `bson:"name" json:"name"`
	Email     string             `bson:"email" json:"email"`
	Password  string             `bson:"password" json:"password"` // the "-" ensures the password is not included in JSON responses
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}

var userCollection *mongo.Collection

// sets the mongodb collection for users
func SetUserCollection(database *mongo.Database) {
	userCollection = database.Collection("users")
}

func (user *User) CreateUser() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	user.ID = primitive.NewObjectID()
	user.CreatedAt = time.Now()

	_, err := userCollection.InsertOne(ctx, user)

	return err
}

// get user functions

func GetUserByEmail(email string) (User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user User

	err := userCollection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	return user, err
}

func GetUserById(id string) (User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user User

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return user, err
	}

	err = userCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
	return user, err
}
