const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer');

router.post('/', auth, multer, bookCtrl.create);
router.get('/', bookCtrl.getAll);
/*
 * This route has to be before /:id because otherwise it will
 * go to that route instead of the /bestrating.
 */
router.get('/bestrating', bookCtrl.getBestRated);
router.get('/:id', bookCtrl.getOne);

module.exports = router;
