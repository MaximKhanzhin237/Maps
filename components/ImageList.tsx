import React from 'react';
import { Button, FlatList, Image, StyleSheet, View } from 'react-native';
import { MarkerImage } from '../types';


interface ImageListProps {
  images: MarkerImage[] | undefined;
  onRemoveImage: (id: number) => void;
}

export default function ImageList({ images, onRemoveImage }: ImageListProps) {
  const renderItem = ({ item }: { item: MarkerImage }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      <Button title="Удалить" onPress={() => onRemoveImage(item.id)} />
    </View>
  );

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
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

