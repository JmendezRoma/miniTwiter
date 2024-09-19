// Importamos las dependencias.
import nodemailer from 'nodemailer';

// Importamos los errores.
import { sendEmailError } from '../services/errorService.js';

// Obtenemos las variables de entorno necesarias.
import { SMTP_SERVICE, SMTP_PORT, SMTP_USER, SMTP_PASS } from '../../env.js';

// Creamos un transporter.
const transporter = nodemailer.createTransport({
  host: SMTP_SERVICE,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Función que envía un email.
export const sendEmailUtil = async (to, subject, text) => {
  try {
    console.log('Enviando email 📧');
    await transporter.sendMail({
      from: SMTP_USER,
      to,
      subject,
      text,
    });
    console.log('Email enviado ✅ 📧');
  } catch (error) {
    console.error(error);
    sendEmailError();
  }
};
