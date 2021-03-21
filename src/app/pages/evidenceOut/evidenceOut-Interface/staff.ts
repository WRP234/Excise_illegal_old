import { FormControl } from "@angular/forms";

export class staff {
    public EVIDENCE_OUT_STAFF_ID: string;
    public EVIDENCE_OUT_ID: string;
    public STAFF_REF_ID: string;
    public TITLE_SHORT_NAME_TH: string;
    public FIRST_NAME: string;
    public LAST_NAME: string;
    public OPREATION_POS_NAME: string;
    public OPERATION_OFFICE_SHORT_NAME: string;
    public STATUS: string;
    public REMARK: string;
    public IS_ACTIVE: string;
    public FULL_NAME: string;
    public TITLE_ID: string;
    public STAFF_ID: number;
    public STAFF_CODE: string;
    public ID_CARD: string;
    public STAFF_TYPE: string;
    public TITLE_NAME_TH: string;
    public TITLE_NAME_EN: string;
    public TITLE_SHORT_NAME_EN: string;
    public BIRTH_DATE: string;
    public AGE: string;
    public OPERATION_POS_CODE: string;
    public OPREATION_POS_LEVEL: string;
    public OPERATION_POS_LEVEL_NAME: string;
    public OPERATION_DEPT_CODE: string;
    public OPERATION_DEPT_NAME: string;
    public OPERATION_DEPT_LEVEL: string;
    public OPERATION_UNDER_DEPT_CODE: string;
    public OPERATION_UNDER_DEPT_NAME: string;
    public OPERATION_UNDER_DEPT_LEVEL: string;
    public OPERATION_WORK_DEPT_CODE: string;
    public OPERATION_WORK_DEPT_NAME: string;
    public OPERATION_WORK_DEPT_LEVEL: string;
    public OPERATION_OFFICE_CODE: string;
    public OPERATION_OFFICE_NAME: string;
    public MANAGEMENT_POS_CODE: string;
    public MANAGEMENT_POS_NAME: string;
    public MANAGEMENT_POS_LEVEL: string;
    public MANAGEMENT_POS_LEVEL_NAME: string;
    public MANAGEMENT_DEPT_CODE: string;
    public MANAGEMENT_DEPT_NAME: string;
    public MANAGEMENT_DEPT_LEVEL: string;
    public MANAGEMENT_UNDER_DEPT_CODE: string;
    public MANAGEMENT_UNDER_DEPT_NAME: string;
    public MANAGEMENT_UNDER_DEPT_LEVEL: string;
    public MANAGEMENT_WORK_DEPT_CODE: string;
    public MANAGEMENT_WORK_DEPT_NAME: string;
    public MANAGEMENT_WORK_DEPT_LEVEL: string;
    public MANAGEMENT_OFFICE_CODE: string;
    public MANAGEMENT_OFFICE_NAME: string;
    public MANAGEMENT_OFFICE_SHORT_NAME: string;
    public REPRESENT_POS_CODE: string;
    public REPRESENT_POS_NAME: string;
    public REPRESENT_POS_LEVEL: string;
    public REPRESENT_POS_LEVEL_NAME: string;
    public REPRESENT_DEPT_CODE: string;
    public REPRESENT_DEPT_NAME: string;
    public REPRESENT_DEPT_LEVEL: string;
    public REPRESENT_UNDER_DEPT_CODE: string;
    public REPRESENT_UNDER_DEPT_NAME: string;
    public REPRESENT_UNDER_DEPT_LEVEL: string;
    public REPRESENT_WORK_DEPT_CODE: string;
    public REPRESENT_WORK_DEPT_NAME: string;
    public REPRESENT_WORK_DEPT_LEVEL: string;
    public REPRESENT_OFFICE_CODE: string;
    public REPRESENT_OFFICE_NAME: string;
    public REPRESENT_OFFICE_SHORT_NAME: string;
    public CONTRIBUTOR_ID: number;

    /** customs */
    public NEW_ITEM: boolean;
    public IS_REQUIRE: boolean;
}


export const EviStaffFC = {
    EVIDENCE_OUT_ID: new FormControl(""),
    EVIDENCE_OUT_STAFF_ID: new FormControl(""),
    STAFF_REF_ID: new FormControl(""),
    TITLE_SHORT_NAME_TH: new FormControl(""),
    FIRST_NAME: new FormControl(""),
    LAST_NAME: new FormControl(""),
    OPREATION_POS_NAME: new FormControl(""),
    OPERATION_OFFICE_SHORT_NAME: new FormControl(""),
    STATUS: new FormControl(""),
    REMARK: new FormControl(""),
    TITLE_ID: new FormControl(""),
    STAFF_ID: new FormControl(""),
    STAFF_CODE: new FormControl(""),
    ID_CARD: new FormControl(""),
    STAFF_TYPE: new FormControl(""),
    TITLE_NAME_TH: new FormControl(""),
    TITLE_NAME_EN: new FormControl(""),
    TITLE_SHORT_NAME_EN: new FormControl(""),
    BIRTH_DATE: new FormControl(""),
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
    CONTRIBUTOR_ID: new FormControl(""),
    IS_ACTIVE: new FormControl(""),

    /** customs */
    FULL_NAME: new FormControl(""),
    NEW_ITEM: new FormControl(null),
    IS_REQUIRE: new FormControl(null)
}

export interface Staff {
    EVIDENCE_OUT_STAFF_ID?: number;
    EVIDENCE_OUT_ID?: number;
    STAFF_REF_ID?: number;
    TITLE_ID?: number;
    STAFF_ID?: number;
    STAFF_CODE: string;
    ID_CARD: string;
    STAFF_TYPE?: number;
    TITLE_NAME_TH: string;
    TITLE_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
    FIRST_NAME: string;
    FULL_NAME: string;
    LAST_NAME: string;
    BIRTH_DATE: string;
    AGE?: number;
    OPERATION_POS_CODE: string;
    OPREATION_POS_NAME: string;
    OPREATION_POS_LEVEL: string;
    OPERATION_POS_LEVEL_NAME: string;
    OPERATION_DEPT_CODE: string;
    OPERATION_DEPT_NAME: string;
    OPERATION_DEPT_LEVEL?: number;
    OPERATION_UNDER_DEPT_CODE: string;
    OPERATION_UNDER_DEPT_NAME: string;
    OPERATION_UNDER_DEPT_LEVEL?: number;
    OPERATION_WORK_DEPT_CODE: string;
    OPERATION_WORK_DEPT_NAME: string;
    OPERATION_WORK_DEPT_LEVEL?: number;
    OPERATION_OFFICE_CODE: string;
    OPERATION_OFFICE_NAME: string;
    OPERATION_OFFICE_SHORT_NAME: string;
    MANAGEMENT_POS_CODE: string;
    MANAGEMENT_POS_NAME: string;
    MANAGEMENT_POS_LEVEL: string;
    MANAGEMENT_POS_LEVEL_NAME: string;
    MANAGEMENT_DEPT_CODE: string;
    MANAGEMENT_DEPT_NAME: string;
    MANAGEMENT_DEPT_LEVEL?: number;
    MANAGEMENT_UNDER_DEPT_CODE: string;
    MANAGEMENT_UNDER_DEPT_NAME: string;
    MANAGEMENT_UNDER_DEPT_LEVEL?: number;
    MANAGEMENT_WORK_DEPT_CODE: string;
    MANAGEMENT_WORK_DEPT_NAME: string;
    MANAGEMENT_WORK_DEPT_LEVEL?: number;
    MANAGEMENT_OFFICE_CODE: string;
    MANAGEMENT_OFFICE_NAME: string;
    MANAGEMENT_OFFICE_SHORT_NAME: string;
    REPRESENTATION_POS_CODE: string;
    REPRESENTATION_POS_NAME: string;
    REPRESENTATION_POS_LEVEL: string;
    REPRESENTATION_POS_LEVEL_NAME: string;
    REPRESENTATION_DEPT_CODE: string;
    REPRESENTATION_DEPT_NAME: string;
    REPRESENTATION_DEPT_LEVEL?: number;
    REPRESENTATION_UNDER_DEPT_CODE: string;
    REPRESENTATION_UNDER_DEPT_NAME: string;
    REPRESENTATION_UNDER_DEPT_LEVEL?: number;
    REPRESENT_WORK_DEPT_CODE: string;
    REPRESENT_WORK_DEPT_NAME: string;
    REPRESENT_WORK_DEPT_LEVEL?: number;
    REPRESENT_OFFICE_CODE: string;
    REPRESENT_OFFICE_NAME: string;
    REPRESENT_OFFICE_SHORT_NAME: string;
    STATUS?: number;
    REMARK: string;
    CONTRIBUTOR_ID?: number;
    IS_ACTIVE?: number;

    /** customs */
    ACTION: string;
    NEW_ITEM: boolean;
    IS_REQUIRE: boolean;

}

export const StaffVariable: Staff = {
    EVIDENCE_OUT_STAFF_ID: null,
    EVIDENCE_OUT_ID: null,
    STAFF_REF_ID: null,
    TITLE_ID: null,
    STAFF_ID: null,
    STAFF_CODE: null,
    ID_CARD: null,
    STAFF_TYPE: null,
    TITLE_NAME_TH: null,
    TITLE_NAME_EN: null,
    TITLE_SHORT_NAME_TH: null,
    TITLE_SHORT_NAME_EN: null,
    FIRST_NAME: null,
    FULL_NAME: null,
    LAST_NAME: null,
    AGE: null,
    BIRTH_DATE: null,
    OPERATION_POS_CODE: null,
    OPREATION_POS_NAME: null,
    OPREATION_POS_LEVEL: null,
    OPERATION_POS_LEVEL_NAME: null,
    OPERATION_DEPT_CODE: null,
    OPERATION_DEPT_NAME: null,
    OPERATION_DEPT_LEVEL: null,
    OPERATION_UNDER_DEPT_CODE: null,
    OPERATION_UNDER_DEPT_NAME: null,
    OPERATION_UNDER_DEPT_LEVEL: null,
    OPERATION_WORK_DEPT_CODE: null,
    OPERATION_WORK_DEPT_NAME: null,
    OPERATION_WORK_DEPT_LEVEL: null,
    OPERATION_OFFICE_CODE: null,
    OPERATION_OFFICE_NAME: null,
    OPERATION_OFFICE_SHORT_NAME: null,
    MANAGEMENT_POS_CODE: null,
    MANAGEMENT_POS_NAME: null,
    MANAGEMENT_POS_LEVEL: null,
    MANAGEMENT_POS_LEVEL_NAME: null,
    MANAGEMENT_DEPT_CODE: null,
    MANAGEMENT_DEPT_NAME: null,
    MANAGEMENT_DEPT_LEVEL: null,
    MANAGEMENT_UNDER_DEPT_CODE: null,
    MANAGEMENT_UNDER_DEPT_NAME: null,
    MANAGEMENT_UNDER_DEPT_LEVEL: null,
    MANAGEMENT_WORK_DEPT_CODE: null,
    MANAGEMENT_WORK_DEPT_NAME: null,
    MANAGEMENT_WORK_DEPT_LEVEL: null,
    MANAGEMENT_OFFICE_CODE: null,
    MANAGEMENT_OFFICE_NAME: null,
    MANAGEMENT_OFFICE_SHORT_NAME: null,
    REPRESENTATION_POS_CODE: null,
    REPRESENTATION_POS_NAME: null,
    REPRESENTATION_POS_LEVEL: null,
    REPRESENTATION_POS_LEVEL_NAME: null,
    REPRESENTATION_DEPT_CODE: null,
    REPRESENTATION_DEPT_NAME: null,
    REPRESENTATION_DEPT_LEVEL: null,
    REPRESENTATION_UNDER_DEPT_CODE: null,
    REPRESENTATION_UNDER_DEPT_NAME: null,
    REPRESENTATION_UNDER_DEPT_LEVEL: null,
    REPRESENT_WORK_DEPT_CODE: null,
    REPRESENT_WORK_DEPT_NAME: null,
    REPRESENT_WORK_DEPT_LEVEL: null,
    REPRESENT_OFFICE_CODE: null,
    REPRESENT_OFFICE_NAME: null,
    REPRESENT_OFFICE_SHORT_NAME: null,
    STATUS: 1,
    REMARK: null,
    CONTRIBUTOR_ID: null,
    IS_ACTIVE: 1,

    /** customs */
    ACTION: null,
    NEW_ITEM: null,
    IS_REQUIRE: null
}

export class staffDelete {
    EVIDENCE_OUT_STAFF_ID: string
}

export interface Types {
    value: number;
    text: string;
    is_req: boolean;
}
