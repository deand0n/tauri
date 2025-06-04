import { addDays, isAfter, isBefore, isSameDay, subDays } from "date-fns";
import { Match, Switch, createSignal, onMount } from "solid-js";
import { CreateTask, TaskEntry, TaskStatus } from "../../lib/task";
import { useTranslation } from "../../lib/translation";
import { CreateTaskModal } from "./create-task-modal";
import {
	createTask,
	getTaskEntriesByDates,
	toggleTaskEntryStatus,
} from "./service";
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
			pastTasks: past,
			presentTasks: present,
			futureTasks: future,
			completedTasks: completed,
		};
	};

	const onTaskCheckedChange = async (task: TaskEntry) => {
		const updatedTask: TaskEntry = await toggleTaskEntryStatus(task.id);

		setTasks(() =>
			tasks().map((t) => (t.id === task.id ? updatedTask : t)),
		);
	};

	const onTaskCreate = async (task: CreateTask) => {
		await createTask(task);

		const page = await getTaskEntriesByDates(
			subDays(new Date(), 1),
			addDays(new Date(), 1),
			{ page: 0, pageSize: 9999 },
		);
		setTasks(page.data);
	};

	onMount(async () => {
		const page = await getTaskEntriesByDates(
			subDays(new Date(), 1),
			addDays(new Date(), 1),
			{ page: 0, pageSize: 9999 },
		);
		setTasks(page.data);
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
