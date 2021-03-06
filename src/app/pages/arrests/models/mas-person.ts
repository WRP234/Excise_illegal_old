import { Types } from "./arrest";

export interface MasPersonGetByCon {
    PERSON_ID: number,
    TEXT_SEARCH: string
}

export interface MasPerson {
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
    COMPANY_REGISTRATION_NO: string;
    COMPANY_FOUND_DATE?: Date;
    COMPANY_LICENSE_NO: string;
    COMPANY_LICENSE_DATE_FROM?: Date;
    COMPANY_LICENSE_DATE_TO?: Date;
    EXCISE_REGISTRATION_NO: string;
    GENDER_TYPE: number;
    ID_CARD: string;
    BIRTH_DATE?: Date;
    BLOOD_TYPE: number;
    PASSPORT_NO: string;
    VISA_TYPE: number;
    PASSPORT_DATE_IN?: Date;
    PASSPORT_DATE_OUT?: Date;
    MARITAL_STATUS: number;
    CAREER: string;
    PERSON_DESC: string;
    EMAIL: string;
    TEL_NO: string;
    MISTREAT_NO: string;
    IS_ILLEGAL: string;
    IS_ACTIVE: number;
    MAS_PERSON_ADDRESS?: MasPersonAddress[];
    MAS_PERSON_EDUCATION?: MasPersonEducation[];
    MAS_PERSON_RELATIONSHIP?: MasPersonRelationship[];
    MAS_PERSON_PHOTO?: MasPersonPhoto[];
    MAS_PERSON_FINGER_PRINT?: MasPersonFingerPrint[];
}

export interface MasPersonAddress {
    PERSON_ADDRESS_ID: number;
    PERSON_ID: number;
    SUB_DISTRICT_ID: number;
    GPS: string;
    ADDRESS_NO: string;
    VILLAGE_NO: string;
    BUILDING_NAME: string;
    ROOM_NO: string;
    FLOOR: string;
    VILLAGE_NAME: string;
    ALLEY: string;
    LANE: string;
    ROAD: string;
    ADDRESS_TYPE: number;
    ADDRESS_DESC: string;
    ADDRESS_STATUS: number;
    IS_ACTIVE: number;
    SUB_DISTRICT_NAME_TH: string;
    SUB_DISTRICT_NAME_EN: string;
    DISTRICT_NAME_TH: string;
    DISTRICT_NAME_EN: string;
    PROVINCE_NAME_TH: string;
    PROVINCE_NAME_EN: string;
}

export interface MasPersonAddressupdDelete {
    PERSON_ADDRESS_ID: number;
}

export interface MasPersonEducation {
    PERSON_EDUCATION_ID: number;
    PERSON_ID: number;
    EDUCATION_INSTITUTION: string;
    EDUCATION_LEVEL: number;
    EDUCATION_START_DATE?: Date;
    EDUCATION_FINISH_DATE?: Date;
    GPA: number;
    IS_ACTIVE: number;
}

export interface MasPersonEducationupdDelete {
    PERSON_EDUCATION_ID: number;
}

export interface MasPersonRelationship {
    PERSON_RELATIONSHIP_ID: number;
    RELATIONSHIP_ID: number;
    PERSON_ID: number;
    TITLE_ID: number;
    TITLE_NAME_TH: string;
    TITLE_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
    FIRST_NAME: string;
    MIDDLE_NAME: string;
    LAST_NAME: string;
    OTHER_NAME: string;
    GENDER_TYPE: number;
    ID_CARD: string;
    BIRTH_DATE?: Date;
    BLOOD_TYPE: number;
    CAREER: string;
    PERSON_DESC: string;
    EMAIL: string;
    TEL_NO: string;
    IS_ACTIVE: number;
}

export interface MasPersonRelationshipupdDelete {
    PERSON_RELATIONSHIP_ID: number;
}

export interface MasPersonPhoto {
    PHOTO_ID: number;
    PERSON_ID: number;
    PERSON_RELATIONSHIP_ID?: number;
    PHOTO: string;
    TYPE: string;
    IS_ACTIVE: number;
}

export interface MasPersonPhotoupdDelete {
    PHOTO_ID: number;
}

export interface MasPersonFingerPrint {
    FINGER_PRINT_ID: number;
    PERSON_ID: number;
    PERSON_RELATIONSHIP_ID?: number;
    FINGER_PRINT: string;
    TYPE: string;
    IS_ACTIVE: number;
}

export interface MasPersonFingerPrintupdDelete {
    FINGER_PRINT_ID: number;
}

export const PERSON_TYPE: Types[] = [
    { value: 0, text: '???????????????' },
    { value: 1, text: '??????????????????????????????' },
    { value: 2, text: '????????????????????????????????????' }
]

export const ENTITY_TYPE: Types[] = [
    { value: 0, text: '?????????????????????????????????' },
    { value: 1, text: '???????????????????????????' },
]

export const VISA_TYPE: Types[] = [
    { value: 0, text: '?????????????????????????????????????????????????????????????????????????????????????????? (Transit Visa)' },
    { value: 1, text: '????????????????????????????????????????????????????????? (Tourist Visa)' },
    { value: 2, text: '???????????????????????????????????????????????????????????? (Non-Immigrant Visa)' },
    { value: 3, text: '??????????????????????????? (Diplomatic Visa)' },
    { value: 4, text: '???????????????????????????????????? (Official Visa)' },
    { value: 5, text: '????????????????????????????????????????????????????????? (Courtesy Visa)' }
]

export const MARITAL_STATUS: Types[] = [
    { value: 0, text: '?????????' },
    { value: 1, text: '????????????' },
    { value: 2, text: '????????????????????????' },
    { value: 3, text: '???????????????' }
]

export const ADDRESS_TYPE: Types[] = [
    { value: 0, text: '??????????????????????????????' },
    { value: 1, text: '??????????????????????????????????????????????????????????????????' },
    { value: 2, text: '??????????????????????????????' },
    { value: 3, text: '???????????????????????????????????????????????????????????????' },
    { value: 4, text: '????????????????????????????????????????????????????????????????????????' },
    { value: 5, text: '???????????????????????????????????????' },
    { value: 6, text: '???????????????' }
]

export const PERSON_IS_ILLEGAL: Types[] = [
    { value: 0, text: '??????????????????????????????????????????' },
    { value: 1, text: '?????????????????????????????????' },
]

export const ADDRESS_STATUS: Types[] = [
    { value: 0, text: '?????????????????????' },
    { value: 1, text: '????????????????????????' },
    { value: 2, text: '?????????????????????' }
]

export const EDUCATION_LEVEL: Types[] = [
    { value: 0, text: '???????????????????????????????????????????????????????????????' },
    { value: 1, text: '?????????????????????????????????????????????' },
    { value: 2, text: '?????????????????????????????????????????????????????????' },
    { value: 3, text: '?????????????????????????????????????????????????????????' },
    { value: 4, text: '???????????????????????????????????????????????????????????? (?????????.)' },
    { value: 5, text: '?????????????????????????????????????????????????????????????????????????????? (?????????.)' },
    { value: 6, text: '????????????????????????????????????????????????????????????????????????????????? (?????????.)' },
    { value: 7, text: '??????????????????????????????????????????' },
    { value: 8, text: '????????????????????????' },
    { value: 9, text: '???????????????????????????' },
]

export const GENDER_TYPE: Types[] = [
    { value: 0, text: '?????????????????????' },
    { value: 1, text: '?????????' },
    { value: 2, text: '????????????' }
]

export const BLOOD_TYPE: Types[] = [
    { value: 1, text: 'A' },
    { value: 3, text: 'AB' },
    { value: 2, text: 'B' },
    { value: 0, text: 'O' }
]

export const MasPersongetByConMock: any[] =
    [
        {
            "PERSON_ID": 105,
            "COUNTRY_ID": 2,
            "NATIONALITY_ID": 1,
            "RACE_ID": 1,
            "RELIGION_ID": 1,
            "TITLE_ID": 56,
            "PERSON_TYPE": 0,
            "ENTITY_TYPE": 0,
            "TITLE_NAME_TH": "???????????????????????????",
            "TITLE_NAME_EN": "Air Marshal",
            "TITLE_SHORT_NAME_TH": "??????.???.???.",
            "TITLE_SHORT_NAME_EN": "AM",
            "FIRST_NAME": "??????????????????",
            "MIDDLE_NAME": null,
            "LAST_NAME": "??????????????????",
            "OTHER_NAME": null,
            "COMPANY_NAME": null,
            "COMPANY_REGISTRATION_NO": null,
            "COMPANY_FOUND_DATE": null,
            "COMPANY_LICENSE_NO": null,
            "COMPANY_LICENSE_DATE_FROM": null,
            "COMPANY_LICENSE_DATE_TO": null,
            "EXCISE_REGISTRATION_NO": null,
            "GENDER_TYPE": 0,
            "ID_CARD": "33366999",
            "BIRTH_DATE": null,
            "BLOOD_TYPE": null,
            "PASSPORT_NO": null,
            "VISA_TYPE": null,
            "PASSPORT_DATE_IN": null,
            "PASSPORT_DATE_OUT": null,
            "MARITAL_STATUS": 0,
            "CAREER": null,
            "PERSON_DESC": null,
            "EMAIL": null,
            "TEL_NO": null,
            "MISTREAT_NO": 0,
            "IS_ILLEGAL": 1,
            "IS_ACTIVE": 1,
            "SUB_DISTRICT_NAME_TH": null,
            "SUB_DISTRICT_NAME_EN": null,
            "DISTRICT_NAME_TH": null,
            "DISTRICT_NAME_EN": null,
            "PROVINCE_NAME_TH": null,
            "PROVINCE_NAME_EN": null,
            "MAS_PERSON_ADDRESS": [
                {
                    "PERSON_ADDRESS_ID": 65,
                    "PERSON_ID": 105,
                    "SUB_DISTRICT_ID": 470808,
                    "GPS": null,
                    "ADDRESS_NO": null,
                    "VILLAGE_NO": null,
                    "BUILDING_NAME": null,
                    "ROOM_NO": null,
                    "FLOOR": "22",
                    "VILLAGE_NAME": null,
                    "ALLEY": null,
                    "LANE": null,
                    "ROAD": null,
                    "ADDRESS_TYPE": 0,
                    "ADDRESS_DESC": null,
                    "ADDRESS_STATUS": 0,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_EDUCATION": [],
            "MAS_PERSON_RELATIONSHIP": [
                {
                    "PERSON_RELATIONSHIP_ID": 83,
                    "RELATIONSHIP_ID": 1,
                    "PERSON_ID": 105,
                    "TITLE_ID": 53,
                    "TITLE_NAME_TH": "?????????????????? (????????????)",
                    "TITLE_NAME_EN": "Seaman",
                    "TITLE_SHORT_NAME_TH": "?????????",
                    "TITLE_SHORT_NAME_EN": null,
                    "FIRST_NAME": "??????",
                    "MIDDLE_NAME": null,
                    "LAST_NAME": "??????",
                    "OTHER_NAME": null,
                    "GENDER_TYPE": 1,
                    "ID_CARD": null,
                    "BIRTH_DATE": null,
                    "BLOOD_TYPE": null,
                    "CAREER": null,
                    "PERSON_DESC": null,
                    "EMAIL": null,
                    "TEL_NO": null,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_FINGER_PRINT": [],
            "MAS_PERSON_PHOTO": []
        },
        {
            "PERSON_ID": 105,
            "COUNTRY_ID": 2,
            "NATIONALITY_ID": 1,
            "RACE_ID": 1,
            "RELIGION_ID": 1,
            "TITLE_ID": 56,
            "PERSON_TYPE": 0,
            "ENTITY_TYPE": 0,
            "TITLE_NAME_TH": "???????????????????????????",
            "TITLE_NAME_EN": "Air Marshal",
            "TITLE_SHORT_NAME_TH": "??????.???.???.",
            "TITLE_SHORT_NAME_EN": "AM",
            "FIRST_NAME": "??????????????????",
            "MIDDLE_NAME": null,
            "LAST_NAME": "??????????????????",
            "OTHER_NAME": null,
            "COMPANY_NAME": null,
            "COMPANY_REGISTRATION_NO": null,
            "COMPANY_FOUND_DATE": null,
            "COMPANY_LICENSE_NO": null,
            "COMPANY_LICENSE_DATE_FROM": null,
            "COMPANY_LICENSE_DATE_TO": null,
            "EXCISE_REGISTRATION_NO": null,
            "GENDER_TYPE": 0,
            "ID_CARD": "33366999",
            "BIRTH_DATE": null,
            "BLOOD_TYPE": null,
            "PASSPORT_NO": null,
            "VISA_TYPE": null,
            "PASSPORT_DATE_IN": null,
            "PASSPORT_DATE_OUT": null,
            "MARITAL_STATUS": 0,
            "CAREER": null,
            "PERSON_DESC": null,
            "EMAIL": null,
            "TEL_NO": null,
            "MISTREAT_NO": 0,
            "IS_ILLEGAL": 1,
            "IS_ACTIVE": 1,
            "SUB_DISTRICT_NAME_TH": null,
            "SUB_DISTRICT_NAME_EN": null,
            "DISTRICT_NAME_TH": null,
            "DISTRICT_NAME_EN": null,
            "PROVINCE_NAME_TH": null,
            "PROVINCE_NAME_EN": null,
            "MAS_PERSON_ADDRESS": [
                {
                    "PERSON_ADDRESS_ID": 65,
                    "PERSON_ID": 105,
                    "SUB_DISTRICT_ID": 470808,
                    "GPS": null,
                    "ADDRESS_NO": null,
                    "VILLAGE_NO": null,
                    "BUILDING_NAME": null,
                    "ROOM_NO": null,
                    "FLOOR": "22",
                    "VILLAGE_NAME": null,
                    "ALLEY": null,
                    "LANE": null,
                    "ROAD": null,
                    "ADDRESS_TYPE": 0,
                    "ADDRESS_DESC": null,
                    "ADDRESS_STATUS": 0,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_EDUCATION": [],
            "MAS_PERSON_RELATIONSHIP": [
                {
                    "PERSON_RELATIONSHIP_ID": 83,
                    "RELATIONSHIP_ID": 1,
                    "PERSON_ID": 105,
                    "TITLE_ID": 53,
                    "TITLE_NAME_TH": "?????????????????? (????????????)",
                    "TITLE_NAME_EN": "Seaman",
                    "TITLE_SHORT_NAME_TH": "?????????",
                    "TITLE_SHORT_NAME_EN": null,
                    "FIRST_NAME": "??????",
                    "MIDDLE_NAME": null,
                    "LAST_NAME": "??????",
                    "OTHER_NAME": null,
                    "GENDER_TYPE": 1,
                    "ID_CARD": null,
                    "BIRTH_DATE": null,
                    "BLOOD_TYPE": null,
                    "CAREER": null,
                    "PERSON_DESC": null,
                    "EMAIL": null,
                    "TEL_NO": null,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_FINGER_PRINT": [],
            "MAS_PERSON_PHOTO": []
        },
        {
            "PERSON_ID": 105,
            "COUNTRY_ID": 2,
            "NATIONALITY_ID": 1,
            "RACE_ID": 1,
            "RELIGION_ID": 1,
            "TITLE_ID": 56,
            "PERSON_TYPE": 0,
            "ENTITY_TYPE": 0,
            "TITLE_NAME_TH": "???????????????????????????",
            "TITLE_NAME_EN": "Air Marshal",
            "TITLE_SHORT_NAME_TH": "??????.???.???.",
            "TITLE_SHORT_NAME_EN": "AM",
            "FIRST_NAME": "??????????????????",
            "MIDDLE_NAME": null,
            "LAST_NAME": "??????????????????",
            "OTHER_NAME": null,
            "COMPANY_NAME": null,
            "COMPANY_REGISTRATION_NO": null,
            "COMPANY_FOUND_DATE": null,
            "COMPANY_LICENSE_NO": null,
            "COMPANY_LICENSE_DATE_FROM": null,
            "COMPANY_LICENSE_DATE_TO": null,
            "EXCISE_REGISTRATION_NO": null,
            "GENDER_TYPE": 0,
            "ID_CARD": "33366999",
            "BIRTH_DATE": null,
            "BLOOD_TYPE": null,
            "PASSPORT_NO": null,
            "VISA_TYPE": null,
            "PASSPORT_DATE_IN": null,
            "PASSPORT_DATE_OUT": null,
            "MARITAL_STATUS": 0,
            "CAREER": null,
            "PERSON_DESC": null,
            "EMAIL": null,
            "TEL_NO": null,
            "MISTREAT_NO": 0,
            "IS_ILLEGAL": 1,
            "IS_ACTIVE": 1,
            "SUB_DISTRICT_NAME_TH": null,
            "SUB_DISTRICT_NAME_EN": null,
            "DISTRICT_NAME_TH": null,
            "DISTRICT_NAME_EN": null,
            "PROVINCE_NAME_TH": null,
            "PROVINCE_NAME_EN": null,
            "MAS_PERSON_ADDRESS": [
                {
                    "PERSON_ADDRESS_ID": 65,
                    "PERSON_ID": 105,
                    "SUB_DISTRICT_ID": 470808,
                    "GPS": null,
                    "ADDRESS_NO": null,
                    "VILLAGE_NO": null,
                    "BUILDING_NAME": null,
                    "ROOM_NO": null,
                    "FLOOR": "22",
                    "VILLAGE_NAME": null,
                    "ALLEY": null,
                    "LANE": null,
                    "ROAD": null,
                    "ADDRESS_TYPE": 0,
                    "ADDRESS_DESC": null,
                    "ADDRESS_STATUS": 0,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_EDUCATION": [],
            "MAS_PERSON_RELATIONSHIP": [
                {
                    "PERSON_RELATIONSHIP_ID": 83,
                    "RELATIONSHIP_ID": 1,
                    "PERSON_ID": 105,
                    "TITLE_ID": 53,
                    "TITLE_NAME_TH": "?????????????????? (????????????)",
                    "TITLE_NAME_EN": "Seaman",
                    "TITLE_SHORT_NAME_TH": "?????????",
                    "TITLE_SHORT_NAME_EN": null,
                    "FIRST_NAME": "??????",
                    "MIDDLE_NAME": null,
                    "LAST_NAME": "??????",
                    "OTHER_NAME": null,
                    "GENDER_TYPE": 1,
                    "ID_CARD": null,
                    "BIRTH_DATE": null,
                    "BLOOD_TYPE": null,
                    "CAREER": null,
                    "PERSON_DESC": null,
                    "EMAIL": null,
                    "TEL_NO": null,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_FINGER_PRINT": [],
            "MAS_PERSON_PHOTO": []
        },
        {
            "PERSON_ID": 105,
            "COUNTRY_ID": 2,
            "NATIONALITY_ID": 1,
            "RACE_ID": 1,
            "RELIGION_ID": 1,
            "TITLE_ID": 56,
            "PERSON_TYPE": 0,
            "ENTITY_TYPE": 0,
            "TITLE_NAME_TH": "???????????????????????????",
            "TITLE_NAME_EN": "Air Marshal",
            "TITLE_SHORT_NAME_TH": "??????.???.???.",
            "TITLE_SHORT_NAME_EN": "AM",
            "FIRST_NAME": "??????????????????",
            "MIDDLE_NAME": null,
            "LAST_NAME": "??????????????????",
            "OTHER_NAME": null,
            "COMPANY_NAME": null,
            "COMPANY_REGISTRATION_NO": null,
            "COMPANY_FOUND_DATE": null,
            "COMPANY_LICENSE_NO": null,
            "COMPANY_LICENSE_DATE_FROM": null,
            "COMPANY_LICENSE_DATE_TO": null,
            "EXCISE_REGISTRATION_NO": null,
            "GENDER_TYPE": 0,
            "ID_CARD": "33366999",
            "BIRTH_DATE": null,
            "BLOOD_TYPE": null,
            "PASSPORT_NO": null,
            "VISA_TYPE": null,
            "PASSPORT_DATE_IN": null,
            "PASSPORT_DATE_OUT": null,
            "MARITAL_STATUS": 0,
            "CAREER": null,
            "PERSON_DESC": null,
            "EMAIL": null,
            "TEL_NO": null,
            "MISTREAT_NO": 0,
            "IS_ILLEGAL": 1,
            "IS_ACTIVE": 1,
            "SUB_DISTRICT_NAME_TH": null,
            "SUB_DISTRICT_NAME_EN": null,
            "DISTRICT_NAME_TH": null,
            "DISTRICT_NAME_EN": null,
            "PROVINCE_NAME_TH": null,
            "PROVINCE_NAME_EN": null,
            "MAS_PERSON_ADDRESS": [
                {
                    "PERSON_ADDRESS_ID": 65,
                    "PERSON_ID": 105,
                    "SUB_DISTRICT_ID": 470808,
                    "GPS": null,
                    "ADDRESS_NO": null,
                    "VILLAGE_NO": null,
                    "BUILDING_NAME": null,
                    "ROOM_NO": null,
                    "FLOOR": "22",
                    "VILLAGE_NAME": null,
                    "ALLEY": null,
                    "LANE": null,
                    "ROAD": null,
                    "ADDRESS_TYPE": 0,
                    "ADDRESS_DESC": null,
                    "ADDRESS_STATUS": 0,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_EDUCATION": [],
            "MAS_PERSON_RELATIONSHIP": [
                {
                    "PERSON_RELATIONSHIP_ID": 83,
                    "RELATIONSHIP_ID": 1,
                    "PERSON_ID": 105,
                    "TITLE_ID": 53,
                    "TITLE_NAME_TH": "?????????????????? (????????????)",
                    "TITLE_NAME_EN": "Seaman",
                    "TITLE_SHORT_NAME_TH": "?????????",
                    "TITLE_SHORT_NAME_EN": null,
                    "FIRST_NAME": "??????",
                    "MIDDLE_NAME": null,
                    "LAST_NAME": "??????",
                    "OTHER_NAME": null,
                    "GENDER_TYPE": 1,
                    "ID_CARD": null,
                    "BIRTH_DATE": null,
                    "BLOOD_TYPE": null,
                    "CAREER": null,
                    "PERSON_DESC": null,
                    "EMAIL": null,
                    "TEL_NO": null,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_FINGER_PRINT": [],
            "MAS_PERSON_PHOTO": []
        },
        {
            "PERSON_ID": 105,
            "COUNTRY_ID": 2,
            "NATIONALITY_ID": 1,
            "RACE_ID": 1,
            "RELIGION_ID": 1,
            "TITLE_ID": 56,
            "PERSON_TYPE": 0,
            "ENTITY_TYPE": 0,
            "TITLE_NAME_TH": "???????????????????????????",
            "TITLE_NAME_EN": "Air Marshal",
            "TITLE_SHORT_NAME_TH": "??????.???.???.",
            "TITLE_SHORT_NAME_EN": "AM",
            "FIRST_NAME": "??????????????????",
            "MIDDLE_NAME": null,
            "LAST_NAME": "??????????????????",
            "OTHER_NAME": null,
            "COMPANY_NAME": null,
            "COMPANY_REGISTRATION_NO": null,
            "COMPANY_FOUND_DATE": null,
            "COMPANY_LICENSE_NO": null,
            "COMPANY_LICENSE_DATE_FROM": null,
            "COMPANY_LICENSE_DATE_TO": null,
            "EXCISE_REGISTRATION_NO": null,
            "GENDER_TYPE": 0,
            "ID_CARD": "33366999",
            "BIRTH_DATE": null,
            "BLOOD_TYPE": null,
            "PASSPORT_NO": null,
            "VISA_TYPE": null,
            "PASSPORT_DATE_IN": null,
            "PASSPORT_DATE_OUT": null,
            "MARITAL_STATUS": 0,
            "CAREER": null,
            "PERSON_DESC": null,
            "EMAIL": null,
            "TEL_NO": null,
            "MISTREAT_NO": 0,
            "IS_ILLEGAL": 1,
            "IS_ACTIVE": 1,
            "SUB_DISTRICT_NAME_TH": null,
            "SUB_DISTRICT_NAME_EN": null,
            "DISTRICT_NAME_TH": null,
            "DISTRICT_NAME_EN": null,
            "PROVINCE_NAME_TH": null,
            "PROVINCE_NAME_EN": null,
            "MAS_PERSON_ADDRESS": [
                {
                    "PERSON_ADDRESS_ID": 65,
                    "PERSON_ID": 105,
                    "SUB_DISTRICT_ID": 470808,
                    "GPS": null,
                    "ADDRESS_NO": null,
                    "VILLAGE_NO": null,
                    "BUILDING_NAME": null,
                    "ROOM_NO": null,
                    "FLOOR": "22",
                    "VILLAGE_NAME": null,
                    "ALLEY": null,
                    "LANE": null,
                    "ROAD": null,
                    "ADDRESS_TYPE": 0,
                    "ADDRESS_DESC": null,
                    "ADDRESS_STATUS": 0,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_EDUCATION": [],
            "MAS_PERSON_RELATIONSHIP": [
                {
                    "PERSON_RELATIONSHIP_ID": 83,
                    "RELATIONSHIP_ID": 1,
                    "PERSON_ID": 105,
                    "TITLE_ID": 53,
                    "TITLE_NAME_TH": "?????????????????? (????????????)",
                    "TITLE_NAME_EN": "Seaman",
                    "TITLE_SHORT_NAME_TH": "?????????",
                    "TITLE_SHORT_NAME_EN": null,
                    "FIRST_NAME": "??????",
                    "MIDDLE_NAME": null,
                    "LAST_NAME": "??????",
                    "OTHER_NAME": null,
                    "GENDER_TYPE": 1,
                    "ID_CARD": null,
                    "BIRTH_DATE": null,
                    "BLOOD_TYPE": null,
                    "CAREER": null,
                    "PERSON_DESC": null,
                    "EMAIL": null,
                    "TEL_NO": null,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_FINGER_PRINT": [],
            "MAS_PERSON_PHOTO": []
        },
        {
            "PERSON_ID": 105,
            "COUNTRY_ID": 2,
            "NATIONALITY_ID": 1,
            "RACE_ID": 1,
            "RELIGION_ID": 1,
            "TITLE_ID": 56,
            "PERSON_TYPE": 0,
            "ENTITY_TYPE": 0,
            "TITLE_NAME_TH": "???????????????????????????",
            "TITLE_NAME_EN": "Air Marshal",
            "TITLE_SHORT_NAME_TH": "??????.???.???.",
            "TITLE_SHORT_NAME_EN": "AM",
            "FIRST_NAME": "??????????????????",
            "MIDDLE_NAME": null,
            "LAST_NAME": "??????????????????",
            "OTHER_NAME": null,
            "COMPANY_NAME": null,
            "COMPANY_REGISTRATION_NO": null,
            "COMPANY_FOUND_DATE": null,
            "COMPANY_LICENSE_NO": null,
            "COMPANY_LICENSE_DATE_FROM": null,
            "COMPANY_LICENSE_DATE_TO": null,
            "EXCISE_REGISTRATION_NO": null,
            "GENDER_TYPE": 0,
            "ID_CARD": "33366999",
            "BIRTH_DATE": null,
            "BLOOD_TYPE": null,
            "PASSPORT_NO": null,
            "VISA_TYPE": null,
            "PASSPORT_DATE_IN": null,
            "PASSPORT_DATE_OUT": null,
            "MARITAL_STATUS": 0,
            "CAREER": null,
            "PERSON_DESC": null,
            "EMAIL": null,
            "TEL_NO": null,
            "MISTREAT_NO": 0,
            "IS_ILLEGAL": 1,
            "IS_ACTIVE": 1,
            "SUB_DISTRICT_NAME_TH": null,
            "SUB_DISTRICT_NAME_EN": null,
            "DISTRICT_NAME_TH": null,
            "DISTRICT_NAME_EN": null,
            "PROVINCE_NAME_TH": null,
            "PROVINCE_NAME_EN": null,
            "MAS_PERSON_ADDRESS": [
                {
                    "PERSON_ADDRESS_ID": 65,
                    "PERSON_ID": 105,
                    "SUB_DISTRICT_ID": 470808,
                    "GPS": null,
                    "ADDRESS_NO": null,
                    "VILLAGE_NO": null,
                    "BUILDING_NAME": null,
                    "ROOM_NO": null,
                    "FLOOR": "22",
                    "VILLAGE_NAME": null,
                    "ALLEY": null,
                    "LANE": null,
                    "ROAD": null,
                    "ADDRESS_TYPE": 0,
                    "ADDRESS_DESC": null,
                    "ADDRESS_STATUS": 0,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_EDUCATION": [],
            "MAS_PERSON_RELATIONSHIP": [
                {
                    "PERSON_RELATIONSHIP_ID": 83,
                    "RELATIONSHIP_ID": 1,
                    "PERSON_ID": 105,
                    "TITLE_ID": 53,
                    "TITLE_NAME_TH": "?????????????????? (????????????)",
                    "TITLE_NAME_EN": "Seaman",
                    "TITLE_SHORT_NAME_TH": "?????????",
                    "TITLE_SHORT_NAME_EN": null,
                    "FIRST_NAME": "??????",
                    "MIDDLE_NAME": null,
                    "LAST_NAME": "??????",
                    "OTHER_NAME": null,
                    "GENDER_TYPE": 1,
                    "ID_CARD": null,
                    "BIRTH_DATE": null,
                    "BLOOD_TYPE": null,
                    "CAREER": null,
                    "PERSON_DESC": null,
                    "EMAIL": null,
                    "TEL_NO": null,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_FINGER_PRINT": [],
            "MAS_PERSON_PHOTO": []
        },
        {
            "PERSON_ID": 105,
            "COUNTRY_ID": 2,
            "NATIONALITY_ID": 1,
            "RACE_ID": 1,
            "RELIGION_ID": 1,
            "TITLE_ID": 56,
            "PERSON_TYPE": 0,
            "ENTITY_TYPE": 0,
            "TITLE_NAME_TH": "???????????????????????????",
            "TITLE_NAME_EN": "Air Marshal",
            "TITLE_SHORT_NAME_TH": "??????.???.???.",
            "TITLE_SHORT_NAME_EN": "AM",
            "FIRST_NAME": "??????????????????",
            "MIDDLE_NAME": null,
            "LAST_NAME": "??????????????????",
            "OTHER_NAME": null,
            "COMPANY_NAME": null,
            "COMPANY_REGISTRATION_NO": null,
            "COMPANY_FOUND_DATE": null,
            "COMPANY_LICENSE_NO": null,
            "COMPANY_LICENSE_DATE_FROM": null,
            "COMPANY_LICENSE_DATE_TO": null,
            "EXCISE_REGISTRATION_NO": null,
            "GENDER_TYPE": 0,
            "ID_CARD": "33366999",
            "BIRTH_DATE": null,
            "BLOOD_TYPE": null,
            "PASSPORT_NO": null,
            "VISA_TYPE": null,
            "PASSPORT_DATE_IN": null,
            "PASSPORT_DATE_OUT": null,
            "MARITAL_STATUS": 0,
            "CAREER": null,
            "PERSON_DESC": null,
            "EMAIL": null,
            "TEL_NO": null,
            "MISTREAT_NO": 0,
            "IS_ILLEGAL": 1,
            "IS_ACTIVE": 1,
            "SUB_DISTRICT_NAME_TH": null,
            "SUB_DISTRICT_NAME_EN": null,
            "DISTRICT_NAME_TH": null,
            "DISTRICT_NAME_EN": null,
            "PROVINCE_NAME_TH": null,
            "PROVINCE_NAME_EN": null,
            "MAS_PERSON_ADDRESS": [
                {
                    "PERSON_ADDRESS_ID": 65,
                    "PERSON_ID": 105,
                    "SUB_DISTRICT_ID": 470808,
                    "GPS": null,
                    "ADDRESS_NO": null,
                    "VILLAGE_NO": null,
                    "BUILDING_NAME": null,
                    "ROOM_NO": null,
                    "FLOOR": "22",
                    "VILLAGE_NAME": null,
                    "ALLEY": null,
                    "LANE": null,
                    "ROAD": null,
                    "ADDRESS_TYPE": 0,
                    "ADDRESS_DESC": null,
                    "ADDRESS_STATUS": 0,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_EDUCATION": [],
            "MAS_PERSON_RELATIONSHIP": [
                {
                    "PERSON_RELATIONSHIP_ID": 83,
                    "RELATIONSHIP_ID": 1,
                    "PERSON_ID": 105,
                    "TITLE_ID": 53,
                    "TITLE_NAME_TH": "?????????????????? (????????????)",
                    "TITLE_NAME_EN": "Seaman",
                    "TITLE_SHORT_NAME_TH": "?????????",
                    "TITLE_SHORT_NAME_EN": null,
                    "FIRST_NAME": "??????",
                    "MIDDLE_NAME": null,
                    "LAST_NAME": "??????",
                    "OTHER_NAME": null,
                    "GENDER_TYPE": 1,
                    "ID_CARD": null,
                    "BIRTH_DATE": null,
                    "BLOOD_TYPE": null,
                    "CAREER": null,
                    "PERSON_DESC": null,
                    "EMAIL": null,
                    "TEL_NO": null,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_FINGER_PRINT": [],
            "MAS_PERSON_PHOTO": []
        },
        {
            "PERSON_ID": 105,
            "COUNTRY_ID": 2,
            "NATIONALITY_ID": 1,
            "RACE_ID": 1,
            "RELIGION_ID": 1,
            "TITLE_ID": 56,
            "PERSON_TYPE": 0,
            "ENTITY_TYPE": 0,
            "TITLE_NAME_TH": "???????????????????????????",
            "TITLE_NAME_EN": "Air Marshal",
            "TITLE_SHORT_NAME_TH": "??????.???.???.",
            "TITLE_SHORT_NAME_EN": "AM",
            "FIRST_NAME": "??????????????????",
            "MIDDLE_NAME": null,
            "LAST_NAME": "??????????????????",
            "OTHER_NAME": null,
            "COMPANY_NAME": null,
            "COMPANY_REGISTRATION_NO": null,
            "COMPANY_FOUND_DATE": null,
            "COMPANY_LICENSE_NO": null,
            "COMPANY_LICENSE_DATE_FROM": null,
            "COMPANY_LICENSE_DATE_TO": null,
            "EXCISE_REGISTRATION_NO": null,
            "GENDER_TYPE": 0,
            "ID_CARD": "33366999",
            "BIRTH_DATE": null,
            "BLOOD_TYPE": null,
            "PASSPORT_NO": null,
            "VISA_TYPE": null,
            "PASSPORT_DATE_IN": null,
            "PASSPORT_DATE_OUT": null,
            "MARITAL_STATUS": 0,
            "CAREER": null,
            "PERSON_DESC": null,
            "EMAIL": null,
            "TEL_NO": null,
            "MISTREAT_NO": 0,
            "IS_ILLEGAL": 1,
            "IS_ACTIVE": 1,
            "SUB_DISTRICT_NAME_TH": null,
            "SUB_DISTRICT_NAME_EN": null,
            "DISTRICT_NAME_TH": null,
            "DISTRICT_NAME_EN": null,
            "PROVINCE_NAME_TH": null,
            "PROVINCE_NAME_EN": null,
            "MAS_PERSON_ADDRESS": [
                {
                    "PERSON_ADDRESS_ID": 65,
                    "PERSON_ID": 105,
                    "SUB_DISTRICT_ID": 470808,
                    "GPS": null,
                    "ADDRESS_NO": null,
                    "VILLAGE_NO": null,
                    "BUILDING_NAME": null,
                    "ROOM_NO": null,
                    "FLOOR": "22",
                    "VILLAGE_NAME": null,
                    "ALLEY": null,
                    "LANE": null,
                    "ROAD": null,
                    "ADDRESS_TYPE": 0,
                    "ADDRESS_DESC": null,
                    "ADDRESS_STATUS": 0,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_EDUCATION": [],
            "MAS_PERSON_RELATIONSHIP": [
                {
                    "PERSON_RELATIONSHIP_ID": 83,
                    "RELATIONSHIP_ID": 1,
                    "PERSON_ID": 105,
                    "TITLE_ID": 53,
                    "TITLE_NAME_TH": "?????????????????? (????????????)",
                    "TITLE_NAME_EN": "Seaman",
                    "TITLE_SHORT_NAME_TH": "?????????",
                    "TITLE_SHORT_NAME_EN": null,
                    "FIRST_NAME": "??????",
                    "MIDDLE_NAME": null,
                    "LAST_NAME": "??????",
                    "OTHER_NAME": null,
                    "GENDER_TYPE": 1,
                    "ID_CARD": null,
                    "BIRTH_DATE": null,
                    "BLOOD_TYPE": null,
                    "CAREER": null,
                    "PERSON_DESC": null,
                    "EMAIL": null,
                    "TEL_NO": null,
                    "IS_ACTIVE": 1
                }
            ],
            "MAS_PERSON_FINGER_PRINT": [],
            "MAS_PERSON_PHOTO": []
        }
    ]
