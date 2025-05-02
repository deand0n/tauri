import { Route, Router } from "@solidjs/router";
import { Home } from "./pages/Home";

export const App = () => {
	return (
		<Router>
			<Route path="" component={Home}></Route>
		</Router>
	);
};
