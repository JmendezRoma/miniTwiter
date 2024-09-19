import { getPool } from '../../db/getPool.js';

export const selectTweetsModel = async () => {
  try {
    // Crear la conexión a la base de datos.
    const pool = await getPool();

    // Obtener los tweets.
    const [tweets] = await pool.query(
      `SELECT T.*, U.username FROM tweets T LEFT JOIN users U ON T.userId = U.id ORDER BY createdAt DESC`
    );

    // Devolver los tweets.
    return tweets;
  } catch (error) {
    console.log('Error al obtener los tweets', error);
    throw error;
  }
};
