import { createSignal } from "solid-js";
import { Task, TaskStatus } from "../../lib/task";

export type TaskCardProps = {
	task: Task;
	onCheckedChange?: (isChecked: boolean) => void;
};

export const TaskCard = ({
	task,
	onCheckedChange: onChange,
}: TaskCardProps) => {
	let listElement!: HTMLLIElement;

	const [isChecked, setIsChecked] = createSignal(
		task.status === TaskStatus.COMPLETED,
	);

	const toggleStatus = async () => {
		const newChecked = isChecked();
		setIsChecked(!newChecked);

		setTimeout(() => {
			// TODO: add :tada: animation
			onChange?.(newChecked);
		}, 400);
	};

	return (
		<li ref={listElement} class="list-row w-full">
			<div class="flex flex-row gap-3 list-col-grow">
				<input
					class="checkbox checkbox-primary"
					checked={isChecked()}
					type="checkbox"
					on:change={() => toggleStatus()}
				/>
				<div class="flex flex-col">
					<div>{task.description}</div>
					<div>{task.dueDate}</div>
				</div>
			</div>
		</li>
	);
};
