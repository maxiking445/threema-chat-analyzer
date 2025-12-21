package models

type Group struct {
	ID           string        `json:"id"`
	Creator      string        `json:"creator"`
	GroupName    string        `json:"group_name"`
	Archived     bool          `json:"archived"`
	MessageCount int64         `json:"message_count"`
	GroupUID     string        `json:"group_uid"`
	GroupMember  []GroupMember `json:"group_member"`
}

type GroupMember struct {
	Identity     Identity `json:"identity"`
	MessageCount int64    `json:"message_count"`
}
