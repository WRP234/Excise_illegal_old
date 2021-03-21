export interface ArrestMasPerson {
    PERSON_ID: number;
    PERSON_TYPE: number;
    ENTITY_TYPE: number;
    ID_CARD: string;
    PASSPORT_NO: string;
    COMPANY_REGISTRATION_NO: string;
    TITLE_NAME_TH: string;
    TITLE_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
    FIRST_NAME: string;
    MIDDLE_NAME: string;
    LAST_NAME: string;
    OTHER_NAME: string;
    MISTREAT_NO: number;
    ArrestMasPersonRelationship: ArrestMasPersonRelationship[]
}

export interface ArrestMasPersongetByConAdv {
    PERSON_TYPE: number;
    ENTITY_TYPE: number;
    ID_CARD: string;
    PASSPORT_NO: string;
    COMPANY_REGISTRATION_NO: string;
    PERSON_NAME: string;
    AGENT_NAME: string;
    FATHER_NAME: string;
    MOTHER_NAME: string;
}

export interface ArrestMasPersonRelationship {
    PERSON_RELATIONSHIP_ID?: number;
    RELATIONSHIP_ID?: number;
    PERSON_ID?: number;
    RELATIONSHIP_NAME: string;
    TITLE_NAME_TH: string;
    TITLE_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
    FIRST_NAME: string;
    MIDDLE_NAME: string;
    LAST_NAME: string;
    OTHER_NAME: string;
}

export const ArrestMasPersonMock: any[] = [
    {
        "PERSON_ID": 15,
        "PERSON_TYPE": 0,
        "ENTITY_TYPE": 0,
        "ID_CARD": "15713000012345",
        "PASSPORT_NO": null,
        "COMPANY_REGISTRATION_NO": null,
        "TITLE_NAME_TH": "นาย",
        "TITLE_NAME_EN": "Mister",
        "TITLE_SHORT_NAME_TH": "นาย",
        "TITLE_SHORT_NAME_EN": "Mr.",
        "FIRST_NAME": "ทดสอบ",
        "MIDDLE_NAME": null,
        "LAST_NAME": "นามสกุล",
        "OTHER_NAME": null,
        "MISTREAT_NO": 0,
        "ArrestMasPersonRelationship": []
    },
    {
        "PERSON_ID": 1,
        "PERSON_TYPE": 0,
        "ENTITY_TYPE": 0,
        "ID_CARD": "15713000012345",
        "PASSPORT_NO": null,
        "COMPANY_REGISTRATION_NO": null,
        "TITLE_NAME_TH": "นาย",
        "TITLE_NAME_EN": "Mister",
        "TITLE_SHORT_NAME_TH": "นาย",
        "TITLE_SHORT_NAME_EN": "Mr.",
        "FIRST_NAME": "ธนากร",
        "MIDDLE_NAME": null,
        "LAST_NAME": "วิเศษแก้ว",
        "OTHER_NAME": null,
        "MISTREAT_NO": 4,
        "ArrestMasPersonRelationship": [
            {
                "PERSON_RELATIONSHIP_ID": 1,
                "RELATIONSHIP_ID": 1,
                "PERSON_ID": 1,
                "RELATIONSHIP_NAME": "นาย ลัดดา  วิเศษแก้ว",
                "TITLE_NAME_TH": "นาย",
                "TITLE_NAME_EN": "Mister",
                "TITLE_SHORT_NAME_TH": "นาย",
                "TITLE_SHORT_NAME_EN": "Mr.",
                "FIRST_NAME": "ลัดดา",
                "MIDDLE_NAME": null,
                "LAST_NAME": "วิเศษแก้ว",
                "OTHER_NAME": null
            }
        ]
    }
]