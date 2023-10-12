import React from 'react';
import {
  Box,
  Container,
  Text,
} from '@chakra-ui/react';
import {
  MapContainer, TileLayer, Marker,
} from 'react-leaflet';
import 'leaflet-geosearch/dist/geosearch.css';
import LeafletgeoSearch from '../components/LeafletgeoSearch';

export default function Map() {
  return (
    <Container height="100vh" maxW="container.lg">
      <Text marginTop={10}>
        Enter zip code or address of your field area.
      </Text>
      <Box height="65vh" marginTop="10">
        <MapContainer center={[38, -450]} zoom={4} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[38, -450]} />
          <LeafletgeoSearch />
        </MapContainer>
      </Box>
    </Container>
  );
}
