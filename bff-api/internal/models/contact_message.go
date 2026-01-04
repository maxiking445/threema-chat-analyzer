package models

type ContactTimeline struct {
	User     Identity   `json:"identity"`
	Timeline []DayCount `json:"timeline"`
}
