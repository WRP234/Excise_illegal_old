import { FormControl, Validators } from '@angular/forms';

export class LawsuitArrestStaff {
    public StaffID: number;
    public ProgramCode: string;
    public ProcessCode: string;
    public ArrestCode: string;
    public StaffCode: string;
    public TitleName: string;
    public FirstName: string;
    public LastName: string;
    public FullName: string;
    public PositionCode: string;
    public PositionName: string;
    public PosLevel: string;
    public PosLevelName: string;
    public DepartmentCode: string;
    public DepartmentName: string;
    public DepartmentLevel: string;
    public OfficeCode: string;
    public OfficeName: string;
    public OfficeShortName: string;
    public ContributorID: number;
    public IsActive: number;
  }
  
  export const LawsuitArrestStaffFormControl = {
    StaffID: new FormControl(null),
    ProgramCode: new FormControl('XCS60-04-02'),
    ProcessCode: new FormControl('0002'),
    LawsuitID: new FormControl(null, Validators.required),
    StaffCode: new FormControl(null, Validators.required),
    TitleName: new FormControl(null),
    FirstName: new FormControl(null, Validators.required),
    LastName: new FormControl(null),
    PositionCode: new FormControl(null),
    PositionName: new FormControl(null),
    PosLevel: new FormControl(null),
    PosLevelName: new FormControl(null),
    DepartmentCode: new FormControl(null),
    DepartmentName: new FormControl(null),
    DepartmentLevel: new FormControl(null),
    OfficeCode: new FormControl(null),
    OfficeName: new FormControl(null),
    OfficeShortName: new FormControl(null),
    ContributorCode: new FormControl(null),
    IsActive: new FormControl(null),
    // FullName: new FormControl(this.TitleName+" "+this.FirstName+" "+this.LastName)
  }
