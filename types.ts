export interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  images: ImageData[];
}

export interface ImageData {
  uri: string
}

export type NavigationParams = {
   id: string;
};
