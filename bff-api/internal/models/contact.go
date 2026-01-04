package models

type Contact struct {
	Identity            Identity `json:"identity"`
	TotalMessageCount   int64    `json:"totalMessageCount"`
	ContactMessageCount int64    `json:"contactMessageCount"`
	YourMessageCount    int64    `json:"yourMessageCount"`
}
