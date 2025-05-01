export type Task = {
	id: string;
	description: string;
	dueDate: string;
	repeat: TaskRepeat[];
	status: TaskStatus;
};

export type TaskRepeat = {
    id: string;
	frequency: Frequency;
	repeatAt: string;
    task: Task;
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
