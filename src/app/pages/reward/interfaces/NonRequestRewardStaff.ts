export interface INonRequestRewardStaff {
  StaffID: number;
  StaffCode: string;
  TitleName: string;
  FirstName: string;
  LastName: string;
  PositionCode: string;
  PositionName: string;
  PosLevel: string;
  PosLevelName: string;
  DepartmentCode: string;
  DepartmentName: string;
  DepartmentLevel: string;
  OfficeCode: string;
  OfficeName: string;
  OfficeShortName: string;
  ContributorID: string;
}

export interface INonRequestRewardStaffgetByIndictmentID {
  IndictmentID: number;
}
