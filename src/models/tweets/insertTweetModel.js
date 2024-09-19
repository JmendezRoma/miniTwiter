import { getPool } from '../../db/getPool.js';

export const insertTweetModel = async (id, userId, text, image) => {
  try {
    // Crear el pool de conexiones.
    const pool = await getPool();

    // Crear la query base.
    let query = `INSERT INTO tweets (id, userId, text) VALUES (?, ?, ?)`;

    // Crear los valores para la query.
    let values = [id, userId, text];

    // Si hay imagen, añadimos la imagen a la query.
    if (image) {
      query = `INSERT INTO tweets (id, userId, text, image) VALUES (?, ?, ?, ?)`;
      values.push(image);
    }

    // Insertamos el tweet en la base de datos.
    const [result] = await pool.query(query, values);

    // Verificar si el insert afectó a alguna línea.
    if (result.affectedRows === 0) {
      const error = new Error('No se ha podido insertar el tweet.');
      error.code = 'INSERT_TWEET_ERROR';
      throw error;
    }

    // Buscar el tweet insertado.
    const [tweet] = await pool.query(`SELECT * FROM tweets WHERE id = ?`, [id]);

    // Devolver el tweet.
    return tweet[0];
  } catch (error) {
    console.log('Error al insertar el tweet', error);
    throw error;
  }
};
