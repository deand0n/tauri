import "./App.css";
import { Route, Router } from "@solidjs/router";
import { Home } from "./pages/Home";

function App() {
	return (
		<Router>
			<Route path="" component={Home}></Route>
		</Router>
	);
}

export default App;
