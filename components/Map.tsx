import { useRouter } from 'expo-router';
import { Guid } from "guid-typescript";
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MarkerData } from '../types';

const { width, height } = Dimensions.get('window');

interface MapProps {
  markers: MarkerData[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerData[]>>;
}

export default function Map({ markers, setMarkers }: MapProps) {
  const router = useRouter();

  const handleLongPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    const newMarker: MarkerData = {
      id: String(Guid.create()),
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      images: [],
    };
    setMarkers([...markers, newMarker]);
  };

  const handleMarkerPress = (markerId: string) => {
    router.push(`/marker/${markerId}`);
  };

  const initialRegion = {
      latitude: 58.0105,
      longitude: 56.2502,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };


  return (
    <View style={styles.container}>
      {initialRegion && (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          onLongPress={handleLongPress}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={"Маркер " + marker.id}
              description="Нажмие для просмотра данных"
              onPress={() => handleMarkerPress(marker.id)}
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
});
