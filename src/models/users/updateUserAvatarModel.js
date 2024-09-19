import { getPool } from '../../db/getPool.js';

export const updateUserAvatarModel = async (userId, avatarName) => {
  const pool = await getPool();

  const [result] = await pool.query(
    `UPDATE users SET avatar = ? WHERE id = ?`,
    [avatarName, userId]
  );

  if (result.affectedRows === 0) {
    const error = new Error('No se ha podido actualizar el avatar');
    error.httpStatus = 500;
    error.code = 'UPDATE_USER_AVATAR_ERROR';
    throw error;
  }

  return result;
};
