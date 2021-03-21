
export interface ArrestNotice {
    NOTICE_ID?: number;
    ARREST_ID?: number;
    NOTICE_CODE: string;
    NOTICE_DATE?: Date;
    IS_MATCH?: number;
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
    SUSPECT_TITLE_NAME_TH: string;
    SUSPECT_TITLE_NAME_EN: string;
    SUSPECT_TITLE_SHORT_NAME_TH: string;
    SUSPECT_TITLE_SHORT_NAME_EN: string;
    SUSPECT_FIRST_NAME: string;
    SUSPECT_MIDDLE_NAME: string;
    SUSPECT_LAST_NAME: string;
    SUSPECT_OTHER_NAME: string;
}

export interface ArrestNoticegetByConAdv {
    NOTICE_CODE: string;
    NOTICE_DATE_FROM?: Date;
    NOTICE_DATE_TO?: Date;
    STAFF_NAME: string;
    OFFICE_NAME: string;
    SUSPECT_NAME: string;
}

export interface ArrestNoticeupdByCon {
    NOTICE_ID: number;
    ARREST_ID: number;
}

export interface ArrestNoticeupdDelete {
    NOTICE_ID: number;
}

export const ArrestNoticeMock: any[] = [
    {
        "NOTICE_ID": 1,
        "NOTICE_CODE": 'LC908060000007',
        "NOTICE_DATE": '2019-01-10',
        "STAFF_TITLE_NAME_TH": 'นาง',
        "STAFF_FIRST_NAME": 'สาวพัชรี',
        "STAFF_LAST_NAME": 'เรืองไชย',
        "STAFF_OPERATION_OFFICE_SHORT_NAME": 'สสพ.ระยอง สาขาเมือง',
        "SUSPECT_TITLE_NAME_TH": 'นาย',
        "SUSPECT_FIRST_NAME": 'ชัยยุทธ',
        "SUSPECT_MIDDLE_NAME": null,
        "SUSPECT_LAST_NAME": 'พงพิสุทธิ์'
    },
    {
        "NOTICE_ID": 2,
        "NOTICE_CODE": 'LC908060000002',
        "NOTICE_DATE": '2019-01-10',
        "STAFF_TITLE_NAME_TH": 'นาง',
        "STAFF_FIRST_NAME": 'สาวพัชรี',
        "STAFF_LAST_NAME": 'เรืองไชย',
        "STAFF_OPERATION_OFFICE_SHORT_NAME": 'สสพ.ระยอง สาขาเมือง',
        "SUSPECT_TITLE_NAME_TH": 'นาย',
        "SUSPECT_FIRST_NAME": 'ชัยยุทธ',
        "SUSPECT_MIDDLE_NAME": null,
        "SUSPECT_LAST_NAME": 'พงพิสุทธิ์'
    },
    {
        "NOTICE_ID": 3,
        "NOTICE_CODE": 'LC908060000003',
        "NOTICE_DATE": '2019-01-10',
        "STAFF_TITLE_NAME_TH": 'นาง',
        "STAFF_FIRST_NAME": 'สาวพัชรี',
        "STAFF_LAST_NAME": 'เรืองไชย',
        "STAFF_OPERATION_OFFICE_SHORT_NAME": 'สสพ.ระยอง สาขาเมือง',
        "SUSPECT_TITLE_NAME_TH": 'นาย',
        "SUSPECT_FIRST_NAME": 'ชัยยุทธ',
        "SUSPECT_MIDDLE_NAME": null,
        "SUSPECT_LAST_NAME": 'พงพิสุทธิ์'
    },
    {
        "NOTICE_ID": 4,
        "NOTICE_CODE": 'LC908060000004',
        "NOTICE_DATE": '2019-01-10',
        "STAFF_TITLE_NAME_TH": 'นาง',
        "STAFF_FIRST_NAME": 'สาวพัชรี',
        "STAFF_LAST_NAME": 'เรืองไชย',
        "STAFF_OPERATION_OFFICE_SHORT_NAME": 'สสพ.ระยอง สาขาเมือง',
        "SUSPECT_TITLE_NAME_TH": 'นาย',
        "SUSPECT_FIRST_NAME": 'ชัยยุทธ',
        "SUSPECT_MIDDLE_NAME": null,
        "SUSPECT_LAST_NAME": 'พงพิสุทธิ์'
    },
    {
        "NOTICE_ID": 5,
        "NOTICE_CODE": 'LC908060000005',
        "NOTICE_DATE": '2019-01-10',
        "STAFF_TITLE_NAME_TH": 'นาง',
        "STAFF_FIRST_NAME": 'สาวพัชรี',
        "STAFF_LAST_NAME": 'เรืองไชย',
        "STAFF_OPERATION_OFFICE_SHORT_NAME": 'สสพ.ระยอง สาขาเมือง',
        "SUSPECT_TITLE_NAME_TH": 'นาย',
        "SUSPECT_FIRST_NAME": 'ชัยยุทธ',
        "SUSPECT_MIDDLE_NAME": null,
        "SUSPECT_LAST_NAME": 'พงพิสุทธิ์'
    }
]