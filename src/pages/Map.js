import { Box } from '@chakra-ui/react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import {
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    Container
  } from '@chakra-ui/react'

export default function Map() {
    return (
        <Container height={'100vh'} maxW='container.lg'>
            <FormControl  marginTop={'10'}>
                <FormLabel>Find location:</FormLabel>
                <Input type='text' />
                <FormHelperText>Enter zip code of your field area.</FormHelperText>
            </FormControl>
            <Box height={'50vh'} marginTop={'10'}>
                <MapContainer center={[38, -450]} zoom={4} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[38, -450]}>
                    </Marker>
                </MapContainer>
            </Box>
        </Container>
    );
}