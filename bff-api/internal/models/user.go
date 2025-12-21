package models

type Identity struct {
	Identity   string `json:"identity" csv:"identity"`
	FirstName  string `json:"firstName" csv:"firstname"`
	LastName   string `json:"lastName" csv:"lastname"`
	NickName   string `json:"nickName" csv:"nick_name"`
	IdentityID string `json:"identityID" csv:"identity_id"`
}
