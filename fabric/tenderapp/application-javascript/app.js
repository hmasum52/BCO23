/**
 * @desc The file which interacts with the fabric network.
 */


const { Gateway } = require('fabric-network');
const path = require('path');
const { buildCAClient, registerAndEnrollUser } = require('./CAUtil.js');
const { buildCCPOrg3, buildCCPOrg2, buildCCPOrg1, buildWallet } = require('./AppUtil.js');

// name can be changed in procurement-network/network.sh
const channelName = 'ittchannel';
// chaincodeName can be changed in tenderapp/startFabric.sh
const chaincodeName = 'tenderapp';

// for test-network
const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';
const mspOrg3 = 'Org3MSP';

const walletPath = path.join(__dirname, 'wallet');


/**
 * @param  {string} username
 * @return {networkObj} networkObj if all paramters are correct, the networkObj consists of contract, network, gateway
 * @return {string} response error if there is a error in the method
 * @description Connects to the network using the username, networkObj contains the paramters using which
 * @description a connection to the fabric network is possible.
 */
exports.connectToNetwork = async function (username) {
  const gateway = new Gateway();
  const ccp = buildCCPOrg1();
  try {
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await buildWallet(walletPath);

    const userExists = await wallet.get(username);
    if (!userExists) {
      console.log('An identity for the user: ' + username + ' does not exist in the wallet');
      console.log('Create the user before retrying');
      const response = {};
      response.error = 'An identity for the user ' + username + ' does not exist in the wallet. Register ' + username + ' first';
      return response;
    }

    /**
    * setup the gateway instance
    *  he user will now be able to create connections to the fabric network and be able to
    * ubmit transactions and query. All transactions submitted by this gateway will be
    * signed by this user using the credentials stored in the wallet.
    */
    // using asLocalhost as this gateway is using a fabric network deployed locally
    await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await gateway.getNetwork(channelName);

    // Get the contract from the network.
    const contract = network.getContract(chaincodeName);

    const networkObj = {
      contract: contract,
      network: network,
      gateway: gateway,
    };

    console.log('Succesfully connected to the network.');
    return networkObj;
  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    const response = {};
    response.error = error;
    return response;
  }
};


/**
 * @param  {Network} networkObj the object which is given when connectToNetwork is executed
 * @param  {boolean} isQuery true if retieving from ledger, else false in the case of add a transaction to the ledger.
 * @param  {string} func must be the function name in the chaincode.
 * @param  {string} args - a json string, if there are mutiple args, the args must be a json as one string
 * @return {string} response if the transaction was successful
 * @return {string} response error otherwise
 * @description A common function to interact with the ledger
 */
exports.invoke = async function (networkObj, isQuery, func, args = '') {
  try {
    if (isQuery === true) {
      const response = await networkObj.contract.evaluateTransaction(func, args);
      console.log(response);
      await networkObj.gateway.disconnect();
      return response;
    } else {
      console.log('invoking submitTransaction with arguments ');
      const response = await networkObj.contract.submitTransaction(func, args);
      console.log('submitTransaction success ');
      await networkObj.gateway.disconnect();
      return response;
    }
  } catch (error) {
    const response = {};
    response.error = error;
    console.error(`Failed to submit transaction: ${error}`);
    return response;
  }
};

/**
 * @param  {string} attributes JSON string in which userId, orgId and role must be present.
 * @description Creates a user and adds to the wallet to the given orgId
 */
exports.registerUser = async function (attributes) {
  console.log("app.js->registerUser(): ", attributes);
  const attrs = JSON.parse(attributes);
  const orgId = parseInt(attrs.orgId);
  const userId = attrs.userId;
  console.log("app.js->registerUser(): registering hopspital: ", orgId, "userid: ", userId);

  if (!userId || !orgId) {
    const response = {};
    response.error = 'Error! You need to fill all fields before you can register!';
    return response;
  }

  try {
    const wallet = await buildWallet(walletPath);
    // TODO: Must be handled in a config file instead of using if
    if (orgId === 1) {
      const ccp = buildCCPOrg1();
      const caClient = buildCAClient(ccp, 'ca.org1.example.com');
      await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'org1admin', attributes);
    } else if (orgId === 2) {
      const ccp = buildCCPOrg2();
      const caClient = buildCAClient(ccp, 'ca.org2.example.com');
      await registerAndEnrollUser(caClient, wallet, mspOrg2, userId, 'org2admin', attributes);
    } else if (orgId === 3) {
      const ccp = buildCCPOrg3();
      const caClient = buildCAClient(ccp, 'ca.org3.example.com');
      await registerAndEnrollUser(caClient, wallet, mspOrg3, userId, 'org3admin', attributes);
    }
    console.log(`Successfully registered user: + ${userId}`);
    const response = 'Successfully registered user: ' + userId;
    return response;
  } catch (error) {
    console.error(`Failed to register user + ${userId} + : ${error}`);
    const response = {};
    response.error = error;
    return response;
  }
};
