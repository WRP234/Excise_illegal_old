import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { ManageConfig } from "../../manage/manage.config";
import { ArrestLocale } from '../../../model';
import { Output, EventEmitter, Input } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";



export class Ilg6003020000E18Config extends ManageConfig {

    public formGroup = new FormGroup({
        person_status : new FormControl(null),
        person_title_id: new FormControl(null),
        person_first_name: new FormControl(null),
        person_last_name: new FormControl(null),
        person_id_card: new FormControl(null),
        person_age: new FormControl(null),
        person_career: new FormControl(null),
        person_position: new FormControl(null),


        LOCALE_ID: new FormControl(null),
        SUB_DISTRICT_ID: new FormControl(null),

        LATITUDE: new FormControl(null),
        LONGITUDE: new FormControl(null),
        GPS: new FormControl(null),

        ADDRESS_NO: new FormControl(null),
        VILLAGE_NO: new FormControl(null),
        BUILDING_NAME: new FormControl(null),
        ROOM_NO: new FormControl(null),
        FLOOR: new FormControl(null),
        VILLAGE_NAME: new FormControl(null),
        ALLEY: new FormControl(null),
        LANE: new FormControl(null),
        ROAD: new FormControl(null),
        ADDRESS_TYPE: new FormControl(null),
        ADDRESS_STATUS: new FormControl(null),
        POLICE_STATION: new FormControl(null),
        IS_ACTIVE: new FormControl(1),
        SUB_DISTRICT_NAME_TH: new FormControl(null),
        SUB_DISTRICT_NAME_EN: new FormControl(null),
        DISTRICT_NAME_TH: new FormControl(null),
        DISTRICT_NAME_EN: new FormControl(null),
        PROVINCE_NAME_TH: new FormControl(null),
        PROVINCE_NAME_EN: new FormControl(null),
    });

    @Input() isEdit: boolean;
    @Input() inputData: BehaviorSubject<ArrestLocale[]>;
    @Input() inputData2: any ;
    @Output() Output = new EventEmitter<ArrestLocale[]>(null);

    get ArrestLocale(): FormArray {
        return this.PuritycertFG.get('ArrestLocale') as FormArray;
    }
}
