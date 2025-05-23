import { invoke } from "@tauri-apps/api/core";
import { isAfter, isBefore, isSameDay } from "date-fns";
import { Match, Switch, createSignal, onMount } from "solid-js";
import { CreateTask, Task, TaskStatus } from "../../lib/task";
import { useTranslation } from "../../lib/translation";
import { CreateTaskModal } from "./create-task-modal";
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

	const onTaskCheckedChange = async (task: Task) => {
		const updatedTask: Task = await invoke("toggle_task_status", {
			id: task.id,
		});

		setTasks(() =>
			tasks()!.map((t) => (t.id === task.id ? updatedTask : t)),
		);
	};

	const onTaskCreate = async (task: CreateTask) => {
		console.log(task);
		const createdTask: Task = await invoke("create_task", {
			newTask: task,
		});
		setTasks([...(tasks() ?? []), createdTask]);
	};

	onMount(async () => {
		const t: Task[] = await invoke("get_tasks");
		setTasks(t);
	});

	return (
		<div class="relative h-full">
			<Switch>
				<Match when={tasks()}>
					<div class="flex flex-col gap-1">
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
					</div>
				</Match>
				<Match when={!tasks()}>
					<div>{t("loading")}</div>
				</Match>
			</Switch>
			<CreateTaskModal onSubmit={onTaskCreate} />
		</div>
	);
};
