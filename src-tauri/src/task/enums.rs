use diesel::{
    backend::Backend,
    deserialize::{self, FromSql},
    sql_types::Text,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub enum TaskStatus {
    New,
    Completed,
}

impl<DB> FromSql<Text, DB> for TaskStatus
where
    DB: Backend,
    String: FromSql<Text, DB>,
{
    fn from_sql(bytes: DB::RawValue<'_>) -> deserialize::Result<Self> {
        match String::from_sql(bytes)?.as_str() {
            "New" => Ok(TaskStatus::New),
            "Completed" => Ok(TaskStatus::Completed),
            x => Err(format!("Unrecognized variant {}", x).into()),
        }
    }
}

impl Into<String> for TaskStatus {
    fn into(self) -> String {
        match self {
            TaskStatus::New => "New".to_string(),
            TaskStatus::Completed => "Completed".to_string(),
        }
    }
}
impl From<String> for TaskStatus {
    fn from(status: String) -> Self {
        match status.as_str() {
            "New" => TaskStatus::New,
            "Completed" => TaskStatus::Completed,
            _ => panic!("Invalid task status"),
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
