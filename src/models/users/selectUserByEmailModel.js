import { getPool } from '../../db/getPool.js';

export const selectUserByEmailModel = async (email) => {
  const pool = await getPool();

  // Obtener el usuario con ese email.
  const [user] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);

  // Si no se ha encontrado ningún usuario, lanzar un error.
  /* if (user.length === 0) {
    notFoundError('usuario');
  } */

  // El array de usuarios solo podrá contener un único usuario dado que el email no puede repetirse. Retornamos al usuario que se encuentra en la posición 0, es decir, retornamos el objeto en lugar de retornar un array con un elemento.
  // Si en la posición 0 no hay nada retornaremos undefined.

  // Devolver el resultado.
  return user[0];
};
