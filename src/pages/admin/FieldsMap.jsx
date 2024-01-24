import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  useToast,
  Progress,
} from '@chakra-ui/react';
import { MdEdit, MdInfo } from 'react-icons/md';
import {
  MapContainer, TileLayer, Popup, Marker, LayersControl, LayerGroup, useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { NavLink } from 'react-router-dom';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import SoybeanService from '../../services/soybean.service';
import CornService from '../../services/corn.service';
import LeafletgeoSearch from '../../components/LeafletgeoSearch';

function AdjustMapBounds({ data, loading }) {
  const map = useMap();

  useEffect(() => {
    if (!loading && map && data.corns.length > 0 && data.soybeans.length > 0) {
      const markers = [
        ...data.corns.map((corn) => [corn.lat, corn.lng]),
        ...data.soybeans.map((soybean) => [soybean.lat, soybean.lng]),
      ];

      const validMarkers = markers.filter(
        ([lat, lng]) => !Number.isNaN(lat) && !Number.isNaN(lng),
      );

      if (validMarkers.length > 0) {
        const bounds = L.latLngBounds(validMarkers).pad(0.5);
        map.fitBounds(bounds);
      }
    }
  }, [data, loading, map]);

  return null;
}

export default function FieldsMap() {
  const cornIcon = L.divIcon({
    className: 'custom-marker',
    iconSize: [32, 32], // adjust the size of your custom marker
    iconAnchor: [16, 32], // adjust the anchor point if needed
    popupAnchor: [0, -32], // adjust the popup anchor point if needed
    html: '<img src="/img/corn.png" style="width: 100%; height: 100%;background: orange;padding:2px;border-radius:15px;box-shadow:0px 0px 10px green;border:4px solid green;" />',
  });
  const soybeanIcon = L.divIcon({
    className: 'custom-marker',
    iconSize: [32, 32], // adjust the size of your custom marker
    iconAnchor: [16, 32], // adjust the anchor point if needed
    popupAnchor: [0, -32], // adjust the popup anchor point if needed
    html: '<img src="/img/soybean.png" style="width: 100%; height: 100%;background: green;padding:2px;border-radius:15px;box-shadow:0px 0px 10px red;border:3px solid red;" />',
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
    <Box height="80vh">
      <Progress hidden={!loading} size="xs" isIndeterminate />
      {!loading && (
        <MapContainer center={[38, -90]} zoom={5} scrollWheelZoom>
          <LayersControl>
            <LayersControl.BaseLayer checked name="Satellite">
              <LayerGroup>
                <TileLayer
                  attribution="Google Maps Satellite"
                  url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
                />
                <TileLayer url="https://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}" />
              </LayerGroup>
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Street View">
              <TileLayer
                attribution="Google Maps"
                url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
              />
            </LayersControl.BaseLayer>

          </LayersControl>

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
                    <Button as={NavLink} to={`/admin/result/edit/corn/${item.id}`} leftIcon={<MdEdit />} colorScheme="blue" variant="ghost" size="sm">
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
                    <Button as={NavLink} to={`/admin/result/edit/soybean/${item.id}`} leftIcon={<MdEdit />} colorScheme="blue" variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Popup>
                </Marker>
              );
            }

            return null; // Ignore markers with invalid coordinates
          })}

          <LeafletgeoSearch />
          <FullscreenControl
            position="topleft"
          />
          <AdjustMapBounds data={data} loading={loading} />
        </MapContainer>
      )}
    </Box>
  );
}
