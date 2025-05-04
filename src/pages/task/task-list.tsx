import { For } from "solid-js";
import { TaskCard } from "./task-card";
import { Task } from "../../lib/task";

export type TaskListProps = {
	tasks: Task[];
	onCheckedChange?: (task: Task, isChecked: boolean) => void;
};

export const TaskList = (props: TaskListProps) => {
	return (
		<ul class="list">
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
	);
};
