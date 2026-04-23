import { SidebarContent } from "./sidebar-content";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarHeader } from "./sidebar-header";

export const Sidebar = () => {
	return (
		<aside className="sticky top-0 h-screen w-[250px] border border-rose-500 p-2">
			<div className="flex h-full flex-col gap-y-8">
				<SidebarHeader />
				<SidebarContent />
				<SidebarFooter />
			</div>
		</aside>
	);
};
