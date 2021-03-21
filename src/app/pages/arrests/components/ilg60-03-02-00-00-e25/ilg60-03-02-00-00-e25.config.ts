import { ManageConfig } from "../manage/manage.config";
import { Output, EventEmitter, Input } from "@angular/core";
import { ArrestIndictment, ArrestProduct, ArrestLawbreaker } from "../../models";
import { FormArray } from "@angular/forms";
import { BehaviorSubject } from "rxjs";

export class Ilg6003020000E25Config extends ManageConfig {


    @Input() isEdit: boolean;
    @Input() mode: string;
    @Input() invalid = new BehaviorSubject<Boolean>(false);
    @Input() inputData = new BehaviorSubject<ArrestIndictment[]>([]);
    @Input() ILG60_03_02_00_00_E21$ = new BehaviorSubject<ArrestProduct[]>([]);
    @Input() ILG60_03_03_00_00_E15$ = new BehaviorSubject<ArrestLawbreaker[]>([]);
    @Input() ILG60_03_03_00_00_E15_TrashIndex = new BehaviorSubject<number>(null);
    @Input() ILG60_03_02_00_00_E21_TrashIndex = new BehaviorSubject<number>(null);

    @Output() delIndict = new EventEmitter();
    @Output() Output = new EventEmitter<ArrestIndictment[]>(null);

    public TempIndictDel: any[] = [];

    get ArrestIndictment(): FormArray {
        return this.ArrestFG.get('ArrestIndictment') as FormArray;
    }

    getArrestIndictmentDetail(form: any) {
        return form.controls.ArrestIndictmentDetail.controls;
    }

    getArrestIndictmentProduct(form: any) {
        return form.controls.ArrestIndictmentProduct.controls;
    }

    sectionNameDropdown: any[] = [];
}