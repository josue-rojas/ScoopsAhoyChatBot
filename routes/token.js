let express = require('express');
let router = express.Router();
let tokenGenerator = require('../services/token_generator');

router.get('/:id?', (req, res) => {
  const id = req.params.id;
  res.send(tokenGenerator(id));
});

// POST /token
router.post('/', function(req, res) {
  const id = req.body.id;
  res.send(tokenGenerator(id));
});


module.exports = router;
