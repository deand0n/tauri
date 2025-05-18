import { For, createSignal, onMount } from "solid-js";
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

	return (
		<div class="collapse collapse-arrow bg-base-100 border-base-300 border select-none">
			<input
				type="checkbox"
				onChange={() => setIsOpen(!isOpen())}
				checked={isOpen()}
				class="peer"
			/>
			<div class="collapse-title font-semibold peer-checked:bg-base-300">
				{props.title}
			</div>
			<div class="collapse-content peer-checked:bg-base-300 p-0">
				<ul ref={listElement} class="list">
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
