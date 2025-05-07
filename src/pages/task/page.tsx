import { invoke } from "@tauri-apps/api/core";
import { isAfter, isBefore, format, isSameDay } from "date-fns";
import { createSignal, Match, onMount, Show, Switch } from "solid-js";
import { TaskStatus, CreateTask, Task } from "../../lib/task";
import { useTranslation } from "../../lib/translation";
import { TaskList } from "./task-list";

export const TaskPage = () => {
	const [tasks, setTasks] = createSignal<Task[]>();
	const { t } = useTranslation();

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

			if (isSameDay(t.dueDate, new Date())) {
				present.push(t);
			} else if (isBefore(t.dueDate, new Date())) {
				past.push(t);
			} else if (isAfter(t.dueDate, new Date())) {
				future.push(t);
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
		<Switch>
			<Match when={tasks()}>
				<Show
					when={!!tasks()?.length}
					fallback={<div>No tasks found</div>}
				>
					<TaskList
						title={t("task.list.past")}
						tasks={derivedTasks().pastTasks}
						onCheckedChange={onTaskCheckedChange}
					/>
					<TaskList
						initialOpen={true}
						title={t("task.list.present")}
						tasks={derivedTasks().presentTasks}
						onCheckedChange={onTaskCheckedChange}
					/>
					<TaskList
						title={t("task.list.future")}
						tasks={derivedTasks().futureTasks}
						onCheckedChange={onTaskCheckedChange}
					/>
					<TaskList
						title={t("task.list.completed")}
						tasks={derivedTasks().completedTasks}
						onCheckedChange={onTaskCheckedChange}
					/>
				</Show>
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
			</Match>
			<Match when={!tasks()}>
				<div>{t("loading")}</div>
			</Match>
		</Switch>
	);
};
