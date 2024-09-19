// Importamos las dependencias.
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Importamos el modelo, el esquema y el validador.
import { selectUserByEmailModel } from '../../models/users/selectUserByEmailModel.js';
import { loginUserSchema } from '../../schemas/users/loginUserSchema.js';
import { validateSchemaUtil } from '../../utils/validateSchemaUtil.js';

// Importamos los modulos de error.
import {
  invalidCredentialsError,
  pendingActivationError,
} from '../../services/errorService.js';

// Importamos la variable de entorno.
import { SECRET } from '../../../env.js';

export const loginUserController = async (req, res, next) => {
  try {
    // Obtener los datos del body.
    const { email, password } = req.body;

    // Validamos los datos con Joi.
    await validateSchemaUtil(loginUserSchema, req.body);

    // Selección del usuario por email.
    const user = await selectUserByEmailModel(email);

    // Variable que almacenará un valor booleano indicando si la contraseña es correcto o no.
    let validPass;

    // Si el usuario existe, comprobar si la contraseña es correcta.
    if (user) {
      validPass = await bcrypt.compare(password, user.password);
    }

    // Si el usuario no existe o la contraseña no es correcta, lanzar un error.
    if (!user || !validPass) {
      invalidCredentialsError();
    }

    // Si el usuario no está activo, lanzar un error.
    if (!user.active) {
      pendingActivationError();
    }

    // Objeto con la información del usuario que se enviará en el token.
    const tokenInfo = {
      id: user.id,
      role: user.role,
    };

    // Crear el token.
    const token = jwt.sign(tokenInfo, SECRET, {
      expiresIn: '1d',
    });

    // Enviar la respuesta.
    res.status(200).send({
      status: 'ok',
      message: 'Usuario logueado correctamente',
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
