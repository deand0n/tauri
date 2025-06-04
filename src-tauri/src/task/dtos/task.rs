use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use crate::task::models::{CreateTask, Task};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TaskDto {
    pub id: i32,
    pub description: String,
    pub due_date: String,
    pub cron: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

impl Into<Task> for TaskDto {
    fn into(self) -> Task {
        Task {
            id: self.id,
            description: self.description,
            due_date: self.due_date,
            cron: self.cron,
            created_at: self.created_at,
            updated_at: self.updated_at,
        }
    }
}

impl From<Task> for TaskDto {
    fn from(value: Task) -> Self {
        TaskDto {
            id: value.id,
            description: value.description,
            due_date: value.due_date,
            cron: value.cron,
            created_at: value.created_at,
            updated_at: value.updated_at,
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateTaskDto {
    pub description: String,
    pub due_date: String,
    pub cron: Option<String>,
}

impl Into<CreateTask> for CreateTaskDto {
    fn into(self) -> CreateTask {
        CreateTask {
            description: self.description,
            due_date: self.due_date,
            cron: self.cron,
        }
    }
}
impl From<CreateTask> for CreateTaskDto {
    fn from(value: CreateTask) -> Self {
        CreateTaskDto {
            description: value.description,
            due_date: value.due_date,
            cron: value.cron,
        }
    }
}
