package services

import (
	"encoding/csv"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/maxiking445/bff-api/internal/common"
	model "github.com/maxiking445/bff-api/internal/models"
)

func LoadGroupsWithMessageCounts(groupsPath string) ([]model.Group, error) {
	groups, err := loadGroupsFromCSV(groupsPath)
	if err != nil {
		return nil, err
	}

	files, err := filepath.Glob(common.GroupMessagePath)
	if err != nil {
		panic(err)
	}

	var msgs []GroupMessageRow
	for _, path := range files {
		fmt.Println("Analyse Groupe File: " + path)
		rows, err := loadGroupMessagesFromCSV(path)
		if err != nil {
			return nil, err
		}
		msgs = append(msgs, rows...)

	}

	groupByUID := countIdentitiesPerGroup(msgs)
	// Create GroupMemebr sub Object
	for i := range groups {
		g := &groups[i] // Pointer auf das Original
		m := groupByUID[g.GroupUID]
		for identity := range m {
			groupMember := model.GroupMember{
				MessageCount: int64(m[identity]),
				Identity:     LoadIdentity(identity),
			}
			g.GroupMember = append(g.GroupMember, groupMember)
		}
	}
	//TOTAL COUND CALC
	for i := range groups {
		g := &groups[i]
		g.MessageCount = 0
		for _, s := range g.GroupMember {
			g.MessageCount += int64(s.MessageCount)
		}
	}

	return groups, nil
}

// Count Messages
func countIdentitiesPerGroup(rows []GroupMessageRow) map[string]map[string]int {
	result := make(map[string]map[string]int)

	for _, r := range rows {
		if result[r.GroupUID] == nil {
			result[r.GroupUID] = make(map[string]int)
		}

		result[r.GroupUID][r.Identity]++
	}

	return result
}

func loadGroupsFromCSV(path string) ([]model.Group, error) {
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
		return []model.Group{}, nil
	}

	var groups []model.Group
	for i, r := range records {
		if i == 0 {
			continue
		}

		if len(r) < 11 {
			continue
		}

		archived, _ := strconv.ParseBool(r[6])

		groupItem := model.Group{
			ID:        r[0],
			Creator:   r[1],
			GroupName: r[2],
			Archived:  archived,
			GroupUID:  r[9],
		}

		groups = append(groups, groupItem)
	}

	return groups, nil
}

type GroupMessageRow struct {
	GroupUID  string
	Identity  string
	Timestamp time.Time
}

func loadGroupMessagesFromCSV(path string) ([]GroupMessageRow, error) {
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
		return []GroupMessageRow{}, nil
	}

	var rows []GroupMessageRow
	for i, r := range records {
		if i == 0 {
			continue
		}

		if len(r) < 12 {
			continue
		}
		if r[10] != "TEXT" {
			continue
		}

		base := filepath.Base(path)
		base = strings.TrimSuffix(base, common.CSV)
		groupUUID := strings.TrimPrefix(base, common.GroupMessage)

		createdAtMillis, err := strconv.ParseInt(r[7], 10, 64)
		if err != nil {
			fmt.Println("Error loading created_at:", r[7], "Error:", err)
			continue
		}
		timestamp := time.UnixMilli(createdAtMillis)

		identity := r[2]
		if identity == "" {
			identity = "YOU"
		}

		rows = append(rows, GroupMessageRow{
			GroupUID:  groupUUID, // uid = group_uid
			Identity:  identity,  // identity = user
			Timestamp: timestamp, //Timestamp
		})
	}

	return rows, nil
}
