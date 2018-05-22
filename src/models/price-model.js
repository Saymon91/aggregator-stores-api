const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PriceSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true
  },
  shop: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('price', PriceSchema);
