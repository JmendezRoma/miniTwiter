import { getPool } from '../../db/getPool.js';

export const selectTweetByIdModel = async (tweetId) => {
  try {
    // Crear la conexión a la base de datos.
    const pool = await getPool();

    // Obtener el tweet.
    const [tweet] = await pool.query(`SELECT * FROM tweets WHERE id = ?`, [
      tweetId,
    ]);

    // Devolver el tweet.
    return tweet[0];
  } catch (error) {
    console.log('Error al obtener el tweet por id', error);
    throw error;
  }
};
