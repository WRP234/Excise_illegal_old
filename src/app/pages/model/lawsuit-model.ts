export class Lawsuit {
    public AccuserTestimony: string;
    public DeliveryDate: Date;
    public DeliveryTime: string;
    public DeliveryDocNo: string;
    public DeliveryDocNo2: string;
    public IndictmentID: number;
    public IsActive: number;
    public IsLawsuit: number;
    public IsOutside: string;
    public LawsuitDate: Date;
    public LawsuitID: number;
    public LawsuitNo: string;
    public LawsuitResult: string;
    public LawsuitStation: string;
    public LawsuitStationCode: string;
    public LawsuitTime: string;
    public ReasonDontLawsuit: string;
    public LawsuiteStaff: LawsuiteStaff[];
}

export class LawsuiteStaff
{
    public ContributorID: number;
    public DepartmentCode: string;
    public DepartmentLevel: string;
    public DepartmentName: string;
    public FirstName: string;
    public IsActive: number;
    public LastName: string;
    public StaffID: number;
    public ProgramCode: string;
    public ProcessCode: string;
    public TitleName: string;
    public LawsuitID: number;
    public OfficeCode: string;
    public OfficeName: string;
    public OfficeShortName: string;
    public PosLevel: string;
    public PosLevelName: string;
    public PositionCode: string;
    public PositionName: string;
    public StaffCode: string;
}