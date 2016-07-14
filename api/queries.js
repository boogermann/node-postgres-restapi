var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/locations'; // Locations is an example database name
var db = pgp(connectionString);


/////////////////////
// Query Functions
/////////////////////

function getAllPlaces(req, res, next) {
  db.any('select * from places')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL places'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getPlace(req, res, next) {
  var placeID = parseInt(req.params.id);
  db.one('select * from places_aoi_2d where id = $1', placeID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE place'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createPlace(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into places(name, type, population)' +
      'values(${name}, ${type}, ${population})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one place'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updatePlace(req, res, next) {
  db.none('update places set name=$1, type=$2, population=$3 where id=$4',
    [req.body.name, req.body.type, parseInt(req.body.population),
      parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated place'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removePlace(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from places where id = $1', placeID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} place`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}


/////////////
// Exports
/////////////

module.exports = {
    getAllPlaces: getAllPlaces,
    getPlace: getPlace,
    createPlace: createPlace,
    updatePlace: updatePlace,
    removePlace: removePlace
};
