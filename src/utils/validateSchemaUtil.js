export const validateSchemaUtil = async (schema, body) => {
  try {
    // Validar el cuerpo con el esquema.
    await schema.validateAsync(body);
  } catch (error) {
    error.httpStatus = 400; // Bad Request
    error.code = 'MISSING_FIELDS';
    throw error;
  }
};
