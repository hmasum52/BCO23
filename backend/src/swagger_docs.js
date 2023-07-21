// components

//========== Tender Proposal ==========
/**
 * @swagger
 *  components:
 *    schemas:
 *      TenderProposal:
 *        type: object
 *        properties:
 *          tender_proposal_id:
 *            type: string
 *            description: The ID of the tender/proposal.
 *          reference_no:
 *            type: string
 *            description: The reference number of the tender/proposal.
 *          public_status:
 *            type: string
 *            description: The public status of the tender/proposal.
 *          procurement_nature:
 *            type: string
 *            description: The nature of procurement.
 *          title:
 *            type: string
 *            description: The title of the tender/proposal.
 *          ministry:
 *            type: string
 *            description: The ministry associated with the tender/proposal.
 *          division:
 *            type: string
 *            description: The division associated with the tender/proposal.
 *          organization:
 *            type: string
 *            description: The organization associated with the tender/proposal.
 *          type:
 *            type: string
 *            description: The type of the tender/proposal.
 *          method:
 *            type: string
 *            description: The method of procurement.
 *          publishing_date_and_time:
 *            type: string
 *            format: date-time
 *            description: The date and time when the tender/proposal was published.
 *          closing_date_and_time:
 *            type: string
 *            format: date-time
 *            description: The date and time when the tender/proposal will be closed.
 */

// create swagger authentication tag
/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: User authentication
 */


// ========== Login route ==========

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login to the application
 *     tags: [Authentication]
 *     description: Use this endpoint to log in to the application.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: o1admin
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: o1adminpw
 *               orgId:
 *                 type: integer
 *                 description: The ID of the organization.
 *                 example: 1
 *               role:
 *                 type: string
 *                 description: The role of the user.
 *                 example: admin
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The authentication token for the user session.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im8xYWRtaW4iLCJpYXQiOjE2MzE1NDI3MDMsImV4cCI6MTYzMTU0NjMwM30.tW9o3qNxr1Ez3y-egbvAbWU0ovEeRjIm0nMkKTuwvcI
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
 *                   example: Invalid credentials.
 */

// ============================================
// ========== Tender Proposal routes ==========
// ============================================

// ========== Get all tender proposals ==========


// crate tender proposal tag
/**
 * @swagger
 * tags:
 *  name: Tender Proposal
 *  description: All tender proposal routes
 */



/**
 * @swagger
 * /tenders:
 *   get:
 *     summary: Get tender list
 *     tags: [Tender Proposal]
 *     description: Use this endpoint to get a list of tenders.
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TenderProposal'
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
