import { ArrestStaff } from './arrest-staff';
import { ArrestLocale, } from './arrest-locale';
import { ArrestLawbreaker } from './arrest-lawbreaker';
import { ArrestProduct } from './arrest-product';
import { ArrestNotice } from './arrest-notice';

export interface ArrestList {
    ARREST_ID?: number;
    ARREST_CODE: string;
    OCCURRENCE_DATE?: Date;
    TITLE_NAME_TH: string;
    TITLE_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
    FIRST_NAME: string;
    LAST_NAME: string;
    OFFICE_NAME: string;
    SUB_DISTRICT_NAME_TH: string;
    SUB_DISTRICT_NAME_EN: string;
    DISTRICT_NAME_TH: string;
    DISTRICT_NAME_EN: string;
    PROVINCE_NAME_TH: string;
    PROVINCE_NAME_EN: string;
    IS_LAWSUIT_COMPLETE?: number;
}

export interface Arrest {
    ARREST_ID?: number;
    OFFICE_ID?: number;
    ARREST_CODE: string;
    OFFICE_CODE: string;
    OFFICE_NAME: string;
    ARREST_DATE: Date;
    OCCURRENCE_DATE?: Date;
    BEHAVIOR_1: string;
    BEHAVIOR_2: string;
    BEHAVIOR_3: string;
    BEHAVIOR_4: string;
    BEHAVIOR_5: string;
    TESTIMONY: string;
    IS_REQUEST?: number;
    REQUEST_DESC: string;
    IS_LAWSUIT_COMPLETE?: number;
    IS_ACTIVE?: number;
    CREATE_DATE?: Date;
    CREATE_USER_ACCOUNT_ID?: number;
    UPDATE_DATE?: Date;
    UPDATE_USER_ACCOUNT_ID?: number;
    ArrestStaff: ArrestStaff[];
    ArrestLocale: ArrestLocale[];
    ArrestLawbreaker: ArrestLawbreaker[];
    ArrestProduct: ArrestProduct[];
    // ArrestNotice: ArrestNotice[]
}

export interface ArrestListgetByConAdv {
    ARREST_CODE?: string;
    OCCURRENCE_DATE_FROM?: Date;
    OCCURRENCE_DATE_TO?: Date;
    STAFF_NAME?: string;
    OFFICE_NAME?: string;
    LOCALE_NAME?: string;
    IS_LAWSUIT_COMPLETE?: number;
    ACCOUNT_OFFICE_CODE: string;
}

export interface ArrestgetByCon {
    ARREST_ID: number;
}

export interface ArrestupdDelete {
    ARREST_ID: number;
}

export interface GetByKeyword {
    TEXT_SEARCH: string;
}

export const IS_ACTIVE: Types[] = [
    { value: 0, text: '???????????????????????????' },
    { value: 1, text: '??????????????????' }
]

export interface Types {
    value: number;
    text: string;
}

export const PERSON_TYPE: Types[] = [
    { value: 0, text: '???????????????' },
    { value: 1, text: '????????????????????????' },
]

export const ENTITY_TYPE: Types[] = [
    { value: 0, text: '?????????????????????????????????' },
    { value: 1, text: '???????????????????????????' },
]

export const IS_PROVE: Types[] = [
    { value: 0, text: '?????????????????????' },
    { value: 1, text: '????????????' },
]

export const IS_COMPARE: Types[] = [
    { value: 0, text: '??????????????????' },
    { value: 1, text: '?????????' },
]

export const ArrestListMock: any[] = [
    {
        "ARREST_ID": 25,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 22,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 21,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 24,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 23,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 25,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 21,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 24,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 23,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 22,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 25,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 24,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 21,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 23,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    },
    {
        "ARREST_ID": 22,
        "ARREST_CODE": "TN0508006200001",
        "OCCURRENCE_DATE": "2018-03-01 12:35:29.123457",
        "TITLE_NAME_TH": "??????????????????",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "??????.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "??????????????????",
        "LAST_NAME": "???????????????????????????????????????",
        "OFFICE_NAME": "???????????????????????????????????????????????????????????????",
        "SUB_DISTRICT_NAME_TH": "???????????????",
        "SUB_DISTRICT_NAME_EN": "Dusit",
        "DISTRICT_NAME_TH": "??????????????????",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_NAME_TH": "?????????????????????",
        "PROVINCE_NAME_EN": null,
        "IS_LAWSUIT_COMPLETE": 0
    }
]
