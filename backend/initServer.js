/* eslint-disable new-cap */
const {enrollAdminOrg1} = require('./enrollAdmin-Org1'); // 
const {enrollAdminOrg2} = require('./enrollAdmin-Org2');

/**
 * @description Function to initialise the backend server, enrolls and regsiter the admins
 * of each organizations
 * @description Need not run this manually, included as a prestart in package.json
 */
async function main() {
  console.log("===============Step - 1 : Enrolling Organization-1=======================");
  await enrollAdminOrg1();
  console.log("=======End===========\n\n");

  console.log("===============Step - 2 : Enrolling Organization-2======================");
  await enrollAdminOrg2();
  console.log("=======End===========\n\n");
}


main();
