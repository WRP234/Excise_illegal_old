export class GuiltBase {
    public IsActive: number;
    public LawGroupID: number;
    public LawGroupNo: string;
    public LawGroupName: string;
    public PartNo: string;
    public PartName: string;
    public CompareMasLawSection: CompareMasLawSection;
    public CompareMasLawSubSection: CompareMasLawSubSection;
    public CompareMasLawSubSectionRule: CompareMasLawSubSectionRule;
    public CompareMasLawGuiltBase: CompareMasLawGuiltBase;
    public CompareMasLawPenalty: CompareMasLawPenalty;
}

export class CompareMasLawSection
{
    public IsActive: number;
    public SectionNo: number;
    public SectionName: string;
    public SectionDesc1: string;
    public SectionDesc2: string;
    public SectionDesc3: string;
    public LawGroupID: number;
}

export class CompareMasLawSubSection
{
    public IsActive: number;
    public SubSectionID: number;
    public SubSectionNo: number;
    public SubSectionType: string;
    public SubSectionDesc: string;
    public SectionNo: number;
}

export class CompareMasLawSubSectionRule
{
    public IsActive: number;
    public SubSectionRuleID: number;
    public SubSectionID: number;
    public SectionNo: number;
}

export class CompareMasLawGuiltBase
{
    public IsActive: number;
    public GuiltBaseID: number;
    public GuiltBaseName: string;
    public Fine: string;
    public IsProve: number;
    public Remark: string;
}

export class CompareMasLawPenalty
{
    public IsActive: number;
    public SectionNo: number;
    public PenaltyDesc: string;
    public IsFinePrison: number;
    public IsFine: number;
    public FineRateMin: number;
    public FineRateMax: number;
    public FineMin: number;
    public FineMax: number;
    public IsImprison: number;
    public PrisonRateMin: number;
    public PrisonRateMax: number;
    public IsTaxPaid: number;
}