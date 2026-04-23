import { UserIcon } from "lucide-react";
import { useAuthQuery } from "#/hooks/queries/use-auth-query";
import { CreatePostContextProvider } from "@/components//create-post/create-post-context";
import { CreatePostDialog } from "@/components//create-post/create-post-dialog";
import { SearchDialog } from "@/components//dialogs/search-user-dialog";
import {
	ExploreFilledIcon,
	ExploreIcon,
} from "@/components//icons/explore-icon";
import { HeartIcon } from "@/components//icons/heart-icon";
import { HomeFilledIcon, HomeIcon } from "@/components//icons/home-icon";
import { PlusIcon } from "@/components//icons/plus-icon";
import { ReelsFilledIcon, ReelsIcon } from "@/components//icons/reels-icon";
import { SearchIcon } from "@/components//icons/search-icon";
import { SendFilledIcon, SendIcon } from "@/components//icons/send-icon";
import { SidebarButton } from "./sidebar-btn";
import { SidebarLink } from "./sidebar-link";

export const SidebarContent = () => {
	const { data: user } = useAuthQuery();
	return (
		<div className="flex flex-1 flex-col gap-y-4">
			<SidebarLink
				to="/"
				icon={<HomeIcon />}
				filledIcon={<HomeFilledIcon />}
				label="Home"
			/>
			<SidebarLink
				to="/reels"
				icon={<ReelsIcon />}
				filledIcon={<ReelsFilledIcon />}
				label="Reels"
			/>
			<SidebarLink
				to="/messages"
				icon={<SendIcon />}
				filledIcon={<SendFilledIcon />}
				label="Messages"
			/>
			<SearchDialog>
				<SidebarButton icon={<SearchIcon />} label="Search" />
			</SearchDialog>
			<SidebarLink
				to="/explore"
				icon={<ExploreIcon />}
				filledIcon={<ExploreFilledIcon />}
				label="Explore"
			/>
			{/* <SidebarLink
				to="/notifications"
				icon={<HeartIcon />}
				filledIcon={<HeartIcon />}
				label="Notifications"
			/> */}

			<CreatePostContextProvider>
				<CreatePostDialog>
					<SidebarButton icon={<PlusIcon />} label="Create" />
				</CreatePostDialog>
			</CreatePostContextProvider>

			<SidebarLink
				to="/$username"
				params={{
					username: user?.user.username ?? "",
				}}
				icon={<UserIcon />}
				filledIcon={<UserIcon />}
				label="Profile"
			/>
		</div>
	);
};
