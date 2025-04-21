import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

interface AddressMapProps {
  location: [number, number];
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    title: string;
  }>;
}

export function AddressMap({ location, center, zoom = 15, markers }: AddressMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRefs = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        // Get Mapbox token from Supabase
        const { data, error } = await supabase
          .functions.invoke('get-secret', {
            body: { secretName: 'MAPBOX_PUBLIC_TOKEN' }
          });

        if (!isMounted) return;

        if (error || !data?.MAPBOX_PUBLIC_TOKEN) {
          console.error("Error fetching Mapbox token:", error);
          return;
        }

        if (!mapContainer.current) return;

        // Clean up existing map instance if it exists
        if (map.current) {
          map.current.remove();
        }

        // Clean up existing markers
        markerRefs.current.forEach(marker => marker.remove());
        markerRefs.current = [];

        // Validate and swap coordinates if they're in wrong order
        // Mapbox expects [longitude, latitude], but sometimes we might get [latitude, longitude]
        const validateCoordinates = (coords: [number, number]): [number, number] => {
          if (!Array.isArray(coords) || coords.length !== 2) {
            return [-118.2437, 34.0522]; // Default to Los Angeles
          }
          
          const [first, second] = coords;
          
          // If first number looks like latitude (between -90 and 90), swap them
          if (first >= -90 && first <= 90 && (second < -90 || second > 90)) {
            return [second, first];
          }
          
          return coords;
        };

        const validLocation = validateCoordinates(location);
        const validCenter = center ? validateCoordinates(center) : validLocation;

        console.log('Initializing map with coordinates:', {
          location: validLocation,
          center: validCenter
        });

        mapboxgl.accessToken = data.MAPBOX_PUBLIC_TOKEN;

        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: validCenter,
          zoom: zoom
        });

        // Store map instance in ref
        map.current = mapInstance;

        // Wait for map to load before adding markers and controls
        mapInstance.on('load', () => {
          if (!isMounted) return;

          // Add markers only after map is loaded
          if (markers && Array.isArray(markers)) {
            markers.forEach(marker => {
              if (Array.isArray(marker.position) && 
                  marker.position.length === 2) {
                const validMarkerPosition = validateCoordinates(marker.position);
                const newMarker = new mapboxgl.Marker()
                  .setLngLat(validMarkerPosition)
                  .setPopup(new mapboxgl.Popup().setHTML(marker.title))
                  .addTo(mapInstance);
                markerRefs.current.push(newMarker);
              }
            });
          } else {
            // Add default marker at location
            const newMarker = new mapboxgl.Marker()
              .setLngLat(validLocation)
              .addTo(mapInstance);
            markerRefs.current.push(newMarker);
          }

          // Add navigation controls after map is loaded
          mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
          
          // Trigger resize to ensure proper rendering
          mapInstance.resize();
        });

      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
      // Clean up markers
      markerRefs.current.forEach(marker => marker.remove());
      markerRefs.current = [];
      
      // Clean up map
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [location, center, zoom, markers]);

  return <div ref={mapContainer} className="w-full h-full" />;
}