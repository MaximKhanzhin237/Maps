
export type NavigationParams = {
   id: string;
};

export interface Marker {
  id: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface MarkerImage {
  id: number;
  marker_id: number;
  uri: string;
  created_at: string;
}

export interface DatabaseContextType {
  isLoading: boolean;
  error: Error | null;
  markers: Marker[];
  loadMarkers: () => Promise<void>;
  addMarker: (lat: number, lon: number) => Promise<number>;
  deleteMarker: (id: number) => Promise<void>;
  addImage: (markerId: number, uri: string) => Promise<void>;
  deleteImage: (id: number) => Promise<void>;
  getMarkerImages: (markerId: number) => Promise<MarkerImage[]> 
}