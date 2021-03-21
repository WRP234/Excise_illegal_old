import { FormControl, Validators } from '@angular/forms';

export class NoticeInformer {

    public INFORMER_STATUS: any;
    public TITLE_SHORT_NAME_TH: string;
    public FIRST_NAME: string;
    public LAST_NAME: string;
    public AGE: string;
    public ADDRESS_NO: string;
    public VILLAGE_NO: string;
    public BUILDING_NAME: string;
    public ROOM_NO: string;
    public FLOOR: string;
    public ALLEY: string;
    public LANE: string;
    public ROAD: string;
    public INFORMER_INFO: string;
    public FULL_NAME: string;

    public INFORMER_ID: string;
    public NOTICE_ID: string;
    public TITLE_ID: string;
    public SUB_DISTRICT_ID: number;
    public TITLE_NAME_TH: string;
    public TITLE_NAME_EN: string;
    public TITLE_SHORT_NAME_EN: string;
    public MIDDLE_NAME: string;
    public OTHER_NAME: string;
    public ID_CARD: string;
    public CAREER: string;
    public POSITION: string;
    public PERSON_DESC: string;
    public EMAIL: string;
    public TEL_NO: string;
    public GPS: string;
    public VILLAGE_NAME: string;
    public INFORMER_PHOTO: string;
    public INFORMER_FINGER_PRINT: string;
    public IS_ACTIVE: string;

    // public InformerID: string;
    // public InformerType: number;
    // public NoticeCode: string;
    // public TitleCode: string;
    // public TitleName: string;
    // public FirstName: string;
    // public LastName: string;
    // public FullName: string;
    // public IDCard: string;
    // public Age: string;
    // public GenderType: string;
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
    // public TelephoneNo: string;
    // public InformerInfo: string;
    // public IsActive: number;

    public Region: string;
}

export const NoticeInformerFormControl = {

    NOTICE_ID: new FormControl("", Validators.required),
    INFORMER_STATUS: new FormControl(""),
    TITLE_SHORT_NAME_TH: new FormControl(""),
    FIRST_NAME: new FormControl(""),
    LAST_NAME: new FormControl(""),
    AGE: new FormControl(""),
    ADDRESS_NO: new FormControl(""),
    VILLAGE_NO: new FormControl(""),
    BUILDING_NAME: new FormControl(""),
    ROOM_NO: new FormControl(""),
    FLOOR: new FormControl(""),
    ALLEY: new FormControl(""),
    LANE: new FormControl(""),
    ROAD: new FormControl(""),
    INFORMER_INFO: new FormControl(""),
    FULL_NAME: new FormControl(""),

    INFORMER_ID: new FormControl(""),
    TITLE_ID: new FormControl(""),
    SUB_DISTRICT_ID: new FormControl(""),
    TITLE_NAME_TH: new FormControl(""),
    TITLE_NAME_EN: new FormControl(""),
    TITLE_SHORT_NAME_EN: new FormControl(""),
    MIDDLE_NAME: new FormControl(""),
    OTHER_NAME: new FormControl(""),
    ID_CARD: new FormControl(""),
    CAREER: new FormControl(""),
    POSITION: new FormControl(""),
    PERSON_DESC: new FormControl(""),
    EMAIL: new FormControl(""),
    TEL_NO: new FormControl(""),
    GPS: new FormControl(""),
    VILLAGE_NAME: new FormControl(""),
    INFORMER_PHOTO: new FormControl(""),
    INFORMER_FINGER_PRINT: new FormControl(""),
    IS_ACTIVE: new FormControl(""),

    // InformerID: new FormControl('22'),
    // InformerType: new FormControl(null),
    // NoticeCode: new FormControl(null, Validators.required),
    // TitleCode: new FormControl(null),
    // TitleName: new FormControl(null),
    // FirstName: new FormControl(null, Validators.required),
    // LastName: new FormControl(null),
    // IDCard: new FormControl('N/A'),
    // Age: new FormControl(null),
    // GenderType: new FormControl('-'),
    // Location: new FormControl('N/A'),
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
    // ProvinceCode: new FormControl(null),
    // Province: new FormControl(null),
    // ZipCode: new FormControl('N/A'),
    // TelephoneNo: new FormControl('N/A'),
    // InformerInfo: new FormControl(null),
    IsActive: new FormControl(1),
    // FullName: new FormControl(null),
    Region: new FormControl("")
}
