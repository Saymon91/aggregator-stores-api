const { Router } = require('express');
const router = Router();
const { Shop, getCsvPrice } = require('../models/shop-model');


router.post('/shops', async ({ body: { title, description, config: cfgString } }, res) => {
  let config = null;
  try {
    config = JSON.parse(cfgString);
  } catch (err) {
    return res.sendStatus(400);
  }

  const shop = new Shop({ title, description, config: config });
  const [prices = null, { _id: shopId = null }  = {}] = await Promise.all([
    getCsvPrice(config.url, config.transform, config.config),
    shop.save()
  ]).catch(err => {
    console.error(err);
    return [];
  });

  if (!prices || !shopId) {
    return res.sendStatus(500);
  }


  for (const price of prices) {
    price.shop = shopId;
    await price.save().catch(console.error);
  }

  res.sendStatus(200);
});

router.get('/shops', (req, res) => {
  Shop.find({}, 'title description').sort({ _id: -1 })
    .then(shops => res.send({ shops }))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.get('/shops/:id', ({ params: { id } }, res) => {
  Shop.findById(id, 'title description config')
    .then(shop => shop ? res.send(shop) : res.sendStatus(404))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.put('/shops/:id', ({ params: { id }, body }, res) => {
  Shop.findById(id, 'title description config')
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    })
    .then(shop => {
      Object.assign(shop, body);
      shop.save()
        .catch(err => {
          console.error(err);
          res.sendStatus(500);
        })
        .then(() => res.sendStatus(200))
    });
});

router.delete('/shops/:id', ({ params: { id: _id } }, res) => {
  Shop.remove({ _id })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
    .then(() => res.sendStatus(200));
});

module.exports = router;
