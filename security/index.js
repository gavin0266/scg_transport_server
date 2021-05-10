var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

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

var checkRole = (user, roles) => {
    return roles.includes(user['https://scg-af-logistic-k6kq2.ondigitalocean.app/user_authorization'].roles)
}

module.exports = { authenticated, checkRole };