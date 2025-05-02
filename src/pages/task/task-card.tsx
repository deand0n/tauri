import { Task } from "../../lib/task";

export type TaskCardProps = {
	task: Task;
};

export const TaskCard = ({ task }: TaskCardProps) => {
	return (
		<li class="list-row">
			<input class="checkbox checkbox-primary" type="checkbox" />
			<div class="flex flex-col">
				<div>{task.description}</div>
				<div>{task.dueDate}</div>
			</div>
		</li>
	);
};
