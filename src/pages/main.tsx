import { JSX } from "solid-js";
import { TranslationProvider } from "../lib/translation";
import { Drawer } from "../lib/components/drawer";

export type MainPageProps = {
	children?: JSX.Element;
};

export const MainPage = (props: MainPageProps) => {
	return (
		<TranslationProvider>
			<Drawer />
			<main class="container">{props.children}</main>
		</TranslationProvider>
	);
};
