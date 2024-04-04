import React, { useState } from 'react';
import { View, Text, Image, Button, TouchableOpacity, Linking, Alert } from 'react-native';
import { getDistance } from 'geolib';

export const ListingDetailsBox = ({ listing, onRequestBooking, userLocation }) => {

  const handleConfirm = () => {
    // Generate a random future date
    const today = new Date();
    const randomFutureDate = new Date(today.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date within 30 days
    // Show confirmation alert
    Alert.alert(
      'Confirm Booking',
      `Are you sure you want to book this listing for ${randomFutureDate.toLocaleString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => onRequestBooking(randomFutureDate) }
      ]
    );
  };

  const handleLocationPress = () => {
    const locationQuery = encodeURIComponent(listing.location);
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${locationQuery}`;
    Linking.openURL(mapUrl);
  };  

  const distanceInMeters = getDistance(
    { latitude: userLocation.latitude, longitude: userLocation.longitude },
    { latitude: listing.latitude, longitude: listing.longitude }
  );

  // Convert distance to kilometers and format it
  const distanceInKm = (distanceInMeters / 1000).toFixed(1);

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <Image source={{ uri: listing.image }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.boldText}>{listing.make} {listing.model}</Text>
          <Text>Electric Range: {listing.electricRange}</Text>
          <Text>Seat Capacity: {listing.seatCapacity}</Text>
          <TouchableOpacity onPress={handleLocationPress}>
            <Text style={styles.linkText}>{distanceInKm}km from you,{'\n'}Get Directions</Text>
          </TouchableOpacity>
          <Text style={styles.boldText}>${listing.price} Total</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="BOOK NOW" onPress={handleConfirm} />
      </View>
    </View>
  );  
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      detailsContainer: {
        flexDirection: 'row',
        marginBottom: 10,
      },
      details: {
        marginLeft: 10,
        marginRight: 20,
        flex: 1,
      },
      image: {
        marginLeft: 20,
        width: 180,
        height: 150,
        resizeMode: 'cover',
      },
      buttonContainer: {
        marginBottom: 20,
      },
      boldText: {
        fontWeight: 'bold',
      },
      linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
      },
    };