import { FormGroup, FormControl } from "@angular/forms";

export interface Types {
    value: number;
    text: string;
}

export const EDUCATION_LEVEL: Types[] = [
    { value: 0, text: 'ระดับชั้นเตรียมอนุบาล' },
    { value: 1, text: 'ระดับชั้นอนุบาล' },
    { value: 2, text: 'ระดับชั้นประถมศึกษา' },
    { value: 3, text: 'ระดับชั้นมัธยมศึกษา' },
    { value: 4, text: 'ประกาศนียบัตรวิชาชีพ (ปวช.)' },
    { value: 5, text: 'ประกาศนียบัตรวิชาชีพเทคนิค (ปวท.)' },
    { value: 6, text: 'ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)' },
    { value: 7, text: 'ระดับปริญญาตรี' },
    { value: 8, text: 'ปริญญาโท' },
    { value: 9, text: 'ปริญญาเอก' },
]

export const ADDRESS_TYPE: Types[] = [
    { value: 0, text: 'บ้านเดี่ยว' },
    { value: 1, text: 'อาคารพานิชย์หรือตึกแถว' },
    { value: 2, text: 'ทาวน์เฮาส์' },
    { value: 3, text: 'แฟลตหรืออาพาร์ตเม้นต์' },
    { value: 4, text: 'คอนโดมิเนียมหรืออาคารชุด' },
    { value: 5, text: 'สหกรณ์เคหสถาน' },
    { value: 6, text: 'อื่นๆ' }
]

export const ADDRESS_STATUS: Types[] = [
    { value: 0, text: 'เจ้าของ' },
    { value: 1, text: 'ผู้อาศัย' },
    { value: 2, text: 'ผู้เช่า' }
]

export const BLOOD_TYPE: Types[] = [
    {
        value: 0,
        text: 'O'
    }, {
        value: 1,
        text: 'A'
    }, {
        value: 2,
        text: 'B'
    }, {
        value: 3,
        text: 'AB'
    }
]

export interface RegionModel_intf {
    SUB_DISTRICT_ID: string;
    SUB_DISTRICT_NAME_TH: string;
    SUB_DISTRICT_NAME_EN: string;
    DISTRICT_NAME_TH: string;
    DISTRICT_NAME_EN: string;
    PROVINCE_NAME_TH: string;
    PROVINCE_NAME_EN: string;
}

export interface MasCountry {
    COUNTRY_ID: number;
    COUNTRY_CODE: number;
    COUNTRY_NAME_TH: string;
    COUNTRY_NAME_EN: string;
    COUNTRY_SHORT_NAME: string;
    IS_ACTIVE: number;
}

export interface ISuspect {
    SuspectItem: Suspect;
    SuspectFG: FormGroup;
    GetByCon(SuspectID: string);
    OnCreate(value: Suspect);
    OnRevice(value: Suspect);
}

export class Suspect {

    PERSON_ID: string;
    COUNTRY_ID: string;
    NATIONALITY_ID: string;
    RACE_ID: string;
    RELIGION_ID: string;
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
    COMPANY_NAME: string;
    COMPANY_REGISTRATION_NO: string;
    COMPANY_FOUND_DATE: string;
    COMPANY_LICENSE_NO: string;
    COMPANY_LICENSE_DATE_FROM: string;
    COMPANY_LICENSE_DATE_TO: string;
    EXCISE_REGISTRATION_NO: string;
    GENDER_TYPE: string;
    ID_CARD: string;
    BIRTH_DATE: string;
    BLOOD_TYPE: string;
    PASSPORT_NO: string;
    VISA_TYPE: number;
    PASSPORT_DATE_IN: string;
    PASSPORT_DATE_OUT: string;
    MARITAL_STATUS: number;
    CAREER: string;
    PERSON_DESC: string;
    EMAIL: string;
    TEL_NO: string;
    MISTREAT_NO: number;
    IS_ILLEGAL: number;
    IS_ACTIVE: number;

    MAS_PERSON_ADDRESS: Array<mas_person_address>;
    MAS_PERSON_EDUCATION: Array<mas_person_education>;
    MAS_PERSON_RELATIONSHIP: Array<personRelationship>;
    MAS_PERSON_PHOTO: Array<MasPersonPhoto>;
    MAS_PERSON_FINGER_PRINT: Array<MasPersonFingerPrint>;

    //--- Custom ---//
    Region: string
}


// ######################################PersonEducation#########################################
export class PersonEducation {
    public PERSON_EDUCATION_ID = "";
    public PERSON_ID = null;
    public EDUCATION_INSTITUTION = "";
    public EDUCATION_LEVEL = "";
    public EDUCATION_START_DATE = "";
    public EDUCATION_FINISH_DATE = "";
    public GPA = "";
    public IS_ACTIVE;

    //--- Custom ---//
    public IsNewItem: boolean;
}

export const EducationFormcontrol = {
    PERSON_EDUCATION_ID: new FormControl(""),
    PERSON_ID: new FormControl(""),
    EDUCATION_INSTITUTION: new FormControl(""),
    EDUCATION_LEVEL: new FormControl(""),
    EDUCATION_START_DATE: new FormControl(""),
    EDUCATION_FINISH_DATE: new FormControl(""),
    GPA: new FormControl(""),
    IS_ACTIVE: new FormControl(1),

}

// ######################################PersonEducation#########################################
export class personRelationship {
    public PERSON_RELATIONSHIP_ID = "";
    public RELATIONSHIP_ID = "";
    public PERSON_ID = null;
    public TITLE_ID = "";
    public TITLE_NAME_TH = "";
    public TITLE_NAME_EN = "";
    public TITLE_SHORT_NAME_TH = "";
    public TITLE_SHORT_NAME_EN = "";
    public FIRST_NAME = "";
    public MIDDLE_NAME = "";
    public LAST_NAME = "";
    public OTHER_NAME = "";
    public GENDER_TYPE = "";
    public ID_CARD = "";
    public BIRTH_DATE = "";
    public BLOOD_TYPE = "";
    public CAREER = "";
    public PERSON_DESC = "";
    public EMAIL = "";
    public TEL_NO = "";
    public IS_ACTIVE;

    //--- Custom ---//
    public IsNewItem: boolean;
}
export class Mas_personRelationship {
    public PERSON_RELATIONSHIP_ID: string;
    public RELATIONSHIP_ID: string;
    public PERSON_ID: string;
    public TITLE_ID: string;
    public TITLE_NAME_TH: string;
    public TITLE_NAME_EN: string;
    public TITLE_SHORT_NAME_TH: string;
    public TITLE_SHORT_NAME_EN: string;
    public FIRST_NAME: string;
    public MIDDLE_NAME: string;
    public LAST_NAME: string;
    public OTHER_NAME: string;
    public GENDER_TYPE: string;
    public ID_CARD: string;
    public BIRTH_DATE: string;
    public BLOOD_TYPE: string;
    public CAREER: string;
    public PERSON_DESC: string;
    public EMAIL: string;
    public TEL_NO: string;
    public IS_ACTIVE: number;

    //--- Custom ---//
    public IsNewItem: boolean;
}
// ######################################MAS_PERSON_ADDRESS#########################################
export class mas_person_address {
    public PERSON_ADDRESS_ID: string;
    public PERSON_ID: string;
    public SUB_DISTRICT_ID: string;
    public GPS: string;
    public ADDRESS_NO: string;
    public VILLAGE_NO: string;
    public BUILDING_NAME: string;
    public ROOM_NO: string;
    public FLOOR: string;
    public VILLAGE_NAME: string;
    public ALLEY: string;
    public LANE: string;
    public ROAD: string;
    public ADDRESS_TYPE: string;
    public ADDRESS_DESC: string;
    public ADDRESS_STATUS: string;
    public IS_ACTIVE: number;
    //#####CUSTOM######
    public Region: string;
}
export const PersonAddressFormcontrol = {
    PERSON_ADDRESS_ID: new FormControl(""),
    PERSON_ID: new FormControl(""),
    SUB_DISTRICT_ID: new FormControl(""),
    GPS: new FormControl(""),
    ADDRESS_NO: new FormControl(""),
    VILLAGE_NO: new FormControl(""),
    BUILDING_NAME: new FormControl(""),
    ROOM_NO: new FormControl(""),
    FLOOR: new FormControl(""),
    VILLAGE_NAME: new FormControl(""),
    ALLEY: new FormControl(""),
    LANE: new FormControl(""),
    ROAD: new FormControl(""),
    ADDRESS_TYPE: new FormControl(""),
    ADDRESS_DESC: new FormControl(""),
    ADDRESS_STATUS: new FormControl(""),
    IS_ACTIVE: new FormControl(1),

    //#####CUSTOM######
    Region: new FormControl("")
}

// ###################################### MAS_PERSON_EDUCATION #########################################
export class mas_person_education {
    PERSON_EDUCATION_ID: string;
    PERSON_ID: string;
    EDUCATION_INSTITUTION: string;
    EDUCATION_LEVEL: string;
    EDUCATION_START_DATE: string;
    EDUCATION_FINISH_DATE: string;
    GPA: any;
    IS_ACTIVE: number;
}

// ###################################### MasPersonPhoto #########################################
export class MasPersonPhoto {
    PHOTO_ID: string;
    PERSON_ID: string;
    PERSON_RELATIONSHIP_ID: string;
    PHOTO: string;
    TYPE: string;
    IS_ACTIVE: number;
}

// ###################################### MasPersonFingerPrint #########################################
export class MasPersonFingerPrint {
    FINGER_PRINT_ID: string;
    PERSON_ID: string;
    PERSON_RELATIONSHIP_ID: string;
    FINGER_PRINT: string;
    TYPE: string;
    IS_ACTIVE: number;
}