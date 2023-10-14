import React from 'react';
import {
  Container,
  Heading,
  Stack,
  Button,
  Box,
} from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { NavLink } from 'react-router-dom';

export default function CornMap() {
  return (
    <Container minHeight="100vh" maxW="container.lg">
      <Heading marginTop={10}>Map of Corn Fields</Heading>
      <Stack direction="row" spacing={4} marginTop={10}>
        <Button as={NavLink} to="/admin/corn" float="right" leftIcon={<MdArrowBack />} colorScheme="blue" variant="outline">
          Back to List
        </Button>
      </Stack>

      <Box height="50vh" marginTop="10">
        <MapContainer center={[38, -450]} zoom={4} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[38, -450]} />

          <Marker position={[38, -460]} />

          <Marker position={[39, -470]} />

        </MapContainer>
      </Box>
    </Container>
  );
}
