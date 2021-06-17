var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var axios = require("axios");


var auth0_namespace = 'https://scg-af-logistic-k6kq2.ondigitalocean.app/'

var authenticated = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://scg-transport.au.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://scg-transport-server-v8z43.ondigitalocean.app',
    issuer: 'https://scg-transport.au.auth0.com/',
    algorithms: ['RS256']
});

var getAuth0AccessToken = async () => {
  var options = {
    method: 'POST',
    url: 'https://scg-transport.au.auth0.com/oauth/token',
    headers: {'content-type': 'application/json'},
    data: {
      grant_type: 'client_credentials',
      client_id: process.env['AUTH0_CLIENT_ID'],
      client_secret: process.env['AUTH0_CLIENT_SECRET'],
      audience: 'https://scg-transport.au.auth0.com/api/v2/'
    }
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.log(error.response);
  }
  
}
var checkRole = (user, roles) => {
    return roles.includes(user[auth0_namespace + 'user_authorization'].roles)
}

var getUserEmail = (user) => {
  return user[auth0_namespace + 'email'];
}

module.exports = { authenticated, checkRole, getUserEmail, getAuth0AccessToken };