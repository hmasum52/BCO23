/**
 * @desc Referenced from https://github.com/hyperledger/fabric-samples/tree/master/test-application/javascript
 */
const bcyrpt = require('bcryptjs');
const FabricCAServices = require("fabric-ca-client");

/**
 *
 * @param {*} ccp is the connection profile
 * @param {string} caHostName example: "ca.org1.example.com"
 * @return {FabricCAServices} caClient
 * @description Create a new CA client for interacting with the CA.
 */
exports.buildCAClient = (ccp, caHostName) => {
  const caInfo = ccp.certificateAuthorities[caHostName]; // lookup CA details from config
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const caClient = new FabricCAServices(caInfo.url, {trustedRoots: caTLSCACerts, verify: false}, caInfo.caName);

  console.log(`Built a CA Client named ${caInfo.caName}`);
  return caClient;
};

/**
 * @param  {FabricCAServices} caClient
 * @param  {Wallet} wallet
 * @param  {string} orgMspId e.g. "Org1MSP"
 * @param  {string} adminUserId e.g. 'admin'
 * @param  {string} adminUserPasswd e.g. 'adminpw'
 * @description Enrolls an admin to the orgMspId
 */
exports.enrollAdmin = async (caClient, wallet, orgMspId, adminUserId, adminUserPasswd) => {
  try {
    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(adminUserId);
    //console.log(identity);
    if (identity) {
      console.log('An identity for the admin user already exists in the wallet');
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await caClient.enroll({
      enrollmentID: adminUserId, 
      enrollmentSecret: adminUserPasswd
    });

    const hashedPassword = await bcyrpt.hash(adminUserPasswd, 10);
    console.log(`CAUtil.js-> ${adminUserId}: `, adminUserPasswd, hashedPassword);

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: 'X.509',
    };

    await wallet.put(adminUserId, x509Identity);
    console.log('Successfully enrolled admin user and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to enroll admin user : ${error}`);
  }
};


/**
 * @param  {FabricCAServices} caClient
 * @param  {Wallet} wallet
 * @param  {string} orgMspId
 * @param  {string} userId
 * @param  {string} adminUserId
 * @param  {string} attributes
 * @param  {string} affiliation e.g. "org1.department1"
 * @description Method to create the user and enroll to the organization and adds the user to the wallet.
 */
exports.registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, adminUserId, attributes, affiliation) => {
  try {
    // Check to see if we've already enrolled the user
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
      console.error(`An identity for the user ${userId} already exists in the wallet`);
      throw new Error(`An identity for the user ${userId} already exists in the wallet`);
    }

    console.log("registerAndEnrollUser: userIdentity ok....");

    // Must use an admin to register a new user
    const adminIdentity = await wallet.get(adminUserId);
    //console.log("admin identity: ");
    //console.log(adminIdentity);
    if (!adminIdentity) {
      console.log(`An identity for the admin user ${adminUserId} does not exist in the wallet`);
      throw new Error(`An identity for the admin user ${adminUserId} does not exist in the wallet`);
    }

    console.log("registerAndEnrollUser: userIdentity ok....");

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

    // Get all the parameters from the JSON string
    attributes = JSON.parse(attributes);
    const firstName = attributes.firstName;
    const lastName = attributes.lastName;
    const role = attributes.role;

    // Register the user, enroll the user, and import the new identity into the wallet.
    // if affiliation is specified by client, the affiliation value must be configured in CA
    // NOTE: Pubic key can be added into attrs
    const secret = await caClient.register({
      affiliation: affiliation,
      enrollmentID: userId,
      // NOTE: Role must be client, other roles access is denied
      // TODO: Check if other roles access can be granted in the ca config files of the organizations.
      // Changes to be made in fabric-ca-server-config.yaml ?? hf.Registrar.Roles and maps
      role: 'client',
      attrs: [{
        name: 'firstName',
        value: firstName,
        ecert: true,
      },
      {
        name: 'lastName',
        value: lastName,
        ecert: true,
      },
      {
        name: 'role',
        value: role,
        ecert: true,
      },],
    }, adminUser);

    console.log("registerAndEnrollUser: secret created....");

    const enrollment = await caClient.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret,
      attrs: [{
        name: 'firstName',
        value: firstName,
        ecert: true,
      },
      {
        name: 'lastName',
        value: lastName,
        ecert: true,
      },
      {
        name: 'role',
        value: role,
        ecert: true,
      }],
    });

    const pass = attributes.password;
    //console.log(userId, pass);
    const hashedPassword = await bcyrpt.hash(attributes.password, 10);
    console.log(`CAUtil.js->registerAndEnrollUser(): ${userId}`, hashedPassword);
    
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: 'X.509',
    };

    await wallet.put(userId, x509Identity);
    console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
  } catch (error) {
    console.error(`CAUtil.js->registerAndEnrollUser(): Failed to register user ${userId} : ${error}`);
    throw new Error(`Failed to register user ${userId}`);
  }
};
