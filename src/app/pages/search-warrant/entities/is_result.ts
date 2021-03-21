export enum IsResult {
    ALL = '',
    COMPLETE = 1,
    WAIT = 0
}

export const IsResultDropDown =
    [
        { value: IsResult.ALL, text: 'ทั้งหมด' },
        { value: IsResult.COMPLETE, text: 'อนุมัติคำร้อง' },
        { value: IsResult.WAIT, text: 'ไม่อนุมัติคำร้อง' }
    ];

export function GetIsResult(value) {
    return IsResultDropDown.find(x => x.value === value).text;
}
