export interface IMasOffice {
    OFFICE_ID: number;
    OFFICE_CODE: string;
    OFFICE_NAME: string;
    IS_ACTIVE: number;
}

export interface ISearchMasOffice {
    TEXT_SEARCH: string;
    OFFICE_ID?: number;
}

export const MasOfficeMock: IMasOffice[] = [
    {
        OFFICE_ID: 1,
        OFFICE_CODE: "officeCode01",
        OFFICE_NAME: "officeCode01",
        IS_ACTIVE: 1
    },
    {
        OFFICE_ID: 2,
        OFFICE_CODE: "officeCode02",
        OFFICE_NAME: "officeCode02",
        IS_ACTIVE: 1
    }, {
        OFFICE_ID: 3,
        OFFICE_CODE: "officeCode03",
        OFFICE_NAME: "officeCode03",
        IS_ACTIVE: 1
    }
]
