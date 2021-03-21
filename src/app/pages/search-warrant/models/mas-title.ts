export interface IMasTitle {
    TITLE_ID: number;
    TITLE_NAME_TH: string;
    TITLE_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
    TITLE_TYPE: number;
    IS_ACTIVE: number;
}

export interface IMasTitlegetByCon {
    TEXT_SEARCH: string;
    TITLE_ID?: number;
}

export interface IMasTitlegetByConAdv {
    TITLE_NAME_TH: string;
    TITLE_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
}