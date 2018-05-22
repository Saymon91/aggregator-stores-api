const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Price = require('./price-model');

const ConfigSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  transform: Schema.Types.Mixed,
  config: Schema.Types.Mixed
});

const ShopSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  description: String,
  config: {
    type: ConfigSchema,
    required: true
  }
});

const request = require('request');
const etl = require('etl');
const iconv = new require('iconv').Iconv('windows-1251', 'utf-8');
const { Transform } = require("stream");
const { get, set } = require('lodash');

function convert(transform) {
  return sourceItem => {
    const resultItem = {};
    for (const target in transform) {
      const { source, separator } = transform[target];
      let value = source.map(field => get(sourceItem, field)).join(separator);
      set(resultItem, target, value);
    }
    return new Price(resultItem);
  }
}

async function getCsvPrice(url, transform, config) {

  const convertEncoding = Transform({
    transform: function (chunk, encoding, next) {
      try {
        this.push(iconv.convert(chunk));
        next();
      } catch (err) {
        next(err);
      }
    }
  });

  convertEncoding.setEncoding("utf-8");

  return new Promise((resolve, reject) => {
    request.get(url)
      .on('error', reject)
      .pipe(convertEncoding)
      .on('error', reject)
      .pipe(etl.csv(config))
      .on('error', reject)
      .pipe(etl.map(convert(transform)))
      .on('error', reject)
      .promise().then(resolve)
  });
}

module.exports = { Shop: mongoose.model('shops', ShopSchema), getCsvPrice };
