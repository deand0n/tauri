import { createSignal, For, onMount } from "solid-js";
import { useTranslation } from "../translation";

enum Theme {
	LIGHT = "light",
	// CUPCAKE = "cupcake",
	// BUMBLEBEE = "bumblebee",
	// EMERALD = "emerald",
	// CORPORATE = "corporate",
	// SYNTHWAVE = "synthwave",
	// RETRO = "retro",
	// CYBERPUNK = "cyberpunk",
	VALENTINE = "valentine",
	// GARDEN = "garden",
	// LOFI = "lofi",
	// PASTEL = "pastel",
	// FANTASY = "fantasy",
	// WIREFRAME = "wireframe",
	// CMYK = "cmyk",
	// AUTUMN = "autumn",
	// ACID = "acid",
	// LEMONADE = "lemonade",
	// WINTER = "winter",
	// NORD = "nord",
	CARAMELLATTE = "caramellatte",
	// SILK = "silk",

	DARK = "dark",
	// HALLOWEEN = "halloween",
	// FOREST = "forest",
	// AQUA = "aqua",
	// BLACK = "black",
	// LUXURY = "luxury",
	DRACULA = "dracula",
	// BUSINESS = "business",
	// NIGHT = "night",
	COFFEE = "coffee",
	// DIM = "dim",
	// SUNSET = "sunset",
	// ABBYSS = "abyss",
}

export const ThemeChanger = () => {
	const { t } = useTranslation();
	const [currentTheme, setCurrentTheme] = createSignal<Theme>(
		(localStorage.getItem("theme") as Theme) ?? Theme.LIGHT,
	);

	onMount(() => {
		localStorage.setItem("theme", currentTheme());
		document.documentElement.setAttribute("data-theme", currentTheme());
	});

	const onThemeChange = (t: string) => {
		localStorage.setItem("theme", t);
		setCurrentTheme(t);
	};

	return (
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn m-1">
				{/* <span>{t("theme.changer.label")}</span> */}
				<span>{t(`theme.changer.options.${currentTheme()}`)}</span>
				<svg
					width="12px"
					height="12px"
					class="inline-block h-2 w-2 fill-current opacity-60"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 2048 2048"
				>
					<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
				</svg>
			</div>
			<ul
				tabindex="0"
				class="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl"
			>
				<For each={Object.values(Theme)}>
					{(theme) => (
						<li>
							<input
								type="radio"
								name="theme-dropdown"
								class="theme-controller btn btn-sm btn-block justify-start"
								classList={{
									"btn-primary": currentTheme() === theme,
									"btn-ghost": currentTheme() !== theme,
								}}
								aria-label={t(`theme.changer.options.${theme}`)}
								value={theme}
								onChange={() => onThemeChange(theme)}
							/>
						</li>
					)}
				</For>
			</ul>
		</div>
	);
};
