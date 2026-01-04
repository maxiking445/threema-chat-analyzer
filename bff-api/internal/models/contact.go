package models

type Contact struct {
	Identity     Identity `json:"identity"`
	MessageCount int64    `json:"messageCount"`
}
