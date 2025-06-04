use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use crate::task::models::TaskEntry;

use super::task::TaskDto;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TaskEntryDto {
    pub id: i32,
    pub datetime: String,
    pub status: String,
    pub task_id: i32,
    pub weight: Option<i32>,
    pub task: Option<TaskDto>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

impl From<TaskEntry> for TaskEntryDto {
    fn from(value: TaskEntry) -> Self {
        TaskEntryDto {
            id: value.id,
            datetime: value.datetime,
            status: value.status,
            task_id: value.task_id,
            weight: value.weight,
            created_at: value.created_at,
            updated_at: value.updated_at,
            task: None,
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateTaskEntryDto {
    pub task_id: i32,
    pub datetime: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChangeTaskEntryOrderDto {
    pub id: i32,
    pub weight: i32,
}
