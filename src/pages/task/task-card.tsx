import { invoke } from "@tauri-apps/api/core";
import { Task, TaskStatus } from "../../lib/task";
import { createSignal } from "solid-js";

export type TaskCardProps = {
	task: Task;
};

export const TaskCard = ({ task }: TaskCardProps) => {
	const [isChecked, setIsChecked] = createSignal(
		task.status === TaskStatus.COMPLETED,
	);

	const toggleStatus = () => {
		setIsChecked(!isChecked());
		invoke("toggle_task_status", { id: task.id });
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
