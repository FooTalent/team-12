const nodemailer = require('nodemailer');

// Crear un transportador reutilizable usando el servicio de correo
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes cambiar el servicio si usas otro
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verificar la configuración de nodemailer
transporter.verify((error, success) => {
  if (error) {
    console.error('Error en la configuración del transportador:', error);
  } else {
    console.log('Transportador configurado correctamente.');
  }
});

module.exports = transporter;
