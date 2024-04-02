import React from 'react';
import { View, Text } from 'react-native';
import { Marker } from 'react-native-maps';

export const CustomMarker = ({ markerKey, coordinate, title, onPress }) => (
  <Marker key={markerKey} coordinate={coordinate} onPress={onPress}>
    <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 5 }}>
      <Text>${title}</Text>
    </View>
  </Marker>
);

