import { ManageConfig } from "../../manage/manage.config";
import { FormArray } from "@angular/forms";
import { CONTRIBUTOR_ID, ArrestStaff } from '../../model';
import { Output, EventEmitter, Input } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export class Ilg6003020000E13Config extends ManageConfig {

    public CONTRIBUTOR_ID = CONTRIBUTOR_ID;

    @Input() isEdit: boolean;
    @Input() inputData: BehaviorSubject<ArrestStaff[]>;
    @Output() Output = new EventEmitter<ArrestStaff[]>();

    get ArrestStaff(): FormArray {
        return this.PuritycertFG.get('ArrestStaff') as FormArray;
    }

    public getContributorId(value: number) {
        return CONTRIBUTOR_ID.find(x => x.value === value).text;
    }

}
