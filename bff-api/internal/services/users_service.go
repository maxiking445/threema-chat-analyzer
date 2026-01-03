package services

import (
	"encoding/csv"
	"io"
	"os"

	"github.com/maxiking445/bff-api/internal/common"
	model "github.com/maxiking445/bff-api/internal/models"
)

func LoadIdentity(userID string) model.Identity {
	if userID == "" || userID == "You" {
		return model.Identity{
			Identity:   "You",
			IdentityID: "You",
		}
	}
	identities, err := LoadIdentitiesFromCSV(common.UserContactsPath)
	if err != nil {
		return model.Identity{}
	}
	for _, ident := range identities {
		if ident.Identity == userID {
			return ident
		}
	}
	return model.Identity{}
}

func LoadIdentitiesFromCSV(path string) ([]model.Identity, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	r := csv.NewReader(f)
	r.Comma = ','

	// SKip Header
	if _, err := r.Read(); err != nil {
		return nil, err
	}

	var identities []model.Identity

	for {
		rec, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}
		if len(rec) < 11 {
			continue
		}

		identities = append(identities, model.Identity{
			Identity:   rec[0],
			FirstName:  rec[4],
			LastName:   rec[5],
			NickName:   rec[6],
			IdentityID: rec[10],
		})
	}

	return identities, nil
}
