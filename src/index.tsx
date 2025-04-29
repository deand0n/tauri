/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

import { attachConsole } from "@tauri-apps/plugin-log";
await attachConsole();

render(() => <App />, document.getElementById("root") as HTMLElement);
