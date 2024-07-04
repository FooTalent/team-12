const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'DentPlanner API',
      version: '1.0.0',
      description: 'API de gestión de turno e historia clínica para sector odontológico',
    },
    basePath: '/api',
  },
  apis: ['./routes/*.js'], // Rutas donde se encuentran las definiciones de Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
