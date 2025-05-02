use diesel::{ExpressionMethods, OptionalExtension, QueryDsl, RunQueryDsl};

use crate::db::{establish_connection, schema::task};

use super::{
    enums::TaskStatus,
    models::{CreateTask, Task},
};

#[tauri::command]
pub fn create_task(new_task: CreateTask) {
    let mut conn = establish_connection();

    let new_task = CreateTask {
        description: new_task.description,
        due_date: new_task.due_date,
    };

    diesel::insert_into(task::table)
        .values(new_task)
        .execute(&mut conn)
        .expect("Cannot insert task");
}

#[tauri::command]
pub fn get_tasks() -> Vec<Task> {
    let mut conn = establish_connection();

    task::table
        .load::<Task>(&mut conn)
        .expect("Cannot load tasks")
}

#[tauri::command]
pub fn update_task(id: i32, new_task: CreateTask) {
    let mut conn = establish_connection();

    let new_task = CreateTask {
        description: new_task.description,
        due_date: new_task.due_date,
    };

    diesel::update(task::table.find(id))
        .set(new_task)
        .execute(&mut conn)
        .expect("Cannot update task");
}

#[tauri::command]
pub fn delete_task(id: i32) {
    let mut conn = establish_connection();

    diesel::delete(task::table.find(id))
        .execute(&mut conn)
        .expect("Cannot delete task");
}

#[tauri::command]
pub fn delete_all_tasks() {
    let mut conn = establish_connection();

    diesel::delete(task::table)
        .execute(&mut conn)
        .expect("Cannot delete tasks");
}

#[tauri::command]
pub fn get_task(id: i32) -> Option<Task> {
    let mut conn = establish_connection();

    task::table
        .find(id)
        .first(&mut conn)
        .optional()
        .expect("Cannot load task")
}

#[tauri::command]
pub fn complete_task(id: i32) -> Option<Task> {
    let mut conn = establish_connection();

    diesel::update(task::table.find(id))
        .set(task::dsl::status.eq::<String>(TaskStatus::Completed.into()))
        .get_result(&mut conn)
        .optional()
        .expect("Cannot load task")
}
