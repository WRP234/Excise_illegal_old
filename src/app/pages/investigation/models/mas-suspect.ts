export interface MasSuspect_New {
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
export interface MasSuspect {
    SuspectID: number;
    EntityType: number;
    CompanyTitleCode: string;
    CompanyTitle: string;
    CompanyName: string;
    CompanyOtherName: string;
    CompanyRegistrationNo: string;
    CompanyLicenseNo: string;
    FoundedDate: Date;
    LicenseDateForm: Date;
    LicenseDateTo: Date;
    TaxID: string;
    ExciseRegNo: string;
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
    PassportDateIn: Date;
    PassportDateOut: Date;
    BirthDate: Date;
    GenderType: string;
    BloodType: string;
    NationalityNameTH: string;
    RaceName: string;
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
    NationalityCode: string;
    RaceCode: string;
    ReligionCode: string;

    //--- Custom ---//
    EntityTypeName: string;
    SuspectTypeName: string;
    CompanyFullName: string;
    SuspectFullName: string;
    RowId: number;
    IsChecked: boolean;
    IsNewItem: boolean;
    MistreatNo: string;
    LawbreakerTitleName: string;
    LawbreakerFirstName: string;
    LawbreakerMiddleName: string;
    LawbreakerLastName: string;
    LawbreakerType: number;
    LawbreakerID: number;
}

export const SuspectForm = {
    // SuspectID: new FormControl(null),
    // EntityType: new FormControl(null),
    // CompanyTitleCode: new FormControl(null),
    // CompanyTitle: new FormControl(null),
    // CompanyName: new FormControl(null),
    // CompanyOtherName: new FormControl(null),
    // CompanyRegistrationNo: new FormControl(null),
    // CompanyLicenseNo: new FormControl(null),
    // FoundedDate: new FormControl(null),
    // LicenseDateForm: new FormControl(null),
    // LicenseDateTo: new FormControl(null),
    // TaxID: new FormControl(null),
    // ExciseRegNo: new FormControl(null),
    // SuspectType: new FormControl(null),
    // SuspectTitleCode: new FormControl(null),
    // SuspectTitleName: new FormControl(null),
    // SuspectFirstName: new FormControl(null),
    // SuspectMiddleName: new FormControl(null),
    // SuspectLastName: new FormControl(null),
    // SuspectOtherName: new FormControl(null),
    // SuspectDesc: new FormControl(null),
    // PassportNo: new FormControl(null),
    // PassportCountryCode: new FormControl(null),
    // PassportCountryName: new FormControl(null),
    // PassportDateIn: new FormControl(null),
    // PassportDateOut: new FormControl(null),
    // BirthDate: new FormControl(null),
    // GenderType: new FormControl(null),
    // BloodType: new FormControl(null),
    // NationalityNameTH: new FormControl(null),
    // RaceCode: new FormControl(null),
    // RaceName: new FormControl(null),
    // ReligionCode: new FormControl(null),
    // ReligionName: new FormControl(null),
    // MaritalStatus: new FormControl(null),
    // Career: new FormControl(null),
    // Gps: new FormControl(null),
    // Location: new FormControl(null),
    // Address: new FormControl(null),
    // Village: new FormControl(null),
    // Building: new FormControl(null),
    // Floor: new FormControl(null),
    // Room: new FormControl(null),
    // Alley: new FormControl(null),
    // Road: new FormControl(null),
    // SubDistrictCode: new FormControl(null),
    // SubDistrict: new FormControl(null),
    // DistrictCode: new FormControl(null),
    // District: new FormControl(null),
    // ProvinceCode: new FormControl(null),
    // Province: new FormControl(null),
    // ZipCode: new FormControl(null),
    // TelephoneNo: new FormControl(null),
    // Email: new FormControl(null),
    // FatherName: new FormControl(null),
    // MotherName: new FormControl(null),
    // Remarks: new FormControl(null),
    // LinkPhoto: new FormControl(null),
    // PhotoDesc: new FormControl(null),
    // IsActive: new FormControl(null),
    // NationalityCode: new FormControl(null),
    // Visatype: new FormControl(null),
    // Idcard: new FormControl(null),
    // IsChecked: new FormControl(false),
    // CompanyFullName: new FormControl(null),
    // SuspectFullName: new FormControl(null),
    // EntityTypeName: new FormControl(null),
    // SuspectTypeName: new FormControl(null)
}
