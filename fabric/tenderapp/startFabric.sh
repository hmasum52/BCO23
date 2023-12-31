#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_SRC_LANGUAGE="javascript"
CC_SRC_PATH="../chaincode/tenderapp/javascript/"

# clean out any old identites in the wallets
rm -rf application-javascript/wallet/*

# launch network; create channel and join peer to channel
pushd ../procurement-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn tenderapp -ccv 1 -cci initLedger -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_PATH}
popd

cat <<EOF

Procurment network is up and running....
Total setup execution time : $(($(date +%s) - starttime)) secs ...

EOF
