export enum IsLawsuitComplate {
    WAIT = 0,
    COMPLATE = 1
}

export const IsLawsuitComplateDropDown =
    [
        { value: IsLawsuitComplate.WAIT, text: "ยังพิจารณาไม่ครบทุกข้อกล่าวหา" },
        { value: IsLawsuitComplate.COMPLATE, text: "พิจารณาครบทุกข้อกล่าวหาแล้ว" }
    ]

export function GetIsLawsuitComplate(value) {
    return IsLawsuitComplateDropDown.find(x => x.value == value).text;
}