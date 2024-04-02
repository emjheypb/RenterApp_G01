import { auth, db } from "../config/FirebaseApp";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

const BOOKINGS_COLLECTION = "bookings";

export const getReservationsForUser = async (_callback) => {
  try {
    const querySnapshot = await getDocs(collection(db, BOOKINGS_COLLECTION));
    const reservations = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().userId === auth.currentUser.uid) {
        // Filter reservations for the current user
        reservations.push({ id: doc.id, ...doc.data() });
      }
    });
    _callback(reservations, null);
  } catch (err) {
    console.log("getReservationsForUser", err);
    _callback(null, err);
  }
};

export const addReservationForUser = async (reservation, _callback) => {
  try {
    const addedReservation = await addDoc(collection(db, BOOKINGS_COLLECTION), reservation);
    console.log("addReservationForUser", addedReservation.id);
    _callback(null);
  } catch (err) {
    console.log("addReservationForUser", err);
    _callback(err);
  }
};

export const deleteReservationForUser = async (reservationId, _callback) => {
  try {
    await deleteDoc(doc(db, BOOKINGS_COLLECTION, reservationId));
    console.log("deleteReservationForUser", reservationId);
    _callback(null);
  } catch (err) {
    console.log("deleteReservationForUser", err);
    _callback(err);
  }
};

export const editReservationForUser = async (reservationId, updatedReservation, _callback) => {
  try {
    await updateDoc(doc(db, BOOKINGS_COLLECTION, reservationId), updatedReservation);
    console.log("editReservationForUser", reservationId);
    _callback(null);
  } catch (err) {
    console.log("editReservationForUser", err);
    _callback(err);
  }
};
