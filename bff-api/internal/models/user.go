package models

type Identity struct {
	Identity   string `csv:"identity"`
	FirstName  string `csv:"firstname"`
	LastName   string `csv:"lastname"`
	NickName   string `csv:"nick_name"`
	IdentityID string `csv:"identity_id"`
}
