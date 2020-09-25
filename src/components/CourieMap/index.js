import React, { useCallback, useRef, useState } from 'react';
import './index.scss';
import { MAP_STYLES } from './map.styles'
import {
  GoogleMap,
  Marker
} from "@react-google-maps/api";
import {w3cwebsocket as W3CWebSocket } from 'websocket';
import DeliveryInfoPanel from '../DeliveryInfoPanel'
import axios from 'axios';
import {
  useParams
} from "react-router-dom";

const options = {
  styles: MAP_STYLES,
  disableDefaultUI: true
};

const CourieMap = () => {

  let { deliveryId } = useParams();
  const [deliveryInfo, setDeliveryInfo] = useState({});

  const mapRef = useRef();

  const onMapLoad = (map) => {
    mapRef.current = map;

    // Load the delivery information after the map has loaded. 
    getDeliveryDetails();
  };

  const driverMarkerRef = useRef();
  const onDriverMarkerLoad = useCallback((marker) => {
    driverMarkerRef.current = marker;
  }, []);

  const pickupMarkerRef = useRef();
  const onPickupMarkerLoad = useCallback((marker) => {
    pickupMarkerRef.current = marker;
  }, []);

  const dropoffMarkerRef = useRef();
  const onDropoffMarkerLoad = useCallback((marker) => {
    dropoffMarkerRef.current = marker;
  }, []);

 const panTo = useCallback((message) => {
    let {driver} = JSON.parse(message.data);
    driverMarkerRef.current.setPosition({ lat: Number(driver.currentLatLng.lat), lng: Number(driver.currentLatLng.lng) });
    
    let currentBounds = mapRef.current.getBounds();
    currentBounds.extend({ lat: Number(driver.currentLatLng.lat), lng: Number(driver.currentLatLng.lng) });

    let center = currentBounds.getCenter();

    mapRef.current.fitBounds(currentBounds, 0);
    mapRef.current.panTo({lat: center.lat(), lng: center.lng()});

  }, []);

  // Hacky way of creating the WS connection once on the proper UpdateDelivery event. 
  let driverEvents;

  const updateDelivery = (msg) => {

    let {delivery} = JSON.parse(msg.data);

    if (delivery) {
      setDeliveryInfo(delivery);
    }
    
    // Only draw the car pin if we the delivery is active or picked up and we do not have the websocket open.
    if (delivery.assignedDriverId && (delivery.status === "ACTIVE" || delivery.status === "PICKED_UP") && !driverEvents) {

      driverEvents = W3CWebSocket(`ws://${process.env.REACT_APP_DRIVERS_HOST}/events/location-updates/${delivery.assignedDriverId}`);
      driverEvents.onmessage = panTo;
      driverMarkerRef.current.setVisible(true);
    }

    // Do not connect ot the delivery event socket if the delivery is finished. 
    if (delivery.status === "FINISHED" && driverEvents) {
      
      driverMarkerRef.current.setVisible(false);
      driverEvents.close();
      driverEvents = null;
    }
  };

  const getDeliveryDetails = async () => {
    let deliveryResponse = await axios.get(`http://${process.env.REACT_APP_DELIVERIES_HOST}/deliveries/${deliveryId}`);

    let delivery = deliveryResponse.data;
    let pickup = { lat: Number(delivery.pickupLatLng.lat), lng: Number(delivery.pickupLatLng.lng) };
    let drop = { lat: Number(delivery.dropoffLatLng.lat), lng: Number(delivery.dropoffLatLng.lng) };

    let bounds = new window.google.maps.LatLngBounds();
    bounds.extend(pickup);
    bounds.extend(drop);

    let center = bounds.getCenter();

    mapRef.current.fitBounds(bounds, 100);
    mapRef.current.panTo({lat: center.lat(), lng: center.lng()});

    pickupMarkerRef.current.setPosition(pickup);
    dropoffMarkerRef.current.setPosition(drop);

    pickupMarkerRef.current.setVisible(true);
    dropoffMarkerRef.current.setVisible(true);

    setDeliveryInfo(delivery);

    const locationClient = W3CWebSocket(`ws://${process.env.REACT_APP_DELIVERIES_HOST}/events/deliveries/${deliveryId}`);
    locationClient.onmessage = updateDelivery;
  }

  return (
    <div>
      <GoogleMap 
        id="map"
        mapContainerClassName="map-container"
        zoom={17} 
        options={options}
        onLoad={onMapLoad}
      >
        <Marker 
          onLoad={onDriverMarkerLoad}
          visible={false}
          icon={{
            url: `${process.env.PUBLIC_URL}/courie-car-icon-sm.png`,
            scaledSize: new window.google.maps.Size(80, 80),
          }} 
        />
        <Marker 
          onLoad={onPickupMarkerLoad}
          icon={{
            url: `${process.env.PUBLIC_URL}/courie-box-icon-sm.png`,
            scaledSize: new window.google.maps.Size(80, 80),
          }}
        />
        <Marker 
          onLoad={onDropoffMarkerLoad}
          icon={{
            url: `${process.env.PUBLIC_URL}/courie-box-icon-sm2.png`,
            scaledSize: new window.google.maps.Size(70, 70),
          }}
        />
      </GoogleMap>
      <DeliveryInfoPanel deliveryInfo={deliveryInfo} />
    </div>
    
  );

};

export default CourieMap;
