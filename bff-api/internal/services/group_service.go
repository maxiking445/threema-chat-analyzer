package services

import (
	"encoding/csv"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"

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

	// Index
	groupByUID := make(map[string]*model.Group)
	for i := range groups {
		g := &groups[i]
		if g.MessageCountByUser == nil {
			g.MessageCountByUser = make(map[string]int)
		}
		groupByUID[g.GroupUID] = g
	}

	// Count Messages
	for _, m := range msgs {
		g := groupByUID[m.GroupUID]
		if g == nil {
			//fmt.Println("No Group found for GroupUID:", m.GroupUID)
			continue
		}
		if m.Identity == "" {
			g.MessageCountByUser["ADMIN"]++
			continue
		}
		g.MessageCountByUser[m.Identity]++
	}

	for i := range groups {
		g := &groups[i]
		g.MessageCount = 0
		for s := range g.MessageCountByUser {
			m := g.MessageCountByUser[s]
			g.MessageCount += int64(m)
		}
	}

	return groups, nil
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
		members := []string{}
		if r[5] != "" {
			members = strings.Split(r[5], ";")
		}

		groupItem := model.Group{
			ID:        r[0],
			Creator:   r[1],
			GroupName: r[2],
			Members:   members,
			Archived:  archived,
			GroupUID:  r[9],
		}

		groups = append(groups, groupItem)
	}

	return groups, nil
}

type GroupMessageRow struct {
	GroupUID string
	Identity string
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

		rows = append(rows, GroupMessageRow{
			GroupUID: groupUUID, // uid = group_uid
			Identity: r[2],      // identity = user
		})
	}

	return rows, nil
}
