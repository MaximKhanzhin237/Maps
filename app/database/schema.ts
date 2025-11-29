
import * as SQLite from 'expo-sqlite';

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  const db = await SQLite.openDatabaseAsync('markers.db');
    try{
      db.execAsync(
        `CREATE TABLE IF NOT EXISTS markers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );
    } catch(err) {
      console.error('Ошибка создания таблицы markers:', err);
    }
    try{
      db.execAsync(
        `CREATE TABLE IF NOT EXISTS marker_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          marker_id INTEGER NOT NULL,
          uri TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (marker_id) REFERENCES markers(id) ON DELETE CASCADE
        );`
      );
    }
    catch(err) {
      console.error('Ошибка создания таблицы marker_images:', err);
    }
    return db;
};