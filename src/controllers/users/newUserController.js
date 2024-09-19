// Importamos el esquema.
import { validateSchemaUtil } from '../../utils/validateSchemaUtil.js';
import { newUserSchema } from '../../schemas/users/newUserSchema.js';

// Importamos los servicios.
import { insertUserService } from '../../services/users/insertUserService.js';

export const newUserController = async (req, res, next) => {
  try {
    // Obtener el cuerpo de la petición.
    const { username, email, password } = req.body;

    // Validar el body con el esquema newUserSchema.
    await validateSchemaUtil(newUserSchema, req.body);

    // Crear una uuid para el codigo de registro.
    const registrationCode = crypto.randomUUID();

    // Insertar el usuario en la base de datos.
    await insertUserService(username, email, password, registrationCode);

    // Responder al cliente.
    res.status(201).send({
      status: 'ok',
      message: 'Usuario creado, revisa tu email para activarlo',
      data: { registrationCode },
    });
  } catch (error) {
    next(error);
  }
};
