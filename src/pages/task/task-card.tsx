import {
	type ElementDropTargetEventBasePayload,
	draggable,
	dropTargetForElements,
	monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { createSignal, onMount } from "solid-js";
import { Task, TaskStatus } from "../../lib/task";
import styles from "./task-card.module.css";

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
	const [dragging, setDragging] = createSignal(false);

	const toggleStatus = async () => {
		const newChecked = isChecked();
		setIsChecked(!newChecked);

		setTimeout(() => {
			// TODO: add :tada: animation
			onChange?.(newChecked);
		}, 400);
	};

	onMount(() => {
		draggable({
			element: listElement,
			onDragStart: () => setDragging(true),
			onDrop: () => setDragging(false),
		});
	});

	return (
		<li
			ref={listElement}
			class="list-row w-full"
			classList={{
				[styles.dragging]: dragging(),
			}}
		>
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
