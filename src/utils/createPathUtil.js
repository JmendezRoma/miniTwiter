// Importamos fs/promises para leer el archivo
import fs from 'fs/promises';

export const createPathIfNotExistsUtil = async (filePath) => {
  try {
    await fs.access(filePath);
    console.log(`La ruta ${filePath} ya existe`);
  } catch (error) {
    try {
      console.log(`La ruta ${filePath} no existe`);
      await fs.mkdir(filePath, { recursive: true });
      console.log(`La ruta ${filePath} ha sido creada`);
    } catch (error) {
      console.error(error);
      error.message = 'No se ha podido crear el directorio';
      throw error;
    }
  }
};
