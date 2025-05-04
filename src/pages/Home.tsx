import { invoke } from "@tauri-apps/api/core";
import { createSignal, Match, onMount, Show, Switch } from "solid-js";
import { Task, CreateTask, TaskStatus } from "../lib/task";
import { format, isAfter } from "date-fns";
import { TaskList } from "./task/task-list";
import { isBefore } from "date-fns/fp";

export type HomeProps = {};

export const Home = ({}: HomeProps) => {
	const [tasks, setTasks] = createSignal<Task[]>();

	const derivedTasks = () => {
		const past: Task[] = [],
			present: Task[] = [],
			future: Task[] = [],
			completed: Task[] = [];

		for (const t of tasks() ?? []) {
			if (t.status === TaskStatus.COMPLETED) {
				completed.push(t);
				continue;
			}

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
			completedTasks: completed,
		};
	};

	const addTask = async () => {
		const task: CreateTask = {
			description: "test task",
			dueDate: format(new Date(), "yyyy-MM-dd"),
		};
		const createdTask: Task = await invoke("create_task", {
			newTask: task,
		});
		setTasks([...(tasks() ?? []), createdTask]);
	};

	const deleteAllTasks = async () => {
		await invoke("delete_all_tasks");
		setTasks([]);
	};

	const onTaskCheckedChange = async (task: Task) => {
		const updatedTask: Task = await invoke("toggle_task_status", {
			id: task.id,
		});

		setTasks(() =>
			tasks()!.map((t) => (t.id === task.id ? updatedTask : t)),
		);
	};

	onMount(async () => {
		const t: Task[] = await invoke("get_tasks");
		setTasks(t);
	});

	return (
		<main class="container">
			<Switch>
				<Match when={tasks()}>
					<Show
						when={!!tasks()?.length}
						fallback={<div>No tasks found</div>}
					>
						past
						<TaskList
							tasks={derivedTasks().pastTasks}
							onCheckedChange={onTaskCheckedChange}
						/>
						present
						<TaskList
							tasks={derivedTasks().presentTasks}
							onCheckedChange={onTaskCheckedChange}
						/>
						future
						<TaskList
							tasks={derivedTasks().futureTasks}
							onCheckedChange={onTaskCheckedChange}
						/>
						completed
						<TaskList
							tasks={derivedTasks().completedTasks}
							onCheckedChange={onTaskCheckedChange}
						/>
					</Show>

					<button
						type="button"
						class="btn btn-primary"
						onClick={addTask}
					>
						Create Task
					</button>
					<button
						type="button"
						class="btn btn-danger"
						onClick={deleteAllTasks}
					>
						Delete All Tasks
					</button>
				</Match>
				<Match when={!tasks()}>
					<div>Loading...</div>
				</Match>
			</Switch>
		</main>
	);
};
