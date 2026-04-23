import { Loader2, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../ui/input-group";

type Location = {
	osm_id: number;
	osm_type: string;
	name: string;
	osm_value: string;
	osm_key: string;
	city: string;
	state: string;
	country: string;
};

type Feature = {
	properties: Location;
};

const findLocations = async (q: string) => {
	const res = await fetch(`https://photon.komoot.io/api/?q=${q}&limit=5`);
	const data = await res.json();
	const features = data.features;
	const locations = features.map((ft: Feature) => ft.properties);
	return locations as Array<Location>;
};

export const getReadableAddress = async (
	lat: number,
	lon: number,
): Promise<string> => {
	const API_KEY = "4ec8890d4f7340b5b90ea98936abb238";
	const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${API_KEY}`;

	const response = await fetch(url);
	const data = await response.json();

	if (data.features && data.features.length > 0) {
		const properties = data.features[0].properties;

		// Constructing your specific format: "Landmark, City, Country"
		const name = properties.name || properties.street || "Unknown Spot";
		const city = properties.city || properties.county || "";
		const country = properties.country || "";

		return `${name}, ${city}, ${country}`;
	}

	return "Location not found";
};

export default function InputLocation({ field }: { field?: any }) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [value] = useDebounce(query, 500);
	const [isLoading, setIsLoading] = useState(false);
	const [locationsResult, setLocationsResult] = useState<Array<Location>>([]);

	useEffect(() => {
		if (value) {
			setIsLoading(true);
			findLocations(value)
				.then((data) => {
					setLocationsResult(data);
				})
				.catch((err) => {
					console.error(err);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			setLocationsResult([]);
		}
	}, [value]);

	const getLocation = async () => {
		return new Promise<string>((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(async (pos) => {
				try {
					const address = await getReadableAddress(
						pos.coords.latitude,
						pos.coords.longitude,
					);
					resolve(address);
				} catch (error) {
					reject(error);
				}
			}, reject);
		});
	};

	const handleSelect = (locName: string) => {
		// If field exists (from Controller), update the form value
		field?.onChange(locName);
		setOpen(false);
		setQuery("");
	};

	const displayValue = field?.value || "";

	const [isGetCurrentLocation, setIsGetCurrentLocation] = useState(false);

	return (
		<div className="relative flex w-full flex-col">
			<InputGroup className="w-full">
				<InputGroupInput
					className="cursor-pointer"
					onClick={() => setOpen(true)}
					readOnly
					disabled={isGetCurrentLocation}
					placeholder="Location"
					value={displayValue}
					title={displayValue}
				/>
				<InputGroupAddon align="inline-start">
					<MapPin />
				</InputGroupAddon>
				<InputGroupAddon align="inline-end">
					<X className="cursor-pointer" onClick={() => field?.onChange("")} />
				</InputGroupAddon>
			</InputGroup>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<Command shouldFilter={false} className="rounded-none">
					<CommandInput
						placeholder="Start typing a place name..."
						value={query}
						onValueChange={setQuery}
						className="h-12"
						disabled={isGetCurrentLocation}
					/>
					<CommandList className="max-h-[300px]">
						{query.length === 0 && (
							<CommandGroup>
								<CommandItem
									onSelect={async () => {
										setIsGetCurrentLocation(true);
										try {
											const address = await getLocation();
											field.onChange(address); // Update the form here!
										} catch (err) {
											console.error(err);
										} finally {
											setIsGetCurrentLocation(false);
										}
									}}
									className="flex cursor-pointer items-center gap-3 text-sm"
								>
									<MapPin className="h-5 w-5" />
									<div className="flex flex-1 flex-col">
										<span className="font-semibold">Use current location</span>
										<span className="text-xs opacity-70">
											Based on your current GPS position
										</span>
									</div>
									{isGetCurrentLocation && (
										<div className="items-end">
											<Loader2 className="size-4 animate-spin" />
										</div>
									)}
								</CommandItem>
							</CommandGroup>
						)}

						{isLoading && !locationsResult.length ? (
							<div className="flex items-center justify-center border-t py-8">
								<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
							</div>
						) : (
							<>
								{locationsResult.length === 0 && query && !isLoading && (
									<CommandEmpty className="py-8 text-sm">
										No locations found for &quot;{query}&quot;.
									</CommandEmpty>
								)}
								{locationsResult.length > 0 && (
									<CommandGroup heading="Search Results" className="border-t">
										{locationsResult.map((loc) => (
											<CommandItem
												key={`${loc.osm_type}-${loc.osm_id}`}
												onSelect={() => {
													const name = `${loc.name}${loc.city ? `, ${loc.city}` : ""}${loc.state ? `, ${loc.state}` : ""}`;
													handleSelect(name);
												}}
												className="flex cursor-pointer items-center gap-3 hover:bg-muted/50"
											>
												<MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
												<div className="flex flex-col overflow-hidden">
													<span className="truncate font-semibold">
														{loc.name}
													</span>
													<span className="truncate text-xs text-muted-foreground">
														{loc.city ? `${loc.city}, ` : ""}
														{loc.state ? `${loc.state}, ` : ""}
														{loc.country}
													</span>
												</div>
											</CommandItem>
										))}
									</CommandGroup>
								)}
							</>
						)}
					</CommandList>
				</Command>
			</CommandDialog>
		</div>
	);
}
