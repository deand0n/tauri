import { invoke } from "@tauri-apps/api/core";
import {
	ChangeTaskEntryOrder,
	CreateTask,
	Page,
	PageParams,
	Task,
	TaskEntry,
} from "../../lib/task";

export const getTaskEntriesByDates = async (
	from: Date,
	to: Date,
	pageParams: PageParams,
): Promise<Page<TaskEntry>> => {
	return invoke("get_task_entries_by_date", {
		from: from.toISOString(),
		to: to.toISOString(),
		pageParams,
	});
};

export const toggleTaskEntryStatus = async (id: number): Promise<TaskEntry> => {
	return invoke("toggle_task_entry_status", {
		id,
	});
};

export const createTask = async (task: CreateTask): Promise<Task> => {
	return invoke("create_task", {
		task,
	});
};

export const changeTaskEntryOrder = async (
	task_entry: ChangeTaskEntryOrder,
): Promise<Task> => {
	return invoke("change_task_entry_order", {
		task_entry,
	});
};
