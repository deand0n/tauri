use diesel::RunQueryDsl;

use crate::db::{establish_connection, schema::task};

use super::models::{NewTask, Task};

#[tauri::command]
pub fn create_task(new_task: NewTask) {
    let mut conn = establish_connection();

    let new_task = NewTask {
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
