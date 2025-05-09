import { Route, Router } from "@solidjs/router";
import { MainPage } from "./pages/main";
import { TaskPage } from "./pages/task/page";

export const App = () => {
	return (
		<Router root={MainPage}>
			<Route path="/" component={TaskPage} />
		</Router>
	);
};
