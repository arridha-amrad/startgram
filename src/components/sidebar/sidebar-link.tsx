import { Link, type LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";

export type SidebarLinkProps = LinkProps & {
	icon: ReactNode;
	filledIcon?: ReactNode;
	label: string;
};

export const SidebarLink = ({
	icon,
	filledIcon,
	label,
	...props
}: SidebarLinkProps) => {
	return (
		<Link {...props} className="sidebar-item">
			{({ isActive }) => (
				<>
					{isActive ? (filledIcon ?? icon) : icon}
					<span className="hidden lg:block">{label}</span>
				</>
			)}
		</Link>
	);
};
