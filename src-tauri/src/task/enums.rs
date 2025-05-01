use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub enum TaskStatus {
    New,
    InProgress,
    Completed,
}

impl Into<String> for TaskStatus {
    fn into(self) -> String {
        match self {
            TaskStatus::New => "New".to_string(),
            TaskStatus::InProgress => "InProgress".to_string(),
            TaskStatus::Completed => "Completed".to_string(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub enum Frequency {
    Hour,
    Day,
    Week,
    Month,
    Year,
}
