import { Link, useNavigate } from "@tanstack/react-router";
import {
	ChevronsUpDown,
	LogOut,
	Monitor,
	Moon,
	Settings,
	Sun,
	User,
} from "lucide-react";
import { useAuthQuery } from "#/hooks/queries/use-auth-query";
import Avatar from "@/components/avatar";
import { LogoutDialog } from "@/components/dialogs/logout-dialog";
import { ThemeIcon } from "@/components/icons/theme-icon";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SidebarFooter = () => {
	const { data } = useAuthQuery();

	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex min-w-0 cursor-pointer w-full items-center gap-4 rounded-md p-2 text-left text-sm hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
					<Avatar src={data?.user.image ?? undefined} />
					<div className="hidden w-full min-w-0 flex-col text-left text-sm leading-tight lg:block">
						<h1 className="truncate text-sm">{data?.user.username}</h1>
						<h3 className="truncate text-xs">{data?.user.name}</h3>
					</div>
					<div className="hidden w-max lg:block">
						<ChevronsUpDown className="size-4" />
					</div>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="ml-4 w-(--radix-dropdown-menu-trigger-width) rounded-md lg:ml-0"
				side="top"
				align="end"
				sideOffset={4}
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel asChild>
						<div className="flex w-full cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-left text-sm">
							<Avatar src={data?.user.image ?? undefined} />
							<div className="hidden w-full flex-1 flex-col text-left text-sm leading-tight lg:block">
								<h1 className="truncate text-sm">{data?.user.username}</h1>
								<h3 className="truncate text-xs">{data?.user.email}</h3>
							</div>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() =>
							navigate({
								to: "/$username",
								params: { username: data?.user.username ?? "" },
							})
						}
					>
						<User />
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Settings />
						Settings
					</DropdownMenuItem>
					<DropdownSubMenuTheme />
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<LogoutDialog>
						<DropdownMenuItem
							onSelect={(e) => e.preventDefault()}
							variant="destructive"
						>
							<LogOut />
							Logout
						</DropdownMenuItem>
					</LogoutDialog>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const DropdownSubMenuTheme = () => {
	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<ThemeIcon />
				Switch Theme
			</DropdownMenuSubTrigger>
			<DropdownMenuPortal>
				<DropdownMenuSubContent className="ml-2 p-2">
					<DropdownMenuItem>
						<Moon />
						Dark
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Sun />
						Light
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Monitor />
						System
					</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuPortal>
		</DropdownMenuSub>
	);
};
