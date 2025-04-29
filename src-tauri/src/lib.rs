use log::info;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Task {
    id: String,
    description: String,
    due_date: String,
    repeat: Option<TaskRepeat>,
    status: TaskStatus,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TaskRepeat {
    frequency: Frequency,
    custom_repeats: Option<Vec<CustomRepeat>>,
    end_date: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CustomRepeat {
    time: Option<String>,
    week_day: Option<String>,
    month_day: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
enum TaskStatus {
    New,
    InProgress,
    Completed,
}

#[derive(Debug, Serialize, Deserialize)]
enum Frequency {
    Hour,
    Day,
    Week,
    Month,
    Year,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    info!("hello");
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn create_task(task: Task) -> Task {
    task
}

mod db;

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
        .invoke_handler(tauri::generate_handler![greet, create_task])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
