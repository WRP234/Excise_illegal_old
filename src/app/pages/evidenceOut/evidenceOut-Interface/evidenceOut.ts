import { Staff } from "./staff";
import { EvidenceOutDetail } from "../evidenceOut-Interface/evidenceOut-detail";

export interface EvidenceOut {
    EVIDENCE_OUT_ID: number;
    OFFICE_CODE: string;
    EVIDENCE_OUT_CODE?: string;
    EVIDENCE_OUT_DATE?: string;
    EVIDENCE_OUT_TYPE?: number;
    EVIDENCE_OUT_NO?: string;
    EVIDENCE_OUT_NO_DATE?: string;
    BOOK_NO?: string;
    RECEIPT_NO?: string;
    PAY_DATE?: string;
    APPROVE_DATE?: string;
    RETURN_DATE?: string;
    REMARK?: string;
    APPROVE_NO?: string;
    EVIDENCE_IN_ID?: number;
    WAREHOUSE_ID?: number;
    DELIVERY?: string;
    REMARK_CANCEL?: string;
    SEND_TO_OFFICE_CODE?: number;
    SEND_TO_OFFICE_NAME?: string;
    IS_ACTIVE: number;

    EvidenceOutStaff: Staff[];
    EvidenceOutItem: any[];
    EvidenceOutDetail: EvidenceOutDetail[];

    /** customs */
    EVIDENCE_OUT_TIME?: any;
    EVIDENCE_OUT_NO_TIME?: any;
    APPROVE_TIME?: any;

}

export interface Types {
    value: number;
    text: string;
}