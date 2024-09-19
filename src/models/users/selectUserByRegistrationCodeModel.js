import { getPool } from '../../db/getPool.js';
import {
  notFoundError,
  userAlreadyActivatedError,
} from '../../services/errorService.js';

export const selectUserByRegistrationCodeModel = async (registrationCode) => {
  // Crear un pool de conexiones.
  const pool = await getPool();

  // Buscar el usuario en la base de datos.
  const [users] = await pool.query(
    `SELECT id, active FROM users WHERE registrationCode = ?`,
    [registrationCode]
  );

  // Si no se encuentra el usuario, lanzar un error.
  if (users.length === 0) {
    notFoundError('usuario');
  }

  // Si existe el usuario, comprobar si está activo.
  if (users[0].active) {
    userAlreadyActivatedError();
  }

  // Devolver el usuario.
  return users[0];
};
