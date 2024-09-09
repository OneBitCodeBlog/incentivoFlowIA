import nodemailer from 'nodemailer';
import { convert } from 'html-to-text'; // Importar a função de conversão

// Configurar o transporte de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT || 587,
  auth: {
    user: process.env.EMAIL_USER || 'your_ethereal_user@ethereal.email',
    pass: process.env.EMAIL_PASS || 'your_ethereal_password'
  }
});

// Função para enviar email
export const sendEmail = async (to, subject, html) => {
  const text = convert(html); // Converter HTML para texto simples
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@incentivoflow.com',
    to,
    subject,
    text, // Fallback de texto simples
    html, // Conteúdo HTML
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email enviado: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
};
