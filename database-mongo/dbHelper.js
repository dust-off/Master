const db = require('./index.js');

const bookDetails = goodReadsIDs => new Promise((resolve, reject) => {
  let count = 0;
  const bookObjs = [];
  // I'll come back to this after I get the book saving function
  // just save the books
  console.log('how long is goodReadsIDs? @ aip.bookDetails 189:', goodReadsIDs.length);
  const booksNotInDB = goodReadsIDs.slice();

  const dealWithResults = (err, result, i) => {
    console.log('');
    console.log('');
    if (err) {
      console.log(' Error to apiHelper from db.searchByGrID');
      count += 1;
    } else {
      console.log(' db.searchByGrID cb returned results to apiHelper:');
      console.log(' results.length:', result.length);
      count += 1;
      console.log(' does i exist?', i);
      if (result.length > 0) {
        bookObjs[i] = result[0];
        booksNotInDB.splice(i, 1);
      }
    }
    if (count === goodReadsIDs.length) {
      resolve([bookObjs, booksNotInDB]);
    }
  };

  for (let i = 0; i < goodReadsIDs.length; i++) {
    console.log('');
    console.log('');
    const goodReadsID = goodReadsIDs[i];
    console.log('finding:', goodReadsID);
    db.searchByGrID(goodReadsID, (err, result) => dealWithResults(err, result, i));
  }

  // for each book in the goodReadsIDs
  // see if it is in the db
  // if it is then .push the object and search for the user review
  // else, search the api, add the results to the db
});

module.exports = {
  bookDetails,
};
