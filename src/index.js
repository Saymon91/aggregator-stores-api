const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/config');
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

mongoose.connect(config.dbURL, config.dbOptions);
mongoose.connection
  .once('open', () => {
    console.log(`Mongoose - successful connection ...`)
    app.listen(process.env.PORT || config.port, () => console.log(`Server start on port ${config.port} ...`))
  })
  .on('error', error => console.warn(error));
