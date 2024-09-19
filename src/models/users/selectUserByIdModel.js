import { getPool } from '../../db/getPool.js';

export const selectUserByIdModel = async (userId) => {
  const pool = await getPool();

  // Comprobar si existe un usuario con el id proporcionado.
  const [users] = await pool.query(`SELECT * FROM users WHERE id = ?`, [
    userId,
  ]);

  // Si no se encuentra el usuario, lanzar un error.
  /* if (users.length === 0) {
    notFoundError('usuario');
  } */

  // El array de usuarios solo podrá contener un único usuario dado que el email
  // no puede repetirse. Retornamos al usuario que se encuentra en la posición 0,
  // es decir, retornamos el objeto en lugar de retornar un array con un elemento.
  return users[0];
};
