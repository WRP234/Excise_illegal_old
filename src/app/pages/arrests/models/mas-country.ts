export interface IMasCountry {
    COUNTRY_ID: number;
    COUNTRY_CODE: string;
    COUNTRY_NAME_TH: string;
    COUNTRY_NAME_EN: string;
    COUNTRY_SHORT_NAME: string;
    IS_ACTIVE: number;
}

export interface IMasCountrygetByCon {
    TEXT_SEARCH: string;
    COUNTRY_ID?: number
}

export interface IMasCountrygetByConAdv {
    COUNTRY_CODE: number;
    COUNTRY_NAME: string;
}