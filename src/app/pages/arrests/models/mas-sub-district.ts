export interface MasSubDistrictgetByCon {
    TEXT_SEARCH: string;
    SUB_DISTRICT_ID: number;
    DISTRICT_ID?: number;
}

export interface MasSubDistrict {
    // SUB_DISTRICT_ID: number;
    // DISTRICT_ID: number;
    // OFFICE_CODE: string;
    // SUB_DISTRICT_CODE: string;
    // SUB_DISTRICT_NAME_TH: string;
    // SUB_DISTRICT_NAME_EN: string;
    // ZIP_CODE: string;
    // IS_ACTIVE: number;
    
    DISTRICT_ID: number;
    DISTRICT_NAME_EN: string;
    DISTRICT_NAME_TH: string;
    IS_ACTIVE: number;
    OFFICE_CODE: string;
    PROVINCE_ID: number;
    PROVINCE_NAME_EN: string;
    PROVINCE_NAME_TH: string;
    SUB_DISTRICT_CODE: string;
    SUB_DISTRICT_ID: number;
    SUB_DISTRICT_NAME_EN: string;
    SUB_DISTRICT_NAME_TH: string;
    ZIP_CODE: string;
}

export const MasSubDistrictMock: any[] = [
    {
        "SUB_DISTRICT_ID": 470808,
        "DISTRICT_ID": 4708,
        "OFFICE_CODE": "040902",
        "SUB_DISTRICT_CODE": "470808",
        "SUB_DISTRICT_NAME_TH": "ศรีวิชัย",
        "SUB_DISTRICT_NAME_EN": null,
        "ZIP_CODE": "47120",
        "IS_ACTIVE": 1,
        "DISTRICT_NAME_TH": "วานรนิวาส",
        "DISTRICT_NAME_EN": null,
        "PROVINCE_ID": 47,
        "PROVINCE_NAME_TH": "สกลนคร",
        "PROVINCE_NAME_EN": null
    }
]