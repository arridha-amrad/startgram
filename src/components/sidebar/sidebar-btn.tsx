import React from "react";
import type { SidebarLinkProps } from "./sidebar-link";

// 1. Wrap the component in forwardRef
export const SidebarButton = React.forwardRef<
	HTMLButtonElement,
	Pick<SidebarLinkProps, "icon" | "label">
>(({ icon, label, ...props }, ref) => {
	// 2. Spread ...props and attach ref
	return (
		<button
			ref={ref}
			className="sidebar-item"
			{...props} // 3. This ensures the onClick from DialogTrigger is applied
		>
			{icon}
			<span className="hidden lg:block">{label}</span>
		</button>
	);
});

// Add a display name for debugging (optional but recommended)
SidebarButton.displayName = "SidebarButton";
