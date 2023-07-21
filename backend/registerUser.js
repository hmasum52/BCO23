/**
 * @desc This file creates a user named 'appUser' at Organization 1. 
 */

const path = require('path');
const { buildCAClient, registerAndEnrollUser } = require('../fabric/tenderapp/application-javascript/CAUtil.js');
const walletPath = path.join(__dirname, '../fabric/tenderapp/application-javascript/wallet');
const { buildCCPOrg1, buildCCPOrg2, buildWallet, buildCCPOrg3 } = require('../fabric/tenderapp/application-javascript/AppUtil.js');
let mspOrg;
let adminUserId;
let caClient;

/**
 * @param {String} orgId
 * @param {string} userId
 * @param {String} attributes
 */
exports.enrollRegisterUser = async function (orgId, userId, attributes) {
    try {
        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(walletPath);
        orgId = parseInt(orgId);

        if (orgId === 1) {
            // build an in memory object with the network configuration (also known as a connection profile)
            const ccp = buildCCPOrg1();

            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            caClient = buildCAClient( ccp, 'ca.org1.example.com');

            mspOrg = 'Org1MSP';
            adminUserId = 'o1admin';
        } else if (orgId === 2) {
            // build an in memory object with the network configuration (also known as a connection profile)
            const ccp = buildCCPOrg2();

            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            caClient = buildCAClient( ccp, 'ca.org2.example.com');

            mspOrg = "Org2MSP"
            adminUserId = 'o2admin';
        } else if (orgId === 3) {
            // build an in memory object with the network configuration (also known as a connection profile)
            const ccp = buildCCPOrg3();

            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            caClient = buildCAClient( ccp, 'ca.org3.example.com');

            mspOrg = 'Org3MSP';
            adminUserId = 'o3admin';
        }
        // enrolls users to Organization 1 and adds the user to the wallet
        await registerAndEnrollUser(caClient, wallet, mspOrg, userId, adminUserId, attributes);
        console.log('msg: Successfully enrolled user ' + userId + ' and imported it into the wallet');
    } catch (error) {
        console.error(`Failed to register user "${userId}": ${error}`);
        process.exit(1);
    }
};