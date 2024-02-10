import React from 'react';
import {
  Popup, Marker, FeatureGroup,
} from 'react-leaflet';
import L from 'leaflet';
import weatherStations from '../../test_data/weather_stations.json';

export default function WeatherStations() {
  const weatherStationIcon = L.divIcon({
    className: 'custom-marker',
    iconSize: [25, 25], // adjust the size of your custom marker
    iconAnchor: [16, 32], // adjust the anchor point if needed
    popupAnchor: [0, -32], // adjust the popup anchor point if needed
    html: '<img src="/img/climatology.png" style="padding:3px;width: 100%; height: 100%;border-radius:5px;border:1px solid white;background:skyblue;" />',
  });

  return (
    <FeatureGroup>
      {weatherStations.records.map((ws) => {
        if (ws.stnStatus !== '0') {
          return (
            <Marker
              key={ws.idAWDN}
              icon={weatherStationIcon}
              weight="12"
              position={[ws.stnLat, -Math.abs(ws.stnLong)]}
            >
              <Popup>{ws.stnName}</Popup>
            </Marker>
          );
        }
        return null;
      })}
    </FeatureGroup>
  );
}
