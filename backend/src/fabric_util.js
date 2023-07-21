const {Wallets} = require("fabric-network");
const path = require("path");
/**
 * 
 * @param {string} currentWorkingDirectory 
 * @returns {Promise<Wallet>} an instance of Wallet
 */
exports.buildWallet = async function () {
    const walletPath = path.join(__dirname, '../../fabric/tenderapp/application-javascript/wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    return wallet;
}