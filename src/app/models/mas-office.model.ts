export interface MasOfficeModel {
    OfficeCode: string;
    OfficeName: string;
    OfficeShortName: string;
    SubDistrictCode: string;
    SubOfficeCode: string;
    EffectiveDate: Date;
    INDCOffice: string;
    ExpirationDate: Date;
    IsActive: number;
    EventDatetime: Date;
    Indcoffice: string;
}



export interface MasOfficeModel_New {
    OFFICE_ID: string;
    OFFICE_CODE: string;
    OFFICE_NAME: string;
    OFFICE_SHORT_NAME?: string;
    IS_ACTIVE: number;

    //Customs
    OfficeShortName: string;
    OFFICE_NAME_TEMP: string;
}