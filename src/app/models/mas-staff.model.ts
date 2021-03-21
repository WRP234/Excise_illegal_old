
export interface MasStaffModel {
    StaffCode: string;
    PerType: number;
    TitleName: string;
    FirstName: string;
    LastName: string;
    OperationPosCode: string;
    OperationPosName: string;
    ManagementPosCode: string;
    ManagementPosName: string;
    PosLevel: string;
    PosLevelName: string;
    RepresentationPosCode: string;
    RepresentationPosName: string;
    OperationDeptCode: string;
    OperationDeptName: string;
    UnderDeptCode: string;
    UnderDeptName: string;
    DeptLevel: string;
    OfficeCode: string;
    OfficeName: string;
    OfficeShortName: string;
    StatusCode: string;
    IsActive: number;

    FullName: string;
}

export interface MasStaffModel_New {
    STAFF_ID: number;
    TITLE_ID: number;
    STAFF_CODE: string;
    ID_CARD: string;
    STAFF_TYPE: number;
    TITLE_NAME_TH: string;
    TITLE_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
    FIRST_NAME: string;
    LAST_NAME: string;
    OPERATION_POS_CODE: string;
    OPREATION_POS_NAME: string;
    OPREATION_POS_LEVEL: string;
    OPERATION_POS_LEVEL_NAME: string;
    OPERATION_DEPT_CODE: string;
    OPERATION_DEPT_NAME: string;
    OPERATION_DEPT_LEVEL: string;
    OPERATION_UNDER_DEPT_CODE: string;
    OPERATION_UNDER_DEPT_NAME: string;
    OPERATION_UNDER_DEPT_LEVEL: string;
    OPERATION_WORK_DEPT_CODE: string;
    OPERATION_WORK_DEPT_NAME: string;
    OPERATION_WORK_DEPT_LEVEL: string;
    OPERATION_OFFICE_CODE: string;
    OPERATION_OFFICE_NAME: string;
    OPERATION_OFFICE_SHORT_NAME: string;
    MANAGEMENT_POS_NAME: string;
    MANAGEMENT_POS_CODE: string;
    MANAGEMENT_POS_LEVEL: string;
    MANAGEMENT_POS_LEVEL_NAME: string;
    MANAGEMENT_DEPT_CODE: string;
    MANAGEMENT_DEPT_NAME: string;
    MANAGEMENT_DEPT_LEVEL: string;
    MANAGEMENT_UNDER_DEPT_CODE: string;
    MANAGEMENT_UNDER_DEPT_NAME: string;
    MANAGEMENT_UNDER_DEPT_LEVEL: string;
    MANAGEMENT_WORK_DEPT_CODE: string;
    MANAGEMENT_WORK_DEPT_NAME: string;
    MANAGEMENT_WORK_DEPT_LEVEL: string;
    MANAGEMENT_OFFICE_CODE: string;
    MANAGEMENT_OFFICE_NAME: string;
    MANAGEMENT_OFFICE_SHORT_NAME: string;
    STATUS: number;
    REMARK: string;
    IS_ACTIVE: number;
}
