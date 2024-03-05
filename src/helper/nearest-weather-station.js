import weatherStations from '../test_data/weather_stations.json';

function haversine(firstLat, firstLon, secondLat, secondLon) {
  // Convert latitude and longitude from degrees to radians
  const toRadians = (angle) => angle * (Math.PI / 180);
  const lat1 = toRadians(firstLat);
  const lon1 = toRadians(firstLon);
  const lat2 = toRadians(secondLat);
  const lon2 = toRadians(secondLon);

  // Haversine formula
  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Radius of Earth in miles
  const radius = 3959.0;

  // Calculate the distance in miles
  const distance = radius * c;

  return distance;
}

function findNearestWeatherStation(userLocation) {
  let minDistance = Infinity;
  let nearestMarker = null;

  weatherStations.records.forEach((marker) => {
    const markerLat = parseFloat(marker.stnLat);
    const markerLon = parseFloat(marker.stnLong);
    const distance = haversine(userLocation.lat, userLocation.lon, markerLat, markerLon);

    if (distance < minDistance) {
      minDistance = distance;
      nearestMarker = marker;
    }
  });

  return { nearestMarker, minDistance };
}

export default findNearestWeatherStation;
// Example usage
// const userLocation = { lat: 37.7749, lon: -122.4194 }; // User-selected location

// const { nearestMarker, minDistance } = findNearestLocation(userLocation);

// console.log(`The nearest marker is at (${nearestMarker.stnLat}, ${nearestMarker.stnLong})`);
// console.log(`The distance to the nearest marker is ${minDistance.toFixed(2)} kilometers`);
