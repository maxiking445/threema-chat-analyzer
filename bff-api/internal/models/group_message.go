package models

type DayCount struct {
	Date  string `json:"date"`
	Count int    `json:"count"`
}

type GroupTimeline struct {
	Group    string     `json:"group"`
	User     string     `json:"user"`
	Timeline []DayCount `json:"timeline"`
}
