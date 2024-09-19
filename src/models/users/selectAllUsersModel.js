import { getPool } from '../../db/getPool.js';

export const selectAllUsersModel = async () => {
  const pool = await getPool();

  // Obtener todos los usuarios. No coger información sensible como la contraseña...
  const [users] = await pool.query(
    `SELECT id, username, avatar, role, active, createdAt, updatedAt FROM users`
  );

  console.log(users);

  // Devolver el resultado.

  return users;
};
