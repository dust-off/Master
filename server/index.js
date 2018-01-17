const express = require('express');
const bodyParser = require('body-parser');

const handler = require('./Handler.js');

const app = express();
app.use(express.static(`${__dirname}/../react-client/dist`));
app.use(bodyParser.json());

app.get('/user/:username', handler.getUserByName);
app.post('/login', handler.postLogin);
app.post('/signup', handler.postSignUp);

app.get('/items', handler.getAllBooks);
app.get('/book/:isbn/:user', handler.getBookByISBN);
app.get('/search/:title', handler.getSearchTitle);
app.get('/bestSellers', handler.getBestSellers);
app.post('/review', handler.postReview);

app.get('/find/:isbn/:user', handler.testFind);

app.listen(3000, () => {
  console.log('listening on port 3000!');
});
