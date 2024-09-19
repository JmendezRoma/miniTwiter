// Importar el módulo bcrypt.
import bcrypt from 'bcrypt';

// Importar los modelos.
import {
  insertUserModel,
  selectUserByEmailModel,
  selectUserByUsernameModel,
} from '../../models/users/index.js';

// Importar las utilidades.
import { sendEmailUtil } from '../../utils/sendEmailUtil.js';
import { sendEmailBrevoUtil } from '../../utils/sendEmailBrevoUtil.js';

// Importar los módulos de error.
import {
  emailAlreadyRegisteredError,
  usernameAlreadyRegisteredError,
} from '../errorService.js';

export const insertUserService = async (
  username,
  email,
  password,
  registrationCode
) => {
  try {
    // Buscamos en la base de datos algún usuario con ese nombre.
    let existUser = await selectUserByUsernameModel(username);

    // Si existe un usuario con ese nombre, lanzamos un error.
    if (existUser) {
      usernameAlreadyRegisteredError();
    }
    console.log('No hay usuarios con ese nombre');

    // Buscamos en la base de datos algún usuario con ese email.
    existUser = await selectUserByEmailModel(email);

    // Si existe un usuario con ese email, lanzamos un error.
    if (existUser) {
      emailAlreadyRegisteredError();
    }
    console.log('No hay usuarios con ese email');

    // Hasheamos la contraseña.
    const hashedPass = await bcrypt.hash(password, 10);

    // Creamos una id para el usuario.
    const userId = crypto.randomUUID();

    // Insertamos el usuario en la base de datos.
    await insertUserModel(
      userId,
      username,
      email,
      hashedPass,
      registrationCode
    );

    // Creamos el asunto del email de verificación.
    const emailSubject = 'Activa tu usuario en Mini Twitter :)';

    // Creamos el cuerpo del email de verificación.
    const emailText = `
    ¡Bienvenid@ ${username} a Mini Twitter! 🐦
    Gracias por registrarte en nuestra aplicación. Para activar tu cuenta, haz click en el siguiente enlace:
    <a href="http://localhost:5173/validate/${registrationCode}">Activa tu cuenta</a>
    `;

    // Enviamos el email de verificación.
    // await sendEmailUtil(email, emailSubject, emailText);
    await sendEmailBrevoUtil(email, emailSubject, emailText);
  } catch (error) {
    // Manejar el error aquí.
    console.error('Error al insertar usuario:', error);
    throw error; // Relanzar el error para que el controlador lo maneje.
  }
};
