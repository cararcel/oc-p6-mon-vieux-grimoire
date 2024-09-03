const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer');

router.post('/', auth, multer, bookCtrl.create);
router.get('/', bookCtrl.getAll);
router.get('/:id', bookCtrl.getOne);

module.exports = router;
