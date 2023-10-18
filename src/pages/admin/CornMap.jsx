import React, { useEffect, useState } from 'react';
import {
  Container,
  Heading,
  Stack,
  Button,
  Box,
  useToast,
  Progress,
} from '@chakra-ui/react';
import { MdArrowBack, MdEdit, MdInfo } from 'react-icons/md';
import {
  MapContainer, TileLayer, Marker, Popup,
} from 'react-leaflet';
import { NavLink } from 'react-router-dom';
import CornService from '../../services/corn.service';

export default function CornMap() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const corns = await CornService.getCorns();
      setData(corns);
      setLoading(false);
    }

    try {
      setLoading(true);
      fetchData();
    } catch (error) {
      // Handle submission error here
      toast({
        title: 'Failed to load data, Try again.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }, []);

  return (
    <Container minHeight="100vh" maxW="container.lg">
      <Heading marginTop={10}>Map of Corn Fields</Heading>
      <Stack direction="row" spacing={4} marginTop={10}>
        <Button as={NavLink} to="/admin/corn" float="right" leftIcon={<MdArrowBack />} colorScheme="blue" variant="outline">
          Back to List
        </Button>
      </Stack>

      <Box height="50vh" marginTop="10">
        <Progress hidden={!loading} size="xs" isIndeterminate />
        {!loading && (
        <MapContainer center={[38, -90]} zoom={4} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {data.map((item) => {
            const latitude = parseFloat(item.lat);
            const longitude = parseFloat(item.lng);
            if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
              return (
                <Marker
                  key={item.id}
                  position={[latitude, longitude]}
                  eventHandlers={{
                    mouseover: (event) => event.target.openPopup(),
                  }}
                >
                  <Popup>
                    {item.name}
                    &nbsp;
                    <Button as={NavLink} to={`/admin/corn/detail/${item.id}`} leftIcon={<MdInfo />} colorScheme="blue" variant="outline" size="sm">
                      Detail
                    </Button>
                    &nbsp;
                    <Button as={NavLink} to={`/admin/corn/edit/${item.id}`} leftIcon={<MdEdit />} colorScheme="blue" variant="outline" size="sm">
                      Edit
                    </Button>
                  </Popup>
                </Marker>
              );
            }

            return null; // Ignore markers with invalid coordinates
          })}
        </MapContainer>
        )}
      </Box>
    </Container>
  );
}
