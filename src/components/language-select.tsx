import { m } from "#/paraglide/messages";
import {
	getLocale,
	type Locale,
	locales,
	setLocale,
} from "#/paraglide/runtime";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

const langMapper = (l: string) => {
	const langs = {
		en: "English",
		tr: "Türkçe",
		id: "Bahasa Indonesia",
		jp: "日本語",
	};
	return langs[l as keyof typeof langs];
};

export default function LanguageSelector() {
	return (
		<Select
			defaultValue={getLocale()}
			onValueChange={(l) => setLocale(l as Locale)}
		>
			<SelectTrigger className="w-max text-xs">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>{m.common_language()}</SelectLabel>
					{locales.map((l) => (
						<SelectItem key={l} value={l}>
							{langMapper(l)}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
