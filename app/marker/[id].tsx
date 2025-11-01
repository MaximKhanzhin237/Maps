import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import ImageList from '../../components/ImageList';
import { useMarkers } from '../../MarkerContext';
import { MarkerData, NavigationParams } from '../../types';

export default function MarkerDetails(){
  const { id } = useLocalSearchParams<NavigationParams>();
  const [marker, setMarker] = useState<MarkerData | undefined>(undefined);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const { getMarkerById, updateMarker } = useMarkers(); 

  useEffect(() => {
    if (id) {
      const foundMarker = getMarkerById(id as string);
      setMarker(foundMarker);
    }

    (async () => {
        const permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            requestPermission();
        }
    })();

  }, [id, getMarkerById, requestPermission]);

  const addImage = async () => {
    if (!status?.granted) {
        Alert.alert("Необходимо получить доступ к галерее телефона.");
        return;
    }

    try {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setMarker((prevMarker) => {  
                if (prevMarker) {
                    const updatedMarker: MarkerData = { ...prevMarker, images: [...prevMarker.images, {uri: result.assets[0].uri}] };
                    updateMarker(updatedMarker); 
                    return updatedMarker;
                }
                return prevMarker;
            });
        }
    } catch (err: any) {
        console.error("Error picking image:", err);
        Alert.alert("Image Picker Error", err.message || "Failed to pick image.");
    }
  };

  const removeImage = (uri: string) => {
    setMarker((prevMarker) => {
      if (prevMarker) {
        const updatedMarker: MarkerData = {  ...prevMarker,
          images: prevMarker.images.filter((image) => image.uri !== uri),
        };
        updateMarker(updatedMarker);
        return updatedMarker;
      }
        return prevMarker;
    });
  };

  if (!marker) {
    return <Text>Loading...</Text>;
  }


  return (
    <View style={styles.container}>
      <Text>Данные маркера {id}</Text>
      <Text>Широта: {marker.latitude}</Text>
      <Text>Долгота: {marker.longitude}</Text>
      <Button title="Выберите фото"  onPress={addImage} disabled={!status?.granted} />

      <ImageList images={marker.images} onRemoveImage={removeImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  map: {
    width: '100%',
    height: 200,
  },
  imageContainer: {
    margin: 10,
    alignItems: 'center',
  },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
});
