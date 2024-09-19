import fs from 'fs/promises';
import path from 'path';
import { UPLOADS_DIR } from '../../env.js';

export const createUploadsPathUtil = async () => {
  const rootDir = process.cwd();
  const uploadsDir = path.join(rootDir, `${UPLOADS_DIR}`);
  const usersDir = path.join(uploadsDir, 'users');
  const tweetsDir = path.join(uploadsDir, 'tweets');

  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    console.log('Directorio uploads creado correctamente.');
    await fs.mkdir(usersDir, { recursive: true });
    console.log('Directorio users creado correctamente.');
    await fs.mkdir(tweetsDir, { recursive: true });
    console.log('Directorio tweets creado correctamente.');

    console.log('Uploads directory structure created successfully.');
  } catch (error) {
    error.code = 'CREATE_UPLOADS_STRUCTURE_PATH_ERROR';
    error.message =
      'No se ha podido crear la estructura de directorios de uploads';
    throw error;
  }
};
