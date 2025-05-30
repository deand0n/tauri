import { JSX } from "solid-js";
import { ThemeChanger } from "./theme-changer";

export type DrawerProps = {
	children: JSX.Element[];
};
export const Drawer = (props: DrawerProps) => {
	return (
		<div class="drawer">
			<input id="my-drawer" type="checkbox" class="drawer-toggle" />
			<div class="drawer-content flex flex-col items-center justify-center">
				{props.children}
			</div>
			<div class="drawer-side">
				<label
					for="my-drawer"
					aria-label="close sidebar"
					class="drawer-overlay"
				></label>

				<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4 m-0">
					<li>
						<ThemeChanger />
					</li>
					<li>
						<a>Sidebar Item 2</a>
					</li>
				</ul>
			</div>
		</div>
	);
};
