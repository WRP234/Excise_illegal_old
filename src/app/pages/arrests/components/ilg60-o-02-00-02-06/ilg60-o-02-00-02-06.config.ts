import { ArrestHelper } from "../../arrest.helper";
import { pagination } from "../../../../config/pagination";
import { Output, EventEmitter, Input } from "@angular/core";
import { IArrestMasGuiltbase } from "../../models";
import { FormGroup, FormArray } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { ManageConfig } from "../manage/manage.config";


export class Ilg60O02000206Config extends ManageConfig {


    @Input() ILG60_03_02_00_00_E21$;
    @Input() ILG60_03_03_00_00_E15$;

    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();
    @Output() Output = new EventEmitter<IArrestMasGuiltbase[]>();

    public formGroup: FormGroup;
    public paginage = pagination;
    public dataList = new Array<any>();
    public selectedEntry: any;
    public INDICT_LP_SELECTED$: boolean = true;

    public LawbcheckedAll: boolean;
    public ProdcheckedAll: boolean;

    public ILG60_o_02_00_02_06_C1 = new BehaviorSubject<Boolean>(true);
    public ILG60_o_02_00_02_06_C2 = new BehaviorSubject<Boolean>(true);
    public ILG60_o_02_00_02_06_C3 = new BehaviorSubject<Boolean>(true);

    get ArrestMasGuiltbase(): FormArray {
        return this.formGroup.get('ArrestMasGuiltbase') as FormArray;
    }

    get IndictmentLawbreaker(): FormArray {
        return this.formGroup.get('IndictmentLawbreaker') as FormArray;
    }

    get IndictmentProducts(): FormArray {
        return this.formGroup.get('IndictmentProducts') as FormArray;
    }


    public dismiss = (e: any) => this.d.emit(e);
}