import { ManageConfig } from "../../manage/manage.config";
import { Output, EventEmitter, Input } from "@angular/core";
import { ArrestIndictment, ArrestProduct, ArrestLawbreaker } from "../../model";
import { FormArray } from "@angular/forms";
import { BehaviorSubject } from "rxjs";

export class Ilg6003020000E25Config extends ManageConfig {
    
    @Input() isEdit: boolean;
    @Input() ILG60_03_02_00_00_E21$: BehaviorSubject<ArrestProduct[]>;
    @Input() ILG60_03_03_00_00_E15$: BehaviorSubject<ArrestLawbreaker[]>;
    @Input() ILG60_03_02_00_00_E25$: BehaviorSubject<ArrestIndictment[]>;

    @Output() Output = new EventEmitter<ArrestIndictment[]>(null);

    get ArrestIndictment(): FormArray {
        return this.PuritycertFG.get('ArrestIndictment') as FormArray;
    }

    // getArrestIndictmentDetail(form: any) {
    //     return form.controls.ArrestIndictmentDetail.controls;
    // }
    //
    // getArrestIndictmentProduct(form: any) {
    //     return form.controls.ArrestIndictmentProduct.controls;
    // }
}
