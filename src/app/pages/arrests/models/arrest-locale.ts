import { Types } from "./arrest";

export interface ArrestLocale {
    ADDRESS_NO: string;
    ADDRESS_STATUS?: number;
    ADDRESS_TYPE?: number;
    ALLEY: string;
    ARREST_ID?: number;
    BUILDING_NAME: string;
    DISTRICT_NAME_EN: string;
    DISTRICT_NAME_TH: string;
    FLOOR: string;
    GPS: string;
    IS_ACTIVE?: number;
    LANE: string;
    LOCATION: string;
    POLICE_STATION: string;
    PROVINCE_NAME_EN: string;
    PROVINCE_NAME_TH: string;
    ROAD: string;
    ROOM_NO: string;
    SUB_DISTRICT_ID?: number;
    SUB_DISTRICT_NAME_EN: string;
    SUB_DISTRICT_NAME_TH: string;
    VILLAGE_NAME: string;
    VILLAGE_NO: string;
    LOCALE_ID?: number;
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