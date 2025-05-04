import { Route, Router } from "@solidjs/router";
import { Home } from "./pages/Home";
import { TranslationProvider } from "./lib/translation";

export const App = () => {
	return (
		<TranslationProvider>
			<Router>
				<Route path="" component={Home}></Route>
			</Router>
		</TranslationProvider>
	);
};
