/**
 * @desc Referenced from https://github.com/hyperledger/fabric-samples/tree/master/test-application/javascript
 */

const { Wallets } = require('fabric-network');
const { buildCcp } = require('./fabricUtil');

// const variables
const networkName = "procurement-network";

/**
 * @return {JSON} ccp
 * @description Creates a connection profile and returns the network config to Orgital 1. Reads the JSON file created
 * @description When CA is created there is a json for each Org which specfies the connection profile.
 */
exports.buildCCPOrg1 = () => {
  // load the common connection configuration file
  console.log("======== start buildCCPOrg1 =========");
  return buildCcp(networkName, 'org1.example.com', 'connection-org1.json');
};

/**
 * @return {ccp} ccp
 * @description Creates a connection profile and returns the network config to Orgital 2. Reads the JSON file created
 * @description When CA is created there is a json for each Org which specfies the connection profile.
 */
exports.buildCCPOrg2 = () => {
  console.log("======== start buildCCPOrg2 =========");
  return buildCcp(networkName, 'org2.example.com', 'connection-org2.json');
};

/**
 * @return {ccp} ccp
 * @description Creates a connection profile and returns the network config to Org 3. Reads the JSON file created
 * @description When CA is created there is a json for each Org which specfies the connection profile.
 */
exports.buildCCPOrg3 = () => {
  // load the common connection configuration file
  console.log("======== start buildCCPOrg2 =========");
  return buildCppPath(networkName, 'org3.example.com', 'connection-org3.json');
};

/**
 * @param  {string} walletPath is the path of wallet folder
 * @return {wallet} wallet
 * @description If there is no wallet presents, a new wallet is created else , returns the wallet that is present.
 */
exports.buildWallet = async (walletPath) => {
  // Create a new  wallet : Note that wallet is for managing identities.
  let wallet;
  console.log(`AppUtil.js->buildWallet: Wallet path: ${walletPath}`);
  wallet = await Wallets.newFileSystemWallet(walletPath);
  /* if (walletPath) {
    wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Built a file system wallet at ${walletPath}`);
  } else {
    wallet = await Wallets.newInMemoryWallet();
    console.log('Built an in memory wallet');
  } */
  return wallet;
};

/**
 * @param {string} inputString
 * @return {string} jsonString
 * @description Formats the string to JSON
 */
exports.prettyJSONString = (inputString) => {
  if (inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
  } else {
    return inputString;
  }
};
