const axios = require('axios');
const { NYTKey } = require('./apiKeys.js');
const fetch = require('node-fetch');
const util = require('util');
const xml2js = util.promisify(require('xml2js').parseString);
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const nycBestSellers = () => {
  axios.get(`https://api.nytimes.com/svc/books/v3/lists.json?list-name=hardcover-fiction&api-key=${NYTKey}`)
    .then(response => response.data.results)
    .then((json) => {
      console.log('');
      console.log('');
      console.log('json', JSON.stringify(json, null, 2));
    })
    .then(() => {
      console.log('finished');
    })
    .catch((err) => {
      console.log('nycBestSellers returned an error from the NYC website');
      return err;
    });
  // x();
  // getBookDetails(9781250130938);
};

// const x = fetch(`https://www.goodreads.com/book/show/36354802?format=xml&key=6oijAUTgvAWaektHWXBqkQ`)
//   .then(response => response.text())
//   .then(xml2js)
//   .then(rex => console.log(rex.GoodreadsResponse.book));

// x;

function getBookDetails(isbn = '9781451648546') {
  console.log('book', isbn);
  console.log('');
  console.log('');
  console.log('');

  // Query the book database by ISBN code.
  // isbn = isbn || '9781451648546'; // Steve Jobs book

  // const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

  fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
    .then(response => response.text())
    .then((rawData) => {
      objData = JSON.parse(rawData);
      // if (data.totalItems) {
      // for (var key in data) {
      //   console.log(key)
      // }
      console.log('data.items', objData.items[0]);
      // }
    })
    .catch(err => console.error(err));
}

// const BookType = new GraphQLObjectType({
//   name: 'Author',
//   description: '...',

//   fields: () => ({
//     name: {
//       type: GraphQLString,
//     },
//   }),
// });

// const old_schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'query',
//     description: '...',

//     fields: () => ({
//       book: {
//         type: BookType,
//         args: {
//           id: { type: GraphQLInt },
//         },
//       },
//     }),
//   }),
// });

// // const AuthorType = new GraphQLObjectType({
// //   name: 'Author',
// //   description: '...',

// //   fields: () => ({
// //     name: {
// //       type: GraphQLString,
// //       resolve: xml =>
// //         xml.GoodreadsResponse.author[0].name[0],
// //     },
// //     books: {
// //       type: new GraphQLList(BookType),
// //       resolve: (xml, args, context) => {
// //         const ids = xml.GoodreadsResponse.author[0].books[0].book.map(elem => elem.id[0]._);
// //         return context.bookLoader.loadMany(ids);
// //       },
// //     },
// //   }),
// // });

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'Query',
//     description: '...',

//     fields: () => ({
//       author: {
//         type: AuthorType,
//         args: {
//           id: { type: GraphQLInt },
//         },
//         // resolve: (root, args, context) => context.authorLoader.load(args.id)
//       },
//     }),
//   }),
// });


// // 9781250130938 = isbn13

module.exports = { nycBestSellers };
