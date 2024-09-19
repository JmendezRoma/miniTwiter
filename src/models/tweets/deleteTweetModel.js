import { getPool } from '../../db/getPool.js';

export const deleteTweetModel = async (tweetId) => {
  try {
    // Crear la conexión a la base de datos.
    const pool = await getPool();

    // Eliminar el tweet de la base de datos.
    const [result] = await pool.query(`DELETE FROM tweets WHERE id = ?`, [
      tweetId,
    ]);

    // Verificar si el delete afectó a alguna línea.
    if (result.affectedRows === 0) {
      const error = new Error('No se ha podido eliminar el tweet.');
      error.code = 'DELETE_TWEET_ERROR';
      throw error;
    }

    return;
  } catch (error) {
    console.log('Error al eliminar el tweet', error);
    throw error;
  }
};
