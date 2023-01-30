const express = require('express');
const { generateCompletion } = require('../controllers/completionsController');
const { editElement } = require('../controllers/editController');
const { generateImage } = require('../controllers/dalleController');
const router = express.Router();


router.post('/generateimage', generateImage);

router.get('/email', (req, res) => {
  res.render('email');
});

router.post('/completion', generateCompletion);

router.post('/edit', editElement);

module.exports = router;