import { Task, TaskStatus } from "../../lib/task";
import { createSignal } from "solid-js";

export type TaskCardProps = {
	task: Task;
	onCheckedChange?: (isChecked: boolean) => void;
};

export const TaskCard = ({
	task,
	onCheckedChange: onChange,
}: TaskCardProps) => {
	const [isChecked, setIsChecked] = createSignal(
		task.status === TaskStatus.COMPLETED,
	);

	const toggleStatus = async () => {
		const newChecked = isChecked();
		setIsChecked(!newChecked);
		onChange?.(newChecked);
	};

	return (
		<li class="list-row">
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
		</li>
	);
};
