use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Serialize, Deserialize, Identifiable)]
#[serde(rename_all = "camelCase")]
#[diesel(table_name = crate::db::schema::task)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Task {
    pub id: i32,
    pub description: String,
    pub due_date: String,
    pub status: String,
}

#[derive(Insertable, Serialize, Deserialize, AsChangeset)]
#[serde(rename_all = "camelCase")]
#[diesel(table_name  = crate::db::schema::task)]
pub struct CreateTask {
    pub description: String,
    pub due_date: String,
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Identifiable)]
#[serde(rename_all = "camelCase")]
#[diesel(table_name = crate::db::schema::task_repeat)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct TaskRepeat {
    pub id: i32,
    pub task_id: i32,
    pub frequency: String,
    pub repeat_at: String,
    pub end_date: Option<String>,
}
