const express = require('express');
const router = express.Router();
const supportController = require('../controllers/support.controller');

/**
 * @swagger
 * /support:
 *   post:
 *     summary: Crear una nueva solicitud de soporte
 *     tags: [Support]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: Nombre
 *                 example: Pedrito
 *               last_name:
 *                 type: string
 *                 description: Apellido
 *                 example: Gonzales
 *               phone_number: 
 *                 type: string
 *                 example: 3743562145      
 *               email:
 *                 type: string
 *                 description: Email
 *                 example: Gonzales@gmail.com
 *               issue_detail:
 *                 type: string
 *                 description: Detalle del problema
 *                 example: No me prende la compu
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Imágenes relacionadas con el problema
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - issue_detail
 *     responses:
 *       201:
 *         description: Solicitud de soporte creada exitosamente
 *       400:
 *         description: Error en la solicitud de soporte
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', supportController.createSupportRequest);

/**
 * @swagger
 * /support/{id}:
 *   get:
 *     summary: Obtener una solicitud de soporte por ID
 *     tags: [Support]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud de soporte
 *     responses:
 *       200:
 *         description: Datos de la solicitud de soporte
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 issue_detail:
 *                   type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Solicitud de soporte no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', supportController.getSupportRequestById);

/**
 * @swagger
 * /support:
 *   get:
 *     summary: Obtener todas las solicitudes de soporte
 *     tags: [Support]
 *     responses:
 *       200:
 *         description: Lista de todas las solicitudes de soporte
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   issue_detail:
 *                     type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', supportController.getSupportRequests);

module.exports = router;
