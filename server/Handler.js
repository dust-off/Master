const convert = require('xml-js');

const db = require('../database-mongo');
const api = require('../api/apiHelper.js');
const { organizeBookData } = require('../api/apiTest.js');
const { addReviewData } = require('../api/apiTest.js');
const dbHelper = require('../database-mongo/dbhelper.js');

module.exports = {
  getAllBooks: (req, res) => {
    db.selectAllBooks((err, data) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(data);
      }
    });
  },
  getBookByISBN: (req, res) => {
    const { isbn, user } = req.params;
    console.log('getting by ', isbn, user);
    db.findBook(isbn, (err, data) => {
      console.log('');
      console.log('');
      console.log('data', data);
      if (err) {
        res.sendStatus(500);
      } else if (data.length > 0) {
        console.log('found a book', data[0].title);
        // RETURN USER_REVIEW
        // then check for a userName and if found
        // look up the user and get their review and look up the review
        // then get the review data
        // let reviewData = [];

        // RETURN FAVORITES
        // look up username
        // then look at their favs
        // if this isbn is in there
        // do: data[0].favorit = true
        const reviewID = `${user}${isbn}`;
        console.log('no the handler:', reviewID);
        db.findReview(reviewID, (err, review) => {
          if (err) throw err;
          console.log('');
          console.log('attaching the review');
          console.log(data[0].title);
          console.log('reviewID', review);
          data[0].review = review;
          res.json(data[0]);
        });
      } else {
        api.searchBook(isbn, (errAPI, searchResults) => {
          if (errAPI) {
            res.sendStatus(500);
          } else {
            api.getMoreBookData(searchResults, (error, results) => {
              if (error) {
                res.sendStatus(500);
              } else {
                searchResults.isbn13 = isbn;
                const bookData = organizeBookData(searchResults);
                const parRez = convert.xml2json(results.data);
                const jsonRez = JSON.parse(parRez).elements[0].elements[1].elements;
                const updatedData = addReviewData(jsonRez, bookData);
                const genres = api.filterByPopularShelves(updatedData);
                updatedData.genres = genres;
                db.save(updatedData);
                res.json(updatedData);
              }
            });
          }
        });
      }
    });
  },
  getUserByName: (req, res) => {
    const { username } = req.params;
    db.findProfile(username, (err, data) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(data[0]);
      }
    });
  },
  postLogin: (req, res) => {
    let loginData = {};
    req.on('data', (chunk) => {
      loginData = JSON.parse(chunk.toString());
      db.findProfile(loginData.username, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(data);
          if (!data.length) {
            loginData.type = 'invalid username';
          } else if (loginData.password === data[0].password) {
            loginData.type = 'success';
            loginData.userProfile = data[0];
          } else {
            loginData.type = 'wrong password';
          }
        }
        res.json(loginData);
      });
    });
  },
  postSignUp: (req, res) => {
    req.on('data', (chunk) => {
      const userData = JSON.parse(chunk.toString());
      const response = {
        type: '',
        data: {},
      };
      // check if exists in database
      db.findProfile(userData.username, (err, data) => {
        if (err) {
          console.log('ERR', err);
        } else if (!data.length) {
          db.createProfile(userData);
          // figure out how to callback this
          response.type = 'success';
          response.data = userData;
          res.json(response);
        } else {
          response.type = 'error';
          res.json(response);
        }
      });
    });
  },
  getSearchTitle: (req, res) => {
    const { title } = req.params;
    let booksToReturn = [];
    const bob = [];
    api.searchBook(title, (err, goodReadsIDs) => {
      dbHelper.bookDetails(goodReadsIDs)
        .then((data) => {
          console.log('returned to Handler @ 139');
          // console.log('bookDetails result');
          // console.log(data);
          booksToReturn = data[0];
          return data[1];
        })
        .then(api.goodReadsObjFromIDs)
        .then((jsonData) => {
          console.log('json Data');
          console.log(jsonData);
          console.log('******************');
          console.log('******************');
          console.log('******************');
          res.json(['test', jsonData[0].data]);
        })
        .then(api.parseGrResults)
        .then((data) => {
          console.log('the data should be parsed now', data.length);
          console.log('data[0] = ', data[0]);
        })
        .catch(fail => console.log('fail'));
    });
  },
  getBestSellers: (req, res) => {
    api.getBestBooks((err, data) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(data.data);
      }
    });
  },
  getBestSellers2: (req, res) => {
    api.getBestBooks2((data) => {
      // console.log('inside handler @ 122 - cb for betSelelrs');
      // console.log(data);
      // if (err) {
      //   res.sendStatus(500);
      // } else {
      // res.json(data);
      // }
    });
    // res.json('sending');
  },
  postReview: (req, res) => {
    db.saveReview(req.body, (err, data) => {
      res.json([err, data]);
    });
  },
  testFind: (req, res) => {
    const { isbn, user } = req.params;
    console.log(isbn, user);

    db.searchReview(isbn, user, (err, data) => {
      console.log('returning data');
      console.log('err', err);
      console.log('data');
      console.log(data);
    });
  },
};
