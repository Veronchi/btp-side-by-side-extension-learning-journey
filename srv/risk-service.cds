using {riskmanagement as rm} from '../db/schema';

@path: 'service/risk'
service RiskService {
    @cds.redirection.target:true
    entity Risks   as projection on rm.Risks;
    annotate Risks with @odata.draft.enabled;

    entity Mitigations as projection on rm.Mitigations;
    annotate Mitigations with @odata.draft.enabled;

    entity ListOfRisks as select from rm.Risks {
        ID, title, owner
    } actions {
        action changeRisk(ID: UUID, newTitle: String, newOwner: String)
    }


// BusinessPartner will be used later
//@readonly entity BusinessPartners as projection on rm.BusinessPartners;
}
