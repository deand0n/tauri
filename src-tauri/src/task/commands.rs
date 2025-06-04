use std::{str::FromStr, time::Duration};

use chrono::{DateTime, Utc};
use cron::Schedule;
use diesel::result::Error;
use diesel::{
    Connection, ExpressionMethods, OptionalExtension, QueryDsl, RunQueryDsl, SqliteConnection,
};

use crate::db::pagination::{Page, PageParams, Paginate};
use crate::db::{
    establish_connection,
    schema::{task, task_entry},
};

use super::dtos::task::{CreateTaskDto, TaskDto};
use super::dtos::task_entry::{ChangeTaskEntryOrderDto, TaskEntryDto};
use super::models::{ChangeTaskEntryOrder, TaskEntry};
use super::{
    enums::TaskStatus,
    models::{CreateTask, CreateTaskEntry, Task},
};

fn create_task_entries(conn: &mut SqliteConnection, task: Task) -> Result<Task, Error> {
    conn.transaction::<Task, Error, _>(|conn| {
        let create_task_entries: Vec<CreateTaskEntry> = match &task.cron {
            Some(value) => {
                let schedule = Schedule::from_str(value.as_str()).expect("invalid cron");

                let now: DateTime<Utc> = Utc::now();
                let tomorrow = now + Duration::from_secs(60 * 60 * 24);

                let mut result: Vec<CreateTaskEntry> = vec![];
                for datetime in schedule.upcoming(Utc).take_while(|date| date.le(&tomorrow)) {
                    result.push(CreateTaskEntry {
                        task_id: task.id,
                        datetime: datetime.to_rfc3339(),
                    });
                }

                result
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
}

#[tauri::command]
pub fn create_task(task: CreateTaskDto) -> TaskDto {
    let conn = &mut establish_connection();

    let task = CreateTask {
        description: task.description,
        due_date: task.due_date,
        cron: task.cron,
    };

    let task: Task = diesel::insert_into(task::table)
        .values(task)
        .returning(task::all_columns)
        .get_result(conn)
        .expect("Cannot insert task");

    create_task_entries(conn, task).unwrap().into()
}

#[tauri::command]
pub fn get_tasks(page_params: PageParams) -> Page<TaskDto> {
    let conn = &mut establish_connection();

    let page: Page<Task> = task::table
        .select(task::all_columns)
        .paginate(page_params.page, page_params.page_size)
        .load_and_count_pages(conn)
        .expect("Cannot load tasks");

    Page::<TaskDto> {
        data: page.data.into_iter().map(|t| TaskDto::from(t)).collect(),
        page: page.page,
        page_size: page.page_size,
        total_count: page.total_count,
    }
}

#[tauri::command]
pub fn get_task_entries_by_date(
    _from: String,
    _to: String,
    page_params: PageParams,
) -> Page<TaskEntryDto> {
    // TODO: implement
    // let from = NaiveDateTime::from(from);
    // DateTime::parse_from_str(from.as_str(), "%Y-%m-%d").expect("Invalid date string provided");
    // let to = NaiveDateTime::from(to);
    // DateTime::parse_from_str(to.as_str(), "%Y-%m-%d").expect("Invalid date string provided");

    let conn = &mut establish_connection();

    let page = task_entry::table
        .inner_join(task::table)
        .select((task_entry::all_columns, task::all_columns))
        .paginate(page_params.page, page_params.page_size)
        .load_and_count_pages::<(TaskEntry, Task)>(conn)
        .expect("Cannot load tasks");

    Page::<TaskEntryDto> {
        data: page
            .data
            .into_iter()
            .map(|t| TaskEntryDto {
                task: Some(TaskDto::from(t.1)),
                ..TaskEntryDto::from(t.0)
            })
            .collect(),
        page: page.page,
        page_size: page.page_size,
        total_count: page.total_count,
    }
}

#[tauri::command]
pub fn update_task(id: i32, task: CreateTaskDto) {
    let conn = &mut establish_connection();

    conn.transaction::<(), Error, _>(|conn| {
        let create_task = CreateTask {
            description: task.description,
            due_date: task.due_date,
            cron: task.cron,
        };

        let task: Task = diesel::update(task::table.find(id))
            .set(create_task)
            .get_result(conn)
            .expect("Cannot update task");

        let task_entries = task_entry::table.filter(task_entry::task_id.eq(task.id));
        diesel::delete(task_entries).execute(conn).expect("msg");

        create_task_entries(conn, task).unwrap();
        Ok(())
    })
    .expect("msg");
}

#[tauri::command]
pub fn delete_task(id: i32) {
    let conn = &mut establish_connection();

    let task = task::table.find(id);
    diesel::delete(task).execute(conn).expect("msg");

    let task_entries = task_entry::table.filter(task_entry::task_id.eq(id));
    diesel::delete(task_entries).execute(conn).expect("msg");
}

#[tauri::command]
pub fn get_task(id: i32) -> Option<TaskDto> {
    let conn = &mut establish_connection();

    let task: Option<Task> = task::table
        .find(id)
        .first(conn)
        .optional()
        .expect("Cannot load task");

    match task {
        Some(v) => Some(TaskDto::from(v)),
        None => None,
    }
}

#[tauri::command]
pub fn toggle_task_entry_status(id: i32) -> Option<TaskEntryDto> {
    let conn = &mut establish_connection();

    let task_entry: Option<TaskEntry> = task_entry::table
        .find(id)
        .first(conn)
        .optional()
        .expect("Cannot load task");

    match task_entry {
        Some(entry) => {
            let new_status: TaskStatus = match entry.status.clone().into() {
                TaskStatus::New => TaskStatus::Completed,
                TaskStatus::Completed => TaskStatus::New,
            };

            let task_entry = diesel::update(&entry)
                .set(task_entry::status.eq::<String>(new_status.into()))
                .get_result::<TaskEntry>(conn)
                .expect("Cannot load task");

            Some(TaskEntryDto::from(task_entry))
        }
        None => None,
    }
}

#[tauri::command]
pub fn change_task_entry_order(task_entry: ChangeTaskEntryOrderDto) -> TaskEntryDto {
    let conn = &mut establish_connection();

    let entry = ChangeTaskEntryOrder {
        id: task_entry.id,
        weight: task_entry.weight,
    };

    let entry: TaskEntry = diesel::update(task_entry::table.find(entry.id))
        .set(entry)
        .get_result(conn)
        .expect("Cannot update task");

    TaskEntryDto::from(entry)
}
