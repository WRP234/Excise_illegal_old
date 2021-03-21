import { FormControl, Validators } from "@angular/forms";

export class ProveStorageList {
    public EVIDENCE_IN_ID?: string; 
    public ARREST_ID?: string;
    public ARREST_CODE?: string;
    public LAWSUIT_NO?: string;
    public DELIVERY_NO?: string;
    public DELIVERY_DATE?: string;
    public DELIVERY_OFFICE_NAME?: string; 
    public DELIVERY_FULL_NAME?: string;
    public EVIDENCE_IN_CODE?: string;
    public EVIDENCE_IN_DATE?: string;
    public PROVE_FULL_NAME?: string;
    public RECEIVE_OFFICE_NAME?: string;
    public IS_RECEIVE?: string; 
    public IS_RECEIVE_TEXT?: string; 
    
}

export class ProveStorage {

    public DELIVERY_CODE?: string;
    public DELIVERY_OFFICE_NAME?: string;
    public DELIVERY_NO?: string;
    public DELIVERY_DATE?: string;
    public DELIVERY_TIME?: string;
    public DELIVERY_TITTLE?: string;
    public DELIVERY_DEAR?: string;
    public DELIVERY_FULL_NAME?: string;
    public DELIVERY_OPERATION_POS_NAME?: string;
    public DELIVERY_OPERATION_OFFICE_SHORT_NAME?: string;
    public ARREST_CODE?: string;
    public OCCURRENCE_DATE?: string;
    public OCCURRENCE_TIME?: string;
    public ARREST_STAFF_NAME?: string;
    public ARREST_OPREATION_POS_NAME?: string;
    public ARREST_OPERATION_OFFICE_SHORT_NAME?: string;
    public ARREST_OFFICE_NAME?: string;
    public EVIDENCE_IN_ID?: number;
    public DELIVERY_OFFICE_CODE?: string;
    public OPERATION_OFFICE_NAME?: string;
    public CONTRIBUTOR_ID?: number;
    public ARREST_ID?: number;
    public ARREST_OPERATION_OFFICE_NAME?: string;
    public ProveStorageLawsuitDetail? :ProveStorageLawsuitDetail[];
}

export class ProveStorageLawsuitDetail {
    public ARREST_ID?: number;
    public INDICTMENT_ID?: number;
    public LAWSUIT_ID?: number;
    public LAWSUIT_NO?: string;
    public LAWSUIT_NO_YEAR?: string;
    public LAWSUIT_DATE?: string;
    public LAWSUIT_STAFF_NAME?: string;
    public OPERATION_POS_NAME?: string;
    public OPERATION_OFFICE_SHORT_NAME?: string;
    public OPERATION_OFFICE_NAME?: string;
    public LAWSUIT_OFFICE_NAME?: string;
    public ProveStorageArrestLawbeaker? :ProveStorageArrestLawbeaker[];
}


export class ProveStorageArrestLawbeaker {
    public LAWBREAKER_ID?: number;
    public ARREST_ID?: number;
    public INDICTMENT_ID?: number;
    public PERSON_ID?: number;
    public LAWBREAKER_NAME?: string;
}


export class ProveStorageProduct {
    
    public EVIDENCE_IN_ITEM_ID?: number;
    public EVIDENCE_IN_ITEM_CODE?: string;
    public EVIDENCE_IN_ID?: number;
    public PRODUCT_DESC?: string;
    public DELIVERY_QTY?: number;
    public DELIVERY_QTY_UNIT?: string;
    public DELIVERY_SIZE?: number;
    public DELIVERY_SIZE_UNIT?: string;
    public DELIVERY_NET_VOLUMN?: number;
    public DELIVERY_NET_VOLUMN_UNIT?: string;
    public DAMAGE_QTY?: string;
    public DAMAGE_QTY_UNIT?: string;
    public DAMAGE_SIZE?: string;
    public DAMAGE_SIZE_UNIT?: string;
    public DAMAGE_NET_VOLUMN?: string;
    public DAMAGE_NET_VOLUMN_UNIT?: string;
    public STOCK_ID?: string;
    public RECEIVE_QTY?: string;
    public RECEIVE_QTY_UNIT?: string;
    public RECEIVE_SIZE?: string;
    public RECEIVE_SIZE_UNIT?: string;
    public RECEIVE_NET_VOLUMN?: string;
    public RECEIVE_NET_VOLUMN_UNIT?: string;
    public BALANCE_QTY?: string;
    public BALANCE_QTY_UNIT?: string;
    public BALANCE_SIZE?: string;
    public BALANCE_SIZE_UNIT?: string;
    public BALANCE_NET_VOLUMN?: string;
    public BALANCE_NET_VOLUMN_UNIT?: string;
    public COMMENT1?: string;

}

export class ProveStorageEvidenceIn {
    public EVIDENCE_IN_ID?: number;
    public EVIDENCE_IN_CODE?: string;
    public EVIDENCE_IN_DATE?: string;
    public RECEIVE_OFFICE_NAME?: string;
    public RECEIVE_OFFICE_CODE?: string;
    public COMMENT1?: string;
    public ProveStorageEvidenceInItem: ProveStorageEvidenceInItem[]
    public ProveStorageEvidenceInStaff: ProveStorageEvidenceInStaff[]
}

export class ProveStorageEvidenceInItem {
    
    public EVIDENCE_IN_ITEM_ID?: number;
    public EVIDENCE_IN_ITEM_CODE?: string;
    public EVIDENCE_IN_ID?: number;
    public PRODUCT_DESC?: string;
    public DELIVERY_QTY?: number;
    public DELIVERY_QTY_UNIT?: string;
    public DELIVERY_SIZE?: number;
    public DELIVERY_SIZE_UNIT?: string;
    public DELIVERY_NET_VOLUMN?: number;
    public DELIVERY_NET_VOLUMN_UNIT?: string;
    public DAMAGE_QTY?: number;
    public DAMAGE_QTY_UNIT?: string;
    public DAMAGE_SIZE?: number;
    public DAMAGE_SIZE_UNIT?: string;
    public DAMAGE_NET_VOLUMN?: number;
    public DAMAGE_NET_VOLUMN_UNIT?: string;
    public STOCK_ID?: number;
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
    public REMARK?: string;
}

export class ProveStorageEvidenceInStaff {
    public STAFF_ID?: number;
    public CONTRIBUTOR_ID?: number;
}


export const ProveStorageStaffFormControl = {
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
    { name: '', position: '', office: '', as: 'ประธานกรรมการ(ขก.2)' },
    { name: '', position: '', office: '', as: 'กรรมการ(ขก.2)' },
    { name: '', position: '', office: '', as: 'กรรมการและเลขานุการ(ขก.2)' },
    { name: '', position: '', office: '', as: 'เจ้าหน้าที่ตรวจรับของกลาง(ขก.1)' },
  ]





