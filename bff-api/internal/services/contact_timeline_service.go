package services

import (
	"encoding/csv"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/maxiking445/bff-api/internal/common"
	"github.com/maxiking445/bff-api/internal/models"
)

func BuildContactTimelinesFromCSV(
	csvPath string,
) ([]models.ContactTimeline, error) {

	fmt.Println("Analyse Groupe File: " + csvPath)
	rows, err := loadContactMessagesFromCSV(csvPath)
	if err != nil {
		return nil, err
	}

	// Map[user]map[date]count
	userDayCounts := make(map[string]map[string]int)

	for _, msg := range rows {
		user := msg.Identity
		day := msg.Timestamp.Format("2006-01-02")

		if _, ok := userDayCounts[user]; !ok {
			userDayCounts[user] = make(map[string]int)
		}
		userDayCounts[user][day]++
	}
	// Map in []GroupTimeline
	var timelines []models.ContactTimeline
	for user, dayMap := range userDayCounts {
		var timeline []models.DayCount
		for day, count := range dayMap {
			timeline = append(timeline, models.DayCount{
				Date:  day,
				Count: count,
			})
		}

		sort.Slice(timeline, func(i, j int) bool {
			return timeline[i].Date < timeline[j].Date
		})
		if user == "" {
			user = "You"
		}
		println(user)
		timelines = append(timelines, models.ContactTimeline{
			User:     LoadIdentityByUserUUID(user),
			Timeline: timeline,
		})
	}

	return timelines, nil
}

type ContactMessageRow struct {
	Identity  string
	Timestamp time.Time
}

func loadContactMessagesFromCSV(path string) ([]ContactMessageRow, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	reader := csv.NewReader(f)
	records, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}

	if len(records) <= 1 {
		return []ContactMessageRow{}, nil
	}

	var rows []ContactMessageRow
	for i, r := range records {
		if i == 0 {
			continue
		}

		base := filepath.Base(path)
		base = strings.TrimSuffix(base, common.CSV)
		identity := strings.TrimPrefix(base, common.UserMessage)
		createdAtMillis, err := strconv.ParseInt(r[7], 10, 64)
		if err != nil {
			fmt.Println("Error loading created_at:", r[7], "Error:", err)
			continue
		}
		timestamp := time.UnixMilli(createdAtMillis)
		if r[5] == "READ" {
			identity = ""
		}

		rows = append(rows, ContactMessageRow{
			Identity:  identity,  // identity = user
			Timestamp: timestamp, //Timestamp
		})
	}

	return rows, nil
}
