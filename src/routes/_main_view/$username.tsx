import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import ProfileInfo from "@/components/profile-info";
import { ProfileTabs } from "@/components/profile-tabs";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_main_view/$username")({
	component: RouteComponent,
	notFoundComponent: () => {
		return (
			<div className="flex flex-col items-center justify-center p-10">
				<h2 className="text-xl font-bold">User Not Found</h2>
				<p className="text-muted-foreground">
					The profile you are looking for doesn't exist.
				</p>
				<Link to="/" className="text-primary underline">
					Go Back Home
				</Link>
			</div>
		);
	},
});

function RouteComponent() {
	return (
		<div className="flex-1 space-y-4 border border-lime-500 px-4">
			<ProfileInfo />
			<ProfileTabs />
			<Outlet />
			<footer className="container mx-auto space-y-4 p-4 pb-10 text-xs text-muted-foreground">
				<div className="">
					<ul className="flex justify-center gap-x-4">
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
					</ul>
				</div>
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
					<div>
						&copy; {new Date().getFullYear()} Startgram from arridha amrad
					</div>
				</div>
			</footer>
		</div>
	);
}
