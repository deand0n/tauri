import { createSignal, For, onMount } from "solid-js";
import { JSX } from "solid-js/h/jsx-runtime";
import { useTranslation } from "../translation";

enum themes {
	LIGHT = "light",
	CUPCAKE = "cupcake",
	BUMBLEBEE = "bumblebee",
	EMERALD = "emerald",
	CORPORATE = "corporate",
	SYNTHWAVE = "synthwave",
	RETRO = "retro",
	CYBERPUNK = "cyberpunk",
	VALENTINE = "valentine",
	GARDEN = "garden",
	LOFI = "lofi",
	PASTEL = "pastel",
	FANTASY = "fantasy",
	WIREFRAME = "wireframe",
	CMYK = "cmyk",
	AUTUMN = "autumn",
	ACID = "acid",
	LEMONADE = "lemonade",
	WINTER = "winter",
	NORD = "nord",
	CARAMELLATTE = "caramellatte",
	SILK = "silk",

	DARK = "dark",
	HALLOWEEN = "halloween",
	FOREST = "forest",
	AQUA = "aqua",
	BLACK = "black",
	LUXURY = "luxury",
	DRACULA = "dracula",
	BUSINESS = "business",
	NIGHT = "night",
	COFFEE = "coffee",
	DIM = "dim",
	SUNSET = "sunset",
	ABBYSS = "abyss",
}

export const ThemeChanger = () => {
	const { t } = useTranslation();
	const [theme, setTheme] = createSignal(themes.DARK);
	const html = document.body.parentElement;

	onMount(() => {
		const newTheme = localStorage.getItem("theme") ?? themes.LIGHT;

		if (newTheme) {
			setTheme(newTheme as themes);
			html?.setAttribute("data-theme", newTheme);
		}
	});

	const onThemeChange: JSX.EventHandlerUnion<HTMLSelectElement, Event> = (
		event,
	) => {
		// @ts-expect-error value will always be present
		const newTheme = event.target.value as themes;
		setTheme(newTheme);
		html?.setAttribute("data-theme", newTheme);
		localStorage.setItem("theme", newTheme);
	};

	return (
		<label class="label">
			<span>{t("theme.changer.label")}</span>
			<select onChange={onThemeChange} class="select" value={theme()}>
				<For each={Object.values(themes)}>
					{(theme) => (
						<option value={theme}>
							{t(`theme.changer.options.${theme}`)}
						</option>
					)}
				</For>
			</select>
		</label>
	);
};
