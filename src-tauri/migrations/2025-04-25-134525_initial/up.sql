CREATE TABLE task (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    weight INTEGER NOT NULL
);

CREATE TABLE task_repeat (
    id INTEGER PRIMARY KEY NOT NULL,
    task_id INTEGER NOT NULL,
    frequency TEXT NOT NULL,
    repeat_at TEXT NOT NULL,
    end_date TEXT,

    FOREIGN KEY(task_id) REFERENCES task(id)
);
