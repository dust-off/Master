const fetch = require('node-fetch');
const { NYTKey } = require('./apiKeys.js');
const axios = require('axios');
const {
  GraphQLSchema,
  GraphQLObjectType,
  // GraphQLInt,
  GraphQLString,
  GraphQLList,
  // GraphQLArray,
} = require('graphql');

// const nycBestSellers = () =>
//   fetch(`https://api.nytimes.com/svc/books/v3/lists.json?list-name=hardcover-fiction&api-key=${NYTKey}`)
//     .then((res) => {
//       console.log('nyc returned with a thing?', res);
//       console.log('json', JSON.stringify(res, null, 2));
//     })
//     .then((json) => {
//       console.log('');
//       console.log('');
//       console.log('json', JSON.stringify(json, null, 2));
//     })
//     .then(() => {
//       console.log('finished');
//       return { fetch: 'success' };
//     })
//     .catch((err) => {
//       console.log('nycBestSellers website returned an error');
//       return err;
//     });
//   // x();
//   // getBookDetails(9781250130938);
// // ;

const nycBestSellers = () => {
  axios.get(`https://api.nytimes.com/svc/books/v3/lists.json?list-name=hardcover-fiction&api-key=${NYTKey}`)
    .then(response => response.data.results)
    .then((json) => 
      // console.log('');
      // console.log('');
      // console.log('json', JSON.stringify(json, null, 2));
       json
    )
    // .then(() => {
    //   console.log('finished');
    // })
    .catch((err) => {
      console.log('nycBestSellers returned an error from the NYC website');
      return err;
    });
  // x();
  // getBookDetails(9781250130938);
};

// function translate(lang, str) {
// // Google Translate API is a paid (but dirt cheap) service. This is my key
// // and will be disabled by the time the video is out. To generate your own,
// // go here: https://cloud.google.com/translate/v2/getting_started
//   const apiKey =
//     'AIzaSyBN-bwtos8sKU6X84wkrdjtCF7uzng6kgQ';
//   const url =
//     'https://www.googleapis.com' +
//     '/language/translate/v2' +
//     '?key=' + apiKey +
//     '&source=en' +
//     '&target=' + lang +
//     '&q=' + encodeURIComponent(str)
// return fetch(url)
//     .then(response => response.json())
//     .then(parsedResponse =>
//         parsedResponse
//             .data
//             .translations[0]
//             .translatedText
//     )
// }

// const aBookType = new GraphQLObjectType({
//   name: 'Book',
//   description: '...',

//   fields: () => ({
//     title: {
//       type: GraphQLString,
//       args: {
//         lang: { type: GraphQLString },
//       },
//       resolve: (xml, args) => {
//         const title = xml.GoodreadsResponse.book[0].title[0];
//         return args.lang ? translate(args.lang, title) : title;
//       },
//     },
//     isbn: {
//       type: GraphQLString,
//       resolve: xml => xml.GoodreadsResponse.book[0].isbn[0],
//     },
//     authors: {
//       type: new GraphQLList(AuthorType),
//       resolve: (xml, args, context) => {
//         const authorElements = xml.GoodreadsResponse.book[0].authors[0].author;
//         const ids = authorElements.map(elem => elem.id[0]);
//         return context.authorLoader.loadMany(ids);
//       },
//     },
//   }),
// });

// const AuthorType = new GraphQLObjectType({
//   name: 'Author',
//   description: '...',

//   fields: () => ({
//     name: {
//       type: GraphQLString,
//       resolve: xml =>
//         xml.GoodreadsResponse.author[0].name[0],
//     },
//     books: {
//       type: new GraphQLList(aBookType),
//       resolve: (xml, args, context) => {
//         const ids = xml.GoodreadsResponse.author[0].books[0].book.map(elem => elem.id[0]._);
//         return context.bookLoader.loadMany(ids);
//       },
//     },
//   }),
// });

// ------------- FETCH ------------- \\
function getBookDetails(isbn = '9781451648546') {
  console.log('book', isbn);
  console.log('');

  return fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
    .then(response => response.text())
    .then((rawData) => {
      const objData = JSON.parse(rawData);
      // if (data.totalItems) {
      // for (var key in data) {
      //   console.log(key)
      // }
      // console.log('data.items', objData.items[0]);
      // }
      // console.log(objData.items[0].kind);
      return objData.items[0];
    })
    .catch((err) => {
      console.error(err);
      return 'error';
    });
}
//----------------------

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: '...',

  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: (obj) => {
        console.log('second resolve', obj);
        return obj;
      },
    },
  }),
});

const BestSellerType = new GraphQLObjectType({
  name: 'nycBestSelelrs',
  description: 'Returns the New York Times Best sellers list',

  fields: () => ({
    // title: {
    //   type: GraphQLString,
    //   args: {
    //     lang: { type: GraphQLString },
    //   },
    //   resolve: (xml, args) => {
    //     const title = xml.GoodreadsResponse.book[0].title[0];
    //     return args.lang ? translate(args.lang, title) : title;
    //   },
    // },
    // isbn: {
    //   type: GraphQLString,
    //   resolve: xml => xml.GoodreadsResponse.book[0].isbn[0],
    // },
    boodDetails: {
      type: new GraphQLList(BookType),
      resolve: (xml, args, context) => ['9781451648546', '9781451648546'],
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'Fetches book details by ISBN from Google Books',

  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: book => book.volumeInfo.title,
    },
    subTitle: {
      type: GraphQLString,
      resolve: book => book.volumeInfo.subtitle,
    },
    pages: {
      type: GraphQLString,
      resolve: book => book.volumeInfo.pageCount,
    },
    publisher: {
      type: GraphQLString,
      resolve: book => book.volumeInfo.publisher,
    },
    publishedDate: {
      type: GraphQLString,
      resolve: book => book.volumeInfo.publishedDate,
    },
    description: {
      type: GraphQLString,
      resolve: book => book.volumeInfo.description,
    },
    isbn13: {
      type: GraphQLString,
      resolve: (book) => {
        let isbn13 = null;
        book.volumeInfo.industryIdentifiers.forEach((id) => {
          if (id.type === 'ISBN_13') {
            isbn13 = id.identifier;
          }
        });
        return isbn13;
      },
    },
    genres: {
      type: GraphQLString,
      resolve: book => JSON.stringify(book.volumeInfo.categories),
    },
    averageRating: {
      type: GraphQLString,
      resolve: book => book.volumeInfo.averageRating,
    },
    imageURL: {
      type: GraphQLString,
      resolve: book => book.volumeInfo.imageLinks.thumbnail,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: book => book.volumeInfo.authors,
    },
  }),
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'aBook',
    description: 'An interface for retreiving book details',

    fields: () => ({
      book: {
        type: BookType,
        args: {
          id: { type: GraphQLString },
        },
        resolve: (root, args) => {
          console.log('inside first resolve');
          const lookUp = getBookDetails(args.id);
          return lookUp;
        },
      },
      bestSellers: {
        type: BestSellerType,
        resolve: (root, args) => {
          console.log('calling nycBestSellers');
          const list = nycBestSellers();
          // console.log('list', list);
          list.forEach((book) => {
            console.log(book.isbns);
          });
          return { success: true };
        },
      },
    }),
  }),
});


// other code

// function getBookDetails(isbn) {

//   // Query the book database by ISBN code.
//   isbn = isbn || "9781451648546"; // Steve Jobs book

//   var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;

//   var response = UrlFetchApp.fetch(url);
//   var results = JSON.parse(response);

//   if (results.totalItems) {

//     // There'll be only 1 book per ISBN
//     var book = results.items[0];

//     var title = (book["volumeInfo"]["title"]);
//     var subtitle = (book["volumeInfo"]["subtitle"]);
//     var authors = (book["volumeInfo"]["authors"]);
//     var printType = (book["volumeInfo"]["printType"]);
//     var pageCount = (book["volumeInfo"]["pageCount"]);
//     var publisher = (book["volumeInfo"]["publisher"]);
//     var publishedDate = (book["volumeInfo"]["publishedDate"]);
//     var webReaderLink = (book["accessInfo"]["webReaderLink"]);

//     // For debugging
//     Logger.log(book);

//   }

// }
