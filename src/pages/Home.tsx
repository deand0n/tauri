import { invoke } from "@tauri-apps/api/core";
import { createSignal } from "solid-js";
import logo from "./../assets/logo.svg";
import { TaskStatus, Task } from "../lib/task";

export type HomeProps = {};

export const Home = ({}: HomeProps) => {
	const [taskDesc, setTaskDesc] = createSignal<Task>();

	const call = async () => {
		const task: Task = {
			id: "123",
			description: "test task",
			dueDate: new Date().toISOString(),
			status: TaskStatus.NEW,
		};
		setTaskDesc(await invoke("create_task", { task }));
	};

	return (
		<main class="container">
			<h1>Welcome to Tauri + Solid</h1>
			<div class="row">
				<a href="https://vitejs.dev" target="_blank">
					<img src="/vite.svg" class="logo vite" alt="Vite logo" />
				</a>
				<a href="https://tauri.app" target="_blank">
					<img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
				</a>
				<a href="https://solidjs.com" target="_blank">
					<img src={logo} class="logo solid" alt="Solid logo" />
				</a>
			</div>
			<p>Click on the Tauri, Vite, and Solid logos to learn more.</p>
			<p>desc: {taskDesc()?.description}</p>
			<button type="button" onClick={call}>
				Hello Click
			</button>
		</main>
	);
};
