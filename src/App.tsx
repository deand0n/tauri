import { Route, Router } from "@solidjs/router";
import { onMount } from "solid-js";
import Sortable, { Swap } from "sortablejs";
import { MainPage } from "./pages/main";
import { TaskPage } from "./pages/task/page";

export const App = () => {
	onMount(() => {
		Sortable.mount(new Swap());
	});

	return (
		<Router root={MainPage}>
			<Route path="/" component={TaskPage} />
		</Router>
	);
};
