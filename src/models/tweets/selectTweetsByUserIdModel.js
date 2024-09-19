import { getPool } from '../../db/getPool.js';

export const selectTweetsByUserIdModel = async (id) => {
  try {
    // Crear la conexión a la base de datos.
    const pool = await getPool();

    // Obtener los tweets.
    const [tweets] = await pool.query(
      `SELECT * FROM tweets WHERE userId = ? ORDER BY createdAt DESC`,
      [id]
    );

    // Devolver los tweets.
    return tweets;
  } catch (error) {
    console.log('Error al obtener los tweets', error);
    throw error;
  }
};
