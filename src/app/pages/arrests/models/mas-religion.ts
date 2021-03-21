export interface IMasReligion {
    RELIGION_ID: number;
    RELIGION_NAME_TH: string;
    RELIGION_NAME_EN: string;
    IS_ACTIVE: number;
}

export interface IMasReligiongetByCon {
    TEXT_SEARCH: string;
    RELIGION_ID?: number;
}