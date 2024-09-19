import brevo from '@getbrevo/brevo';

import { sendEmailError } from '../services/errorService.js';
import { SMTP_USER, SMTP_API_KEY } from '../../env.js';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, SMTP_API_KEY);
export const sendEmailBrevoUtil = async (to, subject, text) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.to = [{ email: to }];

    sendSmtpEmail.htmlContent = text;
    sendSmtpEmail.sender = {
      name: 'Equipo de Mini Twitter',
      email: SMTP_USER,
    };
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    sendEmailError();
  }
};
