export interface IMasOffice {
    OFFICE_ID: number;
    OFFICE_CODE: string;
    OFFICE_NAME: string;
    IS_ACTIVE: number;
}

export interface ISearchMasOffice {
    TEXT_SEARCH: string;
    OFFICE_ID?: number;
}
