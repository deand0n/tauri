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
		<li
			ref={listElement}
			class="list-row w-full after:!border-0 bg-base-200 outline-1 outline-primary/30 py-2"
			data-id={task.weight.toString()}
		>
			<div class="flex flex-row gap-3 list-col-grow items-center">
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
