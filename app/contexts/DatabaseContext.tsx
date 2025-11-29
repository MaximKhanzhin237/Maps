// contexts/DatabaseContext.tsx
import * as SQLite from 'expo-sqlite';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DatabaseContextType, Marker, MarkerImage } from '../../types';
import { initDatabase } from '../database/schema';

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    initDatabase()
      .then(database => {
        setDb(database);
      })
      .catch(err => {
        console.error('Ошибка инициализации базы данных:', err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const loadMarkers = async () => {
    try {
      const data = await getMarkers();
      setMarkers(data);
    } catch (err) {
      setError(err as Error);
    }
  };


  const addMarker = async (latitude: number, longitude: number): Promise<number> => {
    if (!db) throw new Error('База данных не инициализирована');
    try{
        const result = await db.runAsync(
          'INSERT INTO markers (latitude, longitude) VALUES (?, ?);',
          [latitude, longitude],
        );
        return result.lastInsertRowId;
      }
    catch(err) {
      console.log('Ошибка при добавлении маркера ', err);
      throw err;
    }
  };

  const deleteMarker = async (id: number): Promise<void> => {

    if (!db) throw new Error('База данных не инициализирована');
    try{
        await db.runAsync(
          'DELETE FROM markers WHERE id = ?;',
          [id],
        );
      }
    catch(err) {
      console.log('Ошибка при удалении маркера ', err);
      throw err;
    }
  };

  const getMarkers = async (): Promise<Marker[]> => {
    if (!db) throw new Error('База данных не инициализирована');
    try{
        const result = await db.getAllAsync<Marker>(
          'SELECT * FROM markers;',
          [],
        );
        return result;
      }
    catch(err) {
      console.log('Ошибка при получении маркеров ', err);
      throw err;
    }
    
  };

  const addImage = async (markerId: number, uri: string): Promise<void> => {
    if (!db) throw new Error('База данных не инициализирована');
    try{
        await db.runAsync(
          'INSERT INTO marker_images (marker_id, uri) VALUES (?, ?);',
          [markerId, uri],
        );
      }
    catch(err) {
      console.log('Ошибка при добавлении изображения', err);
      throw err;
    }
  };

  const deleteImage = async (id: number): Promise<void> => {
    if (!db) throw new Error('База данных не инициализирована');
    try{
        await db.runAsync(
          'DELETE FROM marker_images WHERE id = ?;',
          [id],
        );
      }
    catch(err) {
      console.log('Ошибка при удалении изображения', err);
      throw err;
    }
  };

  const getMarkerImages = async (markerId: number): Promise<MarkerImage[]> => {
     if (!db) throw new Error('База данных не инициализирована');
    try{
        const result = await db.getAllAsync<MarkerImage>(
          'SELECT * FROM marker_images WHERE marker_id = ?;',
          [markerId],
        );
        return result;
      }
    catch(err) {
      console.log('Ошибка при получении изображений маркера', err);
      throw err;
    }
  };

  const value: DatabaseContextType = {
    addMarker,
    deleteMarker,
    loadMarkers,
    addImage,
    deleteImage,
    getMarkerImages,
    isLoading,
    error,
    markers
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};