export enum IsLawsuitComplate {
    WAIT = 0,
    COMPLATE = 1
}

export const IsLawsuitComplateDropDown =
    [
        { value: IsLawsuitComplate.WAIT, text: "ยังไม่รับเป็นคดี" },
        { value: IsLawsuitComplate.COMPLATE, text: "รับเป็นคดี" }
    ]

export function GetIsLawsuitComplate(value) {
    return IsLawsuitComplateDropDown.find(x => x.value == value).text;
}