/**
 * @desc Add admin of Org3. Execute node addOrg3.js to execute
 */


/* eslint-disable new-cap */
const {enrollAdminOrg3} = require('./enrollAdmin-Org3');


/**
 * @description enroll admin of org 3
 */
async function main() {
  await enrollAdminOrg3();
  //await initRedis3();
}

main();
