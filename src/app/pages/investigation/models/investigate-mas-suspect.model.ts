import { Acceptability } from "./acceptability";
import { FormControl } from "@angular/forms";

export class InvestigateMasSuspectModel {
    SuspectID: number;
    EntityType: number;
    CompanyTitleCode: string;
    CompanyTitle: string;
    CompanyName: string;
    CompanyOtherName: string;
    CompanyRegistrationNo: string;
    CompanyLicenseNo: string;
    FoundedDate: any;
    LicenseDateForm: any;
    LicenseDateTo: any;
    TaxID: string;
    ExciseRegNo: string;
    SuspectReferenceID: number;
    SuspectType: number;
    SuspectTitleCode: string;
    SuspectTitleName: string;
    SuspectFirstName: string;
    SuspectMiddleName: string;
    SuspectLastName: string;
    SuspectOtherName: string;
    SuspectDesc: string;
    IDCard: string;
    PassportNo: string;
    VISAType: number;
    PassportCountryCode: string;
    PassportCountryName: string;
    PassportDateIn: any;
    PassportDateOut: any;
    BirthDate: any;
    GenderType: string;
    BloodType: string;
    NationalityCode: string;
    NationalityNameTH: string;
    RaceCode: string;
    RaceName: string;
    ReligionCode: string;
    ReligionName: string;
    MaritalStatus: string;
    Career: string;
    GPS: string;
    Location: string;
    Address: string;
    Village: string;
    Building: string;
    Floor: string;
    Room: string;
    Alley: string;
    Road: string;
    SubDistrictCode: string;
    SubDistrict: string;
    DistrictCode: string;
    District: string;
    ProvinceCode: string;
    Province: string;
    ZipCode: string;
    TelephoneNo: string;
    Email: string;
    FatherName: string;
    MotherName: string;
    Remarks: string;
    LinkPhoto: string;
    PhotoDesc: string;
    IsActive: number;

    SuspectTypeName: string;
    EntityTypeName: string;
    ReferenceID: string;
    FullName: string;
    IsModify: string;
    ResultCount: string;
    IsChecked: Acceptability;
    Region: string;
    RowId: number;
}

export class InvestigateMasSuspectModelUppercase {
    PERSON_ID: number;
    COUNTRY_ID: number;
    NATIONALITY_ID: number;
    RACE_ID: number;
    RELIGION_ID: number;
    TITLE_ID: number;
    PERSON_TYPE: number;
    ENTITY_TYPE: number;
    TITLE_NAME_TH: string;
    TITLE_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
    FIRST_NAME: string;
    MIDDLE_NAME: string;
    LAST_NAME: string;
    OTHER_NAME: string;
    COMPANY_NAME: string;
    COMPANY_REGISTRATION_NO: string;
    COMPANY_FOUND_DATE: string;
    COMPANY_LICENSE_NO: string;
    COMPANY_LICENSE_DATE_FROM: string;
    COMPANY_LICENSE_DATE_TO: string;
    EXCISE_REGISTRATION_NO: string;
    GENDER_TYPE: number;
    ID_CARD: string;
    BIRTH_DATE: string;
    BLOOD_TYPE: string;
    PASSPORT_NO: string;
    VISA_TYPE: string;
    PASSPORT_DATE_IN: string;
    PASSPORT_DATE_OUT: string;
    MARITAL_STATUS: number;
    CAREER: string;
    PERSON_DESC: string;
    EMAIL: string;
    TEL_NO: string;
    MISTREAT_NO: number;
    IS_ILLEGAL: number;
    IS_ACTIVE: number;
    //--- Custom ---//
    RowId: number;
    IsChecked: boolean;
    IsNewItem: boolean;
    ENTITY_TYPE_NAME: string;
    SUSPECT_FULLNAME: string;
    SuspectTypeName: string
}

export const InvestigateMasSuspectFC = {
    SuspectID: new FormControl(''),
    EntityType: new FormControl(''),
    CompanyTitleCode: new FormControl(''),
    CompanyTitle: new FormControl(''),
    CompanyName: new FormControl(''),
    CompanyOtherName: new FormControl(''),
    CompanyRegistrationNo: new FormControl(''),
    CompanyLicenseNo: new FormControl(''),
    FoundedDate: new FormControl(''),
    LicenseDateForm: new FormControl(''),
    LicenseDateTo: new FormControl(''),
    TaxID: new FormControl(''),
    ExciseRegNo: new FormControl(''),
    SuspectType: new FormControl(''),
    SuspectTitleCode: new FormControl(''),
    SuspectTitleName: new FormControl(''),
    SuspectFirstName: new FormControl(''),
    SuspectMiddleName: new FormControl(''),
    SuspectLastName: new FormControl(''),
    SuspectOtherName: new FormControl(''),
    SuspectDesc: new FormControl(''),
    IDCard: new FormControl(''),
    PassportNo: new FormControl(''),
    VISAType: new FormControl(''),
    PassportCountryCode: new FormControl(''),
    PassportCountryName: new FormControl(''),
    PassportDateIn: new FormControl(''),
    PassportDateOut: new FormControl(''),
    BirthDate: new FormControl(''),
    GenderType: new FormControl(''),
    BloodType: new FormControl(''),
    NationalityCode: new FormControl(''),
    NationalityNameTH: new FormControl(''),
    RaceCode: new FormControl(''),
    RaceName: new FormControl(''),
    ReligionCode: new FormControl(''),
    ReligionName: new FormControl(''),
    MaritalStatus: new FormControl(''),
    Career: new FormControl(''),
    GPS: new FormControl(''),
    Location: new FormControl(''),
    Address: new FormControl(''),
    Village: new FormControl(''),
    Building: new FormControl(''),
    Floor: new FormControl(''),
    Room: new FormControl(''),
    Alley: new FormControl(''),
    Road: new FormControl(''),
    SubDistrictCode: new FormControl(''),
    SubDistrict: new FormControl(''),
    DistrictCode: new FormControl(''),
    District: new FormControl(''),
    ProvinceCode: new FormControl(''),
    Province: new FormControl(''),
    ZipCode: new FormControl(''),
    TelephoneNo: new FormControl(''),
    Email: new FormControl(''),
    FatherName: new FormControl(''),
    MotherName: new FormControl(''),
    Remarks: new FormControl(''),
    LinkPhoto: new FormControl(''),
    PhotoDesc: new FormControl(''),
    IsActive: new FormControl(''),

    SuspectTypeName: new FormControl(''),
    EntityTypeName: new FormControl(''),
    LawbreakerRefID: new FormControl(''),
    ReferenceID: new FormControl(''),
    FullName: new FormControl(''),
    Region: new FormControl(''),
}