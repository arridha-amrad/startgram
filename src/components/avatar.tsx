import {
	Avatar as AvatarContainer,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";

export default function Avatar({
	className,
	size,
	src,
	...props
}: {
	className?: string;
	size?: "default" | "sm" | "lg";
	src?: string;
}) {
	return (
		<AvatarContainer size={size} className={className} {...props}>
			<AvatarImage src={src ?? "/default.jpg"} alt="Avatar" />
			<AvatarFallback className="rounded-lg">CN</AvatarFallback>
		</AvatarContainer>
	);
}
