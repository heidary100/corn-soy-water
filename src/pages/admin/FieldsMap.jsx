import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  useToast,
  Progress,
  Avatar,
} from '@chakra-ui/react';
import { MdInfo } from 'react-icons/md';
import {
  MapContainer, TileLayer, Popup, Marker, LayersControl, LayerGroup, useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { NavLink } from 'react-router-dom';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import SoybeanService from '../../services/soybean.service';
import CornService from '../../services/corn.service';
import LeafletgeoSearch from '../../components/LeafletgeoSearch';
import WeatherStations from '../../components/admin/WeatherStations';
import { cornIcon, soybeanIcon } from '../../components/admin/MarkerIcons';

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
  const toast = useToast();
  const [data, setData] = useState({
    corns: [],
    soybeans: [],
  });
  const [loading, setLoading] = useState(false);
  const [showWS, setShowWS] = useState(false);

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
    <Box height="70vh" pos="relative">
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

          {showWS && <WeatherStations />}
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
      <Button
        pos="absolute"
        bottom="5"
        left="5"
        zIndex={10000}
        onClick={() => {
          setShowWS(!showWS);
        }}
      >
        <Avatar borderRadius={0} size="sm" name="Weather Station" src="/img/climatology.png" />
        &nbsp;
        {showWS ? 'Hide' : 'Show'}
        &nbsp;
        Weather Stations
      </Button>
    </Box>
  );
}
