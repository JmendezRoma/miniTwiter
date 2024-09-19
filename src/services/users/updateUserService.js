import {
  selectUserByEmailModel,
  selectUserByIdModel,
  selectUserByUsernameModel,
  updateUserModel,
} from '../../models/users/index.js';
import {
  emailAlreadyRegisteredError,
  usernameAlreadyRegisteredError,
} from '../errorService.js';

export const updateUserService = async (userId, body) => {
  try {
    // Desestructurar la body.
    const { username, email, bio, hobbies } = body;

    // Comprobar si ese username ya existe.
    let existUser = await selectUserByUsernameModel(username);
    console.log(existUser);
    // Si existe, comprobar si es el mismo usuario.
    if (existUser && existUser.id !== userId) {
      usernameAlreadyRegisteredError();
    }
    console.log('No hay usuarios con ese nombre');

    // Comprobar si ese email ya existe.
    existUser = await selectUserByEmailModel(email);
    // Si existe, comprobar si es el mismo usuario.
    if (existUser && existUser.id !== userId) {
      emailAlreadyRegisteredError();
    }

    // Actualizar el usuario en la base de datos.
    await updateUserModel(userId, username, email, bio, hobbies);

    // Obtener el usuario actualizado.
    const user = await selectUserByIdModel(userId);

    // Devolver el usuario actualizado.
    return user;
  } catch (error) {
    console.log('Error al actualizar el usuario', error);
    throw error;
  }
};
