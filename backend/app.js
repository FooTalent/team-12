// Aplicacion principal

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerOptions'); 

require('dotenv').config();

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

// Crear una instancia de la aplicación Express
const app = express();

// Configuración
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);


// Ruta para la documentación de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Auth API',
      version: '1.0.0',
      description: 'API for managing authentication',
    },
    basePath: '/api',
  },
  apis: ['./routes/*.js'], // Rutas donde se encuentran las definiciones de Swagger
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));


// Definir el puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
