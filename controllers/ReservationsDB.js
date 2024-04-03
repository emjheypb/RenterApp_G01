import { auth, db } from "../config/FirebaseApp";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const BOOKINGS_COLLECTION = "Booking";

export const getReservationsForUser = (_callback) => {
  // Create a query to filter reservations for the current user
  const reservationsQuery = query(
    collection(db, BOOKINGS_COLLECTION),
    where("renterID", "==", auth.currentUser.email)
  );

  // Subscribe to real-time updates using onSnapshot
  const unsubscribe = onSnapshot(reservationsQuery, (querySnapshot) => {
    try {
      const reservations = [];
      querySnapshot.forEach((doc) => {
        // Construct the reservation object and push it into the reservations array
        reservations.push({ id: doc.id, ...doc.data() });
      });
      // Invoke the callback function with the reservations data
      _callback(reservations, null);
    } catch (err) {
      // Handle any errors that occur during data processing
      console.log("Error processing reservations data:", err);
      _callback(null, err);
    }
  });

  // Return the unsubscribe function
  return unsubscribe;
};

// export const getReservationsForUser = async (_callback) => {
//   try {
//     const querySnapshot = await getDocs(collection(db, BOOKINGS_COLLECTION));
//     const reservations = [];
//     querySnapshot.forEach((doc) => {
//       // if (doc.data().userId === auth.currentUser.uid) {
//         if (doc.data().renterID === auth.currentUser.email) {
//         // Filter reservations for the current user
//         reservations.push({ id: doc.id, ...doc.data() });
//       }
//     });
//     _callback(reservations, null);
//   } catch (err) {
//     console.log("getReservationsForUser", err);
//     _callback(null, err);
//   }
// };

export const addReservation = async (reservationData) => {
  try {
    // Add a new document with reservationData to the "bookings" collection
    const docRef = await addDoc(
      collection(db, BOOKINGS_COLLECTION),
      reservationData
    );
    console.log("Reservation added with ID: ", docRef.id);
    return docRef.id; // Return the ID of the newly added reservation
  } catch (error) {
    console.error("Error adding reservation: ", error);
    throw error; // Throw the error for handling in the caller function
  }
};

export const deleteReservation = async (reservationId, _callback) => {
  try {
    await deleteDoc(doc(db, BOOKINGS_COLLECTION, reservationId));
    console.log("Reservation deleted successfully:", reservationId);
    if (_callback) _callback(null); // Call the callback function if provided, passing null for success
  } catch (err) {
    console.error("Error deleting reservation:", err);
    if (_callback) _callback(err); // Call the callback function if provided, passing the error object
  }
};

export const editReservationForUser = async (
  reservationId,
  updatedReservation,
  _callback
) => {
  try {
    await updateDoc(
      doc(db, BOOKINGS_COLLECTION, reservationId),
      updatedReservation
    );
    console.log("editReservationForUser", reservationId);
    _callback(null);
  } catch (err) {
    console.log("editReservationForUser", err);
    _callback(err);
  }
};
