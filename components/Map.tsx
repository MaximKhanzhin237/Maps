import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useDatabase } from '../app/contexts/DatabaseContext';
const { width, height } = Dimensions.get('window');


export default function Map() {
  const router = useRouter();
  const db = useDatabase();

   if (!db || db.isLoading) {
      return <Text>Загрузка...</Text>;
    }
  
    if (db.error) {
      return <Text>Ошибка: {db.error.message}</Text>;
    }

  const handleLongPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
      await db.addMarker(coordinate.latitude, coordinate.longitude); 
      await db.loadMarkers();
  };

  const handleMarkerPress = (markerId: number) => {
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
          {db.markers.map((marker) => (
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
