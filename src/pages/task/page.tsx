import { invoke } from "@tauri-apps/api/core";
import { addDays, isAfter, isBefore, isSameDay, subDays } from "date-fns";
import { Match, Switch, createSignal, onMount } from "solid-js";
import { CreateTask, Page, TaskEntry, TaskStatus } from "../../lib/task";
import { useTranslation } from "../../lib/translation";
import { CreateTaskModal } from "./create-task-modal";
import { TaskList } from "./task-list";

export const TaskPage = () => {
	const [tasks, setTasks] = createSignal<TaskEntry[]>([]);
	const { t } = useTranslation();

	const derivedTasks = () => {
		// TODO: get from backend
		const past: TaskEntry[] = [],
			present: TaskEntry[] = [],
			future: TaskEntry[] = [],
			completed: TaskEntry[] = [];

		// TODO: sort on backend
		const sortByWeight = (tasks: TaskEntry[]) =>
			tasks.sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));

		for (const t of tasks() ?? []) {
			if (t.status === TaskStatus.COMPLETED) {
				completed.push(t);
				continue;
			}

			if (isSameDay(t.datetime, new Date())) {
				present.push(t);
			} else if (isBefore(t.datetime, new Date())) {
				past.push(t);
			} else if (isAfter(t.datetime, new Date())) {
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

	const onTaskCheckedChange = async (task: TaskEntry) => {
		const updatedTask: TaskEntry = await invoke("toggle_task_status", {
			id: task.id,
		});

		setTasks(() =>
			tasks().map((t) => (t.id === task.id ? updatedTask : t)),
		);
	};

	const onTaskCreate = async (task: Omit<CreateTask, "weight">) => {
		const createdTask: TaskEntry = await invoke("create_task", {
			newTask: {
				...task,
				weight: tasks().length + 1,
			},
		});
		setTasks([...tasks(), createdTask]);
	};

	onMount(async () => {
		// get_tasks before today, for today, after today, complete
		const t: Page<TaskEntry> = await invoke("get_task_entries_by_date", {
			from: subDays(new Date(), 1).toISOString(),
			to: addDays(new Date(), 1).toISOString(),
			pageParams: { page: 0 },
		});
		console.log(t);
		setTasks(t.data);
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
