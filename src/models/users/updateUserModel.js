import { getPool } from '../../db/getPool.js';

export const updateUserModel = async (
  userId,
  username,
  email,
  bio,
  hobbies
) => {
  const pool = await getPool();

  // Crear la query.
  let query = `UPDATE users SET username = ?, email = ?`;

  // Crear el array de valores.
  let values = [username, email];

  // SI hay bio, añadirla a la query.
  if (bio) {
    query += `, bio = ?`;
    values.push(bio);
  } else {
    query += `, bio = NULL`;
  }

  // Si hay hobbies, añadirlas a la query.
  if (hobbies) {
    query += `, hobbies = ?`;
    values.push(hobbies);
  } else {
    query += `, hobbies = NULL`;
  }

  // Añadir el where.
  query += ` WHERE id = ?`;

  // Actualizar el usuario con esa id con la información del body.
  const [result] = await pool.query(query, [...values, userId]);

  // Si no se ha actualizado ningún usuario, lanzar un error.
  if (result.affectedRows === 0) {
    const error = new Error('No se ha podido actualizar el usuario');
    error.httpStatus = 500;
    error.code = 'UPDATE_USER_ERROR';
    throw error;
  }

  // Devolver el resultado.
  return result;
};
