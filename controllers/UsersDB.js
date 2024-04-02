import { createContext, useState } from "react";
import { auth, db } from "../config/FirebaseApp";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const USERS_COLLECTION = "Users";

/*export const UserContext = createContext();

export const UserProvider = (props) => {
  const [currUser, setCurrUser] = useState(null);
  return (
    <UserContext.Provider value={{ currUser, setCurrUser }}>
      {props.children}
    </UserContext.Provider>
  );
};*/

export const getUser = async (username, password, _callback) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      username,
      password
    );
    try {
      const docRef = doc(db, USERS_COLLECTION, username);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("getUser", "Document data:", docSnap.data());
        _callback(docSnap.data());
      } else {
        console.log("getUser", "No such document!");
      }
    } catch (err) {
      console.log("getUser", err);
    }
    _callback(auth.currentUser);
  } catch (err) {
    _callback(null);
    console.log("getUser", err);
  }
};

export const getUserDetails = async (username, _callback) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, username);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("getUser", "Document data:", docSnap.data());
      _callback(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("getUserDetails", "No such document!");
      _callback(null);
    }
  } catch (err) {
    console.log("getUserDetails", err);
    _callback(null);
  }
};

export const logOutUser = async () => {
  try {
    // 1. check if a user is currently logged in
    if (auth.currentUser === null) {
      console.log("logOutUser", "Sorry, no user is logged in.")
    }
    else {
      await signOut(auth)
      console.log("logOutUser", "Logout complete!")
    }
  } catch (err) {
    console.log(err)
  }
}

export const addUsers = async () => {
  const users = [
    {
      id: "owner@one.com",
      data: {
        name: "Uno O. Primis",
        type: "owner",
        image:
          "https://firebasestorage.googleapis.com/v0/b/rent-an-ev-2fd04.appspot.com/o/Driver.jpg?alt=media&token=a28efc40-c514-46b8-ae86-9728a1935567",
      },
    },
    {
      id: "owner@two.com",
      data: {
        name: "Deux O. Secondo",
        type: "owner",
        image:
          "https://firebasestorage.googleapis.com/v0/b/rent-an-ev-2fd04.appspot.com/o/Driver.jpg?alt=media&token=a28efc40-c514-46b8-ae86-9728a1935567",
      },
    },
    {
      id: "renter@one.com",
      data: {
        name: "Ichi R. Yi",
        type: "renter",
        image:
          "https://firebasestorage.googleapis.com/v0/b/rent-an-ev-2fd04.appspot.com/o/Driver.jpg?alt=media&token=a28efc40-c514-46b8-ae86-9728a1935567",
      },
    },
    {
      id: "renter@two.com",
      data: {
        name: "Zwei R. Doosara",
        type: "renter",
        image:
          "https://firebasestorage.googleapis.com/v0/b/rent-an-ev-2fd04.appspot.com/o/Driver.jpg?alt=media&token=a28efc40-c514-46b8-ae86-9728a1935567",
      },
    },
  ];

  try {
    for (const user of users) {
      console.log("addUsers", user);
      const addedUser = await setDoc(
        doc(db, USERS_COLLECTION, user.id),
        user.data
      );
      console.log("addUsers", addedUser);
    }
  } catch (err) {
    console.log("addUsers", err);
  }
};
