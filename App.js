import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from './screens/SearchScreen';
import ReservationsScreen from './screens/ReservationsScreen';
import { UserContext } from './controllers/UsersDB';
import { auth } from './config/FirebaseApp';

const Stack = createNativeStackNavigator();

const App = () => {
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     setUser(user);
  //   });
  //   return () => unsubscribe();
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SearchScreen">
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReservationsScreen"
          component={ReservationsScreen}
          options={{ headerShown: false }}
        />
          {/* <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          /> 
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
