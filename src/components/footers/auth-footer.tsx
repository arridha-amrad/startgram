import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export default function AuthFooter() {
	return (
		<footer className="container mx-auto space-y-4 p-4 text-xs text-muted-foreground">
			<ul className="flex flex-wrap justify-center gap-4">
				<li>Meta</li>
				<li>About</li>
				<li>Blog</li>
				<li>Jobs</li>
				<li>Help</li>
				<li>API</li>
				<li>Privacy</li>
				<li>Terms</li>
				<li>Locations</li>
				<li>Instagram Lite</li>
				<li>Meta AI</li>
				<li>Threads</li>
				<li>Contact Uploading & Non-Users</li>
				<li>Meta Verified</li>
				<li>Meta in Indonesia</li>
			</ul>
			<div className="flex items-center justify-center gap-x-4">
				<Select>
					<SelectTrigger className="w-max text-xs">
						<SelectValue placeholder="Language" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Language</SelectLabel>
							<SelectItem value="English">English</SelectItem>
							<SelectItem value="Indonesian">Bahasa Indonesia</SelectItem>
							<SelectItem value="Japanese">日本語</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<div>&copy; {new Date().getFullYear()} Nextgram from arridha amrad</div>
			</div>
		</footer>
	);
}
