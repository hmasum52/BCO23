/**
 * @desc [Primary Smartcontract to initiate ledger with Tender Proposal details]
 */

'use strict';

const { Contract } = require('fabric-contract-api');
let TenderProposal = require('./TenderProposal.js');
let initTenders = require('./tenders.json');

class PrimaryContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        for (let i = 0; i < initTenders.length; i++) {
            await ctx.stub.putState(initTenders[i].tender_proposal_id, Buffer.from(JSON.stringify(initTenders[i])));
            console.info('Added <--> ', initTenders[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    //Read tender proposal details based on proposalId
    async readTenderProposal(ctx, tenderProposalId) {
        const exists = await this.tenderProposalExists(ctx, tenderProposalId);
        if (!exists) {
            throw new Error(`The tender ${proposalId} does not exist`);
        }

        const buffer = await ctx.stub.getState(tenderProposalId);
        let asset = JSON.parse(buffer.toString());
        asset = ({
            tender_proposal_id : asset.tender_proposal_id,
            reference_no : asset.reference_no,
            public_status : asset.public_status,
            procurement_nature : asset.procurement_nature,
            title : asset.title,
            ministry : asset.ministry,
            division : asset.division,
            organization : asset.organization,
            type : asset.type,
            method : asset.method,
            publishing_date_and_time : asset.publishing_date_and_time,
            closing_date_and_time : asset.closing_date_and_time,
        });
        return asset;
    }

    async tenderProposalExists(ctx, proposalId) {
        const buffer = await ctx.stub.getState(proposalId);
        return (!!buffer && buffer.length > 0);
    }

    async getQueryResultForQueryString(ctx, queryString) {
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        console.info('getQueryResultForQueryString <--> ', resultsIterator);
        let results = await this.getAllTenderProposals(resultsIterator, false);
        return JSON.stringify(results);
    }

    async getAllTenderProposals(iterator, isHistory) {
        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));

                if (isHistory && isHistory === true) {
                    jsonRes.Timestamp = res.value.timestamp;
                }
                jsonRes.Key = res.value.key;

                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return allResults;
            }
        }
    }
}
module.exports = PrimaryContract;