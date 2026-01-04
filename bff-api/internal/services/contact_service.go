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
		contactMessageCount, yourMessageCount := countMessagesFrom(common.UserMessagePath + ident.IdentityID + ".csv")
		contact := models.Contact{
			Identity:            ident,
			TotalMessageCount:   countTotalMessagesInCSV(common.UserMessagePath + ident.IdentityID + ".csv"),
			ContactMessageCount: contactMessageCount,
			YourMessageCount:    yourMessageCount,
		}
		contacts = append(contacts, contact)
	}
	return contacts, nil
}

func countTotalMessagesInCSV(path string) int64 {
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

func countMessagesFrom(path string) (int64, int64) {
	file, err := os.Open(path)
	if err != nil {
		return 0, 0
	}
	defer file.Close()

	r := csv.NewReader(file)
	records, err := r.ReadAll()
	if err != nil {
		fmt.Println("Error reading file:", err)
		return 0, 0
	}

	if len(records) <= 1 {
		return 0, 0
	}

	records = records[1:]

	yourMessages := 0
	contactMessages := 0

	for _, record := range records {
		if len(record) < 2 {
			continue
		}

		isOutbox := false
		if record[5] == "READ" {
			isOutbox = true
		}

		if isOutbox {
			yourMessages++
		} else {
			contactMessages++
		}
	}

	return int64(contactMessages), int64(yourMessages)
}
