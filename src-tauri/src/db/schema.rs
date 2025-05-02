// @generated automatically by Diesel CLI.

diesel::table! {
    task (id) {
        id -> Integer,
        description -> Text,
        due_date -> Text,
        status -> Text,
    }
}

diesel::table! {
    task_repeat (id) {
        id -> Integer,
        task_id -> Integer,
        frequency -> Text,
        repeat_at -> Text,
        end_date -> Nullable<Text>,
    }
}

diesel::joinable!(task_repeat -> task (task_id));

diesel::allow_tables_to_appear_in_same_query!(
    task,
    task_repeat,
);
