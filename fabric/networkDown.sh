#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -ex

rm -rf **/wallet/*

# Bring the test network down
pushd procurement-network
./network.sh down
popd
