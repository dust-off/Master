const axios = require('axios');

const convert = require('xml-js');
const { goodReadsKey } = require('./apiKeys.js');
const { NYTKey } = require('./apiKeys.js');
const apiKeys = require('./apiKeys.js');
const param = require('jquery-param');
const db = require('../database-mongo/index.js');

const searchBook = (book, cb) => {
  console.log('api.searchBook:', book);
  axios.get('https://www.goodreads.com/search.xml', {
    params: {
      q: book,
      key: goodReadsKey,
    },
  })
    .then((response) => {
      // console.log('here on line 20');// , response.data);
      const parseRes = convert.xml2json(response.data, { compact: true, spaces: 1 });
      const books = JSON.parse(parseRes).GoodreadsResponse.search.results.work;
      console.log('apiSearchBook returned # results:', books.length);

      const goodReadsIDs = [];
      books.forEach((abook) => {
        goodReadsIDs.push(abook.id._text);
      });
      console.log('');
      console.log('goodReadsIDs:', goodReadsIDs);
      console.log('');

      cb(null, goodReadsIDs);
    })
    .catch((error) => {
      // console.log('here on line 20');// , error);
      cb(error, null);
    });
};

const getMoreBookData = (book, cb) => {
  // console.log('getting more DATA');
  const id = book.best_book.id._text;
  // console.log('id = ', id);
  const url = `https://www.goodreads.com/book/show/${id}?format=xml&key=${goodReadsKey}`;
  axios.get(url)
    .then((response) => {
      // console.log('apiHelper found data 44:');
      // console.log('getting more Data', response);
      cb(null, response);
    })
    .catch((error) => {
      // throw error;
      cb(error, null);
    });
};


const getBestBooks = (cb) => {
  let url = 'https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json';
  url += `?${param({ 'api-key': NYTKey })}`;

  axios.get(url)
    .then((response) => {
      cb(null, response);
    })
    .catch((error) => {
      cb(error, null);
    });
};

const getNYT2 = () => {
  let url = 'https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json';
  url += `?${param({ 'api-key': NYTKey })}`;
  return (
    axios.get(url)
  );
};

const getBestBooks2 = (cb) => {
  // getNYT2()

};

const search3 = (book) => {
  const { isbn13 } = book.isbns[0];
  console.log('Searching for Book:', book.isbns);
  console.log('');
  // if (book.isbns.length <= 0) { console.log('ON SNAP', book); }
  return (
    axios.get('https://www.goodreads.com/search.xml', {
      params: {
        q: isbn13,
        key: goodReadsKey,
      },
    })
  );
};
const searchMap = (books) => {
  const promises = books.data.results.map(book => search3(book));
  return Promise.all(promises);
};

const dataMap = (goodReadsData) => {

};

// var asyncMap = function(tasks, callback) {
//     var promises = tasks.map(function(task) {
//       return new Promise (resolve => {task(resolve)});
//     });
//     Promise.all(promises)
//       .then(values => {
//         return callback(values);
//       });
// };


const genresWhiteList = ['action and adventure',
  'anthology',
  'art',
  'autobiographies',
  'biographies',
  'biography',
  'business',
  'children\'s',
  'christian',
  'classics',
  'comics',
  'cookbooks',
  'diaries',
  'dictionaries',
  'drama',
  'ebooks',
  'encyclopedias',
  'fantasy',
  'fiction',
  'graphic novels',
  'guide',
  'health',
  'historical fiction',
  'history',
  'horror',
  'journals',
  'lifestyle',
  'math',
  'memoir',
  'motivational',
  'music',
  'mystery',
  'non-fiction',
  'poetry',
  'prayer books',
  'psychology',
  'religion spirituality & new age',
  'romance',
  'satire',
  'science',
  'science fiction',
  'self help',
  'series',
  'sports',
  'thriller',
  'travel',
  'trilogy',
  'young adult'];

const createWordsForPopShelves = (shelvesArray) => {
  // console.log('on line 121 in apiHelper', shelvesArray, shelvesArray.length);
  const newPopShelves = [];
  shelvesArray.forEach((shelf) => {
    const shelfWords = shelf.split('-');
    newPopShelves.push(shelfWords);
  });
  return newPopShelves;
};

const filterByPopularShelves = (book) => {
  const genres = [];
  const popShelvesWithOnlyWords = createWordsForPopShelves(book.popularShelves);
  // console.log('on line 135 in apiHelper', popShelvesWithOnlyWords);
  popShelvesWithOnlyWords.forEach((shelf) => {
    shelf.forEach((word) => {
      if (genresWhiteList.indexOf(word) > -1) {
        if (genres.indexOf(word) === -1) {
          // console.log("here you are word:", word);
          genres.push(word);
        }
      }
    });
  });
  // console.log('on line 150 in apiHelper', genres);
  return genres;
};
//
// const bookDetails = goodReadsIDs => new Promise((resolve, reject) => {
//   let count = 0;
//   const bookObjs = [];
//   // I'll come back to this after I get the book saving function
//   // just save the books
//   console.log('how long is goodReadsIDs? @ aip.bookDetails 189:', goodReadsIDs.length);
//   const booksNotInDB = goodReadsIDs.slice();
//
//   const dealWithResults = (err, result, i) => {
//     console.log('');
//     console.log('');
//     if (err) {
//       console.log(' Error to apiHelper from db.searchByGrID');
//       count += 1;
//     } else {
//       console.log(' db.searchByGrID cb returned results to apiHelper:');
//       console.log(' results.length:', result.length);
//       count += 1;
//       console.log(' does i exist?', i);
//       if (result.length > 0) {
//         bookObjs[i] = result[0];
//         booksNotInDB.splice(i, 1);
//       }
//     }
//     if (count === goodReadsIDs.length) {
//       resolve([bookObjs, booksNotInDB]);
//     }
//   };
//
//   for (let i = 0; i < goodReadsIDs.length; i++) {
//     console.log('');
//     console.log('');
//     const goodReadsID = goodReadsIDs[i];
//     console.log('finding:', goodReadsID);
//     db.searchByGrID(goodReadsID, (err, result) => dealWithResults(err, result, i));
//   }
//
//   // for each book in the goodReadsIDs
//   // see if it is in the db
//   // if it is then .push the object and search for the user review
//   // else, search the api, add the results to the db
// });

const goodReadsByID = (goodReadsID, cb) => {
  const url = `https://www.goodreads.com/book/show/${goodReadsID}?format=xml&key=${goodReadsKey}`;
  axios.get(url)
    .then((response) => {
      cb(null, response);
    })
    .catch((error) => {
      cb(error, null);
    });
};

const testPromist =

const goodReadsObjFromIDs = (goodReadsIdArray, cb) => {
  console.log('goodReadsIdArray');
  console.log(goodReadsIdArray);
  let count = 0;
  const len = goodReadsIdArray.length;
  const bookObjs = [];

return (
  const dealWithResults = (i) => {
    const id = goodReadsIdArray[i];
    const url = `https://www.goodreads.com/book/show/${id}?format=xml&key=${goodReadsKey}`;
    axios.get(url)
    .catch((err) => {
      console.log('err');
      count++;
    })
    .then((data) => {
      bookObjs.push(data);
      count++;
    })
    .then(() => {
      if (count === len) {
        console.log('The Count is DONE', bookObjs.length);
        cb(bookObjs);
      }
    });
  };

  for (let i = 0; i < len; i++) {
    dealWithResults(i);
  }

)
};

module.exports = {
  searchBook,
  getMoreBookData,
  getBestBooks,
  filterByPopularShelves,
  getBestBooks2,
  goodReadsObjFromIDs,
};
