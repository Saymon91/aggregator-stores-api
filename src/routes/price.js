const { Router } = require('express');
const router = Router();
const Price = require('../models/price-model');

// => read single post
router.get('/shops/:shop/:id', ({ params: { shop, id } }, res) => {
  Price.findOne({ id, shop }, 'name price')
    .then(item => item ? res.send(item) : res.sendStatus(404))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;
