export interface ArrestPurityCert {
    PURITYCERT_ID: number;
    ARREST_ID: number;
    PURITYCERT_CODE: string;
    PURITYCERT_DATE?: Date;
    OFFICE_NAME: string;
    STAFF_TITLE_NAME_TH: string;
    STAFF_TITLE_NAME_EN: string;
    STAFF_TITLE_SHORT_NAME_TH: string;
    STAFF_TITLE_SHORT_NAME_EN: string;
    STAFF_FIRST_NAME: string;
    STAFF_LAST_NAME: string;
    STAFF_OPERATION_OFFICE_NAME: string;
    STAFF_OPERATION_OFFICE_SHORT_NAME: string;
    STAFF_OPREATION_POS_NAME: string;
    STAFF_MANAGEMENT_OFFICE_NAME: string;
    STAFF_MANAGEMENT_OFFICE_SHORT_NAME: string;
    STAFF_MANAGEMENT_POS_NAME: string;
    STAFF_REPRESENT_OFFICE_NAME: string;
    STAFF_REPRESENT_OFFICE_SHORT_NAME: string;
    STAFF_REPRESENT_POS_NAME: string;
    PERSON_TITLE_NAME_TH: string;
    PERSON_TITLE_NAME_EN: string;
    PERSON_TITLE_SHORT_NAME_TH: string;
    PERSON_TITLE_SHORT_NAME_EN: string;
    PERSON_FIRST_NAME: string;
    PERSON_MIDDLE_NAME: string;
    PERSON_LAST_NAME: string;
    PERSON_OTHER_NAME: string;
    SUB_DISTRICT_NAME_TH: string;
    SUB_DISTRICT_NAME_EN: string;
    DISTRICT_NAME_TH: string;
    DISTRICT_NAME_EN: string;
    PROVINCE_NAME_TH: string;
    PROVINCE_NAME_EN: string;
}

export interface ArrestPurityCertgetByConAdv {
    PURITYCERT_CODE: string;
    PURITYCERT_DATE_FROM?: Date;
    PURITYCERT_DATE_TO?: Date;
    OFFICE_NAME: string;
    STAFF_NAME: string;
    PERSON_NAME: string;
}

export interface ArrestPurityCertupdByCon {
    PURITYCERT_ID: number;
    ARREST_ID: number;
}

export interface ArrestPurityCertOutPut {
    PURITYCERT_ID: number;
    PURITYCERT_CODE: string;
}

export interface ArrestPurityCertupdDelete {
    PURITYCERT_ID: number;
}

export const ArrestPurityCertMock: any[] = [
    {
        "PURITYCERT_ID": 1,
        "PURITYCERT_CODE": "SC908060000007",
        "PURITYCERT_DATE":  "2019-01-10",
        "STAFF_TITLE_NAME_TH": "นางสาว",
        "STAFF_FIRST_NAME": "พัชรี",
        "STAFF_LAST_NAME": "เรืองไชย",
        "STAFF_OPERATION_OFFICE_SHORT_NAME": "สสพ.ระยอง สาขาเมือง",
        "PERSON_TITLE_NAME_TH": "นาย",
        "PERSON_FIRST_NAME": "ชัยยุทธ",
        "PERSON_MIDDLE_NAME": null,
        "PERSON_LAST_NAME": "พงพิสุทธิ์"
    },
    {
        "PURITYCERT_ID": 2,
        "PURITYCERT_CODE": "SC908060000008",
        "PURITYCERT_DATE": "2019-01-11",
        "STAFF_TITLE_NAME_TH": "นางสาว",
        "STAFF_FIRST_NAME": "พัชรี",
        "STAFF_LAST_NAME": "เรืองไชย",
        "STAFF_OPERATION_OFFICE_SHORT_NAME": "สสพ.ระยอง สาขาเมือง",
        "PERSON_TITLE_NAME_TH": "นาย",
        "PERSON_FIRST_NAME": "ชัยยุทธ",
        "PERSON_MIDDLE_NAME": null,
        "PERSON_LAST_NAME": "พงพิสุทธิ์"
    },
    {
        "PURITYCERT_ID": 3,
        "PURITYCERT_CODE": "SC908060000009",
        "PURITYCERT_DATE": "2019-01-24",
        "STAFF_TITLE_NAME_TH": "นางสาว",
        "STAFF_FIRST_NAME": "พัชรี",
        "STAFF_LAST_NAME": "เรืองไชย",
        "STAFF_OPERATION_OFFICE_SHORT_NAME": "สสพ.ระยอง สาขาเมือง",
        "PERSON_TITLE_NAME_TH": "นาย",
        "PERSON_FIRST_NAME": "ชัยยุทธ",
        "PERSON_MIDDLE_NAME": null,
        "PERSON_LAST_NAME": "พงพิสุทธิ์"
    },
    {
        "PURITYCERT_ID": 4,
        "PURITYCERT_CODE": "SC908060000010",
        "PURITYCERT_DATE": "2019-01-10",
        "STAFF_TITLE_NAME_TH": "นางสาว",
        "STAFF_FIRST_NAME": "พัชรี",
        "STAFF_LAST_NAME": "เรืองไชย",
        "STAFF_OPERATION_OFFICE_SHORT_NAME": "สสพ.ระยอง สาขาเมือง",
        "PERSON_TITLE_NAME_TH": "นาย",
        "PERSON_FIRST_NAME": "ชัยยุทธ",
        "PERSON_MIDDLE_NAME": null,
        "PERSON_LAST_NAME": "พงพิสุทธิ์"
    },
    {
        "PURITYCERT_ID": 5,
        "PURITYCERT_CODE": "SC908060000011",
        "PURITYCERT_DATE": "2019-01-11",
        "STAFF_TITLE_NAME_TH": "นางสาว",
        "STAFF_FIRST_NAME": "พัชรี",
        "STAFF_LAST_NAME": "เรืองไชย",
        "STAFF_OPERATION_OFFICE_SHORT_NAME": "สสพ.ระยอง สาขาเมือง",
        "PERSON_TITLE_NAME_TH": "นาย",
        "PERSON_FIRST_NAME": "ชัยยุทธ",
        "PERSON_MIDDLE_NAME": null,
        "PERSON_LAST_NAME": "พงพิสุทธิ์"
    },
    {
        "PURITYCERT_ID": 6,
        "PURITYCERT_CODE": "SC908060000012",
        "PURITYCERT_DATE": "2019-01-24",
        "STAFF_TITLE_NAME_TH": "นางสาว",
        "STAFF_FIRST_NAME": "พัชรี",
        "STAFF_LAST_NAME": "เรืองไชย",
        "STAFF_OPERATION_OFFICE_SHORT_NAME": "สสพ.ระยอง สาขาเมือง",
        "PERSON_TITLE_NAME_TH": "นาย",
        "PERSON_FIRST_NAME": "ชัยยุทธ",
        "PERSON_MIDDLE_NAME": null,
        "PERSON_LAST_NAME": "พงพิสุทธิ์"
    },
    {
        "PURITYCERT_ID": 7,
        "PURITYCERT_CODE": "SC908060000013",
        "PURITYCERT_DATE": "2019-01-10",
        "STAFF_TITLE_NAME_TH": "นางสาว",
        "STAFF_FIRST_NAME": "พัชรี",
        "STAFF_LAST_NAME": "เรืองไชย",
        "STAFF_OPERATION_OFFICE_SHORT_NAME": "สสพ.ระยอง สาขาเมือง",
        "PERSON_TITLE_NAME_TH": "นาย",
        "PERSON_FIRST_NAME": "ชัยยุทธ",
        "PERSON_MIDDLE_NAME": null,
        "PERSON_LAST_NAME": "พงพิสุทธิ์"
    },
    {
        "PURITYCERT_ID": 8,
        "PURITYCERT_CODE": "SC908060000014",
        "PURITYCERT_DATE": "2019-01-11",
        "STAFF_TITLE_NAME_TH": "นางสาว",
        "STAFF_FIRST_NAME": "พัชรี",
        "STAFF_LAST_NAME": "เรืองไชย",
        "STAFF_OPERATION_OFFICE_SHORT_NAME": "สสพ.ระยอง สาขาเมือง",
        "PERSON_TITLE_NAME_TH": "นาย",
        "PERSON_FIRST_NAME": "ชัยยุทธ",
        "PERSON_MIDDLE_NAME": null,
        "PERSON_LAST_NAME": "พงพิสุทธิ์"
    },
    {
        "PURITYCERT_ID": 9,
        "PURITYCERT_CODE": "SC908060000015",
        "PURITYCERT_DATE": "2019-01-24",
        "STAFF_TITLE_NAME_TH": "นางสาว",
        "STAFF_FIRST_NAME": "พัชรี",
        "STAFF_LAST_NAME": "เรืองไชย",
        "STAFF_OPERATION_OFFICE_SHORT_NAME": "สสพ.ระยอง สาขาเมือง",
        "PERSON_TITLE_NAME_TH": "นาย",
        "PERSON_FIRST_NAME": "ชัยยุทธ",
        "PERSON_MIDDLE_NAME": null,
        "PERSON_LAST_NAME": "พงพิสุทธิ์"
    }
]