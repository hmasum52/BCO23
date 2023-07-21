/**
 * @desc [The base TenderProposal class]
 * @author Hasan Masum(github: hmasum52)
 */

class TenderProposal {
    constructor(
        tender_proposal_id,
        reference_no,
        public_status,
        procurement_nature,
        title,
        ministry,
        division,
        organization,
        type,
        method,
        publishing_date_and_time,
        closing_date_and_time
    ) {
        this.tender_proposal_id = tender_proposal_id;
        this.reference_no = reference_no;
        this.public_status = public_status;
        this.procurement_nature = procurement_nature;
        this.title = title;
        this.ministry = ministry;
        this.division = division;
        this.organization = organization;
        this.type = type;
        this.method = method;
        this.publishing_date_and_time = publishing_date_and_time;
        this.closing_date_and_time = closing_date_and_time;
    }
}

module.exports = TenderProposal