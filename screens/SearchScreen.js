import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getAllListings } from '../controllers/ListingsDB';
import { CurrentLocation, doForwardGeocode } from '../controllers/LocationManager';
import { ListingDetailsBox } from '../screens/components/ListingDetailsBox';
import { CustomMarker } from '../screens/components/CustomMarker';
import { addReservation } from '../controllers/ReservationsDB';
import { auth, db } from "../config/FirebaseApp";
import { getUserDetails } from "../controllers/UsersDB";
import { collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import ReservationsScreen from './ReservationsScreen';

const SearchScreen = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showListingDetails, setShowListingDetails] = useState(false); // State to control visibility of ListingDetailsBox
  const [address, setAddress] = useState('');

  useEffect(() => {
    // Fetch vehicles data
    fetchListingsData();
  }, []);

  const fetchListingsData = () => {
    getAllListings((data, error) => {
      if (error) {
        console.error('Error fetching vehicles:', error);
      } else {
        setListings(data);
      }
    });
  };

  const handleAddressChange = (text) => {
    setAddress(text);
  };

  // Function to handle search button press
  const handleSearch = () => {
    console.log('Searching for address:', address);

    // Perform forward geocoding
    doForwardGeocode(address, (location, error) => {
      if (error) {
        console.error('Error performing forward geocoding:', error);
        // Handle error, e.g., display an error message
      } else {
        console.log('Geocoded location:', location);

        // Update userLocation state with the geocoded location
        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }
    });
  };
  
  const renderMarkers = () => {
    console.log('Listings:', listings); // Log the listings array
  
    // Check if listings is an array
    if (!Array.isArray(listings)) {
      console.error('Listings data is not an array.');
      return null;
    }
  
    return listings.map((listing) => (
      <CustomMarker
        key={listing.id}
        coordinate={{ latitude: listing.latitude, longitude: listing.longitude }}
        title={listing.price.toString()} // Ensure title is a string
        onPress={() => handleMarkerPress(listing.id)}
      />
    ));
  };
  
  const handleMarkerPress = (listingID) => {
    // Find the listing with the matching ID
    const selected = listings.find(listing => listing.id === listingID);
    setSelectedListing(selected);
    setShowListingDetails(true); // Show the ListingDetailsBox
  };

  const handleMapPress = () => {
    setShowListingDetails(false); // Hide the ListingDetailsBox when user presses other region of the map
  };

  const handleBookingRequest = async (selectedDate) => {
    try {
      // Get user details for the authenticated user
      const currentUserEmail = auth.currentUser.email;
      getUserDetails(currentUserEmail, async (userData) => {
        if (userData) {
          // Construct the reservation data object
          const reservationData = {
            date: selectedDate,
            licensePlate: selectedListing.licensePlate,
            listingID: selectedListing.id,
            make: selectedListing.make,
            model: selectedListing.model,
            image: selectedListing.image,
            price: selectedListing.price,
            pickupLocation: selectedListing.location,
            ownerID: selectedListing.ownerEmail,
            owner: selectedListing.ownerName,
            ownerImage: selectedListing.ownerImage,
            renterID: currentUserEmail, 
            renter: userData.name, 
            renterImage: userData.image, 
            status: 0 
          };
  
          // Add the reservation to the database
          const reservationId = await addReservation(reservationData);
          console.log('Reservation requested for:', selectedListing.id, 'on date:', selectedDate, 'added with ID:', reservationId);
        } else {
          console.error('Error: User details not found');
        }
      });
    } catch (error) {
      console.error('Error adding reservation:', error);
    }
  };

  const handleLoadingComplete = () => {
    setLoading(false);
  };
  
  return (
    <View style={{ flex: 1 }}>
      {/* Search bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10 }}>
        <TextInput
          style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, marginRight: 10 }}
          value={address}
          onChangeText={handleAddressChange}
          placeholder="Enter address"
        />
        <TouchableOpacity onPress={handleSearch} style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5 }}>
          <Text style={{ color: 'white' }}>Search</Text>
        </TouchableOpacity>
      </View>
      
      {/* MapView */}
      <CurrentLocation setUserLocation={setUserLocation} />
      {loading && !userLocation ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          {userLocation && (
           <TouchableOpacity style={{ flex: 1 }} onPress={handleMapPress} activeOpacity={1}  >
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onLayout={handleLoadingComplete} // Call handleLoadingComplete when MapView layout is complete
            >
              {renderMarkers()}
            </MapView>
           </TouchableOpacity>
          )}
          
          {/* ListingDetailsBox */}
            {showListingDetails && selectedListing && (
              <ListingDetailsBox listing={selectedListing} onRequestBooking={handleBookingRequest}   userLocation={userLocation} />
            )}

          {/* <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Listings:</Text>
            <FlatList
              data={listings}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 10 }}>
                  <Text>{item.make} {item.model} - {item.price}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View> */}
        </>
      )}

      {/* <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}>
        <Button title="My Reservations" onPress={() => navigation.navigate(ReservationsScreen)} />
      </View> */}
    </View>
  );
};



export default SearchScreen;
