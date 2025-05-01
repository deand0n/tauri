mod db;
mod task;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut connection = db::establish_connection();
    db::run_migrations(&mut connection).unwrap();

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .clear_targets()
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Webview,
                ))
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            task::commands::create_task,
            task::commands::get_tasks,
            task::commands::update_task,
            task::commands::delete_task,
            task::commands::get_task,
            task::commands::complete_task,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
