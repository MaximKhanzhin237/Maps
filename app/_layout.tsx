
import { Stack } from 'expo-router';
import { MarkerProvider } from '../MarkerContext';

export default function RootLayout() {
  return (
    <MarkerProvider>
      <Stack>
        <Stack.Screen name="index" options={{title: "Карта"}}/>
        <Stack.Screen name="marker/[id]" options={{title: "Данные маркера"}}/>
      </Stack>
    </MarkerProvider>
  );
};
