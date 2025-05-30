import { invoke } from "@tauri-apps/api/core";
import { For, createSignal, onMount } from "solid-js";
import Sortable from "sortablejs";
import { Task } from "../../lib/task";
import { TaskCard } from "./task-card";

export type TaskListProps = {
	initialOpen?: boolean;
	title: string;
	tasks: Task[];
	onCheckedChange?: (task: Task, isChecked: boolean) => void;
};

export const TaskList = (props: TaskListProps) => {
	let listElement!: HTMLUListElement;

	const [isOpen, setIsOpen] = createSignal(props.initialOpen);

	onMount(() => {
		new Sortable(listElement, {
			swap: true,
			forceFallback: true,
			dragClass: "bg-primary/30",
			swapClass: "bg-info/30",
			animation: 150,
			onEnd: (event) => {
				const from = props.tasks[event.oldIndex!];
				const to = props.tasks[event.newIndex!];

				const tmp = from.weight;
				from.weight = to.weight;
				to.weight = tmp;

				// TODO: add batch update
				invoke("update_task", {
					id: from.id,
					newTask: from,
				});
				invoke("update_task", {
					id: to.id,
					newTask: to,
				});
			},
		});

		console.log(window.navigator.userAgent);
	});

	return (
		<div class="collapse collapse-arrow select-none border-2 lg:max-w-1/3 lg:collapse-open lg:max-h-96">
			<input
				type="checkbox"
				onChange={() => setIsOpen(!isOpen())}
				checked={isOpen()}
				class="peer"
			/>
			<div class="collapse-title font-semibold shadow-2xs shadow-current lg:z-10 lg:after:!hidden lg:!cursor-default">
				{props.title}
			</div>
			<div class="collapse-content p-0 lg:overflow-y-auto -z-10">
				<ul ref={listElement} class="list gap-2 px-4 pt-2">
					<For each={props.tasks}>
						{(task) => (
							<TaskCard
								task={task}
								onCheckedChange={(isChecked) =>
									props.onCheckedChange?.(task, isChecked)
								}
							/>
						)}
					</For>
				</ul>
			</div>
		</div>
	);
};
