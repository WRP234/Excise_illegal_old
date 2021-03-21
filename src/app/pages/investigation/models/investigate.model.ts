import { Acceptability } from "app/pages/arrests/models";

export class InvestigateModelUppercase {
    INVESTIGATE_CODE: string;
    INVESTIGATE_NO: string;
    INVESTIGATE_NO_YEAR: string;
    DATE_START: string;
    DATE_END: string;
    SUBJECT: string;
    IS_ACTIVE: number;
    INVESTIGATE_DETAIL: InvestigateDetail[];
}

export class InvestigateModel {
    InvestigateCode: string;
    InvestigateNo: string;
    DateStart: any;
    DateEnd: any;
    Subject: string;
    IsActive: number;
    InvestigateDetail: InvestigateDetail[];
}

export class InvestigateDetail {
    InvestigateDetailID: number;
    InvestigateCode: string;
    InvestigateSeq: string;
    StationCode: string;
    StationName: string;
    InvestigateDateStart: any;
    InvestigateDateEnd: any;
    InvestigateDetail: string;
    ConfidenceOfNews: string;
    ValueOfNews: string;
    IsActive: number;
    InvestigateDetailStaff: InvestigateDetailStaff[];
    InvestigateDetailSuspect: InvestigateDetailSuspect[];
    InvestigateDetailLocal: InvestigateDetailLocal[];
    InvestigateDetailProduct: InvestigateDetailProduct[];
}

export class InvestigateDetailUppercase {
    COMMAND: string;
    CONFIDENCE_OF_NEWS: number;
    DATE_END: string;
    DATE_START: string;
    INVESTIGATE_DETAIL_DESCRIPTION: string;
    INVESTIGATE_DETAIL_ID: number;
    INVESTIGATE_ID: number;
    INVESTIGATE_SEQUENCE: string;
    IS_ACTIVE: number;
    OFFICE_CODE: string;
    OFFICE_ID: number;
    OFFICE_NAME: string;
    OPS_INVESTIGATE_DETAIL_LOCALE: any;
    OPS_INVESTIGATE_DETAIL_PRODUCT: any;
    OPS_INVESTIGATE_DETAIL_STAFF: any;
    OPS_INVESTIGATE_DETAIL_SUSPECT: any;
    VALUE_OF_NEWS: number;
}

export class InvestigateDetailStaff {
    StaffID: number;
    ProgramCode: number;
    ProcessCode: string;
    InvestigateDetailID: number;
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
    IsActive: number;

    RowId: number;
    StaffFullName: string;
    IsModify: string;

    Commander: string;
    Investigator: string;
}

export class InvestigateDetailStaffUppercase {
    CONTRIBUTOR_ID: number;
    FIRST_NAME: string;
    INVESTIGATE_DETAIL_ID: number;
    IS_ACTIVE: number;
    LAST_NAME: string;
    OPERATION_DEPT_CODE: string;
    OPERATION_DEPT_LEVEL: number;
    OPERATION_DEPT_NAME: string;
    OPERATION_OFFICE_CODE: string;
    OPERATION_OFFICE_NAME: string;
    OPERATION_OFFICE_SHORT_NAME: string;
    OPERATION_POS_CODE: string;
    OPERATION_POS_LEVEL_NAME: string;
    OPREATION_POS_LEVEL: string;
    OPREATION_POS_NAME: string;
    STAFF_CODE: string;
    STAFF_ID: number;
    STAFF_TYPE: number;
    TITLE_ID: number;
    TITLE_NAME_TH: string;

    RowId: number;
    StaffFullName: string;
    IsModify: string;
    IsNewItem: boolean;

    FULL_NAME: string;
}

export class InvestigateDetailSuspect {
    SuspectID: number;
    SuspectReferenceID: number;
    EntityType: number;
    CompanyTitleCode: string;
    CompanyTitle: string;
    CompanyName: string;
    CompanyOtherName: string;
    CompanyRegistrationNo: string;
    TaxID: string;
    ExciseRegNo: string;
    SuspectType: number;
    SuspectTitleName: string;
    SuspectFirstName: string;
    SuspectMiddleName: string;
    SuspectLastName: string;
    SuspectOtherName: string;
    IDCard: string;
    PassportNo: string;
    IsActive: number;
    InvestigateDetailID: number;

    SuspectTypeName: string;
    EntityTypeName: string;
    ReferenceID: string;
    ResultCount: string;
    FullName: string;
    IsModify: string;
    IsChecked: Acceptability;
    RowId: number;
}

export class InvestigateDetailSuspectUppercase {
    AGE: number;
    CAREER: string;
    COMPANY_REGISTRATION_NO: string;
    EMAIL: string;
    ENTITY_TYPE: number;
    ENTITY_TYPE_NAME: string;
    EXCISE_REGISTRATION_NO: string;
    FIRST_NAME: string;
    ID_CARD: string;
    INVESTIGATE_DETAIL_ID: number;
    IS_ACTIVE: number;
    LAST_NAME: string;
    MIDDLE_NAME: string;
    MISTREAT_NO: number;
    OTHER_NAME: string;
    PASSPORT_NO: string;
    PERSON_DESC: string;
    PERSON_ID: number;
    PERSON_TYPE: number;
    SUSPECT_ID: number;
    TEL_NO: string;
    TITLE_ID: number;
    TITLE_NAME_EN: string;
    TITLE_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    ///////////////////////////////
    IS_CHECK: number;
    TYPE_NAME: string;
    REFERENCE_ID: string;

    IsModify: string;
    idcard: string;
    investigateDetailID: number;
    suspectID: number;

    RowId: number;
    FULL_NAME: string;
    PERSON_TYPE_NAME: string;
    IsNewItem: boolean;
}

export class InvestigateDetailLocal {
    LocalID: number;
    InvestigateDetailID: number;
    GPS: string;
    Location: string;
    Address: string;
    Village: string;
    Building: string;
    Room: string;
    Alley: string;
    Road: string;
    Floor: string;
    SubDistrictCode: string;
    SubDistrict: string;
    DistrictCode: string;
    District: string;
    ProvinceCode: string;
    Province: string;
    ZipCode: string;
    IsActive: number;

    RowId: number;
    IsModify: string;
    Region: string;
}

export class InvestigateDetailLocalUppercase {
    LOCALE_ID: number;
    INVESTIGATE_DETAIL_ID: number;
    ADDRESS_NO: number;
    ADDRESS_STATUS: string;
    ADDRESS_TYPE: string;
    ALLEY: string;
    ARREST_ID: number;
    BUILDING_NAME: string;
    DISTRICT_NAME_EN: string;
    DISTRICT_NAME_TH: string;
    FLOOR: string;
    GPS: string;
    IS_ACTIVE: number;
    IsModify: string;
    LANE: string;
    LATITUDE?: string;
    LONGITUDE?: string;
    LOCATION: string;
    POLICE_STATION: string;
    PROVINCE_NAME_EN: string;
    PROVINCE_NAME_TH: string;
    ROAD: string;
    ROOM_NO: number;
    RowId: number;
    SUB_DISTRICT_ID: number;
    SUB_DISTRICT_NAME_EN: string;
    SUB_DISTRICT_NAME_TH: string;
    VILLAGE_NAME: string;
    VILLAGE_NO: number;
    IsNewItem: boolean;
    Region: string;
}

export class InvestigateDetailProduct {
    ProductID: number;
    InvestigateDetailID: number;
    GroupName: string;
    GroupCode: string;
    IsDomestic: number;
    ProductCode: string;
    BrandCode: string;
    BrandNameTH: string;
    BrandNameEN: string;
    SubBrandCode: string;
    SubBrandNameTH: string;
    SubBrandNameEN: string;
    ModelCode: string;
    ModelName: string;
    FixNo1: number;
    DegreeCode: string;
    Degree: number;
    SizeCode: string;
    Size: string;
    SizeUnitCode: string;
    SizeUnitName: string;
    FixNo2: number;
    SequenceNo: string;
    ProductDesc: string;
    CarNo: string;
    Qty: number;
    QtyUnit: string;
    NetVolume: number;
    NetVolumeUnit: string;
    IsActive: number;

    RowId: number;
    IsModify: string;
}

export class InvestigateDetailProductUppercase {
    DEGREE: string;
    INVESTIGATE_DETAIL_ID: number;
    IS_ACTIVE: number;
    IS_DOMESTIC: number;
    IS_TAX_VALUE: number;
    IS_TAX_VOLUMN: number;
    LICENSE_PLATE: string;
    PRODUCT_BRAND_CODE: string;
    PRODUCT_BRAND_NAME_EN: string;
    PRODUCT_BRAND_NAME_TH: string;
    PRODUCT_CODE: string;
    PRODUCT_DESC: string;
    PRODUCT_GROUP_CODE: string;
    PRODUCT_GROUP_NAME: string;
    PRODUCT_ID: number;
    PRODUCT_MODEL_CODE: string;
    PRODUCT_MODEL_NAME_TH: string;
    PRODUCT_SUBBRAND_CODE: string;
    PRODUCT_SUBBRAND_NAME_EN: string;
    PRODUCT_SUBBRAND_NAME_TH: string;
    QUANTITY: number;
    QUANTITY_UNIT: string;
    SIZES: string;
    SIZES_UNIT: string;
    VOLUMN: string;
    VOLUMN_UNIT: string;
    ///////////////
    RowId: number;
    IsModify: string;
    IsNewItem: boolean;
}

export interface Types {
    value: number;
    text: string;
}
