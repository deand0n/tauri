CREATE TABLE task (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    weight INTEGER NOT NULL,
    cron TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE task_entry (
    id INTEGER PRIMARY KEY NOT NULL,
    datetime TEXT NOT NULL,
    task_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    FOREIGN KEY(task_id) REFERENCES task(id)
);
