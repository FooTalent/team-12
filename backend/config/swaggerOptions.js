const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "DentPlanner API",
      version: "1.0.0",
      description:
        "API de gestión de turno e historia clínica para sector odontológico",
    },   
    servers: [
      {
        url: `${process.env.SERVER_URL}/api`, // Utilizar la URL del servidor desde .env con prefijo
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            first_name: {
              type: "string",
              example: "John",
            },
            last_name: {
              type: "string",
              example: "Doe",
            },
            email: {
              type: "string",
              example: "john.doe@example.com",
            },
            password: {
              type: "string",
              example: "strongpassword123",
            },
            role_id: {
              type: "integer",
              example: 1,
            },
          },
          required: ["first_name", "last_name", "email", "password", "role_id"],
        },
        Auth: {
          type: "object",
          properties: {
            email: {
              type: "string",
              example: "john.doe@example.com",
            },
            password: {
              type: "string",
              example: "strongpassword123",
            },
          },
          required: ["email", "password"],
        },
        ChangePassword: {
          type: "object",
          properties: {
            old_password: {
              type: "string",
              example: "oldpassword123",
            },
            new_password: {
              type: "string",
              example: "newpassword123",
            },
            confirm_password: {
              type: "string",
              example: "newpassword123",
            },
          },
          required: ["old_password", "new_password", "confirm_password"],
        },
        ForgotPassword: {
          type: "object",
          properties: {
            email: {
              type: "string",
              example: "john.doe@example.com",
            },
          },
          required: ["email"],
        },
        ResetPassword: {
          type: "object",
          properties: {
            new_password: {
              type: "string",
              example: "newpassword123",
            },
          },
          required: ["new_password"],
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Rutas donde se encuentran las definiciones de Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
