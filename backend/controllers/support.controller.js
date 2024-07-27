const pool = require("../config/db");
const multer = require('multer');
const path = require('path');
const { transporter } = require("../config/email");

// Configuración de multer para la subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Configuración de Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de tamaño de archivo en bytes (10 MB)
  fileFilter: (req, file, cb) => {
    // Filtra los archivos permitidos según su tipo MIME
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
}).array('images', 10); // Permite subir hasta 10 imágenes

// Controlador para manejar la creación de una solicitud de soporte
const createSupportRequest = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    const { first_name, last_name, email, issue_detail } = req.body;

    try {
      const [result] = await pool.query(
        'INSERT INTO support_requests (first_name, last_name, email, issue_detail) VALUES (?, ?, ?, ?)',
        [first_name, last_name, email, issue_detail]
      );

      const supportRequestId = result.insertId;

      const imagePaths = req.files.map(file => file.path);
      for (const imagePath of imagePaths) {
        await pool.query(
          'INSERT INTO support_images (support_request_id, image_path) VALUES (?, ?)',
          [supportRequestId, imagePath]
        );
      }

      // Enviar correo al soporte
      const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER, // Dirección de correo del equipo de soporte
        subject: "Nueva solicitud de soporte",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="text-align: center; color: #333;">Nueva solicitud de soporte</h2>
            <p><strong>Nombre:</strong> ${first_name}</p>
            <p><strong>Apellido:</strong> ${last_name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Detalle del problema:</strong> ${issue_detail}</p>
            ${imagePaths.length > 0 ? '<p><strong>Imágenes adjuntas:</strong></p>' + imagePaths.map(path => `<p>${path}</p>`).join('') : ''}
          </div>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo de soporte:', error);
        } else {
          console.log('Correo de soporte enviado: ' + info.response);
        }
      });

      res.status(201).json({ message: 'Support request created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Controlador para obtener todas las solicitudes de soporte
const getSupportRequests = async (req, res) => {
  try {
    const [supportRequests] = await pool.query('SELECT * FROM support_requests');
    res.json(supportRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para obtener una solicitud de soporte por ID
const getSupportRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const [supportRequestRows] = await pool.query(
      'SELECT * FROM support_requests WHERE id = ?',
      [id]
    );

    if (supportRequestRows.length === 0) {
      return res.status(404).json({ error: 'Support request not found' });
    }

    const supportRequest = supportRequestRows[0];

    const [imageRows] = await pool.query(
      'SELECT image_path FROM support_images WHERE support_request_id = ?',
      [id]
    );

    const images = imageRows.map(row => row.image_path);

    res.status(200).json({
      id: supportRequest.id,
      first_name: supportRequest.first_name,
      last_name: supportRequest.last_name,
      email: supportRequest.email,
      issue_detail: supportRequest.issue_detail,
      images: images
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSupportRequest,
  getSupportRequests,
  getSupportRequestById
};
