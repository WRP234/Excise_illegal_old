export enum IsDomestic {
    LOCAL = 1,
    BROTHEL = 2,
    ABROAD = 3,
    UNKNOWN = 4
}

export const IsDomesticDropDown =
    [
        { value: IsDomestic.LOCAL, text: "ในประเทศ" },
        { value: IsDomestic.BROTHEL, text: "สถานบริการ" },
        { value: IsDomestic.ABROAD, text: "ต่างประเทศ" },
        { value: IsDomestic.UNKNOWN, text: "ไม่ระบุ" }
    ]

export function GetIsDomestic(value) {
    const val = IsDomesticDropDown.find(x => x.value == value);
    return val ? val.text : null;
}