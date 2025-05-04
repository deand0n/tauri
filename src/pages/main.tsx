import { JSX } from "solid-js";
import { ThemeChanger } from "../lib/components/ThemeChanger";
import { TranslationProvider } from "../lib/translation";

export type MainPageProps = {
	children?: JSX.Element;
};

export const MainPage = (props: MainPageProps) => {
	return (
		<TranslationProvider>
			<main class="container">
				{props.children}
				<ThemeChanger />
			</main>
		</TranslationProvider>
	);
};
