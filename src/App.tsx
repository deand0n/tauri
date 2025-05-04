import { Route, Router } from "@solidjs/router";
import { TaskPage } from "./pages/task/page";
import { MainPage } from "./pages/main";

export const App = () => {
	return (
		<Router root={MainPage}>
			<Route path="/" component={TaskPage} />
		</Router>
	);
};
