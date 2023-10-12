import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

export default function LeafletgeoSearch() {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: false,
      showPopUp: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: 'Enter address or zip code',
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);
  return null;
}
