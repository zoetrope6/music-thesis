const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const chalk = require('chalk');

const app = express();
const PORT = 8080;

app.use('/', express.static(path.join(__dirname, '../public')))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(chalk.red(`Client on ${PORT}!`));
});
