export type Task = {
	id: string;
	description: string;
	dueDate: string;
	repeat?: TaskRepeat;
	status: TaskStatus;
};

export type TaskRepeat = {
	frequency: Frequency;
	customRepeats?: CustomRepeat[];
	endDate?: string;
};

export type CustomRepeat = {
	time?: string;
	weekDay?: string;
	monthDay?: string;
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
