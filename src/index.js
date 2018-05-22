const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { port, dbURL, dbOptions } = require('./config/config');
mongoose.Promise = Promise;

const app = express();
app.use(morgan('combined'));
app.use(cors({
  accessControlAllowOrigin: '*',
  accessControlAllowHeaders: 'Authorization, Referer'
}));
app.use(require('./security'));
app.use(bodyParser.json());

app.use(require('./routes/shops'));
app.use(require('./routes/price'));

mongoose.connect(dbURL, dbOptions);
mongoose.connection
  .once('open', () => {
    console.log(`Mongoose - successful connection ...`)
    app.listen(process.env.PORT || port, () => console.log(`Server start on port ${port} ...`))
  })
  .on('error', error => console.warn(error));
