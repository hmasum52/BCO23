/**
 * @desc Execute this file to create and enroll an admin at Organization 1.
 */
const path = require('path');
const {buildCAClient, enrollAdmin} = require('../fabric/tenderapp/application-javascript/CAUtil.js');
const {buildCCPOrg1, buildWallet} = require('../fabric/tenderapp/application-javascript/AppUtil.js');
const adminOrg1 = 'o1admin';
const adminOrg1Password = 'o1adminpw';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, '../fabric/tenderapp/application-javascript/wallet');

/**
 * @description This functions enrolls the admin of Org 1
 */
exports.enrollAdminOrg1 = async function() {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPOrg1();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(ccp, 'ca.org1.example.com');

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(walletPath);

    // to be executed and only once per organization. Which enrolls admin and creates admin in the wallet
    await enrollAdmin(caClient, wallet, mspOrg1, adminOrg1, adminOrg1Password);

    console.log('msg: Successfully enrolled admin user ' + adminOrg1 + ' and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to enroll admin user ' + ${adminOrg1} + : ${error}`);
    process.exit(1);
  }
};
