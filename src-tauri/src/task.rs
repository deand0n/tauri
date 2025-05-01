use log::info;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    id: String,
    description: String,
    due_date: String,
    repeat: Option<TaskRepeat>,
    status: TaskStatus,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TaskRepeat {
    frequency: Frequency,
    custom_repeats: Option<Vec<CustomRepeat>>,
    end_date: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CustomRepeat {
    time: Option<String>,
    week_day: Option<String>,
    month_day: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum TaskStatus {
    New,
    InProgress,
    Completed,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum Frequency {
    Hour,
    Day,
    Week,
    Month,
    Year,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
pub fn greet(name: &str) -> String {
    info!("hello");
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn create_task(task: Task) -> Task {
    task
}
