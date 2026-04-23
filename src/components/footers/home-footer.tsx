import LanguageSelector from "../language-select";

export default function HomeFooter() {
	return (
		<footer className="w-full space-y-6 px-2">
			<ul className="flex flex-wrap gap-x-2 gap-y-2 text-xs text-muted-foreground">
				<li>About</li> &middot;
				<li>Help</li> &middot;
				<li>Press </li> &middot;
				<li>API </li> &middot;
				<li>Jobs</li> &middot;
				<li>Privacy</li> &middot;
				<li>Terms</li> &middot;
				<li>Locations</li> &middot;
				<li>Meta Verified</li>
			</ul>
			<div className="flex items-center flex-col gap-4">
				<LanguageSelector />
				<h5 className="text-xs text-muted-foreground uppercase">
					&copy; {new Date().getFullYear()} Startgram from Ari
				</h5>
			</div>
		</footer>
	);
}
