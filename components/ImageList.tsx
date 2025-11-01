import React from 'react';
import { Button, FlatList, Image, StyleSheet, View } from 'react-native';
import { ImageData } from '../types';


interface ImageListProps {
  images: ImageData[];
  onRemoveImage: (uri: string) => void;
}

export default function ImageList({ images, onRemoveImage }: ImageListProps) {
  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
      <Button title="Удалить" onPress={() => onRemoveImage(item)} />
    </View>
  );

  return (
    <FlatList
      data={images.map((image) => image.uri)}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      numColumns={2}
    />
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    margin: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  }
});

