import { searchUser } from "#/server-fn/search-user";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { UserMinimal } from "@/types/user.types";
import { Button } from "@base-ui/react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Search, XIcon } from "lucide-react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../ui/input-group";
import { useCreatePost } from "./create-post-context";
import TagUserWrapper from "./tag-user-wrapper";

type Props = {
	emblaRefs: RefObject<Array<HTMLDivElement | null>>;
	inputRef: RefObject<HTMLInputElement | null>;
	setCoordinate: Dispatch<
		SetStateAction<{
			x: number;
			y: number;
		}>
	>;
	coordinate: {
		x: number;
		y: number;
	};
	closeInput: (e: React.MouseEvent<HTMLButtonElement>) => void;
	imageOrder: number;
};


export default function TagUserInput({
	emblaRefs,
	setCoordinate,
	coordinate,
	inputRef,
	closeInput,
	imageOrder,
}: Props) {
	const container = emblaRefs.current[imageOrder];
	const [query, setQuery] = useState("");
	const [users, setUsers] = useState<Array<UserMinimal>>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const { tagUser, mediaWithTaggedUsers } = useCreatePost();
	const [debouncedQuery] = useDebounce(query, 500);

	const closeRef = useRef<HTMLButtonElement | null>(null);

	const search = useServerFn(searchUser)

	// Fetch Logic
	useEffect(() => {
		const t = setTimeout(() => {
			if (debouncedQuery.trim() === "") {
				setUsers([]);
				setOpen(false);
				return;
			}
			setIsLoading(true);
			search({data: {limit: 5, query: debouncedQuery}})
				.then((data: Array<UserMinimal>) => {
					const filteredUsers = data.filter(
						(user) =>
							!mediaWithTaggedUsers[imageOrder].taggedUsers.some(
								(u) => u.id === user.id,
							),
					);
					setUsers(filteredUsers);
					setOpen(filteredUsers.length > 0);
				})
				.catch((err) => {
					toast.error(err instanceof Error ? err.message : "Error");
				})
				.finally(() => setIsLoading(false));
		}, 0);

		return () => clearTimeout(t);
	}, [debouncedQuery, imageOrder, mediaWithTaggedUsers]);

	const handleSelect = (user: UserMinimal) => {
		tagUser({ id: user.id, username: user.username, coordinate }, imageOrder);
		setOpen(false);
		closeRef.current?.click();
	};

	return (
		<TagUserWrapper
			containerRef={container}
			setCoordinate={setCoordinate}
			coordinate={coordinate}
		>
			<div className="flex items-center gap-2 px-2 py-1.5 text-foreground">
				<Popover open={open} onOpenChange={setOpen}>
					{/* Trigger adalah input teks itu sendiri */}
					<PopoverTrigger asChild>
						<InputGroup>
							<InputGroupInput
								ref={inputRef}
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Tag person..."
								onMouseDown={(e) => e.stopPropagation()}
								className="w-40 text-sm outline-none ring-0 placeholder:text-foreground/50"
							/>
							<InputGroupAddon>
								{isLoading ? <Loader2 className="animate-spin" /> : <Search />}
							</InputGroupAddon>
							<InputGroupAddon align="inline-end">
								<Button
									ref={closeRef}
									onClick={(e) => {
										e.stopPropagation();
										closeInput(e);
									}}
								>
									<XIcon className="size-4 hover:scale-105" />
								</Button>
							</InputGroupAddon>
						</InputGroup>
					</PopoverTrigger>

					<PopoverContent
						className="w-(--radix-popover-trigger-width) border-foreground/10 bg-background/95 p-0 backdrop-blur-md"
						align="start"
						sideOffset={4}
						// Mencegah popover menutup saat kita klik di dalam input
						onOpenAutoFocus={(e) => e.preventDefault()}
					>
						<Command shouldFilter={false}>
							<CommandList>
								<CommandGroup heading="result">
									{users.map((user) => (
										<CommandItem
											key={user.id}
											value={user.id} // value unik untuk internal cmdk
											onSelect={() => handleSelect(user)}
											className="cursor-pointer"
										>
											<Avatar>
												<AvatarImage src={user.image ?? "/default.jpg"} />
												<AvatarFallback>AN</AvatarFallback>
											</Avatar>
											<div className="flex flex-col">
												<span className="line-clamp-1 font-medium">
													{user.username}
												</span>
												<span className="line-clamp-1 text-xs text-muted-foreground">
													{user.name}
												</span>
											</div>
										</CommandItem>
									))}
								</CommandGroup>

								{users.length === 0 && !isLoading && (
									<div className="p-3 text-center text-xs text-muted-foreground">
										No users found.
									</div>
								)}
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>

				{/* <button
          ref={closeRef}
          onClick={closeInput}
          className="ml-1 transition-colors hover:text-destructive"
        >
          <XIcon className="size-4" />
        </button> */}
			</div>
		</TagUserWrapper>
	);
}
