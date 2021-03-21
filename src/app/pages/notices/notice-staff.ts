import { FormControl, Validators } from "@angular/forms";

export class NoticeStaff {
  public STAFF_ID: string;
  public NOTICE_ID: string;
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
  public STAFF_CODE: string;
  public ID_CARD: string;
  public STAFF_TYPE: string;
  public TITLE_NAME_TH: string;
  public TITLE_NAME_EN: string;
  public TITLE_SHORT_NAME_EN: string;
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
  public IsNewItem: boolean;
  public IsUpdate: boolean;

  //    public StaffID: string;
  //    public ProgramCode: string;
  //    public ProcessCode: string;
  //    public NOTICE_ID: string;
  //    public NoticeCode: string;
  //    public StaffCode: string;
  //    public TitleName: string;
  //    public FirstName: string;
  //    public LastName: string;
  //    public PositionCode: string;
  //    public PositionName: string;
  //    public PosLevel: string;
  //    public PosLevelName: string;
  //    public DepartmentCode: string;
  //    public DepartmentName: string;
  //    public DepartmentLevel: string;
  //    public OfficeCode: string;
  //    public OfficeName: string;
  //    public OfficeShortName: string;
  public ContributorCode: string;

  public IsActive: number;
  public StaffFullName: string;

  public DeptLevel: string;
  // public ContributorID: number;
}

export const NoticeStaffFormControl = {
  STAFF_ID: new FormControl(""),
  NOTICE_ID: new FormControl(""),
  STAFF_REF_ID: new FormControl(""),
  TITLE_SHORT_NAME_TH: new FormControl(""),
  FIRST_NAME: new FormControl(""),
  LAST_NAME: new FormControl(""),
  OPREATION_POS_NAME: new FormControl(""),
  OPERATION_OFFICE_SHORT_NAME: new FormControl(""),
  STATUS: new FormControl(""),
  REMARK: new FormControl(""),
  IS_ACTIVE: new FormControl(""),
  FULL_NAME: new FormControl(""),

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
  CONTRIBUTOR_ID: new FormControl(""),
  IsNewItem: new FormControl(false),
  IsUpdate: new FormControl(false),

  // StaffID: new FormControl(null),
  // ProgramCode: new FormControl('XCS60-02-02'),
  // ProcessCode: new FormControl('0002'),
  // NoticeCode: new FormControl(null, Validators.required),
  // StaffCode: new FormControl(null, Validators.required),
  // TitleName: new FormControl(null),
  // FirstName: new FormControl(null, Validators.required),
  // LastName: new FormControl(null),
  // PositionCode: new FormControl(null),
  // PositionName: new FormControl(null),
  // PosLevel: new FormControl(null),
  // PosLevelName: new FormControl(null),
  // DepartmentCode: new FormControl(null),
  // DepartmentName: new FormControl(null),
  // DepartmentLevel: new FormControl(null),
  // OfficeCode: new FormControl(null),
  // OfficeName: new FormControl(null),
  // OfficeShortName: new FormControl(null),
  // ContributorCode: new FormControl(null),
  // IsActive: new FormControl(1),
  // StaffFullName: new FormControl(null),

  // DeptLevel: new FormControl(null),
  // ContributorID: new FormControl
};
