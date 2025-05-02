import { invoke } from "@tauri-apps/api/core";
import { createResource, Show, Suspense } from "solid-js";
import { Task, CreateTask } from "../lib/task";
import { format, isAfter } from "date-fns";
import { TaskList } from "./task/task-list";
import { isBefore } from "date-fns/fp";

export type HomeProps = {};

export const Home = ({}: HomeProps) => {
	const [tasks, { refetch }] = createResource<Task[]>(async () => {
		return invoke("get_tasks");
	});

	const derivedTasks = () => {
		const past: Task[] = [],
			present: Task[] = [],
			future: Task[] = [];

		for (const t of tasks() ?? []) {
			if (isAfter(t.dueDate, new Date())) {
				past.push(t);
			} else if (isBefore(t.dueDate, new Date())) {
				future.push(t);
			} else {
				present.push(t);
			}
		}
		return {
			pastTasks: past,
			presentTasks: present,
			futureTasks: future,
		};
	};

	const addTask = async () => {
		const task: CreateTask = {
			description: "test task",
			dueDate: format(new Date(), "yyyy-MM-dd"),
		};
		await invoke("create_task", { newTask: task });
		refetch();
	};

	const deleteAllTasks = async () => {
		await invoke("delete_all_tasks");
		refetch();
	};

	return (
		<main class="container">
			<Suspense fallback={<div>Loading...</div>}>
				<Show
					when={tasks()?.length}
					fallback={<div>No tasks found</div>}
				>
					past
					<TaskList tasks={derivedTasks().pastTasks} />
					present
					<TaskList tasks={derivedTasks().presentTasks} />
					future
					<TaskList tasks={derivedTasks().futureTasks} />
				</Show>
			</Suspense>
			<button type="button" class="btn btn-primary" onClick={addTask}>
				Create Task
			</button>
			<button
				type="button"
				class="btn btn-danger"
				onClick={deleteAllTasks}
			>
				Delete All Tasks
			</button>
		</main>
	);
};
