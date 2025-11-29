import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Map from '../components/Map';
import { useDatabase } from './contexts/DatabaseContext';
export default function Index() {
  const db = useDatabase();

  if (!db || db.isLoading) {
    return <Text>Загрузка...</Text>;
  }

  if (db.error) {
    return <Text>Ошибка: {db.error.message}</Text>;
  }

    return (
        <View style={styles.container}>
            <Map/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});