use tauri::{AppHandle, Manager, webview::DownloadEvent};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .setup(|app| {
      setup_window(app)?;

      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

fn setup_window(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    tauri::WebviewWindowBuilder::new(app, "main", tauri::WebviewUrl::App(Default::default()))
        .title("Threema-Chat-Analyzer")
        .inner_size(1600.0, 800.0)
        .resizable(true)
        .on_download(|webview, event| {
            handle_download_event(webview.app_handle().clone(), event);
            true
        })
        .build()?;

    Ok(())
}

fn handle_download_event(app_handle: AppHandle, event: DownloadEvent) {
    match event {
        DownloadEvent::Requested { url, destination } => {
            log::info!("Download requested: {}", url);
            *destination = std::env::temp_dir().join(destination.file_name().unwrap());
        }
        DownloadEvent::Finished { path, success, .. } => {
            log::info!("Download finished: {:?}, success={}", path, success);

            if let Some(path) = path {
                let file_name = path
                    .file_name()
                    .unwrap_or_default()
                    .to_string_lossy()
                    .to_string();

                open_save_dialog(app_handle, path.clone(), &file_name);
            } else {
                log::error!("Download finished with invalid path");
            }
        }
        _ => {}
    }
}

fn open_save_dialog(app_handle: AppHandle, temp_path: std::path::PathBuf, file_name: &str) {
    use tauri_plugin_dialog::DialogExt;

    let file_name = file_name.to_string();
    app_handle
        .dialog()
        .file()
        .set_file_name(&file_name)
        .save_file(move |selected| {
            if let Some(dest) = selected {
                let dest_path = dest.as_path().unwrap();
                if let Err(e) = std::fs::copy(&temp_path, dest_path) {
                    log::error!("Failed to save file: {}", e);
                }
                let _ = std::fs::remove_file(&temp_path);
            } else {
                let _ = std::fs::remove_file(&temp_path);
            }
        });
}
