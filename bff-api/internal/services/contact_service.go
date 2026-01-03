package services

import (
	"encoding/csv"
	"fmt"
	"os"

	"github.com/maxiking445/bff-api/internal/common"
	"github.com/maxiking445/bff-api/internal/models"
)

func LoadContacts() ([]models.Contact, error) {
	identities, err := LoadIdentitiesFromCSV(common.UserContactsPath)
	if err != nil {
		return nil, err
	}
	var contacts []models.Contact
	for _, ident := range identities {
		contact := models.Contact{
			Identity:     ident,
			MessageCount: countMessagesInCSV(common.UserMessagePath + ident.IdentityID + ".csv"),
		}
		contacts = append(contacts, contact)
	}
	return contacts, nil
}

func countMessagesInCSV(path string) int64 {
	fmt.Println("Path", path)
	file, err := os.Open(path)
	if err != nil {
		return 0
	}

	defer file.Close()

	r := csv.NewReader(file)
	records, err := r.ReadAll()
	if err != nil {
		fmt.Println("Error reading file", err)
		return 0
	}

	if len(records) <= 1 {
		fmt.Println("Error reading empty file", err)
		return 0
	}
	fmt.Println(int64(len(records) - 1))
	return int64(len(records) - 1)
}
