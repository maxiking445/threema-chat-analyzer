package services

import (
	"fmt"

	"github.com/maxiking445/bff-api/internal/models"
)

func BuildGroupTimelinesFromCSV(
	csvPath string,
	groupName string,
) ([]models.GroupTimeline, error) {

	var msgs []GroupMessageRow
	fmt.Println("Analyse Groupe File: " + csvPath)
	rows, err := loadGroupMessagesFromCSV(csvPath)
	if err != nil {
		return nil, err
	}
	msgs = append(msgs, rows...)

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
	var timelines []models.GroupTimeline
	for user, dayMap := range userDayCounts {
		var timeline []models.DayCount
		for day, count := range dayMap {
			timeline = append(timeline, models.DayCount{
				Date:  day,
				Count: count,
			})
		}
		
		timelines = append(timelines, models.GroupTimeline{
			Group:    groupName,
			User:     user,
			Timeline: timeline,
		})
	}

	return timelines, nil
}
