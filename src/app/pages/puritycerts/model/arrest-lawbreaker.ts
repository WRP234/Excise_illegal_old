export interface ArrestLawbreaker {
    LAWBREAKER_ID?: number;
    ARREST_ID?: number;
    PERSON_ID?: number;
    TITLE_ID?: number;
    PERSON_TYPE?: number;
    ENTITY_TYPE?: number;
    TITLE_NAME_TH: string;
    TITLE_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
    FIRST_NAME: string;
    MIDDLE_NAME: string;
    LAST_NAME: string;
    OTHER_NAME: string;
    COMPANY_REGISTRATION_NO: string;
    EXCISE_REGISTRATION_NO: string;
    ID_CARD: string;
    AGE?: number;
    PASSPORT_NO: string;
    CAREER: string;
    PERSON_DESC: string;
    EMAIL: string;
    TEL_NO: string;
    MISTREAT_NO?: number;
    IS_ACTIVE?: number;
}

export interface ArrestLawbreakerupdDelete {
    LAWBREAKER_ID: number;
}

export const ArrestLawbreakerFormControl = {
}



