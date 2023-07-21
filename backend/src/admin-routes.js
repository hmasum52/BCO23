/* eslint-disable new-cap */
/**
 * @desc Admin specific methods - API documentation in http://localhost:3002/ swagger editor.
 */

// Bring common classes into scope, and Fabric SDK network class
const { ROLE_ADMIN, capitalize, getMessage, validateRole } = require('../utils.js');
const network = require('../../fabric/tenderapp/application-javascript/app.js');
const { compareSync } = require('bcryptjs');


/**
 * @param  {Request} req Role in the header
 * @param  {Response} res 200 response with the json of all the assets(tenders) in the ledger
 * @description Retrieves all the assets(tenders) in the ledger
 */
exports.getAllTenderProposals = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_ADMIN], userRole, res);
  // Set up and connect to Fabric Gateway using the username in header
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  console.log("invoking queryAllTenderProposals contract as admin.")
  const response = await network.invoke(
                      networkObj, 
                      true,
                      capitalize(userRole) + 'Contract:queryAllTenderProposals',
                      '' // empty args
                    );
  const parsedResponse = await JSON.parse(response);
  res.status(200).send(parsedResponse);
};
