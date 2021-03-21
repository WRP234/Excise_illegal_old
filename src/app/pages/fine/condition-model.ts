export class ICompareCon {
    public CompareID?: string;
    public CompareDetailID?: string;
    public CompareDetailReceiptID?: string;
    public FineType?: string;
    public CompareFineID?: string;
    public ReceiptFineType?: string;
    public StaffID?: string;
    public ProgramCode?: string;
    public ProcessCode?: string;
}

export class ICompareConAdv
{
    public ArrestCode?: string;
    public LawsuitCOde?: string
    public ProveReportNo?: string
    public CompareCode?: string
    public CompareDateFrom?: string
    public CompareDateTo?: string
    public ProgramCode?: string
    public ProcessCode?: string;
    public Staff?: string;
    public Department?: string
}

export class ICompareMistreat
{
    public LawbreakerID?: string;
    public SectionNo?: string
}

export class IRateMistreat
{
    public SubSectionID?: string;
    public GroupCode?: string;
    public MistreatNo?: string;
    public MistreatVolume?: string;
}

export class ICompareIns
{
    public CompareID?: string;
    public CompareCode?: string;
    public CompareDate?: string;
    public CompareStationCode?: string;
    public CompareStation?: string;
    public CompareSubdistrictCode?: string;
    public CompareSubdistrict?: string;
    public CompareDistrictCode?: string;
    public CompareDistrict?: string;
    public CompareProvinceCode?: string;
    public CompareProvince?: string;
    public AccuserSubdistrictCode?: string;
    public AccuserSubdistrict?: string;
    public AccuserDistrictCode?: string;
    public AccuserDistrict?: string;
    public AccuserProvinceCode?: string;
    public AccuserProvince?: string;
    public IsOutside?: string;
    public LawsuitID?: string;
}