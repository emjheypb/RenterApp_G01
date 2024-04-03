import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

// export const CurrentLocation = ({ setUserLocation }) => {
//   useEffect(() => {
//     (async () => {
//       // Request permission to access device location
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         console.error('Permission to access location was denied');
//         return;
//       }

//       // Get current location
//       const location = await Location.getCurrentPositionAsync({});
//       const userLocation = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       };

//       // Pass the user location to the parent component
//       setUserLocation(userLocation);
//     })();
//   }, [setUserLocation]);

//   return null; // This component doesn't render anything
// };

export const CurrentLocation = ({ setUserLocation }) => {
  useEffect(() => {
    let isMounted = true;
    
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }
        
        const location = await Location.getCurrentPositionAsync({});
        const userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        if (isMounted) {
          setUserLocation(userLocation);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    // Fetch initial location
    fetchLocation();

    // Set up interval to fetch location every 5 seconds
    const interval = setInterval(fetchLocation, 5000);

    // Clean up function
    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, [setUserLocation]);

  return null; // This component doesn't render anything
};

export const doForwardGeocode = async (address, _callback) => {
  try {
    // 0. on android, permissions must be granted
    Location.requestForegroundPermissionsAsync()
      // 1. do geocoding setCityFromUI
      .then((result) => {
        // console.log("doForwardGeocode", result.status);
        if (result.status === "granted") {
          return Location.geocodeAsync(address);
        } else {
          throw new Error("Edit Location Permission");
        }
      })
      // 2. Check if a result is found
      .then((location) => {
        // console.log("doForwardGeocode", JSON.stringify(location));
        _callback(location[0], null);
      });
    // 3. do something with results
  } catch (err) {
    console.log(err, "doForwardGeocode");
    _callback(null, err);
  }
};

