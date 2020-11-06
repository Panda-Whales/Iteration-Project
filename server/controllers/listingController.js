const db = require("../models/databaseModel");
const listingController = {};

listingController.addListing = (req, res, next) => {
  // inserts new user using the locationid grabbed from first two queries
  let query = `insert into listings (name, price, user_id, location, category_id, description) values ($1, $2, $3, $4, $5, $6);`

  let params = [req.body.params.name, req.body.params.price, req.body.params.user_id, req.body.params.location, req.body.params.category_id, req.body.params.description]

  db.query(query, params, (err, result) => {
    if (err) {
      console.log(err)
      next()
    }
    else {
      // console.log(result)
      next()
    }
  })
}

listingController.findListing = (req, res, next) => {
  // console.log('inside findinglisting' , req)
  // search for every item that has the name we are looking for
  let name = '%' + req.query.name + '%'
  let query = `select * from listings where name like ($1) and category_id = ($2) and user_id != ($3)`

  let params = [name, req.query.category_id, req.query.user_id]

  db.query(query, params, (err, result) => {
    if (err) {
      // return status of 204 if something went wrong
      res.status(204)
      next()
    }
    else {
      // set the locals.items to the result of the query 
      res.locals.items = result.rows
      next()
    }
  })
}

listingController.findListingInAll = (req, res, next) => {
  let name = '%' + req.query.name + '%'
  let query = 'select * from listings where name like ($1) and user_id != ($2)'
  let params = [name, req.query.user_id]
  db.query(query, params, (err, result) => {
    if (err) {
      // return status of 204 if something went wrong
      console.log('Error')
      res.status(204)
      next()
    }
    else {
      // set the locals.items to the result of the query 
      res.locals.items = result.rows
      next()
    }
  })
}

listingController.findItemForUser = (req, res, next) => {
  let query = 'select * from listings where user_id = ($1)'
  let params = [req.query.user_id]

  db.query(query, params, (err, result) => {
    if (err) {
      console.log(err)
      res.status(204)
      next()
    }
    else {
      res.locals.items = result.rows
      next()
    }
  })
}

listingController.findName = (req, res, next) => {
  let id = req.query.user_id
  let query = 'select users.username from listings inner join users on users.id =($1)'
  let params = [id]
  db.query(query, params, (err, result) => {
    if (err) {
      // return status of 204 if something went wrong
      console.log('Error')
      res.status(204)
      next()
    }
    else {
      // set the locals.items to the result of the query 
      res.locals.name = result.rows[0]
      next()
    }
  })
}

listingController.findAllListing = (req, res, next) => {
  // search for every item that has the name we are looking for
  let query = `select * from listings `
  let params = []

  db.query(query, params, (err, result) => {
    if (err) {
      // return status of 204 if something went wrong
      res.status(204)
      next()
    }
    else {
      // set the locals.items to the result of the query 
      res.locals.items = result.rows
      next()
    }
  })
}

//middleware to update the listing info in the database
listingController.updateListing = (req, res, next) => {
  //get the data from params to select the listing to be updated
  //get the data from the body to have the new info
  const listing_id = req.params.listing_id;
  const {name, price, location} = req.body;

  console.log('listing controller update listing')

  console.log('listing id',listing_id);
  console.log('body',req.body);

  //query the database with update script with corresponding data from the request
  let query = `UPDATE listings SET name = ($1), price = ($2), location = ($3) WHERE id = ($4) RETURNING listings.*`;
  let params = [name, price, location, listing_id];

  db.query(query, params)
  .then(updatedListing => {
    // console.log('in listing controller update listing, returning data: ',data.rows[0]);
    res.locals.updatedListing = updatedListing.rows[0];
    return next();
  })
  .catch(err => {
    return next({
      log: 'From listingController.updateListing: ' + err,
      message: { err: 'Error occurred in listingController.updateListing. Check server logs for more details.'}
    })
  })

}

listingController.deleteListing = (req, res, next) => {
  // this is storing the card's id storing it into listing_id variable
  const listing_id = req.params.listing_id;
  console.log('inside of delete controller', listing_id);
  //query the database with delete script with corresponding data from the request
  let deleteList = `DELETE FROM listings WHERE id = ${listing_id}`;
  

  db.query(deleteList)
  .then(deleteListing => {
    console.log('in listing controller delete listing, returning data: ',deleteListing.rows[0]);
    res.locals.deleteListing = deleteListing.rows[0];
    console.log(res.locals.deleteListing)
    return next();
  })
  .catch(err => {
    return next({
      log: 'From listingController.deleteListing: ' + err,
      message: { err: 'Error occurred in listingController.deleteListing. Check server logs for more details.'}
    })
  })

}

module.exports = listingController;
