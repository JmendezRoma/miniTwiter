import { getPool } from '../../db/getPool.js';

export const updateUserActivationModel = async (registrationCode) => {
  const pool = await getPool();

  // Actualizar el usuario con ese código de registro.
  const [result] = await pool.query(
    `UPDATE users SET active = 1 WHERE registrationCode = ?`,
    [registrationCode]
  );

  // Si no se ha actualizado ningún usuario, lanzar un error. Si llegó aqui el usuario existe asi que el error no es que no lo encontro sino que no se pudo actualizar.
  if (result.affectedRows === 0) {
    const error = new Error('No se ha podido activar el usuario');
    error.httpStatus = 500;
    error.code = 'UPDATE_USER_ACTIVATION_ERROR';
    throw error;
  }

  // Devolver el resultado.
  return result;
};
