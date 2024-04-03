import { auth, db } from "../config/FirebaseApp";
import { collection, getDocs, addDoc, doc, setDo, onSnapshot } from "firebase/firestore";

const LISTING_COLLECTION = "Listing";
const USERS_COLLECTION = "Users";


// export const getAllListings = async (_callback) => {
//   try {
//     const querySnapshot = await getDocs(collection(db, LISTING_COLLECTION));
//     const listings = [];
//     querySnapshot.forEach((doc) => {
//       // Convert Firestore document to JavaScript object and add it to the listings array
//       listings.push({ id: doc.id, ...doc.data() });
//     });
//     _callback(listings, null);
//   } catch (err) {
//     console.log("getAllListings", err);
//     _callback(null, err);
//   }
// };

// export const getAllListings = async (_callback) => {
//   try {
//     const querySnapshot = await getDocs(collection(db, LISTING_COLLECTION));
//     const listings = [];
//     querySnapshot.forEach((doc) => {
//       const data = doc.data();
//       // Extract the data from the document and push it into the listings array
//       listings.push({
//         id: doc.id,
//         electricRange: data.electricRange,
//         formFactor: data.formFactor,
//         image: data.image,
//         latitude: data.latitude,
//         licensePlate: data.licensePlate,
//         location: data.location,
//         longitude: data.longitude,
//         make: data.make,
//         model: data.model,
//         ownerEmail: data.ownerEmail,
//         ownerImage: data.ownerImage,
//         ownerName: data.ownerName,
//         price: data.price,
//         seatCapacity: data.seatCapacity,
//         status: data.status,
//         trim: data.trim,
//       });
//     });
//     _callback(listings, null);
//   } catch (err) {
//     console.log("getAllListings", err);
//     _callback(null, err);
//   }
// };

export const getAllListings = (_callback) => {
  try {
    const unsubscribe = onSnapshot(collection(db, LISTING_COLLECTION), (querySnapshot) => {
      const listings = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Extract the data from the document and push it into the listings array
        listings.push({
          id: doc.id,
          electricRange: data.electricRange,
          formFactor: data.formFactor,
          image: data.image,
          latitude: data.latitude,
          licensePlate: data.licensePlate,
          location: data.location,
          longitude: data.longitude,
          make: data.make,
          model: data.model,
          ownerEmail: data.ownerEmail,
          ownerImage: data.ownerImage,
          ownerName: data.ownerName,
          price: data.price,
          seatCapacity: data.seatCapacity,
          status: data.status,
          trim: data.trim,
        });
      });
      _callback(listings, null);
    });
    // Return the unsubscribe function in case it's needed
    return unsubscribe;
  } catch (err) {
    console.log("getAllListings", err);
    _callback(null, err);
  }
};

export const addListing = async (listing, _callback) => {
  try {
    const miniListing = {
      make: listing.make,
      model: listing.model,
      trim: listing.trim,
      location: listing.location,
      price: listing.price,
      licensePlate: listing.licensePlate,
      status: 1,
    };

    const addedListing = await addDoc(
      collection(db, LISTING_COLLECTION),
      listing
    );

    await setDoc(
      doc(
        db,
        USERS_COLLECTION,
        auth.currentUser.email,
        LISTING_COLLECTION,
        addedListing.id
      ),
      miniListing
    );

    console.log("addListing", addedListing.id);
    _callback(null);
  } catch (err) {
    console.log("addListing", err);
    _callback(err);
  }
};
