/**
 * @desc Execute this file to create and enroll an admin at Organization 3.
 */


const {Wallets} = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {buildCAClient, enrollAdmin} = require('../fabric/tenderapp/application-javascript/CAUtil.js');
const {buildWallet, buildCCPOrg3} = require('../fabric/tenderapp/application-javascript/AppUtil.js');
const adminOrg3 = 'o3admin'
const adminOrg3Password = 'o3adminpw';

const mspOrg3 = 'Org3MSP';
const walletPath = path.join(__dirname, '../fabric/tenderapp/application-javascript/wallet');

/**
  * @description This functions enrolls the admin of Organization 3
  */
exports.enrollAdminOrg3 = async function() {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPOrg3();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(ccp, 'ca.org3.example.com');

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(walletPath);

    // to be executed and only once per Organization. Which enrolls admin and creates admin in the wallet
    await enrollAdmin(caClient, wallet, mspOrg3, adminOrg3, adminOrg3Passwd);

    console.log('msg: Successfully enrolled admin user ' + adminOrg3 + ' and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to enroll admin user ' + ${adminOrg3} + : ${error}`);
    process.exit(1);
  }
};
