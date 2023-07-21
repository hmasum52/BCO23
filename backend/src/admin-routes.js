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

// get tender by id
/**
 * @swagger
 * /tenders/{id}:
 *   get:
 *     summary: Get a specific tender by ID
 *     description: Use this endpoint to get details of a specific tender by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the tender to retrieve.
 *         schema:
 *           type: integer
 *           format: int64
 *     tags:
 *       - Tender Proposal
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenderProposal'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message indicating unauthorized access.
 *                   example: Unauthorized. Please provide a valid token.
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message indicating forbidden access.
 *                   example: Access forbidden. You do not have permission to access this resource.
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message indicating that the tender with the given ID was not found.
 *                   example: Tender not found. Please provide a valid tender ID.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message indicating internal server error.
 *                   example: Internal Server Error. Please try again later.
 */
exports.getTenderProposalById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_ADMIN], userRole, res);
  // Set up and connect to Fabric Gateway using the username in header
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  console.log("invoking queryTenderProposal contract as admin.")
  const response = await network.invoke(
                      networkObj,
                      true,
                      capitalize(userRole) + 'Contract:readTenderProposal',
                      req.params.id
                    );
  const parsedResponse = await JSON.parse(response);
  if(parsedResponse.success === false){
    res.status(404).send(parsedResponse);
  } else {
    res.status(200).send(parsedResponse.tender);
  }
}


// create a tender proposal by invoking Contract:createTenderProposal chaincode method

/**
 * @param  {Request} req Role in the header, tender proposal details in the body
 * @param  {Response} res 201 response with the json of the created tender proposal
 * @description Creates a tender proposal in the ledger
 * @swagger
 * /tenders/create:
 *   post:
 *     summary: Create a new tender
 *     tags: [Tender Proposal]
 *     description: Use this endpoint to create a new tender.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TenderProposal'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenderProposal'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message indicating unauthorized access.
 *                   example: Unauthorized. Please provide a valid token.
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message indicating forbidden access.
 *                   example: Access forbidden. You do not have permission to access this resource.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message indicating internal server error.
 *                   example: Internal Server Error. Please try again later.
 */
exports.createTenderProposal = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_ADMIN], userRole, res);
  // Set up and connect to Fabric Gateway using the username in header
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  console.log("creating tender proposal from backend.")
  try{
    const response = await network.invoke(
      networkObj, 
      false, // isQuery
      capitalize(userRole) + 'Contract:createTenderProposal',
      JSON.stringify(req.body)
    );
    const parsedResponse = await JSON.parse(response);
    if(parsedResponse.success === false){
      // found duplicate tender proposal
      res.status(400).send(parsedResponse);
    } else {
      res.status(201).send(parsedResponse);
    }
  }catch(error){
    res.status(500).send({
      success: false,
      message: "Error in creating tender proposal",
    });
  }
}

