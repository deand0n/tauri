// @generated automatically by Diesel CLI.

diesel::table! {
    task (id) {
        id -> Integer,
        description -> Text,
        due_date -> Text,
        weight -> Integer,
        cron -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    task_entry (id) {
        id -> Integer,
        datetime -> Text,
        status -> Text,
        task_id -> Integer,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::joinable!(task_entry -> task (task_id));

diesel::allow_tables_to_appear_in_same_query!(
    task,
    task_entry,
);
