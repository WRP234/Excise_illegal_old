import { Types } from "./arrest";

export interface ArrestLocale {
    LOCALE_ID?: number;
    ARREST_ID?: number;
    SUB_DISTRICT_ID?: number;
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
    ADDRESS_TYPE?: number;
    ADDRESS_STATUS?: number;
    POLICE_STATION: string;
    IS_ACTIVE?: number;
    SUB_DISTRICT_NAME_TH: string;
    SUB_DISTRICT_NAME_EN: string;
    DISTRICT_NAME_TH: string;
    DISTRICT_NAME_EN: string;
    PROVINCE_NAME_TH: string;
    PROVINCE_NAME_EN: string;
}

// export const ADDRESS_TYPE: Types[] = [
//     { value: 0, text: 'บ้านเดี่ยว' },
//     { value: 1, text: 'อาคารพาณิชย์หรือตึกแถว' },
//     { value: 2, text: 'ทาวน์เฮาส์' },
//     { value: 3, text: 'แฟลตหรืออาพาร์ตเม้นต์' },
//     { value: 4, text: 'คอนโดมิเนียมหรืออาคารชุด' },
//     { value: 5, text: 'สหกรณ์เคหสถาน' }
// ]

// export const ADDRESS_STATUS: Types[] = [
//     { value: 0, text: 'เจ้าของ' },
//     { value: 1, text: 'ผู้อยู่อาศัย' },
//     { value: 2, text: 'ผู้เช่า' }
// ]