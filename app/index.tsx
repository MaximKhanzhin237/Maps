import React from 'react';
import { StyleSheet, View } from 'react-native';
import Map from '../components/Map';
import { useMarkers } from '../MarkerContext';

export default function Index() {
    const { markers, setMarkers } = useMarkers();

    return (
        <View style={styles.container}>
            <Map markers={markers} setMarkers={setMarkers} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});