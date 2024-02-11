/* eslint-disable no-underscore-dangle */
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

function calculateCenter(e) {
  console.log(e);
  if (e.layerType === 'circle') {
    const shapeCenter = e.layer.getLatLng();
    return [shapeCenter.lat, shapeCenter.lng];
  } if (e.layerType === 'rectangle') {
    // Get the bounds of the created rectangle
    const bounds = e.layer.getBounds();
    const shapeCenter = bounds.getCenter();
    return [shapeCenter.lat, shapeCenter.lng];
  } if (e.layerType === 'polygon') {
    const bounds = e.layer.getBounds();
    const shapeCenter = bounds.getCenter();
    return [shapeCenter.lat, shapeCenter.lng];
  }

  return [null, null];
}

function getShape(e) {
  console.log(e);
  let newShape;

  if (e.layerType === 'circle') {
    // Get the center and radius of the created circle
    const center = e.layer.getLatLng();
    const radius = e.layer.getRadius();

    // Create GeoJSON representation of the circle
    newShape = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [center.lng, center.lat],
      },
      properties: {
        radius,
      },
    };
  } else if (e.layerType === 'rectangle') {
    // Get the bounds of the created rectangle
    const bounds = e.layer.getBounds();

    // Create GeoJSON representation of the rectangle
    newShape = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [bounds._southWest.lng, bounds._southWest.lat],
            [bounds._northEast.lng, bounds._southWest.lat],
            [bounds._northEast.lng, bounds._northEast.lat],
            [bounds._southWest.lng, bounds._northEast.lat],
            [bounds._southWest.lng, bounds._southWest.lat],
          ],
        ],
      },
    };
  } else if (e.layerType === 'polygon') {
    // Get the coordinates of the created polygon
    const coordinates = e.layer._latlngs.map((coord) => [coord.lng, coord.lat]);

    // Create GeoJSON representation of the polygon
    newShape = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates],
      },
    };
  }

  return newShape;
}

export default function DrawTools({ updateShape, shape }) {
  const shapeParentRef = useRef(null);

  const loadShape = (newShape) => {
    if (shapeParentRef && shapeParentRef.current) {
      const leafletFG = shapeParentRef.current;
      leafletFG.eachLayer((layer) => {
        leafletFG.removeLayer(layer);
      });
      if (newShape) {
        const leafletLayer = new L.GeoJSON({
          ...newShape,
        });
        leafletFG.addLayer(leafletLayer.getLayers()[0]);
      }
    }
  };

  useEffect(() => {
    if (shape) {
      loadShape(shape);
    }
  }, [shape]);

  const onCreated = (e) => {
    try {
      const [lat, lng] = calculateCenter(e);
      const newShape = getShape(e);
      loadShape(newShape);
      updateShape({ shape: newShape, lat, lng });
      // eslint-disable-next-line no-underscore-dangle
      const drawnItems = shapeParentRef.current._layers;
      if (Object.keys(drawnItems).length > 1) {
        Object.keys(drawnItems).forEach((layerid, index) => {
          if (index > 0) return;
          const layer = drawnItems[layerid];
          shapeParentRef.current.removeLayer(layer);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onDeleted = () => {
    try {
      // const layer = Object.values(shapeParentRef.current._layers)[0];
      updateShape({ shape: null, lat: null, lng: null });
      const drawnItems = shapeParentRef.current._layers;
      Object.keys(drawnItems).forEach((layerid, index) => {
        if (index > 0) return;
        const layer = drawnItems[layerid];
        shapeParentRef.current.removeLayer(layer);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onEdited = (e) => {
    try { // const layer = Object.values(shapeParentRef.current._layers)[0];
      const [lat, lng] = calculateCenter(e);
      const newShape = getShape(e);
      console.log(e);
      // loadShape(newShape);
      updateShape({ shape: newShape, lat, lng });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FeatureGroup ref={shapeParentRef}>
      <EditControl
        position="topright"
        onEdited={onEdited}
        onCreated={onCreated}
        onDeleted={onDeleted}
        draw={{
          rectangle: true,
          circle: true,
          polygon: true,
          polyline: false,
          marker: false,
          circlemarker: false,
        }}
      />
    </FeatureGroup>
  );
}
