package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/maxiking445/bff-api/internal/common"
	"github.com/yeka/zip"
)

// DeleteTempDirHandler godoc
//
// @Summary      Löscht ein temporäres Verzeichnis
// @Description  Löscht ein angegebenes temporäres Verzeichnis rekursiv
// @Tags         upload
// @Accept       json
// @Produce      json
// @Success      200      {string} string  "Temp-Verzeichnis gelöscht"
// @Failure      400      {string} string  "Temp-Verzeichnis nicht angegeben oder ungültig"
// @Failure      500      {string} string  "Fehler beim Löschen"
// @Router       /delete-zip [delete]
func DeleteDataHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Relativer Pfad ./data
	dataDir := common.DataPath

	// Prüfen, ob das Verzeichnis existiert
	if _, err := os.Stat(dataDir); os.IsNotExist(err) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Data directory does not exist, nothing to delete"))
		return
	}

	entries, err := os.ReadDir(dataDir)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for _, entry := range entries {
		path := filepath.Join(dataDir, entry.Name())
		fmt.Println("Removing entry:", path)
		err := os.RemoveAll(path)
		if err != nil {
			// Fehler nur loggen, nicht abbrechen
			fmt.Printf("Failed to remove entry %s: %v\n", path, err)
			continue
		}
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("All files and directories in ./data deleted"))
}

// UploadZipHandler godoc
//
// @Summary      Upload ZIP (password protected)
// @Description  Nimmt eine passwortgeschützte ZIP-Datei entgegen, entpackt sie in das relative Verzeichnis ./data
// @Tags         upload
// @Accept       multipart/form-data
// @Produce      plain
// @Param        X-Zip-Password header string true "Passwort der ZIP-Datei"
// @Param        file formData file true "ZIP-Datei"
// @Success      200 {string} string "ZIP successfully extracted"
// @Failure      400 {string} string "Bad request / wrong password / invalid zip"
// @Failure      405 {string} string "Method not allowed"
// @Failure      500 {string} string "Internal server error"
// @Router       /upload-zip [post]
func UploadZipHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	password := r.Header.Get("X-Zip-Password")
	if password == "" {
		http.Error(w, "X-Zip-Password header missing", http.StatusBadRequest)
		return
	}

	err := r.ParseMultipartForm(50 << 20) // 50 MB
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "file not provided", http.StatusBadRequest)
		return
	}
	defer file.Close()

	tmpZip, err := os.CreateTemp("", "upload-*.zip")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer os.Remove(tmpZip.Name())
	defer tmpZip.Close()

	_, err = io.Copy(tmpZip, file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	zr, err := zip.OpenReader(tmpZip.Name())
	if err != nil {
		http.Error(w, "invalid zip file", http.StatusBadRequest)
		return
	}
	defer zr.Close()

	// Relatives data-Verzeichnis
	destDir := common.DataPath
	err = os.MkdirAll(destDir, 0755) // Ordner erstellen, falls nicht vorhanden
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	entries, err := os.ReadDir(destDir)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if len(entries) > 0 {
		http.Error(w, "./data is not empty, Upload aborted", http.StatusBadRequest)
		return
	}

	// Dateien extrahieren
	for _, f := range zr.File {
		f.SetPassword(password)

		path := filepath.Join(destDir, f.Name)

		// Zip-Slip Schutz
		if !filepath.HasPrefix(path, filepath.Clean(destDir)+string(os.PathSeparator)) {
			http.Error(w, "invalid zip content", http.StatusBadRequest)
			return
		}

		if f.FileInfo().IsDir() {
			_ = os.MkdirAll(path, f.Mode())
			continue
		}

		err = os.MkdirAll(filepath.Dir(path), 0755)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		src, err := f.Open()
		if err != nil {
			http.Error(w, "wrong password or corrupt zip", http.StatusBadRequest)
			return
		}
		defer src.Close()

		dst, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		_, err = io.Copy(dst, src)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ZIP successfully extracted to ./data"))
}
