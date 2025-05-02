/* @refresh reload */
import { render } from "solid-js/web";
import { attachConsole } from "@tauri-apps/plugin-log";
import { App } from "./App";
import "./index.css";
await attachConsole();

render(() => <App />, document.getElementById("root") as HTMLElement);
