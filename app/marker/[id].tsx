import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import ImageList from '../../components/ImageList';
import { Marker, MarkerImage, NavigationParams } from '../../types';
import { useDatabase } from '../contexts/DatabaseContext';

export default function MarkerDetails(){
  const { id } = useLocalSearchParams<NavigationParams>();
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const db = useDatabase(); 
  const [marker, setMarker] = useState<Marker| undefined>();
  const [images, setImages] = useState<MarkerImage[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const markerId = Number(id);

   if (!db || db.isLoading) {
    return <Text>Загрузка...</Text>;
  }

  if (db.error) {
    return <Text>Ошибка: {db.error.message}</Text>;
  }

 useEffect(() => {
    const fetchData = async () => {
      try {
        const currentMarker = db.markers.find(m => m.id === markerId);
        setMarker(currentMarker);

        const imgs = await db.getMarkerImages(markerId);
        setImages(imgs);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    (async () => {
        const permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            requestPermission();
        }
    })();
  }, [db, markerId]);

  const handleDeleteMarker = () => {
    Alert.alert(
      'Удалить маркер?',
      'Это действие нельзя отменить.',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.deleteMarker(markerId);
              await db.loadMarkers();
              router.back();
            } catch (err) {
              Alert.alert('Ошибка', 'Не удалось удалить маркер.');
            }
          },
        },
      ]
    );
  };

  const handleAddImage = async () => {
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
          await db.addImage(markerId, result.assets[0].uri);
          const imgs = await db.getMarkerImages(markerId);
          setImages(imgs);
        }
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось добавить изображение.');
    }
  };

  const handleDeleteImage = async (id: number) => {
    try {
      await db.deleteImage(id);
      const imgs = await db.getMarkerImages(markerId);
      setImages(imgs);
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось удалить изображение.');
    }
  };

  if (loading) {
    return <Text>Загрузка...</Text>;
  }

  if (error) {
    return <Text>Ошибка: {error.message}</Text>;
  }

  if (!marker) {
    return <Text>Маркер не найден</Text>;
  }


  return (
    <View style={styles.container}>
      <Text>Данные маркера {id}</Text>
      <Text>Широта: {marker.latitude}</Text>
      <Text>Долгота: {marker.longitude}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Button title="Выберите фото"  onPress={handleAddImage} disabled={!status?.granted} />
      <Button title="Удалить маркер"  onPress={handleDeleteMarker} />
      </View>
      <ImageList images={images} onRemoveImage={handleDeleteImage} />
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
