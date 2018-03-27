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

const filterISBN = bestSellersJson => bestSellersJson.map(book =>
  book.book_details[0].primary_isbn13);

const nycBestSellers = () => (axios.get(`https://api.nytimes.com/svc/books/v3/lists.json?list-name=hardcover-fiction&api-key=${NYTKey}`)
  .then(response => response.data.results)
  .then(jsonData => filterISBN(jsonData))
  .catch((err) => {
    console.log('nycBestSellers returned an error from the NYC website');
    return err;
  }));

// ------------- FETCH ------------- \\
function getBookDetails(isbn = '9781451648546') {
  console.log('book', isbn);
  console.log('');

  return fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
    .then(response => response.text())
    .then((rawData) => {
      const objData = JSON.parse(rawData);
      console.log('###', objData);
      // if (!objData.items) {
      //   console.log('#####');
      // }
      // console.log('isbn', isbn);
      // console.log('objData', objData.length);
      // return objData.items[0];
      return null;
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
    boodDetails: {
      type: new GraphQLList(BookType),
      resolve: (isbns, args, context) =>
        // console.log('isbns!!!', isbns); // at this point the isbns is really just [ISBNS]
        isbns.map(bookISBN => getBookDetails(bookISBN))
      ,
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
        resolve: (root, args) => nycBestSellers(),
      },
    }),
  }),
});


// console.log('calling nycBestSellers');
// const list = nycBestSellers();
// console.log('returned the NYC?');
// // console.log('list', list);
// // list.forEach((book) => {
// //   console.log(book.isbns);
// // });
// return list;


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
