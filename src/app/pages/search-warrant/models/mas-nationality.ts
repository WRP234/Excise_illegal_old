export interface IMasNationality {
    NATIONALITY_ID: number;
    NATIONALITY_NAME_TH: string;
    NATIONALITY_NAME_EN: string;
    IS_ACTIVE: number;
}

export interface IMasNationalitygetByCon {
    TEXT_SEARCH: string;
    NATIONALITY_ID?: number;
}