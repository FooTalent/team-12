const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');

router.post('/send-message-whatsapp', whatsappController.sendMessage);
router.get('/webhook', whatsappController.verifyWebhook);
router.post('/webhook', whatsappController.receiveMessage);

module.exports = router;
