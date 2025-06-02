use std::{str::FromStr, time::Duration};

use chrono::{DateTime, Utc};
use cron::Schedule;
use diesel::result::Error;
use diesel::{
    Connection, ExpressionMethods, OptionalExtension, QueryDsl, RunQueryDsl, SelectableHelper,
};

use crate::db::pagination::Paginate;
use crate::db::{
    establish_connection,
    schema::{task, task_entry},
};

use super::{
    enums::TaskStatus,
    models::{CreateTask, CreateTaskEntry, Task},
};

#[tauri::command]
pub fn create_task(new_task: CreateTask) -> Task {
    let conn = &mut establish_connection();

    conn.transaction::<Task, Error, _>(|conn| {
        let new_task = CreateTask {
            description: new_task.description,
            due_date: new_task.due_date,
            weight: new_task.weight,
            cron: new_task.cron,
        };

        let task: Task = diesel::insert_into(task::table)
            .values(new_task)
            .returning(task::all_columns)
            .get_result(conn)
            .expect("Cannot insert task");

        let create_task_entries: Vec<CreateTaskEntry> = match &task.cron {
            Some(value) => {
                let schedule = Schedule::from_str(value.as_str()).expect("invalid cron");

                let now: DateTime<Utc> = Utc::now();
                let tomorrow = now + Duration::from_secs(60 * 60 * 24);

                let mut tmp: Vec<CreateTaskEntry> = vec![];
                for datetime in schedule.upcoming(Utc).take_while(|date| date.le(&tomorrow)) {
                    tmp.push(CreateTaskEntry {
                        task_id: task.id,
                        datetime: datetime.to_rfc3339(),
                    });
                }

                tmp
            }
            None => {
                vec![CreateTaskEntry {
                    task_id: task.id,
                    datetime: Utc::now().to_rfc3339(),
                }]
            }
        };

        // diesel cannot return from batch insert in SQLite
        // https://stackoverflow.com/questions/77487976/rust-diesel-sqlite-insert-returning-multiple-ids
        diesel::insert_into(task_entry::table)
            .values(create_task_entries)
            .execute(conn)
            .expect("Cannot insert task entries");

        Ok(task)
    })
    .expect("msg")
}

#[tauri::command]
pub fn get_tasks() -> Vec<Task> {
    let conn = &mut establish_connection();

    task::table
        .select(task::all_columns)
        .paginate(0)
        .load_and_count_pages(conn)
        .expect("Cannot load tasks")
        .0
}

#[tauri::command]
pub fn get_tasks_by_date(from: String, to: String) -> Vec<Task> {
    let from =
        DateTime::parse_from_str(from.as_str(), "%Y-%m-%d").expect("Invalid date string provided");
    let to =
        DateTime::parse_from_str(to.as_str(), "%Y-%m-%d").expect("Invalid date string provided");

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
        weight: new_task.weight,
        cron: new_task.cron,
    };

    // TODO: re-create task entries
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
pub fn toggle_task_status(id: i32) -> Option<Task> {
    let mut conn = establish_connection();

    let task: Task = task::table
        .find(id)
        .first(&mut conn)
        .optional()
        .expect("Cannot load task")?;

    let new_status: TaskStatus = match task.status.into() {
        TaskStatus::New => TaskStatus::Completed,
        TaskStatus::Completed => TaskStatus::New,
    };

    diesel::update(task::table.find(id))
        .set(task::dsl::status.eq::<String>(new_status.into()))
        .get_result(&mut conn)
        .optional()
        .expect("Cannot load task")
}
