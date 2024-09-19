import { getPool } from '../../db/getPool.js';

export const selectUserByUsernameModel = async (username) => {
  const pool = await getPool();

  // Obtener el usuario con ese username.
  const [user] = await pool.query(`SELECT * FROM users WHERE username = ?`, [
    username,
  ]);

  // Si no se ha encontrado ningún usuario, lanzar un error.
  /* if (user.length === 0) {
    notFoundError('usuario');
  } */

  // El array de usuarios solo podrá contener un único usuario dado que el username no puede repetirse. Retornamos al usuario que se encuentra en la posición 0, es decir, retornamos el objeto en lugar de retornar un array con un elemento.
  // Si en la posición 0 no hay nada retornaremos undefined.

  // Devolver el resultado.
  return user[0];
};
