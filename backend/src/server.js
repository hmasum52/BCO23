/* eslint-disable new-cap */
/**
 * @desc NodeJS APIs to interact with the fabric network.
 * @desc Look into API docs for the documentation of the routes
 */


// Classes for Node Express
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');
const bcyrpt = require('bcryptjs');

const jwtSecretToken = 'password';
const refreshSecretToken = 'refreshpassword';
let refreshTokens = [];


/// swagger config
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const options = {
  "definition": {
      "openapi": "3.1.0",
      "info": {
          "title": "Tender App API",
          "description": "API endpoints",
          "version": "1.0.0"
      },
      "server": [
          {
              "url": "http://127.0.0.1:8052"
          }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            in: 'header',
            name: 'Authorization',
            description: 'Bearer token to access these api endpoints',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
  },
  "apis": ["./src/*.js"]
}

// Express Application init
dotenv.config();
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

// swagger
let swaggerDocument = swaggerJsDoc(options);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(8052, () => console.log('Backend server running on 8052'));

// Bring key classes into scope

const adminRoutes = require('./admin-routes');
const {ROLE_ADMIN } = require('../utils');
const { capitalize, getMessage } = require('../utils');
const network = require('../../fabric/tenderapp/application-javascript/app.js');
const { buildWallet } = require('./fabric_util');



const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (token === '' || token === 'null') {
      return res.status(401).send('Unauthorized request: Token is missing');
    }
    jwt.verify(token, jwtSecretToken, (err, user) => {
      if (err) {
        return res.status(403).send('Unauthorized request: Wrong or expired token found');
      }
      req.user = user;
      console.log("user is authenticated")
      console.log(user)
      req.headers.username = user.username;
      req.headers.role = user.role;
      next();
    });
  } else {
    return res.status(401).send('Unauthorized request: Token is missing');
  }
};

/**
 * @description Generates a new accessToken
 */
function generateAccessToken(username, role) {
  return jwt.sign({ username: username, role: role }, jwtSecretToken, { expiresIn: '30m' });
}

async function getUser(username) {
  const wallet = await buildWallet();
  return await wallet.get(username);
}

/**
 * @description Login and create a session with and add two variables to the session
 */
app.post('/login', async (req, res) => {
  // Read username and password from request body
  console.log("/login")
  console.log(req.body);
  let { username, password, orgId, role } = req.body;
  orgId = parseInt(orgId);
  let user;

  if (role === ROLE_ADMIN) {
    const tempuser = await getUser(username);
    console.log(`User from wallet ${tempuser}`)
    //hashedPassword = tempuser.mspId.split(" ")[1];
    //console.log(`hashedPassword: ${hashedPassword}`)
    //const validPassword = await bcyrpt.compare(password, hashedPassword);
    //if(validPassword) 
      user = tempuser;
    //else {
      // response unauthorized
     // res.status(401).send({ error: 'Password incorrect!' })
    //}
  }

  if (user) {
    // Generate an access token
    const accessToken = generateAccessToken(username, role);
    const refreshToken = jwt.sign({ username: username, role: role }, refreshSecretToken);
    refreshTokens.push(refreshToken);
    // Once the password is matched a session is created with the username and password
    res.status(200);
    res.json({
      accessToken,
      refreshToken,
    });
  } else {
    res.status(401).send({ message: 'Invalid credentials.' });
  }
});

/**
 * @description Creates a new accessToken when refreshToken is passed in post request
 */
app.post('/token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, refreshSecretToken, (err, username) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = generateAccessToken({ username: username, role: req.headers.role });
    res.json({
      accessToken,
    });
  });
});

/**
 * @description Logout to remove refreshTokens
 */
app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.headers.token);
  res.sendStatus(204);
});

// //////////////////////////////// Admin Routes //////////////////////////////////////
app.get('/tenders', authenticateJWT, adminRoutes.getAllTenderProposals);
app.post('/tenders/create', authenticateJWT, adminRoutes.createTenderProposal);
// get tender by id
app.get('/tenders/:id', authenticateJWT, adminRoutes.getTenderProposalById);
