import { invoke } from "@tauri-apps/api/core";
import { isAfter, isBefore, isSameDay } from "date-fns";
import { Match, Switch, createSignal, onMount } from "solid-js";
import { CreateTask, Task, TaskStatus } from "../../lib/task";
import { useTranslation } from "../../lib/translation";
import { CreateTaskModal } from "./create-task-modal";
import { TaskList } from "./task-list";

export const TaskPage = () => {
	const [tasks, setTasks] = createSignal<Task[]>([]);
	const { t } = useTranslation();

	const derivedTasks = () => {
		const past: Task[] = [],
			present: Task[] = [],
			future: Task[] = [],
			completed: Task[] = [];

		// TODO: sort on backend
		const sortByWeight = (tasks: Task[]) =>
			tasks.sort((a, b) => a.weight - b.weight);

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
			pastTasks: sortByWeight(past),
			presentTasks: sortByWeight(present),
			futureTasks: sortByWeight(future),
			completedTasks: sortByWeight(completed),
		};
	};

	const onTaskCheckedChange = async (task: Task) => {
		const updatedTask: Task = await invoke("toggle_task_status", {
			id: task.id,
		});

		setTasks(() =>
			tasks().map((t) => (t.id === task.id ? updatedTask : t)),
		);
	};

	const onTaskCreate = async (task: Omit<CreateTask, "weight">) => {
		const createdTask: Task = await invoke("create_task", {
			newTask: {
				...task,
				weight: tasks().length + 1,
			},
		});
		setTasks([...tasks(), createdTask]);
	};

	onMount(async () => {
		// get_tasks before today, for today, after today, complete
		const t: Task[] = await invoke("get_tasks");
		setTasks(t);
	});

	// TODO: add ability to move between lists
	return (
		<div class="relative h-full w-full">
			<Switch>
				<Match when={tasks().length}>
					<div class="flex flex-col gap-3 md:flex-row md:flex-wrap md:justify-center">
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
				<Match when={!tasks().length}>
					<div>{t("loading")}</div>
				</Match>
			</Switch>
			<CreateTaskModal onSubmit={onTaskCreate} />
		</div>
	);
};
