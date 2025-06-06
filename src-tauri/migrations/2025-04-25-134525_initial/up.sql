CREATE TABLE task (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    due_date TEXT NOT NULL,
    cron TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_entry (
    id INTEGER PRIMARY KEY NOT NULL,
    datetime TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    task_id INTEGER NOT NULL,
    weight INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(task_id) REFERENCES task(id)
);
