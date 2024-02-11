/* eslint-disable no-underscore-dangle */
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

function calculateCenter(e) {
  if (e.layerType === 'circle') {
    const shapeCenter = e.layer.getLatLng();
    if (shapeCenter) {
      return [shapeCenter.lat, shapeCenter.lng];
    }
  } else {
    const bounds = e.layer.getBounds();
    const shapeCenter = bounds.getCenter();
    return [shapeCenter.lat, shapeCenter.lng];
  }

  return [null, null];
}

function getShape(e) {
  const geoJSON = e.layer.toGeoJSON();
  const type = e.layerType;

  if (type === 'circle') {
    const radius = e.layer.getRadius();
    const center = e.layer.getLatLng();
    return { type, geoJSON: { center, radius } };
  }

  return { type, geoJSON };
}

export default function DrawTools({ updateShape, shape }) {
  const shapeParentRef = useRef(null);

  const addShape = ({ type, geoJSON }) => {
    let leafletLayer;

    if (type === 'circle') {
      // leafletLayer = L.circle({ ...geoJSON });
      leafletLayer = L.circle(geoJSON.center, { radius: geoJSON.radius });
      shapeParentRef.current.addLayer(leafletLayer);
    } else {
      leafletLayer = new L.GeoJSON({
        ...geoJSON,
      });
      shapeParentRef.current.addLayer(leafletLayer.getLayers()[0]);
    }
  };

  const clearShapes = () => {
    const drawnItems = shapeParentRef.current._layers;
    Object.keys(drawnItems).forEach((layerid) => {
      const layer = drawnItems[layerid];
      shapeParentRef.current.removeLayer(layer);
    });
  };

  useEffect(() => {
    if (shape) {
      clearShapes();
      addShape(shape);
    }
  }, [shape]);

  const onCreated = (e) => {
    const [lat, lng] = calculateCenter(e);
    const newShape = getShape(e);
    updateShape({ shape: newShape, lat, lng });
    clearShapes();
    addShape(newShape);
  };

  const onDeleted = (e) => {
    const editedShapes = Object.values(e.layers._layers);
    if (editedShapes.length > 1) {
      throw Error('Invalid shapes');
    }
    if (editedShapes.length !== 0) {
      updateShape({ shape: null, lat: null, lng: null });
      clearShapes();
    }
  };

  const onEdited = (e) => {
    const editedShapes = Object.values(e.layers._layers);
    if (editedShapes.length > 1) {
      throw Error('Invalid shapes');
    }
    let layerType;
    const layer = editedShapes[0];
    if (layer?.feature?.geometry?.type) {
      layerType = layer.feature.geometry.type;
    } else {
      layerType = 'circle';
    }

    const newShape = getShape({ layerType, layer });
    const [lat, lng] = calculateCenter({ layerType, layer });
    updateShape({ shape: newShape, lat, lng });
    clearShapes();
    addShape(newShape);
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
