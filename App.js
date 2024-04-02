import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from './screens/SearchScreen';
import ReservationsScreen from './screens/ReservationsScreen';
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

const App = () => {
  return (
    <NavigationContainer theme={MyTheme}>
        <Stack.Navigator>
        {/* <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReservationsScreen"
          component={ReservationsScreen}
          options={{ headerShown: false }}
        /> */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          /> 
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
