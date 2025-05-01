export type Task = {
	id: number;
	description: string;
	dueDate?: string;
	status: TaskStatus;
};
export type CreateTask = {
	description: string;
	dueDate?: string;
};

export type TaskRepeat = {
    id: number;
    taskId: number;
	frequency: Frequency;
	repeatAt: string;
	endDate?: string;
};

export enum Frequency {
	HOUR = "Hour",
	DAY = "Day",
	WEEK = "Week",
	MONTH = "Month",
	YEAR = "Year",
}

export enum TaskStatus {
	NEW = "New",
	IN_PROGRESS = "InProgress",
	COMPLETED = "Completed",
}
