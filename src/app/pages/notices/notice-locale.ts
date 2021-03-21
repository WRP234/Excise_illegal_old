import { FormControl, Validators } from '@angular/forms';

export class NoticeLocale {


    public LOCALE_ID: number;
    public NOTICE_ID: number;
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
    public ADDRESS_STATUS: string;
    public POLICE_STATION: string;
    public LOCATION: string;
    public IS_ACTIVE: number;


    // public LocaleID: number;
    // public NoticeCode: string;
    // // public CoordinateX: string;
    // // public CoordinateY: string;
    // public Location: string;
    // public Address: string;
    // public Village: string;
    // public Building: string;
    // public Floor: string;
    // public Room: string;
    // public Alley: string;
    // public Road: string;
    // public SubDistrictCode: string;
    // public SubDistrict: string;
    // public DistrictCode: string;
    // public District: string;
    // public ProvinceCode: string;
    // public Province: string;
    // public ZipCode: string;
    // public Policestation: string;
    // public IsActive: number;
    public Region: string;
}

export const NoticeLocaleFormControl = {


    LOCALE_ID: new FormControl(""),
    NOTICE_ID: new FormControl(""),
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
    ADDRESS_STATUS: new FormControl(""),
    POLICE_STATION: new FormControl(""),
    LOCATION: new FormControl(""),
    IS_ACTIVE: new FormControl(""),


    // LocaleID: new FormControl(null),
    // NoticeCode: new FormControl(null, Validators.required),
    // // CoordinateX: new FormControl('CoordinateX'),
    // // CoordinateY: new FormControl('CoordinateY'),
    // Location: new FormControl(null),
    // Address: new FormControl(null),
    // Village: new FormControl(null),
    // Building: new FormControl(null),
    // Floor: new FormControl(null),
    // Room: new FormControl(null),
    // Alley: new FormControl(null),
    // Road: new FormControl(null),
    // SubDistrictCode: new FormControl(null),
    // SubDistrict: new FormControl(null),
    // DistrictCode: new FormControl(null),
    // District: new FormControl(null),
    // ProvinceCode: new FormControl(null, Validators.required),
    // Province: new FormControl(null),
    // ZipCode: new FormControl('N/A'),
    // Policestation: new FormControl(null),
    // IsActive: new FormControl(1),
    Region: new FormControl("")
}
