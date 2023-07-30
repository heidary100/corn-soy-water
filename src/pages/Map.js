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
        <Container>
            <FormControl  marginTop={'10'}>
                <FormLabel>Find location:</FormLabel>
                <Input type='text' />
                <FormHelperText>Enter zip code of your field area.</FormHelperText>
            </FormControl>
            <Box height={'50vh'} marginTop={'10'}>
                <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
            </Box>
        </Container>
    );
}