const express = require("express");
const router = express.Router();
const { checkToken, authorizeRole } = require('../utils/middleware');
const userController = require("../controllers/user.controller");

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.delete('/:id', checkToken, authorizeRole(['admin']), userController.deleteUserById);
router.put('/:id', userController.updateUserById);
router.patch('/:id', userController.patchUserById);

module.exports = router;
