import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as Location from 'expo-location';

export const CurrentLocation = ({ setUserLocation }) => {
  useEffect(() => {
    (async () => {
      // Request permission to access device location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Pass the user location to the parent component
      setUserLocation(userLocation);
    })();
  }, [setUserLocation]);

  return null; // This component doesn't render anything
};
