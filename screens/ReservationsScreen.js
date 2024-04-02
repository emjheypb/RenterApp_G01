import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { getReservationsForUser, deleteReservation } from '../controllers/ReservationsDB';
import SearchScreen from './SearchScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { navigate, navigation } from '@react-navigation/native';

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

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Confirmed';
      case 2:
        return 'Declined';
      default:
        return 'Unknown';
    }
  };
  
  const renderItem = ({ item }) => (
    <View style={styles.reservationContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.renterImage} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.boldText}>{item.make} {item.model}</Text>
        <Text>Booking Date: {item.date.toDate().toLocaleString()}</Text>
        <Text>License Plate: {item.licensePlate}</Text>
        <Text>Pickup Location: {item.location}</Text>
        <Text>Price: ${item.price}</Text>
        <View style={styles.renterContainer}>
          <Image source={{ uri: item.ownerImage }} style={styles.renterImageSmall} />
          <Text style={styles.renterName}>Owner:{'\n'}{item.owner}</Text>
        </View>
        <Text>Status: {getStatusText(item.status)}</Text>
        {item.status === 1 && <Text>Booking Confirmation Code: {item.confirmationCode}</Text>}
      <TouchableOpacity onPress={() => deleteAndRefresh(item.id)}>
        <Text style={{ color: 'red', marginTop: 5 }}>Delete Reservation</Text>
      </TouchableOpacity>
      </View>
    </View>
  );

  const deleteAndRefresh = async (reservationId) => {
    try {
      // Call deleteReservation function from ReservationsDB
      await deleteReservation(reservationId);
      // Refresh reservations after deletion
      fetchReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };
  

  const sortedReservations = reservations.slice().sort((a, b) => a.date - b.date);
  
  return (
    <View style={{ flex: 1, paddingTop:100 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, justifyContent:'center', marginLeft:30 }}>My Reservations</Text>
      {reservations.length > 0 ? (
        <FlatList
          data={sortedReservations}
          style={styles.animeList}
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

const styles = {
  animeList:{
    alignContent:"stretch",
    width:"100%",
  },
  reservationContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginRight: 20,
  },
  detailsContainer: {
    flex: 1,
  },
  renterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  renterImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  renterImageSmall: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
    marginRight: 10,
  },
  renterName: {
    fontSize: 16,
  },
};
