// TODO: add ordering
export type Task = {
	id: number;
	description: string;
	dueDate: string;
	cron?: string;
	createdAt: string;
	updatedAt: string;
};

export type CreateTask = {
	description: string;
	dueDate: string;
	cron?: string;
};

export type TaskEntry = {
	id: number;
	datetime: string;
	status: TaskStatus;
	taskId: number;
	weight?: number;
	createdAt: string;
	updatedAt: string;
	task?: Task;
};

export enum TaskStatus {
	NEW = "New",
	COMPLETED = "Completed",
}

export type Page<T> = {
	data: T[];
	page: number;
	page_size: number;
	total_count: number;
};

export type PageParams = {
	page: number;
	pageSize?: number;
};
