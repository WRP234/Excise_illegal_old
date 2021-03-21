export class ArrestStaff {
    public StaffID = '';
    public ProgramCode = '';
    public ProcessCode = '';
    public ArrestCode = '';
    public StaffCode = '';
    public TitleName = '';
    public FirstName = '';
    public LastName = '';
    public PositionCode = '';
    public PositionName = '';
    public PosLevel = '';
    public PosLevelName = '';
    public DepartmentCode = '';
    public DepartmentName = '';
    public DepartmentLevel = '';
    public OfficeCode = '';
    public OfficeName = '';
    public OfficeShortName = '';
    public ContributorCode = '';
    public ContributorID = '';
    public IsActive = '';
    public FullName = '';
    public IsNewItem: boolean;
}

class Types {
    public value: string;
    public text: string;
}

export const Contributor: Types[] = [
    {
        value: '1',
        text: 'contributor1'
    }, {
        value: '2',
        text: 'contributor2'
    }
]
