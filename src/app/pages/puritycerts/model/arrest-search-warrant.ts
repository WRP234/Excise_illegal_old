export interface ArrestSearchWarrant {
    SEARCH_WARRANT_ID?: number;
    ARREST_ID?: number;
    REQUEST_CODE: string;
    REQUEST_NO?: number;
    REQUEST_NO_YEAR?: Date;
    REQUEST_DATE?: Date;
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
    STAFF_REPRESENTATION_POS_NAME: string;
    REQUEST_DATE_FROM?: Date;
    PRESENT_COURT_NAME: string;
    JUDGE_TITLE_NAME_TH: string;
    JUDGE_TITLE_NAME_EN: string;
    JUDGE_TITLE_SHORT_NAME_TH: string;
    JUDGE_TITLE_SHORT_NAME_EN: string;
    JUDGE_FIRST_NAME: string;
    JUDGE_LAST_NAME: string;
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
    SEARCH_WARRANT_NO?: number;
    SEARCH_WARRANT_NO_YEAR?: Date;
    SEARCH_WARRANT_DATE?: Date;
    CONSIDER_UNDECIDE_NO?: number;
    CONSIDER_UNDECIDE_NO_YEAR?: Date;
    CONSIDER_DECIDE_NO?: number;
    CONSIDER_DECIDE_NO_YEAR?: Date;
    CONSIDER_DATE?: Date;
}

export interface ArrestSearchWarrantgetByConAdv {
    REQUEST_CODE: string;
    REQUEST_NO?: number;
    REQUEST_NO_YEAR?: Date;
    COURT_NAME: string;
    REQUEST_DATE_FROM?: Date;
    REQUEST_DATE_TO?: Date;
    PERSON_NAME: string;
    STAFF_NAME: string;
    CONSIDER_UNDECIDE_NO?: number;
    CONSIDER_UNDECIDE_NO_YEAR?: Date;
    CONSIDER_DECIDE_NO?: number;
    CONSIDER_DECIDE_NO_YEAR?: Date;
    CONSIDER_DATE_FROM?: Date;
    CONSIDER_DATE_TO?: Date;
    SEARCH_WARRANT_NO?: number;
    SEARCH_WARRANT_NO_YEAR?: Date;
    SEARCH_WARRANT_DATE_FROM?: Date;
    SEARCH_WARRANT_DATE_TO?: Date;
}

export interface ArrestSearchWarrantupdByCon {
    SEARCH_WARRANT_ID: number;
    ARREST_ID: number;
}

export interface ArrestSearchWarrantOutput {
    SEARCH_WARRANT_ID: number;
    REQUEST_CODE: string;
}

export interface ArrestSearchWarrantupdDelete {
    SEARCH_WARRANT_ID: number;
}



export const ArrestSearchWarrantMock: any[] = [
    {
        "SEARCH_WARRANT_ID": 1,
        "REQUEST_CODE": "SW90806026000001",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },  {
        "SEARCH_WARRANT_ID": 1,
        "REQUEST_CODE": "SW90806026000001",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },  {
        "SEARCH_WARRANT_ID": 2,
        "REQUEST_CODE": "SW90806026000002",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },  {
        "SEARCH_WARRANT_ID": 3,
        "REQUEST_CODE": "SW90806026000003",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },  {
        "SEARCH_WARRANT_ID": 4,
        "REQUEST_CODE": "SW90806026000004",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },  {
        "SEARCH_WARRANT_ID": 5,
        "REQUEST_CODE": "SW90806026000005",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },  {
        "SEARCH_WARRANT_ID": 6,
        "REQUEST_CODE": "SW90806026000006",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },  {
        "SEARCH_WARRANT_ID": 7,
        "REQUEST_CODE": "SW90806026000007",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },  {
        "SEARCH_WARRANT_ID": 8,
        "REQUEST_CODE": "SW90806026000008",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },  {
        "SEARCH_WARRANT_ID": 9,
        "REQUEST_CODE": "SW90806026000009",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },  {
        "SEARCH_WARRANT_ID": 10,
        "REQUEST_CODE": "SW90806026000010",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },  {
        "SEARCH_WARRANT_ID": 11,
        "REQUEST_CODE": "SW90806026000011",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },  {
        "SEARCH_WARRANT_ID": 12,
        "REQUEST_CODE": "SW90806026000012",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },  {
        "SEARCH_WARRANT_ID": 13,
        "REQUEST_CODE": "SW90806026000013",
        "REQUEST_NO": 1,
        "REQUEST_NO_YEAR": 2562,
        "COURT_NAME": "ศาลอาญากรุงเทพใต้",
        "REQUEST_DATE": "2019-01-10",
        "PERSON_TITLE_NAME_TH": "นางสาว",
        "PERSON_FIRST_NAME": "ขุชนี",
        "PERSON_MIDDLE_NAME": "ทองใจ",
        "PERSON_LAST_NAME": "นางสาว",
        "STAFF_TITLE_NAME_TH": "พัชรี",
        "STAFF_FIRST_NAME": null,
        "STAFF_LAST_NAME": "ไชยศรี",
        "CONSIDER_UNDECIDE_NO": 46,
        "CONSIDER_UNDECIDE_NO_YEAR": 2562,
        "CONSIDER_DECIDE_NO": 26,
        "CONSIDER_DECIDE_NO_YEAR": 2562,
        "CONSIDER_DATE": "2019-01-11",
        "SEARCH_WARRANT_NO": 3,
        "SEARCH_WARRANT_NO_YEAR": 2562,
        "SEARCH_WARRANT_DATE": "2019-01-12"
    },
]