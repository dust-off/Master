const axios = require('axios');

const convert = require('xml-js');
const { goodReadsKey } = require('./apiKeys.js');
const { NYTKey } = require('./apiKeys.js');
const apiKeys = require('./apiKeys.js');
const param = require('jquery-param');

const searchBook = (book, cb) => {
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
      //let theBook = books;
      // if (books.length > 0) {
      //   theBook = books;
      // }
      // console.log('books');// , theBook);
      cb(null, books);
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

const getNYT2 = () => {
  let url = 'https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json';
  url += `?${param({ 'api-key': NYTKey })}`;
  return (
    axios.get(url)
  );
};

const getBestBooks = (cb) => {
  getNYT2()
    .then(searchMap)
    .then((data) => {
      const allCleanBooks = [];
      data.forEach((one) => {
        const parseRes = convert.xml2json(one.data, { compact: true, spaces: 1 });
        const books = JSON.parse(parseRes).GoodreadsResponse.search.results.work;
        let theBook = books;
        if (books.length > 0) {
          theBook = books[0];
        }
        allCleanBooks.push(theBook);

        // console.log(jsonBook);
      });
      // console.log(allCleanBooks[0]);
      cb(allCleanBooks[0]);
    })
    .catch(cb);
};

// .then((response) => {
//   // console.log('here on line 20');// , response.data);
//   const parseRes = convert.xml2json(response.data, { compact: true, spaces: 1 });
//   const books = JSON.parse(parseRes).GoodreadsResponse.search.results.work;
//   let theBook = books;
//   if (books.length > 0) {
//     theBook = books[0];
//   }
//   // console.log('books');// , theBook);
//   cb(null, theBook);
// })
// .catch((error) => {
//   // console.log('here on line 20');// , error);
//   cb(error, null);
// });

const search3 = book => (
  console.log(book)
  axios.get('https://www.goodreads.com/search.xml', {
    params: {
      q: book,
      key: goodReadsKey,
    },
  })
);
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
        if(genres.indexOf(word) === -1) {
          // console.log("here you are word:", word);
          genres.push(word);
        }
      }
    });
  });
  // console.log('on line 150 in apiHelper', genres);
  return genres;
};

module.exports = {
  searchBook,
  getMoreBookData,
  getBestBooks,
  filterByPopularShelves,
};
