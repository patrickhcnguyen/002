import { OfficeLocations } from './officeLocations';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface GeocodedLocation {
  coordinates: [number, number];
  placeName: string;
  nearestOffice: {
    name: string;
    address: string;
    coordinates: [number, number];
    distance: number;
  };
}

export async function geocodeAndFindNearestOffice(address: string): Promise<GeocodedLocation> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    if (!data.features || data.features.length === 0) {
      throw new Error('No location found');
    }

    const [longitude, latitude] = data.features[0].center;
    
    let nearestOffice = OfficeLocations[0];
    let shortestDistance = calculateDistance(
      latitude,
      longitude,
      OfficeLocations[0].coordinates[0],
      OfficeLocations[0].coordinates[1]
    );

    for (const office of OfficeLocations) {
      const distance = calculateDistance(
        latitude,
        longitude,
        office.coordinates[0],
        office.coordinates[1]
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestOffice = office;
      }
    }

    return {
      coordinates: [longitude, latitude],
      placeName: data.features[0].place_name,
      nearestOffice: {
        name: nearestOffice.name,
        address: nearestOffice.address,
        coordinates: nearestOffice.coordinates as [number, number],
        distance: shortestDistance
      }
    };
  } catch (error) {
    console.error('Error in geocoding:', error);
    throw error;
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}
