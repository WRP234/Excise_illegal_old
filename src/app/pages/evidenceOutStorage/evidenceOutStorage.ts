import { FormControl, Validators } from "@angular/forms";

export class EvidenceOutStorageList {
    public EVIDENCE_OUT_ID?: number;
    public EVIDENCE_OUT_CODE?: string;
    public EVIDENCE_OUT_DATE?: string;
    public EVIDENCE_OUT_TYPE?: string;
    public EVIDENCE_OUT_NO?: string;
    public EVIDENCE_OUT_NO_DATE?: string;
    public BOOK_NO?: string;
    public RECEIPT_NO?: string;
    public PAY_DATE?: string;
    public APPROVE_DATE?: string;
    public RETURN_DATE?: string;
    public APPROVE_NO?: string;
    public EVIDENCE_IN_ID?: number;
    public SEND_TO_OFFICE_CODE?: string;
    public SEND_TO_OFFICE_NAME?: string;
    public TEXT_EVIDENCE_OUT_DATE?: string;
    public TEXT_APPROVE_DATE?: string;
    public EvidenceOutStaff?: EvidenceOutStaff[]
}


export class EvidenceOutStockBalanceByLawsuitNo {
    public DELIVERY_NO?: string;
    public DELIVERY_DATE?: string;
    public EVIDENCE_IN_DATE?: string;
    public EVIDENCE_IN_ID?: number;
    public LAWSUIT_NO?: string;
    public EvidenceInItem?: EvidenceInItem[];
}

export class EvidenceInItem {
    public EVIDENCE_IN_ITEM_ID?: number;
    public EVIDENCE_IN_ITEM_CODE?: string;
    public EVIDENCE_IN_ID?: number;
    public PRODUCT_MAPPING_ID?: number;
    public PRODUCT_CODE?: string;
    public PRODUCT_REF_CODE?: string;
    public PRODUCT_GROUP_ID?: number;
    public PRODUCT_CATEGORY_ID?: number;
    public PRODUCT_TYPE_ID?: number;
    public PRODUCT_SUBTYPE_ID?: number;
    public PRODUCT_SUBSETTYPE_ID?: number;
    public PRODUCT_BRAND_ID?: number;
    public PRODUCT_SUBBRAND_ID?: number;
    public PRODUCT_MODEL_ID?: number;
    public PRODUCT_TAXDETAIL_ID?: number;
    public PRODUCT_GROUP_CODE?: number;
    public PRODUCT_GROUP_NAME?: string;
    public PRODUCT_CATEGORY_CODE?: number;
    public PRODUCT_CATEGORY_NAME?: string;
    public PRODUCT_TYPE_CODE?: number;
    public PRODUCT_TYPE_NAME?: string;
    public PRODUCT_SUBTYPE_CODE?: number;
    public PRODUCT_SUBTYPE_NAME?: string;
    public PRODUCT_SUBSETTYPE_CODE?: number;
    public PRODUCT_SUBSETTYPE_NAME?: string;
    public PRODUCT_BRAND_CODE?: number;
    public PRODUCT_BRAND_NAME_TH?: string;
    public PRODUCT_BRAND_NAME_EN?: string;
    public PRODUCT_SUBBRAND_CODE?: number;
    public PRODUCT_SUBBRAND_NAME_TH?: string;
    public PRODUCT_SUBBRAND_NAME_EN?: string;
    public PRODUCT_MODEL_CODE?: number;
    public PRODUCT_MODEL_NAME_TH?: string;
    public PRODUCT_MODEL_NAME_EN?: string;
    public LICENSE_PLATE?: string;
    public ENGINE_NO?: string;
    public CHASSIS_NO?: string;
    public PRODUCT_DESC?: string;
    public SUGAR?: number;
    public CO2?: number;
    public DEGREE?: number;
    public PRICE?: number;
    public DELIVERY_QTY?: number;
    public DELIVERY_QTY_UNIT?: string;
    public DELIVERY_SIZE?: number;
    public DELIVERY_SIZE_UNIT?: string;
    public DELIVERY_NET_VOLUMN?: number;
    public DELIVERY_NET_VOLUMN_UNIT?: string;
    public DAMAGE_QTY?: number;
    public DAMAGE_QTY_UNIT?: string;
    public DAMAGE_SIZE?: string;
    public DAMAGE_SIZE_UNIT?: string;
    public DAMAGE_NET_VOLUMN?: number;
    public DAMAGE_NET_VOLUMN_UNIT?: string;
    public IS_DOMESTIC?: number;
    public IS_ACTIVE?: number;
    public REMARK?: string;
    public EvidenceOutStockBalance?: EvidenceStockBalance[];

}

export class EvidenceStockBalance {
    public STOCK_ID?: number;
    public EVIDENCE_IN_ITEM_ID?: number;
    public WAREHOUSE_ID?: number;
    public RECEIVE_QTY?: number;
    public RECEIVE_QTY_UNIT?: string;
    public RECEIVE_SIZE?: number;
    public RECEIVE_SIZE_UNIT?: string;
    public RECEIVE_NET_VOLUMN?: number;
    public RECEIVE_NET_VOLUMN_UNIT?: string;
    public BALANCE_QTY?: number;
    public BALANCE_QTY_UNIT?: string;
    public BALANCE_SIZE?: number;
    public BALANCE_SIZE_UNIT?: string;
    public BALANCE_NET_VOLUMN?: number;
    public BALANCE_NET_VOLUMN_UNIT?: string;
    public IS_FINISH?: number;
    public IS_RECEIVE?: number;
}

export class EvidenceOut {
    public EVIDENCE_OUT_ID?: number;
    public OFFICE_CODE?: number;
    public EVIDENCE_OUT_CODE?: string;
    public EVIDENCE_OUT_DATE?: string;
    public EVIDENCE_OUT_TYPE?: number;
    public EVIDENCE_OUT_NO?: string;
    public EVIDENCE_OUT_NO_DATE?: string;
    public BOOK_NO?: string;
    public RECEIPT_NO?: string;
    public PAY_DATE?: string;
    public APPROVE_DATE?: string;
    public RETURN_DATE?: string;
    public REMARK?: string;
    public APPROVE_NO?: string;
    public IS_ACTIVE?: number;
    public EVIDENCE_IN_ID?: number;
    public WAREHOUSE_ID?: number;
    public DELIVERY?: string;
    public REMARK_CANCEL?: string;
    public SEND_TO_OFFICE_CODE?: string;
    public SEND_TO_OFFICE_NAME?: string;
    public EvidenceOutDetail?: EvidenceOutDetail[];
    public EvidenceOutItem?: EvidenceOutItem[];
    public EvidenceOutStaff?: EvidenceOutStaff[];

}

export class EvidenceOutDetail {
    public EVIDENCE_OUT_DETAIL_ID?: number;
    public EVIDENCE_OUT_ID?: number;
    public EVIDENCE_IN_ID?: number;
    public IS_ACTIVE?: number;

}

export class EvidenceOutItem {
    public EVIDENCE_OUT_ITEM_ID?: number;
    public EVIDENCE_OUT_ID?: number;
    public STOCK_ID?: number;
    public QTY?: number;
    public QTY_UNIT?: string;
    public PRODUCT_SIZE?: number;
    public PRODUCT_SIZE_UNIT?: string;
    public NET_VOLUMN?: number;
    public NET_VOLUMN_UNIT?: string;
    public IS_RETURN?: number;
    public IS_ACTIVE?: number;
    public COST?: number;
    public RECEIPT_NO?: string;
    public BOOK_NO?: string;

}

export class EvidenceOutStaff {
    public STAFF_ID?: number;
    public CONTRIBUTOR_ID?: number;
    public TITLE_SHORT_NAME_TH?: string;
    public FIRST_NAME?: string;
    public LAST_NAME?: string;
    public OPERATION_OFFICE_SHORT_NAME?: string;
}

export const EvidenceOutStorageStaffFormControl = {
    STAFF_ID: new FormControl(""),
    STAFF_REF_ID: new FormControl(""),
    TITLE_SHORT_NAME_TH: new FormControl(""),
    FIRST_NAME: new FormControl(""),
    LAST_NAME: new FormControl(""),
    OPREATION_POS_NAME: new FormControl(""),
    OPERATION_OFFICE_SHORT_NAME: new FormControl(""),
    STATUS: new FormControl(""),
    REMARK: new FormControl(""),
    IS_ACTIVE: new FormControl(""),
    FULL_NAME: new FormControl("", Validators.required),
    TITLE_ID: new FormControl(""),
    STAFF_CODE: new FormControl(""),
    ID_CARD: new FormControl(""),
    STAFF_TYPE: new FormControl(""),
    TITLE_NAME_TH: new FormControl(""),
    TITLE_NAME_EN: new FormControl(""),
    TITLE_SHORT_NAME_EN: new FormControl(""),
    AGE: new FormControl(""),
    OPERATION_POS_CODE: new FormControl(""),
    OPREATION_POS_LEVEL: new FormControl(""),
    OPERATION_POS_LEVEL_NAME: new FormControl(""),
    OPERATION_DEPT_CODE: new FormControl(""),
    OPERATION_DEPT_NAME: new FormControl(""),
    OPERATION_DEPT_LEVEL: new FormControl(""),
    OPERATION_UNDER_DEPT_CODE: new FormControl(""),
    OPERATION_UNDER_DEPT_NAME: new FormControl(""),
    OPERATION_UNDER_DEPT_LEVEL: new FormControl(""),
    OPERATION_WORK_DEPT_CODE: new FormControl(""),
    OPERATION_WORK_DEPT_NAME: new FormControl(""),
    OPERATION_WORK_DEPT_LEVEL: new FormControl(""),
    OPERATION_OFFICE_CODE: new FormControl(""),
    OPERATION_OFFICE_NAME: new FormControl(""),
    MANAGEMENT_POS_CODE: new FormControl(""),
    MANAGEMENT_POS_NAME: new FormControl(""),
    MANAGEMENT_POS_LEVEL: new FormControl(""),
    MANAGEMENT_POS_LEVEL_NAME: new FormControl(""),
    MANAGEMENT_DEPT_CODE: new FormControl(""),
    MANAGEMENT_DEPT_NAME: new FormControl(""),
    MANAGEMENT_DEPT_LEVEL: new FormControl(""),
    MANAGEMENT_UNDER_DEPT_CODE: new FormControl(""),
    MANAGEMENT_UNDER_DEPT_NAME: new FormControl(""),
    MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(""),
    MANAGEMENT_WORK_DEPT_CODE: new FormControl(""),
    MANAGEMENT_WORK_DEPT_NAME: new FormControl(""),
    MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(""),
    MANAGEMENT_OFFICE_CODE: new FormControl(""),
    MANAGEMENT_OFFICE_NAME: new FormControl(""),
    MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(""),
    REPRESENT_POS_CODE: new FormControl(""),
    REPRESENT_POS_NAME: new FormControl(""),
    REPRESENT_POS_LEVEL: new FormControl(""),
    REPRESENT_POS_LEVEL_NAME: new FormControl(""),
    REPRESENT_DEPT_CODE: new FormControl(""),
    REPRESENT_DEPT_NAME: new FormControl(""),
    REPRESENT_DEPT_LEVEL: new FormControl(""),
    REPRESENT_UNDER_DEPT_CODE: new FormControl(""),
    REPRESENT_UNDER_DEPT_NAME: new FormControl(""),
    REPRESENT_UNDER_DEPT_LEVEL: new FormControl(""),
    REPRESENT_WORK_DEPT_CODE: new FormControl(""),
    REPRESENT_WORK_DEPT_NAME: new FormControl(""),
    REPRESENT_WORK_DEPT_LEVEL: new FormControl(""),
    REPRESENT_OFFICE_CODE: new FormControl(""),
    REPRESENT_OFFICE_NAME: new FormControl(""),
    REPRESENT_OFFICE_SHORT_NAME: new FormControl(""),
    CONTRIBUTOR_ID: new FormControl(null),
    IsNewItem: new FormControl(null),
    IsActive: new FormControl(null),
    StaffFullName: new FormControl(""),
    DeptLevel: new FormControl("")
}

export const ContibutorName: any[] = [
    { name: '', position: '', office: '', as: 'ผู้ขอโอนย้าย' },
    { name: '', position: '', office: '', as: 'ผู้พิจารณาอนุมัติ' },
    { name: '', position: '', office: '', as: 'ผู้นำออก' }
]








