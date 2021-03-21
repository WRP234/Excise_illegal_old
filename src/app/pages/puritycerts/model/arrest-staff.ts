import { Types } from './arrest';

export interface ArrestStaff {
    STAFF_ID?: number;
    ARREST_ID?: number;
    STAFF_REF_ID?: number;
    TITLE_ID?: number;
    STAFF_CODE: string;
    ID_CARD: string;
    STAFF_TYPE?: number;
    TITLE_NAME_TH: string;
    TITLE_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
    FIRST_NAME: string;
    LAST_NAME: string;
    AGE?: number;
    OPERATION_POS_CODE: string;
    OPREATION_POS_NAME: string;
    OPREATION_POS_LEVEL: string;
    OPERATION_POS_LEVEL_NAME: string;
    OPERATION_DEPT_CODE: string;
    OPERATION_DEPT_NAME: string;
    OPERATION_DEPT_LEVEL?: number;
    OPERATION_UNDER_DEPT_CODE: string;
    OPERATION_UNDER_DEPT_NAME: string;
    OPERATION_UNDER_DEPT_LEVEL?: number;
    OPERATION_WORK_DEPT_CODE: string;
    OPERATION_WORK_DEPT_NAME: string;
    OPERATION_WORK_DEPT_LEVEL?: number;
    OPERATION_OFFICE_CODE: string;
    OPERATION_OFFICE_NAME: string;
    OPERATION_OFFICE_SHORT_NAME: string;
    MANAGEMENT_POS_CODE: string;
    MANAGEMENT_POS_NAME: string;
    MANAGEMENT_POS_LEVEL: string;
    MANAGEMENT_POS_LEVEL_NAME: string;
    MANAGEMENT_DEPT_CODE: string;
    MANAGEMENT_DEPT_NAME: string;
    MANAGEMENT_DEPT_LEVEL?: number;
    MANAGEMENT_UNDER_DEPT_CODE: string;
    MANAGEMENT_UNDER_DEPT_NAME: string;
    MANAGEMENT_UNDER_DEPT_LEVEL?: number;
    MANAGEMENT_WORK_DEPT_CODE: string;
    MANAGEMENT_WORK_DEPT_NAME: string;
    MANAGEMENT_WORK_DEPT_LEVEL?: number;
    MANAGEMENT_OFFICE_CODE: string;
    MANAGEMENT_OFFICE_NAME: string;
    MANAGEMENT_OFFICE_SHORT_NAME: string;
    REPRESENTATION_POS_CODE: string;
    REPRESENTATION_POS_NAME: string;
    REPRESENTATION_POS_LEVEL: string;
    REPRESENTATION_POS_LEVEL_NAME: string;
    REPRESENTATION_DEPT_CODE: string;
    REPRESENTATION_DEPT_NAME: string;
    REPRESENTATION_DEPT_LEVEL?: number;
    REPRESENTATION_UNDER_DEPT_CODE: string;
    REPRESENTATION_UNDER_DEPT_NAME: string;
    REPRESENTATION_UNDER_DEPT_LEVEL?: number;
    REPRESENT_WORK_DEPT_CODE: string;
    REPRESENT_WORK_DEPT_NAME: string;
    REPRESENT_WORK_DEPT_LEVEL?: number;
    REPRESENT_OFFICE_CODE: string;
    REPRESENT_OFFICE_NAME: string;
    REPRESENT_OFFICE_SHORT_NAME: string;
    STATUS?: number;
    REMARK: string;
    CONTRIBUTOR_ID?: number;
    IS_ACTIVE?: number;
    PURITYCERT_ID?: number;
}

export const ArrestStaffVariable: ArrestStaff = {
    STAFF_ID: null,
    ARREST_ID: null,
    STAFF_REF_ID: null,
    TITLE_ID: null,
    STAFF_CODE: null,
    ID_CARD: null,
    STAFF_TYPE: null,
    TITLE_NAME_TH: null,
    TITLE_NAME_EN: null,
    TITLE_SHORT_NAME_TH: null,
    TITLE_SHORT_NAME_EN: null,
    FIRST_NAME: null,
    LAST_NAME: null,
    AGE: null,
    OPERATION_POS_CODE: null,
    OPREATION_POS_NAME: null,
    OPREATION_POS_LEVEL: null,
    OPERATION_POS_LEVEL_NAME: null,
    OPERATION_DEPT_CODE: null,
    OPERATION_DEPT_NAME: null,
    OPERATION_DEPT_LEVEL: null,
    OPERATION_UNDER_DEPT_CODE: null,
    OPERATION_UNDER_DEPT_NAME: null,
    OPERATION_UNDER_DEPT_LEVEL: null,
    OPERATION_WORK_DEPT_CODE: null,
    OPERATION_WORK_DEPT_NAME: null,
    OPERATION_WORK_DEPT_LEVEL: null,
    OPERATION_OFFICE_CODE: null,
    OPERATION_OFFICE_NAME: null,
    OPERATION_OFFICE_SHORT_NAME: null,
    MANAGEMENT_POS_CODE: null,
    MANAGEMENT_POS_NAME: null,
    MANAGEMENT_POS_LEVEL: null,
    MANAGEMENT_POS_LEVEL_NAME: null,
    MANAGEMENT_DEPT_CODE: null,
    MANAGEMENT_DEPT_NAME: null,
    MANAGEMENT_DEPT_LEVEL: null,
    MANAGEMENT_UNDER_DEPT_CODE: null,
    MANAGEMENT_UNDER_DEPT_NAME: null,
    MANAGEMENT_UNDER_DEPT_LEVEL: null,
    MANAGEMENT_WORK_DEPT_CODE: null,
    MANAGEMENT_WORK_DEPT_NAME: null,
    MANAGEMENT_WORK_DEPT_LEVEL: null,
    MANAGEMENT_OFFICE_CODE: null,
    MANAGEMENT_OFFICE_NAME: null,
    MANAGEMENT_OFFICE_SHORT_NAME: null,
    REPRESENTATION_POS_CODE: null,
    REPRESENTATION_POS_NAME: null,
    REPRESENTATION_POS_LEVEL: null,
    REPRESENTATION_POS_LEVEL_NAME: null,
    REPRESENTATION_DEPT_CODE: null,
    REPRESENTATION_DEPT_NAME: null,
    REPRESENTATION_DEPT_LEVEL: null,
    REPRESENTATION_UNDER_DEPT_CODE: null,
    REPRESENTATION_UNDER_DEPT_NAME: null,
    REPRESENTATION_UNDER_DEPT_LEVEL: null,
    REPRESENT_WORK_DEPT_CODE: null,
    REPRESENT_WORK_DEPT_NAME: null,
    REPRESENT_WORK_DEPT_LEVEL: null,
    REPRESENT_OFFICE_CODE: null,
    REPRESENT_OFFICE_NAME: null,
    REPRESENT_OFFICE_SHORT_NAME: null,
    STATUS: 1,
    REMARK: null,
    CONTRIBUTOR_ID: 6,
    IS_ACTIVE: 1,
    PURITYCERT_ID: null
};

export interface ArrestStaffupdDelete {
    STAFF_ID: number;
}

export const STAFF_TYPE: Types[] = [
    { value: 0, text: 'เจ้าหน้าที่อื่นๆ' },
    { value: 1, text: 'เจ้าหน้าที่กรมฯ' },
];

export const DEPT_LEVEL: Types[] = [
    { value: 1, text: 'กรม' },
    { value: 2, text: 'สำนัก/กลุ่ม/ศูนย์/สรรพสามิตภาค' },
    { value: 3, text: 'ส่วน(ส่วนกลาง/สภ.)/ฝ่าย (ส่วนกลาง/สภ.)/สรรพสามิตพื้นที่' },
    { value: 4, text: 'งาน(ส่วนกลาง)/ฝ่าย(สพ.)/สรรพสามิตพื้นที่สาขา' },
    { value: 5, text: 'ฝ่าย(สข.)/งาน(สข.)' }
];

export const STATUS: Types[] = [
    { value: 1, text: 'ปกติ' },
    { value: 2, text: 'พ้นจากราชการแล้ว' }
];

export const CONTRIBUTOR_ID: Types[] = [
    { value: 5, text: 'ผู้ตรวจค้น' },
    { value: 6, text: 'ผู้ร่วมตรวจค้น' }
];


export const ArrestStaffMock: any[] = [
    {
        "STAFF_ID": 92,
        "TITLE_ID": 3,
        "STAFF_CODE": "6373",
        "ID_CARD": null,
        "STAFF_TYPE": 1,
        "TITLE_NAME_TH": "นางสาว",
        "TITLE_NAME_EN": "Miss",
        "TITLE_SHORT_NAME_TH": "น.ส.",
        "TITLE_SHORT_NAME_EN": "Ms.",
        "FIRST_NAME": "สมพร",
        "LAST_NAME": "วงศ์ขันคำ",
        "BIRTH_DATE": null,
        "OPERATION_POS_CODE": "520412",
        "OPREATION_POS_NAME": "เจ้าพนักงานการเงินและบัญชีปฏิบัติงาน",
        "OPREATION_POS_LEVEL": "O1",
        "OPERATION_POS_LEVEL_NAME": "ประเภททั่วไป ระดับปฏิบัติงาน",
        "OPERATION_DEPT_CODE": "300600070400",
        "OPERATION_DEPT_NAME": "ส่วนคดี",
        "OPERATION_DEPT_LEVEL": null,
        "OPERATION_UNDER_DEPT_CODE": "300600070000",
        "OPERATION_UNDER_DEPT_NAME": "สำนักกฎหมาย",
        "OPERATION_UNDER_DEPT_LEVEL": null,
        "OPERATION_WORK_DEPT_CODE": null,
        "OPERATION_WORK_DEPT_NAME": null,
        "OPERATION_WORK_DEPT_LEVEL": null,
        "OPERATION_OFFICE_CODE": "000603",
        "OPERATION_OFFICE_NAME": "สำนักกฎหมาย ส่วนคดี",
        "OPERATION_OFFICE_SHORT_NAME": "สกม. ส่วนคดี",
        "MANAGEMENT_POS_CODE": null,
        "MANAGEMENT_POS_NAME": null,
        "MANAGEMENT_POS_LEVEL": null,
        "MANAGEMENT_POS_LEVEL_NAME": null,
        "MANAGEMENT_DEPT_CODE": null,
        "MANAGEMENT_DEPT_NAME": null,
        "MANAGEMENT_DEPT_LEVEL": null,
        "MANAGEMENT_UNDER_DEPT_CODE": null,
        "MANAGEMENT_UNDER_DEPT_NAME": null,
        "MANAGEMENT_UNDER_DEPT_LEVEL": null,
        "MANAGEMENT_WORK_DEPT_CODE": null,
        "MANAGEMENT_WORK_DEPT_NAME": null,
        "MANAGEMENT_WORK_DEPT_LEVEL": null,
        "MANAGEMENT_OFFICE_CODE": null,
        "MANAGEMENT_OFFICE_NAME": null,
        "MANAGEMENT_OFFICE_SHORT_NAME": null,
        "REPRESENT_POS_CODE": "520412",
        "REPRESENT_POS_NAME": "เจ้าพนักงานการเงินและบัญชี",
        "REPRESENT_POS_LEVEL": null,
        "REPRESENT_POS_LEVEL_NAME": null,
        "REPRESENT_DEPT_CODE": null,
        "REPRESENT_DEPT_NAME": null,
        "REPRESENT_DEPT_LEVEL": null,
        "REPRESENT_UNDER_DEPT_CODE": null,
        "REPRESENT_UNDER_DEPT_NAME": null,
        "REPRESENT_UNDER_DEPT_LEVEL": null,
        "REPRESENT_WORK_DEPT_CODE": null,
        "REPRESENT_WORK_DEPT_NAME": null,
        "REPRESENT_WORK_DEPT_LEVEL": null,
        "REPRESENT_OFFICE_CODE": null,
        "REPRESENT_OFFICE_NAME": null,
        "REPRESENT_OFFICE_SHORT_NAME": null,
        "STATUS": 1,
        "REMARK": null,
        "IS_ACTIVE": 1
    },
    {
        "STAFF_ID": 2419,
        "TITLE_ID": 1,
        "STAFF_CODE": "136140",
        "ID_CARD": null,
        "STAFF_TYPE": 1,
        "TITLE_NAME_TH": "นาย",
        "TITLE_NAME_EN": "Mister",
        "TITLE_SHORT_NAME_TH": "นาย",
        "TITLE_SHORT_NAME_EN": "Mister",
        "FIRST_NAME": "พิสุทธิ์",
        "LAST_NAME": "ประกิ่ง",
        "BIRTH_DATE": null,
        "OPERATION_POS_CODE": "10005",
        "OPREATION_POS_NAME": "พนักงานขับรถยนต์",
        "OPREATION_POS_LEVEL": "E1",
        "OPERATION_POS_LEVEL_NAME": "กลุ่มงานบริการ",
        "OPERATION_DEPT_CODE": "300601159300",
        "OPERATION_DEPT_NAME": "ฝ่ายอำนวยการ",
        "OPERATION_DEPT_LEVEL": null,
        "OPERATION_UNDER_DEPT_CODE": "300601150000",
        "OPERATION_UNDER_DEPT_NAME": "สำนักงานสรรพสามิตพื้นที่สกลนคร",
        "OPERATION_UNDER_DEPT_LEVEL": null,
        "OPERATION_WORK_DEPT_CODE": null,
        "OPERATION_WORK_DEPT_NAME": null,
        "OPERATION_WORK_DEPT_LEVEL": null,
        "OPERATION_OFFICE_CODE": "040900",
        "OPERATION_OFFICE_NAME": "สำนักงานสรรพสามิตพื้นที่สกลนคร",
        "OPERATION_OFFICE_SHORT_NAME": "สสพ.สกลนคร",
        "MANAGEMENT_POS_CODE": null,
        "MANAGEMENT_POS_NAME": null,
        "MANAGEMENT_POS_LEVEL": null,
        "MANAGEMENT_POS_LEVEL_NAME": null,
        "MANAGEMENT_DEPT_CODE": null,
        "MANAGEMENT_DEPT_NAME": null,
        "MANAGEMENT_DEPT_LEVEL": null,
        "MANAGEMENT_UNDER_DEPT_CODE": null,
        "MANAGEMENT_UNDER_DEPT_NAME": null,
        "MANAGEMENT_UNDER_DEPT_LEVEL": null,
        "MANAGEMENT_WORK_DEPT_CODE": null,
        "MANAGEMENT_WORK_DEPT_NAME": null,
        "MANAGEMENT_WORK_DEPT_LEVEL": null,
        "MANAGEMENT_OFFICE_CODE": null,
        "MANAGEMENT_OFFICE_NAME": null,
        "MANAGEMENT_OFFICE_SHORT_NAME": null,
        "REPRESENT_POS_CODE": "10005",
        "REPRESENT_POS_NAME": "พนักงานขับรถยนต์",
        "REPRESENT_POS_LEVEL": null,
        "REPRESENT_POS_LEVEL_NAME": null,
        "REPRESENT_DEPT_CODE": null,
        "REPRESENT_DEPT_NAME": null,
        "REPRESENT_DEPT_LEVEL": null,
        "REPRESENT_UNDER_DEPT_CODE": null,
        "REPRESENT_UNDER_DEPT_NAME": null,
        "REPRESENT_UNDER_DEPT_LEVEL": null,
        "REPRESENT_WORK_DEPT_CODE": null,
        "REPRESENT_WORK_DEPT_NAME": null,
        "REPRESENT_WORK_DEPT_LEVEL": null,
        "REPRESENT_OFFICE_CODE": null,
        "REPRESENT_OFFICE_NAME": null,
        "REPRESENT_OFFICE_SHORT_NAME": null,
        "STATUS": 1,
        "REMARK": null,
        "IS_ACTIVE": 0
    },
    {
        "STAFF_ID": 2420,
        "TITLE_ID": 1,
        "STAFF_CODE": "136006",
        "ID_CARD": null,
        "STAFF_TYPE": 1,
        "TITLE_NAME_TH": "นาย",
        "TITLE_NAME_EN": "Mister",
        "TITLE_SHORT_NAME_TH": "นาย",
        "TITLE_SHORT_NAME_EN": "Mister",
        "FIRST_NAME": "ธีรพันธ์",
        "LAST_NAME": "พิกุลแก้ว",
        "BIRTH_DATE": null,
        "OPERATION_POS_CODE": "20001",
        "OPREATION_POS_NAME": "พนักงานสื่อสาร",
        "OPREATION_POS_LEVEL": "E2",
        "OPERATION_POS_LEVEL_NAME": "กลุ่มงานเทคนิค",
        "OPERATION_DEPT_CODE": "300601159300",
        "OPERATION_DEPT_NAME": "ฝ่ายอำนวยการ",
        "OPERATION_DEPT_LEVEL": null,
        "OPERATION_UNDER_DEPT_CODE": "300601150000",
        "OPERATION_UNDER_DEPT_NAME": "สำนักงานสรรพสามิตพื้นที่สกลนคร",
        "OPERATION_UNDER_DEPT_LEVEL": null,
        "OPERATION_WORK_DEPT_CODE": null,
        "OPERATION_WORK_DEPT_NAME": null,
        "OPERATION_WORK_DEPT_LEVEL": null,
        "OPERATION_OFFICE_CODE": "040900",
        "OPERATION_OFFICE_NAME": "สำนักงานสรรพสามิตพื้นที่สกลนคร",
        "OPERATION_OFFICE_SHORT_NAME": "สสพ.สกลนคร",
        "MANAGEMENT_POS_CODE": null,
        "MANAGEMENT_POS_NAME": null,
        "MANAGEMENT_POS_LEVEL": null,
        "MANAGEMENT_POS_LEVEL_NAME": null,
        "MANAGEMENT_DEPT_CODE": null,
        "MANAGEMENT_DEPT_NAME": null,
        "MANAGEMENT_DEPT_LEVEL": null,
        "MANAGEMENT_UNDER_DEPT_CODE": null,
        "MANAGEMENT_UNDER_DEPT_NAME": null,
        "MANAGEMENT_UNDER_DEPT_LEVEL": null,
        "MANAGEMENT_WORK_DEPT_CODE": null,
        "MANAGEMENT_WORK_DEPT_NAME": null,
        "MANAGEMENT_WORK_DEPT_LEVEL": null,
        "MANAGEMENT_OFFICE_CODE": null,
        "MANAGEMENT_OFFICE_NAME": null,
        "MANAGEMENT_OFFICE_SHORT_NAME": null,
        "REPRESENT_POS_CODE": "20001",
        "REPRESENT_POS_NAME": "พนักงานสื่อสาร",
        "REPRESENT_POS_LEVEL": null,
        "REPRESENT_POS_LEVEL_NAME": null,
        "REPRESENT_DEPT_CODE": null,
        "REPRESENT_DEPT_NAME": null,
        "REPRESENT_DEPT_LEVEL": null,
        "REPRESENT_UNDER_DEPT_CODE": null,
        "REPRESENT_UNDER_DEPT_NAME": null,
        "REPRESENT_UNDER_DEPT_LEVEL": null,
        "REPRESENT_WORK_DEPT_CODE": null,
        "REPRESENT_WORK_DEPT_NAME": null,
        "REPRESENT_WORK_DEPT_LEVEL": null,
        "REPRESENT_OFFICE_CODE": null,
        "REPRESENT_OFFICE_NAME": null,
        "REPRESENT_OFFICE_SHORT_NAME": null,
        "STATUS": 1,
        "REMARK": null,
        "IS_ACTIVE": 1
    }
]
