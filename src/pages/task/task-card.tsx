import { createSignal } from "solid-js";
import { TaskEntry, TaskStatus } from "../../lib/task";

export type TaskEntryCardProps = {
	entry: TaskEntry;
	onCheckedChange?: (isChecked: boolean) => void;
	index: number;
};

export const TaskEntryCard = ({
	entry,
	onCheckedChange,
	index,
}: TaskEntryCardProps) => {
	let listElement!: HTMLLIElement;

	const [isChecked, setIsChecked] = createSignal(
		entry.status === TaskStatus.COMPLETED,
	);

	const toggleStatus = async () => {
		const newChecked = isChecked();
		setIsChecked(!newChecked);

		setTimeout(() => {
			// TODO: add :tada: animation
			onCheckedChange?.(newChecked);
		}, 400);
	};

	return (
		<li
			ref={listElement}
			class="list-row w-full after:!border-0 bg-base-200 outline-1 outline-primary/30 py-2"
			data-id={index}
		>
			{index}
			<div class="flex flex-row gap-3 list-col-grow items-center">
				<input
					class="checkbox checkbox-primary"
					checked={isChecked()}
					type="checkbox"
					on:change={() => toggleStatus()}
				/>
				<div class="flex flex-col">
					<div>{entry.task!.description}</div>
					<div>{entry.task!.dueDate}</div>
				</div>
			</div>
		</li>
	);
};
