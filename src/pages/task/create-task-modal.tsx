import { format, formatISO } from "date-fns";
import { createSignal } from "solid-js";
import { DatePicker } from "../../lib/components/datepicker";
import { DateFormats } from "../../lib/dateUtils";
import { Plus } from "../../lib/icons/plus";
import { CreateTask } from "../../lib/task";
import { useTranslation } from "../../lib/translation";

export type CreateTaskModalProps = {
	onSubmit: (task: CreateTask) => void;
};
export const CreateTaskModal = (props: CreateTaskModalProps) => {
	let dialogElement!: HTMLDialogElement;
	let formElement!: HTMLFormElement;

	const defaultDueDate = formatISO(new Date(), { representation: "date" });

	const { t } = useTranslation();
	const [description, setDescription] = createSignal<string>();
	const [dueDate, setDueDate] = createSignal<string>(defaultDueDate);

	const onSubmit = () => {
		props.onSubmit?.({
			description: description()!,
			dueDate: dueDate(),
		});
		formElement.reset();
	};

	const onClose = () => {
		formElement.reset();
		setDescription("");
	};

	return (
		<div>
			<button
				class="btn btn-primary btn-circle btn-xl fixed right-5 bottom-5"
				onClick={() => dialogElement.showModal()}
			>
				<Plus />
			</button>
			<dialog ref={dialogElement} class="modal">
				<div class="modal-box">
					<form ref={formElement} method="dialog" onSubmit={onSubmit}>
						<fieldset class="fieldset gap-5">
							<label class="floating-label">
								<span>
									{t("task.create-modal.description")}
								</span>
								<textarea
									required
									class="textarea validator resize-none"
									name="description"
									onChange={(e) =>
										setDescription(e.target.value)
									}
								/>
							</label>
							<label class="floating-label">
								<span>{t("task.create-modal.due-date")}</span>
								<DatePicker
									onChange={(e) => setDueDate(e)}
									name="due-date"
									id="due-date"
									value={dueDate()}
								/>
							</label>
							{/* <label class="floating-label">
								<span>{t("task.create-modal.due-date")}</span>
								<input
									ref={dueDateElement}
									required
									class="input validator"
									onChange={(e) => setDueDate(e.target.value)}
									type="date"
									name="due-date"
									value={defaultDueDate}
								/>
							</label> */}
						</fieldset>
						<div class="modal-action">
							<button class="btn btn-primary">
								{t("task.create-modal.submit")}
							</button>
						</div>
					</form>
				</div>
				<form method="dialog" class="modal-backdrop">
					<button onClick={onClose}>close</button>
				</form>
			</dialog>
		</div>
	);
};
