import { ArrestHelper } from "../../arrest.helper";
import { FormGroup, FormArray } from "@angular/forms";
import { ManageConfig } from "../manage/manage.config";
import { Output, EventEmitter, Input } from "@angular/core";
import { ArrestNotice } from "../../models";
import { BehaviorSubject } from "rxjs";

export class Ilg6003020000E10Config extends ManageConfig {

    public formGroup: FormGroup;

    @Input() isEdit: boolean;
    @Input() mode: string;
    @Input() inputData = new BehaviorSubject<ArrestNotice[]>([]);
    @Output() Output = new EventEmitter<ArrestNotice[]>();

    public addNoticeCheck$ = new BehaviorSubject<Boolean>(false);

    get ArrestNotice(): FormArray {
        return this.ArrestFG.get('ArrestNotice') as FormArray;
    }
}