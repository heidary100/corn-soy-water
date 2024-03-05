import React, { useEffect, useState } from 'react';
import {
  Box,
  useToast,
  Progress,
} from '@chakra-ui/react';
import {
  MapContainer, TileLayer, Marker, LayersControl, LayerGroup, useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import SoybeanService from '../../services/soybean.service';
import CornService from '../../services/corn.service';
import LeafletgeoSearch from '../../components/LeafletgeoSearch';
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
        const bounds = L.latLngBounds(validMarkers);
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
  const navigate = useNavigate();

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
    <Box h="90vh" pos="relative">
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
                    click: () => { navigate(`/admin/result/corn/${item.id}`); },
                  }}
                />
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
                    click: () => { navigate(`/admin/result/soybean/${item.id}`); },
                  }}
                />
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
