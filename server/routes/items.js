const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');
const authMiddleware = require('../middlewares/auth');

// Attach routes to the router object
router.post('/', authMiddleware, itemsController.createItem);
router.get('/', authMiddleware, itemsController.getItems);
router.put('/:id', authMiddleware, itemsController.updateItem);
router.delete('/:id', authMiddleware, itemsController.deleteItem);

// Make sure to export the router directly
module.exports = router;