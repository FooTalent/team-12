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
            birth_date: {
              type: "string",
              format: "date",
              example: "1999-08-15",
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
            clinic_id: {
              type: "integer",
              example: 1,
            },
            image: {
              type: "string",
              format: "binary",
              description: "The image file to upload",
            },
          },
        },
        Contact: {
          type: "object",
          properties: {
            first_name: {
              type: "string",
              description: "Nombre",
              example: "Pedrito",
            },
            last_name: {
              type: "string",
              description: "Apellido",
              example: "Gonzales",
            },
            email: {
              type: "string",
              description: "Email",
              example: "Gonzales@gmail.com",
            },
            phone_number: {
              type: "string",
              example: "3743562145",
            },
          },
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
            dni: {
              type: "string",
              format: "string",
              example: "40111333",
            },
            phone_number: {
              type: "string",
              example: "+123456789",
            },
            alternative_phone_number: {
              type: "string",
              example: "+233456789",
            },
            email: {
              type: "string",
              example: "jane.doe@example.com",
            },
          },
          required: [
            "first_name",
            "last_name",
            "birth_date",
            "dni",
            "phone_number",
            "alternative_phone_number",
            "email",
          ],
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
            reason_id: {
              type: "integer",
              example: 1,
            },
            date: {
              type: "string",
              format: "date",
              example: "2024-08-15",
            },
            time: {
              type: "string",
              format: "time",
              example: "07:30",
            },
            state: {
              type: "string",
              enum: ["pending", "confirmed", "cancelled", "rescheduled"],
              example: "pending",
            },
            assistance: {
              type: "boolean",
              example: true,
            },
            observations: {
              type: "string",
              example: "The pacient has scars",
            },
            anticipation_time: {
              type: "integer",
              example: 24,
            },
            is_active: {
              type: "boolean",
              example: true,
            },
          },
          required: [
            "patient_id",
            "dentist_id",
            "reason_id",
            "date",
            "time",
            "state",
          ],
        },
        /*  MedicalHistory: {
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
        }, */
        Reason: {
          type: "object",
          properties: {
            description: {
              type: "string",
              example: "Routine check-up",
            },
            time: {
              type: "string",
              format: "time",
              example: "07:30",
            },
          },
          required: ["description", "time"],
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
            email: {
              type: "string",
              example: "jane.doe@example.com",
            },
          },
          required: ["email"],
        },
        Role: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "admin",
            },
          },
          required: ["id", "name"],
        },
        Reminder: {
          type: "object",
          properties: {
            appointment_id: {
              type: "integer",
              example: 101,
            },
            status: {
              type: "string",
              enum: ["sent", "delivered", "failed"],
              example: "sent",
            },
            response: {
              type: "string",
              enum: ["confirmed", "cancelled", "rescheduled"],
              example: "confirmed",
            },
            response_received_at: {
              type: "string",
              format: "date-time",
              example: "2024-07-31T13:00:00Z",
            },
          },
        },
        WhatsAppMessage: {
          type: "object",
          properties: {
            phoneNumber: {
              type: "string",
              description: "Número de teléfono del destinatario.",
            },
            clinicName: {
              type: "string",
              description: "Nombre de la clínica.",
            },
            appointmentDate: {
              type: "string",
              format: "date",
              description: "Fecha de la cita.",
            },
            appointmentTime: {
              type: "string",
              description: "Hora de la cita.",
            },
            dentistName: {
              type: "string",
              description: "Nombre del dentista.",
            },
            appointmentId: {
              type: "integer",
              description: "ID de la cita.",
            },
          },
        },
        ClinicInfo: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Odonto Clinic",
            },
            phone_number: {
              type: "string",
              example: "+1-234-567-8900",
            },
            address: {
              type: "string",
              example: "1234 Elm Street, Suite 100, Springfield",
            },
            email: {
              type: "string",
              example: "info@clinicexample.com",
            },
            opening_hours: {
              type: "string",
              format: "time",
              example: "08:00",
            },
            closing_hours: {
              type: "string",
              format: "time",
              example: "17:00",
            },
          },
        },
        ReminderConfiguration: {
          type: "object",
          properties: {
            appointment_id: {
              type: "integer",
              example: "1",
            },
            anticipation_time: {
              example: "12",
            },
            is_active: {
              type: "boolean",
              example: true,
            },
          },
        },
        /* 
        Odontogram: {
          type: "object",
          properties: {
            appointment_id: {
              type: "integer",
              example: 1,
            },
            patient_id: {
              type: "integer",
              example: 1,
            },
            date: {
              type: "string",
              format: "date",
              example: "2024-08-15",
            },
            type: {
              type: "string",
              enum: ["children", "adults"],
              example: "adults",
            },
            notes: {
              type: "string",
              example: "Notes about the odontogram",
            },
          },
          required: ["appointment_id", "patient_id", "date", "type"],
        },
        Tooth: {
          type: "object",
          properties: {
            odontogram_id: {
              type: "integer",
              example: 1,
            },
            tooth_number: {
              type: "integer",
              example: 1,
            },
            general_condition: {
              type: "string",
              example: "Good",
            },
            mesial_side: {
              type: "string",
              example: "No issues",
            },
            distal_side: {
              type: "string",
              example: "No issues",
            },
            buccal_side: {
              type: "string",
              example: "No issues",
            },
            lingual_side: {
              type: "string",
              example: "No issues",
            },
            center: {
              type: "string",
              example: "No issues",
            },
          },
          required: ["odontogram_id", "tooth_number"],
        }, */
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(swaggerOptions);

module.exports = specs;
