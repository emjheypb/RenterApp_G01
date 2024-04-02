import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getReservationsForUser } from '../controllers/ReservationsDB';

const ReservationsScreen = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    // Assuming you have a function to fetch reservations for the current user
    getReservationsForUser((data, error) => {
      if (error) {
        console.error('Error fetching reservations:', error);
      } else {
        setReservations(data);
      }
    });
  };

  const renderItem = ({ item }) => (
    <View style={{ marginVertical: 10, paddingHorizontal: 20 }}>
      <Text>Vehicle: {item.vehicleName}</Text>
      <Text>Date: {item.bookingDate}</Text>
      <Text>License Plate: {item.licensePlate}</Text>
      {/* Add more details as needed */}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>My Reservations</Text>
      {reservations.length > 0 ? (
        <FlatList
          data={reservations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text>No reservations found.</Text>
      )}
    </View>
  );
};

export default ReservationsScreen;
