import * as m from "@/paraglide/messages";
import LanguageSelector from "../language-select";

export default function AuthFooter() {
	return (
		<footer className="container mx-auto space-y-4 p-4 text-xs text-muted-foreground">
			<ul className="flex flex-wrap justify-center gap-4">
				<li>{m.footer_meta()}</li>
				<li>{m.footer_about()}</li>
				<li>{m.footer_blog()}</li>
				<li>{m.footer_jobs()}</li>
				<li>{m.footer_help()}</li>
				<li>{m.footer_api()}</li>
				<li>{m.footer_privacy()}</li>
				<li>{m.footer_terms()}</li>
				<li>{m.footer_locations()}</li>
				<li>{m.footer_instagram_lite()}</li>
				<li>{m.footer_meta_ai()}</li>
				<li>{m.footer_threads()}</li>
				<li>{m.footer_contact_uploading()}</li>
				<li>{m.footer_meta_verified()}</li>
				<li>{m.footer_meta_in_country()}</li>
			</ul>
			<div className="flex items-center justify-center gap-x-4">
				<LanguageSelector />
				<div>
					{m.footer_copyright({
						year: new Date().getFullYear().toString(),
						app_name: m.common_app_name(),
						author: "arridha amrad",
					})}
				</div>
			</div>
		</footer>
	);
}
