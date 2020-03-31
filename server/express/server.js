'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/cookies', (req, res) => {
  console.log('Cookies', Object.entries(req.cookies));
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(`
<h1>Cookies</h1>
<ul>
  ${Object.entries(req.cookies)
    .map(([key, value]) => `<li><pre>${key}</pre><pre>${value}</pre></li>`)
    .join('')}
</ul>
`);
  res.end();
});
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/.netlify/functions/server', router); // path must route to lambda
app.use('/server', router); // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
