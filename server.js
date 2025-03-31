const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use((req, res, next) => {
  res.status(404).send('Sorry, the file you requested was not found.');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});