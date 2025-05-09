import { Burger } from "../icons/burger";

export const Header = () => {
	return (
		<ul class="menu bg-base-200 menu-horizontal w-full">
			<li>
				<label
					for="my-drawer"
					class="btn btn-ghost drawer-button w-10 h-10 p-0"
				>
					<Burger />
				</label>
			</li>
		</ul>
	);
};
