use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
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
