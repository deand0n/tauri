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
	const [isChecked, setIsChecked] = createSignal(
		task.status === TaskStatus.COMPLETED,
	);

	const toggleStatus = async () => {
		const newChecked = isChecked();
		setIsChecked(!newChecked);
		onChange?.(newChecked);
	};

	return (
		<li class="list-row w-full">
			<label class="label list-col-grow">
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
			</label>
		</li>
	);
};
