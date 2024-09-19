import { getPool } from '../../db/getPool.js';

export const updateTweetModel = async (id, text, image) => {
  try {
    // Crear la conexión a la base de datos.
    const pool = await getPool();

    // Crear la query base.
    let query = `UPDATE tweets SET text = ?`;

    // Crear los valores para la query.
    let values = [text];

    // Si hay imagen, añadimos la imagen a la query.
    if (image) {
      query += `, image = ?`;
      values.push(image);
    }

    // Añadir el where al final de la query y el id a los valores.
    query += ` WHERE id = ?`;
    values.push(id);

    // Actualizar el tweet en la base de datos.
    const [result] = await pool.query(query, values);

    // Verificar si el update afectó a alguna línea.
    if (result.affectedRows === 0) {
      const error = new Error('No se ha podido actualizar el tweet.');
      error.code = 'UPDATE_TWEET_ERROR';
      throw error;
    }

    // Buscar el tweet actualizado.
    const [tweet] = await pool.query(`SELECT * FROM tweets WHERE id = ?`, id);

    // Devolver el tweet.
    return tweet[0];
  } catch (error) {
    console.log('Error al actualizar el tweet', error);
    throw error;
  }
};
