import type {
	CalendarDateProps,
	CalendarMonthProps,
	CalendarMultiProps,
	CalendarRangeProps,
} from "cally";

type MapEvents<T> = {
	[K in keyof T as K extends `on${infer E}` ? `on${Lowercase<E>}` : K]: T[K];
};

declare module "solid-js" {
	namespace JSX {
		interface IntrinsicElements {
			"calendar-month": MapEvents<CalendarMonthProps> &
				HTMLAttributes<HTMLElement>;
			"calendar-range": MapEvents<CalendarRangeProps> &
				HTMLAttributes<HTMLElement>;
			"calendar-date": MapEvents<CalendarDateProps> &
				HTMLAttributes<HTMLElement>;
			"calendar-multi": MapEvents<CalendarMultiProps> &
				HTMLAttributes<HTMLElement>;
		}
	}
}
