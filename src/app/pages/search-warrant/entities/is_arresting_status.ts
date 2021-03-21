export enum IsArrestingStatus {
    ALL = '',
    WAIT = 0,
    COMPLETE = 1,
    NOTFOUND  = 2,
}

export const IsArrestingStatusDropDown =
    [
        { value: IsArrestingStatus.ALL, text: 'ทั้งหมด' },
        { value: IsArrestingStatus.WAIT, text: 'ยังไม่ดำเนินการ' },
        { value: IsArrestingStatus.COMPLETE, text: 'จับกุมแล้ว' },
        { value: IsArrestingStatus.NOTFOUND, text: 'ไม่พบความผิด' }
    ];

export function GetIsArrestingStatus(value) {
    return IsArrestingStatusDropDown.find(x => x.value === value).text;
}
