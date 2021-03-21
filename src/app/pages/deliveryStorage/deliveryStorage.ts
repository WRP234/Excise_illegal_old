import { FormControl, Validators } from "@angular/forms";

export class DeliveryStorageList {
    public ARREST_ID?: string;
    public ARREST_CODE?: string;
    public OCCURRENCE_DATE?: string;
    public LAWSUIT_NO?: string;
    public LAWSUIT_DATE?: string;
    public DELIVERY_NO?: string;
    public DELIVERY_DATE?: string;
    public DELIVERY_OFFICE_NAME?: string; 
    public IS_RECEIVE?: string; 
    public DELIVERY_FULL_NAME?: string; 
    public IS_RECEIVE_TEXT?: string; 
    public EVIDENCE_IN_ID?: string; 

    public OCCURRENCE_DATE_SORT?: string;
    public LAWSUIT_DATE_SORT?: string;
    public DELIVERY_DATE_SORT?: string;
}

export class DeliveryStorage {
    public ARREST_ID?: number;
    public ARREST_CODE?: string;
    public OCCURRENCE_DATE?: string;
    public OCCURRENCE_TIME?: string;
    public ARREST_STAFF_NAME?: string;
    public OPERATION_POS_NAME?: string;
    public OPERATION_OFFICE_SHORT_NAME?: string;
    public OPERATION_OFFICE_NAME?: string;
    public ARREST_OFFICE_NAME?: string;
    public DeliveryStorageLawsuitDetail? :DeliveryStorageLawsuitDetail[];
}

export class DeliveryStorageLawsuitDetail {
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
    public DeliveryStorageArrestLawbeaker? :DeliveryStorageArrestLawbeaker[];
}


export class DeliveryStorageArrestLawbeaker {
    public LAWBREAKER_ID?: number;
    public ARREST_ID?: number;
    public INDICTMENT_ID?: number;
    public PERSON_ID?: number;
    public LAWBREAKER_NAME?: string;
}


export class DeliveryStorageProduct {
    public PRODUCT_ID?: number;
    public PRODUCT_GROUP_ID?: number;
    public PRODUCT_GROUP_CODE?: string;
    public PRODUCT_GROUP_NAME?: string;
    public PRODUCT_CATEGORY_CODE?: string;
    public PRODUCT_CATEGORY_NAME?: string;
    public PRODUCT_DESC?: string;
    public DEGREE?: number;
    public PRICE?: number;
    public SIZES?: number;
    public SIZES_UNIT?: string;
    public QUANTITY?: number;
    public QUANTITY_UNIT?: string;
    public VOLUMN?: number;
    public VOLUMN_UNIT?: string;
    public REMAIN_PRODUCT_ID?: number;
    public ARREST_PRODUCT_ID?: number;
    public REMAIN_SIZES?: number;
    public REMAIN_SIZES_UNIT?: string;
    public REMAIN_QUANTITY?: number;
    public REMAIN_QUANTITY_UNIT?: string;
    public REMAIN_VOLUMN?: number;
    public REMAIN_VOLUMN_UNIT?: string;
}

export class DeliveryStorageEvidenceIn {
    public EVIDENCE_IN_ID?: number;
    public ARREST_ID?: number;
    public DELIVERY_CODE?: string;
    public DELIVERY_NO?: string;
    public DELIVERY_DATE?: string;
    public DELIVERY_OFFICE_CODE?: string;
    public DELIVERY_OFFICE_NAME?: string;
    public DELIVERY_TITTLE?: string;
    public DELIVERY_DEAR?: string;
    public REMARK?: string;
    public DeliveryStorageEvidenceInItem: DeliveryStorageEvidenceInItem[]
    public DeliveryStorageEvidenceInStaff: DeliveryStorageEvidenceInStaff[]
}

export class DeliveryStorageEvidenceInItem {
    public PRODUCT_GROUP_ID?: number;
    public EVIDENCE_IN_ITEM_CODE?: string;
    public PRODUCT_GROUP_CODE?: string;
    public PRODUCT_GROUP_NAME?: string;
    public PRODUCT_CATEGORY_CODE?: string;
    public PRODUCT_CATEGORY_NAME?: string;
    public PRODUCT_DESC?: string;
    public DEGREE?: number;
    public PRICE?: number;
    public DELIVERY_SIZE?: number;
    public DELIVERY_SIZE_UNIT?: string;
    public DELIVERY_QTY?: number;
    public DELIVERY_QTY_UNIT?: string;
    public DELIVERY_NET_VOLUMN?: number;
    public DELIVERY_NET_VOLUMN_UNIT?: number;
}

export class DeliveryStorageEvidenceInStaff {
    public STAFF_ID?: number;
}


export const DeliveryStorageStaffFormControl = {
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
    { name: '', position: '', office: '', as: 'ผู้นำส่งของกลาง' }
  ]





