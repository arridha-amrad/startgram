import { Loader, MapPin } from "lucide-react";
import { useEffect, useId, useState } from "react";
import type {
	FieldValues,
	Path,
	PathValue,
	UseFormSetValue,
} from "react-hook-form";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "#/components/ui/combobox";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { InputGroupAddon } from "#/components/ui/input-group";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "#/components/ui/item";
import { type Location, queryLocations } from "#/lib/location-fn";

type LocationInputProps<T extends FieldValues> = {
	name: Path<T>;
	setValue: UseFormSetValue<T>;
	error?: string;
};

export default function LocationInput<T extends FieldValues>({
	name,
	setValue,
	error,
}: LocationInputProps<T>) {
	const [queryKey, setQueryKey] = useState("");

	const [debouncedQueryKey] = useDebounce(queryKey, 500);

	const [locationsResult, setLocationsResult] = useState<Array<Location>>([]);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (debouncedQueryKey !== "") {
			setIsLoading(true);
			queryLocations(debouncedQueryKey)
				.then((data) => setLocationsResult(data))
				.catch((err) => {
					console.log(err);
					toast.error("Failed to load locations");
				})
				.finally(() => setIsLoading(false));
		}
	}, [debouncedQueryKey]);

	const id = useId();
	return (
		<Combobox items={locationsResult}>
			<Field>
				<FieldLabel htmlFor={id}>Location</FieldLabel>
				<ComboboxInput
					value={queryKey}
					onChange={(e) => setQueryKey(e.target.value)}
					id={id}
					showTrigger={false}
					placeholder="Search location..."
					className="w-full"
				>
					{isLoading && (
						<InputGroupAddon align="inline-end">
							<Loader className="animate-spin" />
						</InputGroupAddon>
					)}
				</ComboboxInput>
				{error && <FieldError errors={[{ message: error }]} />}
			</Field>
			<ComboboxContent className="z-999 min-w-(--anchor-width)">
				{locationsResult.length > 0 ? (
					<ComboboxList className="pointer-events-auto cursor-pointer">
						{(item: Location) => (
							<ComboboxItem
								key={`${item.osm_id}-${item.osm_type}-${item.osm_key}-${item.osm_value}`}
								value={item.name}
								onClick={() => {
									const locName = `${item.name}${item.city ? `, ${item.city}` : ""}${item.state ? `, ${item.state}` : ""}`;
									setQueryKey(locName);
									setValue(name, locName as PathValue<T, Path<T>>, {
										shouldDirty: true,
										shouldValidate: true,
									});
								}}
							>
								<Item size="xs" className="p-0">
									<ItemMedia variant="icon">
										<MapPin />
									</ItemMedia>
									<ItemContent>
										<ItemTitle>{item.name}</ItemTitle>
										<ItemDescription>
											{item.city ? `${item.city}, ` : ""}
											{item.state ? `${item.state}, ` : ""}
											{item.country}
										</ItemDescription>
									</ItemContent>
								</Item>
							</ComboboxItem>
						)}
					</ComboboxList>
				) : (
					<ComboboxEmpty>No items found.</ComboboxEmpty>
				)}
			</ComboboxContent>
		</Combobox>
	);
}
