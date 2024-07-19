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
        url: `${process.env.SERVER_URL}/api`,
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            first_name: {
              type: "string",
              example: "John",
            },
            last_name: {
              type: "string",
              example: "Doe",
            },
            dni: {
              type: "string",
              example: "40111333",
            },
            email: {
              type: "string",
              example: "john.doe@example.com",
            },
            phone_number: {
              type: "string",
              example: "3743562145",
            },
            password: {
              type: "string",
              example: "strongpassword123",
            },
            role_id: {
              type: "integer",
              example: 1,
            },
            active: {
              type: "boolean",
              example: true,
            },
          },
          required: ["first_name", "last_name", "dni", "email", "phone_number", "password", "role_id", "active"],
        },
        Patient: {
          type: "object",
          properties: {
            first_name: {
              type: "string",
              example: "Jane",
            },
            last_name: {
              type: "string",
              example: "Doe",
            },
            birth_date: {
              type: "string",
              format: "date",
              example: "1980-01-01",
            },
            gender: {
              type: "string",
              enum: ["M", "F", "Other"],
              example: "F",
            },
            marital_status: {
              type: "string",
              example: "Single",
            },
            address: {
              type: "string",
              example: "123 Main St",
            },
            city: {
              type: "string",
              example: "Anytown",
            },
            phone: {
              type: "string",
              example: "+123456789",
            },
            email: {
              type: "string",
              example: "jane.doe@example.com",
            },
            occupation: {
              type: "string",
              example: "Engineer",
            },
          },
          required: ["first_name", "last_name", "birth_date", "gender"],
        },
        Appointment: {
          type: "object",
          properties: {
            patient_id: {
              type: "integer",
              example: 1,
            },
            dentist_id: {
              type: "integer",
              example: 2,
            },
            reason: {
              type: "string",
              example: "Routine checkup",
            },
            date: {
              type: "string",
              format: "date",
              example: "2024-08-15",
            },
          },
          required: ["patient_id", "dentist_id", "date"],
        },
        MedicalHistory: {
          type: "object",
          properties: {
            patient_id: {
              type: "integer",
              example: 1,
            },
            cardiac_issues: {
              type: "boolean",
              example: false,
            },
            diabetes: {
              type: "boolean",
              example: false,
            },
            hepatitis: {
              type: "boolean",
              example: false,
            },
            drug_consumption: {
              type: "boolean",
              example: true,
            },
            abnormal_blood_pressure: {
              type: "boolean",
              example: false,
            },
            hiv: {
              type: "boolean",
              example: false,
            },
            asthma: {
              type: "boolean",
              example: true,
            },
            anemia: {
              type: "boolean",
              example: false,
            },
            epilepsy: {
              type: "boolean",
              example: false,
            },
            pregnancy: {
              type: "boolean",
              example: false,
            },
            medication_consumption: {
              type: "boolean",
              example: true,
            },
            medications_notes: {
              type: "string",
              example:
                "Patient is on daily medication for high blood pressure.",
            },
            allergies: {
              type: "boolean",
              example: true,
            },
            allergies_notes: {
              type: "string",
              example: "Allergic to penicillin.",
            },
            notes: {
              type: "string",
              example: "Patient has a history of asthma.",
            },
          },
          required: [
            "patient_id",
            "cardiac_issues",
            "diabetes",
            "hepatitis",
            "drug_consumption",
            "abnormal_blood_pressure",
            "hiv",
            "asthma",
            "anemia",
            "epilepsy",
            "pregnancy",
            "medication_consumption",
            "allergies",
          ],
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
        Role: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "admin",
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2024-07-19T00:00:00Z",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2024-07-19T00:00:00Z",
            },
          },
          required: ["id", "name", "created_at", "updated_at"],
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
