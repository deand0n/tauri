import { JSX } from "solid-js";
import { Drawer } from "../lib/components/drawer";
import { Header } from "../lib/components/header";
import { TranslationProvider } from "../lib/translation";

export type MainPageProps = {
	children?: JSX.Element;
};

export const MainPage = (props: MainPageProps) => {
	return (
		<TranslationProvider>
			<Drawer>
				<Header />
				<main class="container p-2">{props.children}</main>
			</Drawer>
		</TranslationProvider>
	);
};
