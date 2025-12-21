package models

type Group struct {
	ID                 string         `json:"id"`
	Creator            string         `json:"creator"`
	GroupName          string         `json:"groupname"`
	Members            []string       `json:"members"`
	Archived           bool           `json:"archived"`
	MessageCount       int64          `json:"message_count"`
	GroupUID           string         `json:"group_uid"`
	MessageCountByUser map[string]int `json:"message_count_by_user"`
}
