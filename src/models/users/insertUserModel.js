// Importamos la conexión a la base de datos.
import { getPool } from '../../db/getPool.js';

// Función que realiza una consulta a la base de datos para crear un nuevo usuario.
export const insertUserModel = async (
  id,
  username,
  email,
  password,
  registrationCode
) => {
  // Crear un pool de conexiones.
  const pool = await getPool();

  // Insertamos el usuario en la base de datos.
  const [result] = await pool.query(
    `INSERT INTO users (id, username, email, password, registrationCode) VALUES (?, ?, ?, ?, ?)`,
    [id, username, email, password, registrationCode]
  );

  // Verificar si el insert afectó a alguna línea.
  if (result.affectedRows === 0) {
    const error = new Error('No se ha podido insertar el usuario.');
    error.code = 'INSERT_USER_ERROR';
    throw error;
  }
};
