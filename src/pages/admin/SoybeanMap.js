import {
    Container,
    Heading,
    Stack,
    Button,
    Box
} from '@chakra-ui/react'
import { MdAdd, MdList } from "react-icons/md"
import { MapContainer, TileLayer, Marker } from 'react-leaflet'

export default function SoybeanMap() {
    return (
        <Container height={'100vh'} maxW='container.lg'>
            <Heading marginTop={10}>Map of Soybean Fields</Heading>
            <Stack direction='row' spacing={4} marginTop={10}>
                <Button as={'a'} href={'/admin/add-soybean'} leftIcon={<MdAdd />} colorScheme='green' variant='solid'>
                    Add Soybean Field
                </Button>
                <Button as={'a'} href={'/admin/soybean'} float={'right'} rightIcon={<MdList />} colorScheme='blue' variant='outline'>
                    List of Soybeans
                </Button>
            </Stack>

            <Box  height={'50vh'} marginTop={'10'}>
                <MapContainer center={[38, -450]} zoom={4} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[38, -450]}>
                    </Marker>

                    <Marker position={[38, -460]}>
                    </Marker>

                    <Marker position={[39, -470]}>
                    </Marker>

                </MapContainer>
            </Box>
        </Container>)
}