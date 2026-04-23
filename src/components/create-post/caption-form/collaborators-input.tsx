import { Loader } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import type { TCreatePostSchema } from "#/zod-schemas/createpost-schema";
import type { UserMinimal } from "@/types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from "../../ui/combobox";
import { Field, FieldLabel } from "../../ui/field";

type Props = {
	field: ControllerRenderProps<TCreatePostSchema, "collaborators">;
};

export default function CollaboratorsInput({ field }: Props) {
	const [users, setUsers] = useState<Array<UserMinimal>>([]);

	const anchor = useComboboxAnchor();

	const collaborators = useMemo(
		() => (field.value || []) as Array<UserMinimal>,
		[field.value],
	);

	const inputRef = useRef<HTMLInputElement>(null);

	const [query, setQuery] = useState("");
	const [debouncedQuery] = useDebounce(query, 500);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchUsers = async () => {
			const res = await fetch("/api/users");
			const data = await res.json();
			return data.users as Array<UserMinimal>;
		};

		const t = setTimeout(() => {
			if (debouncedQuery.trim() !== "") {
				setIsLoading(true);
				fetchUsers()
					.then((data: Array<UserMinimal>) => {
						const filteredUsers = data.filter(
							(user) =>
								!collaborators.some((u: UserMinimal) => u.id === user.id),
						);
						setUsers(filteredUsers);
					})
					.catch((err) => {
						toast.error(err instanceof Error ? err.message : "Error");
					})
					.finally(() => {
						setIsLoading(false);
					});
			}
		}, 0);

		return () => clearTimeout(t);
	}, [debouncedQuery, collaborators]);

	return (
		<Combobox
			multiple
			items={users}
			value={collaborators}
			onValueChange={(value) => {
				field.onChange(value);
				setQuery("");
				setUsers((prev) =>
					prev.filter((user) => !value.some((u) => u.id === user.id)),
				);
			}}
		>
			<Field>
				<FieldLabel>Collaborators</FieldLabel>
				<ComboboxChips ref={anchor} className="w-full">
					<ComboboxValue>
						{(values: Array<UserMinimal>) => (
							<>
								{values.map((value: UserMinimal) => (
									<ComboboxChip key={value.id}>{value.username}</ComboboxChip>
								))}
								<ComboboxChipsInput
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									ref={inputRef}
									placeholder="Add collaborators..."
								/>
							</>
						)}
					</ComboboxValue>
				</ComboboxChips>
			</Field>
			<ComboboxContent anchor={anchor} className={"z-999"}>
				<ComboboxEmpty>
					{isLoading ? <Loader className="animate-spin" /> : "No items found."}
				</ComboboxEmpty>
				<ComboboxList>
					{(item: UserMinimal) => (
						<ComboboxItem
							className="pointer-events-auto cursor-pointer"
							key={item.id}
							value={item}
						>
							<Avatar>
								<AvatarImage src={item.image ?? "/default.jpg"} />
								<AvatarFallback>AN</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<span className="line-clamp-1 font-medium">
									{item.username}
								</span>
								<span className="line-clamp-1 text-xs text-muted-foreground">
									{item.name}
								</span>
							</div>
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
