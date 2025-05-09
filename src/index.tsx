/* @refresh reload */
import { render } from "solid-js/web";
import { App } from "./App";
import "./index.css";
import { attachConsole } from "@tauri-apps/plugin-log";

attachConsole();
render(() => <App />, document.getElementById("root") as HTMLElement);
