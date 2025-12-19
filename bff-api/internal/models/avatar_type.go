package models

import (
	"fmt"
	"strings"
)

type AvatarType string

const (
	AvatarTypeContact AvatarType = "CONTACT"
	AvatarTypeGroup   AvatarType = "GROUP"
	AvatarTypeAvatar  AvatarType = "AVATAR"
)

func ParseAvatarType(s string) (AvatarType, error) {
	switch strings.ToUpper(s) {
	case string(AvatarTypeContact):
		return AvatarTypeContact, nil
	case string(AvatarTypeGroup):
		return AvatarTypeGroup, nil
	case string(AvatarTypeAvatar):
		return AvatarTypeAvatar, nil
	default:
		return "", fmt.Errorf("invalid type %q (must be CONTACT, GROUP or AVATAR)", s)
	}
}
