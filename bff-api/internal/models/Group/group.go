package Group

type Group struct {
	ID                 string         `json:"id"`
	Creator            string         `json:"creator"`
	GroupName          string         `json:"groupname"`
	Members            []string       `json:"members"`
	Archived           bool           `json:"archived"`
	GroupUID           string         `json:"group_uid"`
	MessageCountByUser map[string]int `json:"message_count_by_user"`
}
