/**
 * @desc [Admin Smartcontract to create, read TenderProposal details in legder]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

let TenderProposal = require('./TenderProposal.js');
const PrimaryContract = require('./primary-contract.js');

class AdminContract extends PrimaryContract {

    //Returns the last TenderProposal in the set
    async getLatestTenderProposalId(ctx) {
        let allResults = await this.queryAllTenderProposals(ctx);
        return allResults[allResults.length - 1].tender_proposal_id;
    }


    //Create TenderProposal in the ledger
    async createTenderProposal(ctx, args) {
        args = JSON.parse(args);

        let newTenderProposal = await new TenderProposal(
            args.tender_proposal_id,
            args.reference_no,
            args.public_status,
            args.procurement_nature,
            args.title,
            args.ministry,
            args.division,
            args.organization,
            args.type,
            args.method,
            args.publishing_date_and_time,
            args.closing_date_and_time
        );
        const exists = await this.tenderProposalExists(ctx, newTenderProposal.tender_proposal_id);
        if (exists) {
            throw new Error(`The tender ${newTenderProposal.tender_proposal_id} already exists`);
        }
        const buffer = Buffer.from(JSON.stringify(newTenderProposal));
        await ctx.stub.putState(newTenderProposal.tender_proposal_id, buffer);
    }


    //Read tenderProposal details based on tenderProposalId
    async readTenderProposal(ctx, tenderProposalId) {
        let asset = await super.readTenderProposal(ctx, tenderProposalId)
        return asset;
    }


    //Delete tenderProposal from the ledger based on tenderProposalId
    async deleteTenderProposal(ctx, tenderProposalId) {
        const exists = await this.tenderProposalExists(ctx, tenderProposalId);
        if (!exists) {
            throw new Error(`The tender ${tenderProposalId} does not exist`);
        }
        await ctx.stub.deleteState(tenderProposalId);
    }


    // Read the TenderProposal details based on the Organization Name
    async queryTenderProposalByOrganizationName(ctx, orgName) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.organization = orgName;
        const buffer = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        let asset = JSON.parse(buffer.toString());
        return asset;
    }

    //Retrieves all TenderProposal details
    async queryAllTenderProposals(ctx) {
        let resultsIterator = await ctx.stub.getStateByRange('', '');
        let asset = await this.getAllTenderProposals(resultsIterator, false);
        return asset;
    }



}
module.exports = AdminContract;