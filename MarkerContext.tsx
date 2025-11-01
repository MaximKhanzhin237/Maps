import React, { createContext, ReactNode, useContext, useState } from 'react';
import { MarkerData } from './types';

interface MarkerContextProps {
  markers: MarkerData[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerData[]>>;
  getMarkerById: (id: string) => MarkerData | undefined;
  updateMarker: (updatedMarker: MarkerData) => void;
}

const MarkerContext = createContext<MarkerContextProps | undefined>(undefined);

interface MarkerProviderProps {
  children: ReactNode;
}

export const MarkerProvider: React.FC<MarkerProviderProps> = ({ children }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const getMarkerById = (id: string): MarkerData | undefined => {
    return markers.find((marker) => marker.id === id);
  };

  const updateMarker = (updatedMarker: MarkerData) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) => (marker.id === updatedMarker.id ? updatedMarker : marker))
    );
  };

  return (
    <MarkerContext.Provider value={{ markers, setMarkers, getMarkerById, updateMarker }}>
      {children}
    </MarkerContext.Provider>
  );
};

export const useMarkers = (): MarkerContextProps => {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error("useMarkers должен использоваться внутри MarkerProvider");
  }
  return context;
};
