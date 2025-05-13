import { format, formatISO, parse, parseISO } from "date-fns";
import { DateFormats } from "../dateUtils";
import "cally";

export type DatePickerProps = {
	value?: string;
	onChange?: (value: string) => void;
	displayFormat?: string;
	name?: string;
	id: string;
};

export const DatePicker = (props: DatePickerProps) => {
	let inputElement!: HTMLButtonElement;
	let popoverElement!: HTMLDivElement;

	const parsedDate = () => (props.value ? parseISO(props.value) : undefined);
	const displayFormat = props.displayFormat ?? DateFormats.DATE_SHORT;
	const displayDate = () =>
		parsedDate() ? format(parsedDate()!, displayFormat) : "Pick a date";

	const onChange = (event: Event) => {
		const v = (event?.target as HTMLInputElement)?.value;

		inputElement.innerText = v;
		props.onChange?.(v);

		popoverElement.hidePopover();
	};

	return (
		<>
			<button
				ref={inputElement}
				popovertarget={props.id + "popover"}
				class="input"
				id={props.id}
				style={"anchor-name:--" + props.id}
				type="button"
				name={props.name}
				onClick={() => popoverElement.showPopover()}
			>
				{displayDate()}
			</button>
			<div
				ref={popoverElement}
				popover
				id={props.id + "popover"}
				class="dropdown bg-base-100 rounded-box shadow-lg"
				style={"position-anchor:--" + props.id}
			>
				<calendar-date
					class="cally"
					onchange={onChange}
					value={props.value}
				>
					<svg
						aria-label="Previous"
						class="fill-current size-4"
						slot="previous"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
					</svg>
					<svg
						aria-label="Next"
						class="fill-current size-4"
						slot="next"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
					</svg>
					<calendar-month></calendar-month>
				</calendar-date>
			</div>
		</>
	);
};
