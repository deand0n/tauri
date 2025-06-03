use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Identifiable, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[diesel(table_name = crate::db::schema::task)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Task {
    pub id: i32,
    pub description: String,
    pub due_date: String,
    pub weight: i32,
    pub cron: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable, Serialize, Deserialize, AsChangeset)]
#[serde(rename_all = "camelCase")]
#[diesel(table_name = crate::db::schema::task)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct CreateTask {
    pub description: String,
    pub due_date: String,
    pub weight: i32,
    pub cron: Option<String>,
}

#[derive(Queryable, Selectable, Identifiable, Associations, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[diesel(table_name = crate::db::schema::task_entry)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[diesel(belongs_to(Task))]
pub struct TaskEntry {
    pub id: i32,
    pub datetime: String,
    pub status: String,
    pub task_id: i32,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable, Serialize, Deserialize, AsChangeset)]
#[serde(rename_all = "camelCase")]
#[diesel(table_name  = crate::db::schema::task_entry)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct CreateTaskEntry {
    pub task_id: i32,
    pub datetime: String,
}
