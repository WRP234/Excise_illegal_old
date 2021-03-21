import { FormControl, Validators } from '@angular/forms';

export class InvestigateSuspectLocale {


    public LOCALE_ID: number;
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
    public LOCATION: string;
    public IS_ACTIVE: number;
    public Region: string;
}

export const InvestigateSuspectFormControl = {
    LOCALE_ID: new FormControl(""),
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
    LOCATION: new FormControl(""),
    IS_ACTIVE: new FormControl(""),
    Region: new FormControl("")
}
