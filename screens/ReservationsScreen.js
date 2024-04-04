import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { getReservationsForUser, deleteReservation, editReservationForUser } from '../controllers/ReservationsDB';
import { useFocusEffect } from '@react-navigation/native';
import SegmentedControl from "@react-native-segmented-control/segmented-control";

const ReservationsScreen = () => {
  const [reservations, setReservations] = useState([]);
  const [statusFilterIndex, setStatusFilterIndex] = useState(0); // State for the selected status filter index
  const sortedReservations = reservations.slice().sort((a, b) => a.date - b.date);

  useFocusEffect(
    useCallback(() => {
      fetchReservations();
    }, [])
  );

  const fetchReservations = () => {
    // Assuming you have a function to fetch reservations for the current user
    getReservationsForUser((data, error) => {
      if (error) {
        console.error('Error fetching reservations:', error);
      } else {
        setReservations(data);
        console.log('Reservations: ', data.length)
      }
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return { text: 'Pending', color: 'orange' }; // Orange color for pending
      case 1:
        return { text: 'Confirmed', color: 'green' }; // Green color for confirmed
      case 2:
        return { text: 'Declined', color: 'red' }; // Red color for declined
      case 3:
        return { text: 'Cancelled', color: 'gray' }; // Gray color for cancelled
      default:
        return { text: 'Unknown', color: 'gray' }; // Gray color for unknown
    }
  };
  
  const renderItem = ({ item }) => (
    <View style={styles.reservationContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.renterImage} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.boldText}>{item.make} {item.model}</Text>
        <Text>Date: {item.date.toDate().toLocaleString()}</Text>
        <Text>License Plate: {item.licensePlate}</Text>
        <Text>Location: {item.pickupLocation}</Text>
        <Text>Price: ${item.price}</Text>
        <View style={styles.renterContainer}>
          <Image source={{ uri: item.ownerImage }} style={styles.renterImageSmall} />
          <Text style={styles.renterName}>Owner:{'\n'}{item.owner}</Text>
        </View>
        <Text style={{ color: 'white', backgroundColor: getStatusText(item.status).color }}>Status: {getStatusText(item.status).text}</Text>
        {item.status === 1 && <Text style={styles.confirmCode}>Booking Confirmation Code:{'\n'}{item.confirmationCode}</Text>}
        {item.status !== 3 && ( // Render button if status is not 3 (cancelled)
        <TouchableOpacity onPress={() => deleteReservationAlert(item.id)} style={styles.button}>
          <Text style={styles.buttonText}>Delete Reservation</Text>
        </TouchableOpacity>
      )}
      </View>
    </View>
  );

  const deleteReservationAlert = (reservationId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to cancel this reservation?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => cancelReservation(reservationId),
        },
      ],
      { cancelable: false }
    );
  };

  const cancelReservation = async (reservationId) => {
    try {
      await editReservationForUser(reservationId, { status: 3 }); // Update status to 3 (Cancelled)
      fetchReservations(); // Refresh reservations after cancellation
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  // const deleteAndRefresh = async (reservationId) => {
  //   try {
  //     // Call deleteReservation function from ReservationsDB
  //     await deleteReservation(reservationId);
  //     // Refresh reservations after deletion
  //     fetchReservations();
  //   } catch (error) {
  //     console.error('Error deleting reservation:', error);
  //   }
  // };

  return (
    <View style={{ flex: 1}}>
      <SegmentedControl
        values={['Pending', 'Confirmed', 'Declined', 'Cancelled']} // Segment titles including 'Cancelled'
        selectedIndex={statusFilterIndex} // Selected segment index
        onChange={(event) => setStatusFilterIndex(event.nativeEvent.selectedSegmentIndex)} // Handle segment change
      />
      {sortedReservations.filter(item => item.status === statusFilterIndex).length > 0 ? (
        <FlatList
          data={sortedReservations.filter(item => item.status === statusFilterIndex)} // Apply filtering
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
  confirmCode: {
    fontWeight: 'bold',
    color: 'green',
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
  button: {
    backgroundColor: 'palevioletred',
    marginTop: 5,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius:5,
    borderWidth:1,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'seashell', 
  },
};
