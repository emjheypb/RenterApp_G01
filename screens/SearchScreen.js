import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getAllListings } from '../controllers/ListingsDB';
import { CurrentLocation } from '../controllers/LocationManager';
import { getUser } from '../controllers/UsersDB';
import { auth, db } from "../config/FirebaseApp";
import { collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";

const LISTING_COLLECTION = "Listing";


const SearchScreen = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch vehicles data
    // fetchListingsData();
    const fetchListings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, LISTING_COLLECTION));
        const fetchedListings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setListings(fetchedListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
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

  // const renderMarkers = () => {
  //   console.log('Listings:', listings); // Log the listings array
  //   return listings.map((listing, index) => (
  //     <Marker
  //       key={index}
  //       coordinate={{ latitude: listing.latitude, longitude: listing.longitude }}
  //       title={<Text>{listing.price.toString()}</Text>}
  //       onPress={() => handleMarkerPress(listing.id)}
  //     />
  //   ));
  // };

  // const renderMarkers = () => {
  //   // Stringify the listings array
  //   const listingsString = stringify(listings);  
  //   // Parse the stringified listings back to an array
  //   const listingsArray = JSON.parse(listingsString);

  //   console.log('Listings:', listingsString); // Log the stringified listings array
  //   console.log('Listings:', listingsArray); // Log the stringified listings array

  
  //   return listingsArray.map((listing) => (
  //     <Marker
  //       key={listing.id}
  //       coordinate={{ latitude: listing.latitude, longitude: listing.longitude }}
  //       title={<Text>{listing.price}</Text>}
  //       onPress={() => handleMarkerPress(listing.id)}
  //     />
  //   ));
  // };
  
  const renderMarkers = () => {
    console.log('Listings:', listings); // Log the listings array
  
    // Check if listings is an array
    if (!Array.isArray(listings)) {
      console.error('Listings data is not an array.');
      return null;
    }
  
    return listings.map((listing) => (
      <Marker
        key={listing.id}
        coordinate={{ latitude: listing.latitude, longitude: listing.longitude }}
        title={listing.price.toString()} // Ensure title is a string
        onPress={() => handleMarkerPress(listing.id)}
      />
    ));
  };
  
  const handleMarkerPress = (listingID) => {
    // Code to handle marker press, show summary of selected vehicle
    // Example: navigation.navigate('VehicleDetails', { vehicle });
    // try {
    //   // Fetch listing details using the ID
    //   const listingDetails = await fetchListingDetails(listingId);
    //   // Show ListingSummary component with listing details
    //   setShowListingSummary(true);
    //   setListingDetails(listingDetails);
    // } catch (error) {
    //   console.error("Error fetching listing details:", error);
    // }
  };
  

  return (
    <View style={{ flex: 1 }}>
      <CurrentLocation setUserLocation={setUserLocation} />
      {userLocation && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
         {renderMarkers()}
        </MapView>
      )}

      <View style={{ padding: 10 }}>
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
      </View>

      <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}>
        <Button title="My Reservations" onPress={() => navigation.navigate('Reservations')} />
      </View>
    </View>
  );
};

export default SearchScreen;
