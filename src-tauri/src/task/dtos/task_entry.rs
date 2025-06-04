use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use crate::task::models::{CreateTaskEntry, TaskEntry};

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

impl Into<TaskEntry> for TaskEntryDto {
    fn into(self) -> TaskEntry {
        TaskEntry {
            id: self.id,
            datetime: self.datetime,
            status: self.status,
            task_id: self.task_id,
            weight: self.weight,
            created_at: self.created_at,
            updated_at: self.updated_at,
        }
    }
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

impl Into<CreateTaskEntry> for CreateTaskEntryDto {
    fn into(self) -> CreateTaskEntry {
        CreateTaskEntry {
            task_id: self.task_id,
            datetime: self.datetime,
        }
    }
}
impl From<CreateTaskEntry> for CreateTaskEntryDto {
    fn from(value: CreateTaskEntry) -> Self {
        CreateTaskEntryDto {
            task_id: value.task_id,
            datetime: value.datetime,
        }
    }
}
