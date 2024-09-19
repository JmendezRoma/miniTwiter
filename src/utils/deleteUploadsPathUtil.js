import fs from 'fs/promises';
import path from 'path';
import { UPLOADS_DIR } from '../../env.js';

export async function deleteUploadsPathUtil() {
  const uploadsDir = path.join(process.cwd(), `${UPLOADS_DIR}`);

  try {
    // Comprobar si el directorio de uploads existe
    await fs.access(uploadsDir);

    // Borrar el directorio de uploads y todo su contenido
    await fs.rm(uploadsDir, { recursive: true });
    console.log(
      'Uploads directory and its contents have been deleted successfully.'
    );
  } catch (error) {
    error.code = 'DELETE_UPLOADS_PATH_ERROR';
    error.message = 'No se ha podido eliminar el directorio de uploads';
    throw error;
  }
}
