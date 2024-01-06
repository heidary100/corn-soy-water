import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  useToast,
  Progress,
} from '@chakra-ui/react';
import { MdEdit, MdInfo } from 'react-icons/md';
import {
  MapContainer, TileLayer, Popup, Marker,
} from 'react-leaflet';
import L from 'leaflet';
import { NavLink } from 'react-router-dom';
import SoybeanService from '../../services/soybean.service';
import CornService from '../../services/corn.service';

export default function FieldsMap() {
  const cornIcon = L.divIcon({
    className: 'custom-marker',
    iconSize: [32, 32], // adjust the size of your custom marker
    iconAnchor: [16, 32], // adjust the anchor point if needed
    popupAnchor: [0, -32], // adjust the popup anchor point if needed
    html: '<img src="/img/corn.png" style="width: 100%; height: 100%;background: orange;padding:2px;border-radius:15px;box-shadow:0px 0px 10px green;opacity:0.5;border:4px solid green;" />',
  });
  const soybeanIcon = L.divIcon({
    className: 'custom-marker',
    iconSize: [32, 32], // adjust the size of your custom marker
    iconAnchor: [16, 32], // adjust the anchor point if needed
    popupAnchor: [0, -32], // adjust the popup anchor point if needed
    html: '<img src="/img/soybean.png" style="width: 100%; height: 100%;background: green;padding:2px;border-radius:15px;box-shadow:0px 0px 10px red;opacity:0.5;border:3px solid red;" />',
  });

  const toast = useToast();
  const [data, setData] = useState({
    corns: [],
    soybeans: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const soybeans = await SoybeanService.getSoybeans();
      const corns = await CornService.getCorns();
      setData({
        corns,
        soybeans,
      });
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
    <Box height="70vh" marginTop="10">
      <Progress hidden={!loading} size="xs" isIndeterminate />
      {!loading && (
        <MapContainer center={[38, -90]} zoom={4} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {data.corns.map((item) => {
            const latitude = parseFloat(item.lat);
            const longitude = parseFloat(item.lng);
            if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
              return (
                <Marker
                  icon={cornIcon}
                  key={`corn-${item.id}`}
                  position={[latitude, longitude]}
                  eventHandlers={{
                    mouseover: (event) => event.target.openPopup(),
                  }}
                >
                  <Popup>
                    {item.name}
                    <br />
                    <Button as={NavLink} to={`/admin/result/corn/${item.id}`} leftIcon={<MdInfo />} colorScheme="blue" variant="ghost" size="sm">
                      Detail
                    </Button>
                    { }
                    <Button as={NavLink} to={`/admin/edit/corn/${item.id}`} leftIcon={<MdEdit />} colorScheme="blue" variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Popup>
                </Marker>
              );
            }

            return null; // Ignore markers with invalid coordinates
          })}

          {data.soybeans.map((item) => {
            const latitude = parseFloat(item.lat);
            const longitude = parseFloat(item.lng);
            if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
              return (
                <Marker
                  icon={soybeanIcon}
                  style={{ background: '3px solid red' }}
                  weight="12"
                  key={`soybean-${item.id}`}
                  position={[latitude, longitude]}
                  eventHandlers={{
                    mouseover: (event) => event.target.openPopup(),
                  }}
                >
                  <Popup>
                    {item.name}
                    <br />
                    <Button as={NavLink} to={`/admin/result/soybean/${item.id}`} leftIcon={<MdInfo />} colorScheme="blue" variant="ghost" size="sm">
                      Detail
                    </Button>
                    { }
                    <Button as={NavLink} to={`/admin/edit/soybean/${item.id}`} leftIcon={<MdEdit />} colorScheme="blue" variant="ghost" size="sm">
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
  );
}
