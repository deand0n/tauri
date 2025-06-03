import { For, createSignal, onMount } from "solid-js";
import Sortable from "sortablejs";
import { TaskEntry } from "../../lib/task";
import { TaskCard } from "./task-card";

export type TaskListProps = {
	initialOpen?: boolean;
	title: string;
	tasks: TaskEntry[];
	onCheckedChange?: (task: TaskEntry, isChecked: boolean) => void;
};

export const TaskList = (props: TaskListProps) => {
	let listElement!: HTMLUListElement;

	const [isOpen, setIsOpen] = createSignal(props.initialOpen);

	onMount(() => {
		console.log(props.tasks);
		new Sortable(listElement, {
			group: "shared",
			swap: false,
			forceFallback: true,
			revertOnSpill: true,
			dragClass: "bg-primary/30",
			swapClass: "bg-info/30",
			animation: 150,
			store: {
				get: function (sortable) {
					// var order = localStorage.getItem(sortable.options.group.name);
					// return order ? order.split('|') : [];
					const a = sortable.toArray().sort((a, b) => b - a);
					console.log(a);
					return a;
				},

				set: function (sortable) {
					console.log(sortable.toArray());
					// var order = sortable.toArray();
					// localStorage.setItem(sortable.options.group.name, order.join('|'));
				},
			},
			onEnd: (event) => {
				if (!event.newIndex || !event.oldIndex) {
					return;
				}

				if (event.newIndex > event.oldIndex) {
					// swap from bottom to up
				} else {
					// swap from top to bottom
				}
				// TODO: add batch update
				// invoke("update_task", {
				// 	id: from.id,
				// 	newTask: from,
				// });
				// invoke("update_task", {
				// 	id: to.id,
				// 	newTask: to,
				// });
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
			<div class="collapse-content p-0 lg:overflow-y-auto">
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
