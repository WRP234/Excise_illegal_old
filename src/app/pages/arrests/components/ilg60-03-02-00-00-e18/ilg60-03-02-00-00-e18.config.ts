import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { ManageConfig } from "../manage/manage.config";
import { ArrestLocale } from "../../models";
import { Output, EventEmitter, Input } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class Ilg6003020000E18Config extends ManageConfig {

    public formGroup = new FormGroup({
        ADDRESS_NO: new FormControl(null),
        ADDRESS_STATUS: new FormControl(null),
        ADDRESS_TYPE: new FormControl(null),
        ALLEY: new FormControl(null),
        ARREST_ID: new FormControl(null),
        BUILDING_NAME: new FormControl(null),
        DISTRICT_NAME_EN: new FormControl(null),
        DISTRICT_NAME_TH: new FormControl(null),
        FLOOR: new FormControl(null),
        GPS: new FormControl(null),
        IS_ACTIVE: new FormControl(1),
        LANE: new FormControl(null),
        LATITUDE: new FormControl(null),
        LOCATION: new FormControl(null),
        LONGITUDE: new FormControl(null),
        POLICE_STATION: new FormControl(null),
        PROVINCE_NAME_EN: new FormControl(null),
        PROVINCE_NAME_TH: new FormControl(null),
        ROAD: new FormControl(null),
        ROOM_NO: new FormControl(null),
        SUB_DISTRICT_ID: new FormControl(null),
        SUB_DISTRICT_NAME_EN: new FormControl(null),
        SUB_DISTRICT_NAME_TH: new FormControl(null),
        VILLAGE_NAME: new FormControl(null),
        VILLAGE_NO: new FormControl(null),
        LOCALE_ID: new FormControl(null)
    });

    @Input() invalid = new BehaviorSubject<Boolean>(false);
    @Input() LOCATION_REQ_E18 = new BehaviorSubject<Boolean>(false);
    @Input() REGION_REQ_E18 = new BehaviorSubject<Boolean>(false);
    @Input() LOCALE_OFFICE_CODE = new BehaviorSubject<string>("");
    @Input() isEdit: boolean;
    @Input() mode: string;
    @Input() inputData = new BehaviorSubject<ArrestLocale[]>([]);
    @Output() Output = new EventEmitter<ArrestLocale[]>(null);

    get ArrestLocale(): FormArray {
        return this.ArrestFG.get('ArrestLocale') as FormArray;
    }
}