import L from 'leaflet';

export const cornIcon = L.divIcon({
  className: 'custom-marker',
  iconSize: [32, 32], // adjust the size of your custom marker
  iconAnchor: [16, 32], // adjust the anchor point if needed
  popupAnchor: [0, -32], // adjust the popup anchor point if needed
  html: '<img src="/img/corn.png" style="width: 100%; height: 100%;background: orange;padding:2px;border-radius:15px;box-shadow:0px 0px 10px green;border:4px solid green;" />',
});

export const soybeanIcon = L.divIcon({
  className: 'custom-marker',
  iconSize: [32, 32], // adjust the size of your custom marker
  iconAnchor: [16, 32], // adjust the anchor point if needed
  popupAnchor: [0, -32], // adjust the popup anchor point if needed
  html: '<img src="/img/soybean.png" style="width: 100%; height: 100%;background: green;padding:2px;border-radius:15px;box-shadow:0px 0px 10px red;border:3px solid red;" />',
});
