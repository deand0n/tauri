import { createContext, JSX, useContext } from "solid-js";
import * as i18n from "@solid-primitives/i18n";
import * as en from "../assets/i18n/en.json";
import { createSignal, createMemo } from "solid-js";

export type TranslationContext<
	T extends i18n.BaseRecordDict = i18n.BaseRecordDict,
> = {
	t: i18n.Translator<T, string>;
	locale: () => string;
	setLocale: (locale: string) => void;
};

const dictionaries = {
	en: en,
};
const [locale, setLocale] = createSignal<keyof typeof dictionaries>("en");
const dict = createMemo(() => i18n.flatten(dictionaries[locale()]));
const t = i18n.translator(dict);

const Translation = createContext<TranslationContext<ReturnType<typeof dict>>>({
	t,
	locale,
	setLocale,
});

export const TranslationProvider = (props: { children: JSX.Element }) => {
	return (
		<Translation.Provider value={{ t, locale, setLocale }}>
			{props.children}
		</Translation.Provider>
	);
};

export const useTranslation = () => useContext(Translation);
