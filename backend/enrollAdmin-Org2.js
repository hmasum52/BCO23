/**
 * @desc Execute this file to create and enroll an admin at Organization 2.
 */

const path = require('path');
const {buildCAClient, enrollAdmin} = require('../fabric/tenderapp/application-javascript/CAUtil.js');
const {buildCCPOrg2, buildWallet} = require('../fabric/tenderapp/application-javascript/AppUtil.js');
const adminOrg2 =  'o2admin';
const adminOrg2Password = 'o2adminpw';

const mspOrg2 = 'Org2MSP'
const walletPath = path.join(__dirname, '../fabric/tenderapp/application-javascript/wallet');

/**
 * @description This functions enrolls the admin of Organization 2
 */
exports.enrollAdminOrg2 = async function() {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPOrg2();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(ccp, 'ca.org2.example.com');

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(walletPath);

    // to be executed and only once per Organization. Which enrolls admin and creates admin in the wallet
    await enrollAdmin(caClient, wallet, mspOrg2, adminOrg2, adminOrg2Password);

    console.log('msg: Successfully enrolled admin user ' + adminOrg2 + ' and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to enroll admin user ' + ${adminOrg2} + : ${error}`);
    process.exit(1);
  }
};
