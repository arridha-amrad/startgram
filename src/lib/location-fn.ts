export type Location = {
  osm_id: number;
  osm_type: string;
  name: string;
  osm_value: string;
  osm_key: string;
  city: string;
  state: string;
  country: string;
};

export type Feature = {
  properties: Location;
};

export const queryLocations = async (q: string) => {
  const res = await fetch(`https://photon.komoot.io/api/?q=${q}&limit=5`);
  const data = await res.json();
  const features = data.features;
  const locations = features.map((ft: Feature) => ft.properties);
  return locations as Location[];
};

const getReadableAddress = async (
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

export const getLocation = async () => {
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