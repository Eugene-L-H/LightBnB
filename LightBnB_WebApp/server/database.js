const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require("pg");

const pool = new Pool({
  user: "labber",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

// TEST
// pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)})

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  queryString = `
    SELECT *
    FROM users
    WHERE users.email = $1;
  `;

  return pool
    .query(queryString, [email])
    .then((result) => {
      if (result.rows.length === 1) {
        return result.rows[0];
      }
      return null;
    })
    .catch((err) => {
      console.log(err.message);
    })
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  queryString = `
    SELECT *
    FROM users
    WHERE users.id = $1;
  `;

  return pool
    .query(queryString, [id])
    .then((result) => {
      if (result.rows.length === 1) {
        return result.rows[0];
      }
      return null;
    })
    .catch((err) => {
      console.log(err.message);
    })
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  queryString = `
    INSERT into users (name, email, password)
    VALUES ($1, $2, $3);
  `;

  return pool
    .query(queryString, [user.name, user.email, user.password])
    .then((result) => {
      if (result) return result.rows[0];
      return null;
    })
    .catch((err) => {
      console.log(err.message);
    })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
    SELECT properties.* reservations.*
    FROM properties
    JOIN reservations ON reservations.id = properties.id
    JOIN users ON reservations.id = users.id
    WHERE reservations.guest_id = 1$
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIIT $2;
  `;
  
  return pool
    .query(queryString, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      return console.log(err.message);
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // if <- checks if key value pair exists
  // ternary in queryString

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  // ternary in queryString to check whether to use AND or WHERE
  if (options.minimum_price_per_night) {
    queryString += `${queryParams.length ? 'AND' : 'WHERE'} ` ;
    const minPrice = options.minimum_price_per_night * 100;
    queryParams.push(minPrice);
    queryString += `cost_per_night > $${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    queryString += `${queryParams.length ? 'AND' : 'WHERE'} `;
    const maxPrice = options.maximum_price_per_night * 100;
    queryParams.push(maxPrice);
    queryString += `cost_per_night < $${queryParams.length}`;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `WHERE owner_id = $${queryParams.length}`
  }

  queryString += `
  GROUP BY properties.id
  `

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length}`
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams).then((result) => result.rows);

}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  return pool.query(`
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, street, city, province, post_code, country)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;`,
    [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.street, property.city, property.province, property.post_code, property.country])
  .then(result => result);
}
exports.addProperty = addProperty;
