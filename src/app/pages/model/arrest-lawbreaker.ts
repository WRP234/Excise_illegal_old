import { ArrestLawbreakerAddress } from './arrest-lawbreaker-address';

export class ArrestLawbreaker {
    public LawbreakerID: number;
    public ArrestCode: string;
    public LawbreakerRefID: number;
    public EntityType: number;
    public CompanyTitleCode: string;
    public CompanyTitle: string;
    public CompanyName: string;
    public CompanyOtherName: string;
    public CompanyRegistrationNo: string;
    public CompanyLicenseNo: string;
    public CompanyFullName: string;
    public FoundedDate: string;
    public LicenseDateForm: string;
    public LicenseDateTo: string;
    public TaxID: string;
    public ExciseRegNo: string;
    public LawbreakerType: number;
    public LawbreakerTitleCode: string;
    public LawbreakerTitleName: string;
    public LawbreakerFirstName: string;
    public LawbreakerMiddleName: string;
    public LawbreakerLastName: string;
    public LawbreakerOtherName: string;
    public LawbreakerDesc: string;
    public LawbreakerFullName: string;
    public IDCard: string;
    public PassportNo: string;
    public VISAType: number;
    public PassportCountryCode: string;
    public PassportCountryName: string;
    public PassportDateIn: string;
    public PassportDateOut: string;
    public BirthDate: string;
    public GenderType: string;
    public BloodType: string;
    public NationalityCode: string;
    public NationalityNameTH: string;
    public RaceCode: string;
    public RaceName: string;
    public ReligionCode: string;
    public ReligionName: string;
    public MaritalStatus: number;
    public Career: string;
    public FatherName: string;
    public MotherName: string;
    public Remarks: string;
    public LinkPhoto: string;
    public PhotoDesc: string;
    public IsActive: number;
    public ArrestLawbreakerAddress: Array<ArrestLawbreakerAddress>;
    public IsNewItem: boolean;
}

class Types {
    public value: string;
    public text: string;
}

export const VISATypes: Types[] = [
    {
        value: '1',
        text: 'ประเภทคนเดินทางผ่านราชอาณาจักร (Transit Visa)'
    }, {
        value: '2',
        text: 'ประเภทนักท่องเที่ยว (Tourist Visa)'
    }
];

export const EntityTypes: Types[] = [
    {
        value: '1',
        text: 'บุคคลธรรมดา'
    }, {
        value: '2',
        text: 'นิติบุคคล'
    }
]

export const GenderTypes: Types[] = [
    {
        value: 'M',
        text: 'ชาย'
    }, {
        value: 'F',
        text: 'หญิง'
    }
]

export const LawbreakerTypes: Types[] = [
    {
        value: '0',
        text: 'ชาวต่างชาติ'
    }, {
        value: '1',
        text: 'ชาวไทย'
    }
]

export const MaritalStatus: Types[] = [
    {
        value: '1',
        text: 'โสด'
    }, {
        value: '2',
        text: 'สมรส'
    }, {
        value: '3',
        text: 'หย่าร้าง'
    }, {
        value: '4',
        text: 'หม้าย'
    },
]

