import { For } from "solid-js";
import { TaskCard } from "./task-card";
import { Task } from "../../lib/task";

export type TaskListProps = {
	title: string;
	tasks: Task[];
	onCheckedChange?: (task: Task, isChecked: boolean) => void;
};

export const TaskList = (props: TaskListProps) => {
	return (
		<div class="collapse collapse-arrow bg-base-100 border-base-300 border">
			<input type="checkbox" />
			<div class="collapse-title font-semibold">{props.title}</div>
			<div class="collapse-content text-sm">
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
			</div>
		</div>
	);
};
