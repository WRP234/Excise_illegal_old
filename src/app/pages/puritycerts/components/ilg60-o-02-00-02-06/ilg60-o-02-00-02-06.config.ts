import { pagination } from "../../../../config/pagination";
import { Output, EventEmitter } from "@angular/core";
import { IArrestMasGuiltbase } from "../../model";
import { FormGroup, FormArray } from "@angular/forms";

export class Ilg60O02000206Config {
    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();
    @Output() Output = new EventEmitter<IArrestMasGuiltbase[]>();

    public formGroup: FormGroup;
    public paginage = pagination;
    public dataList = new Array<any>();
    public selectedEntry: any;

    get ArrestMasGuiltbase(): FormArray {
        return this.formGroup.get('ArrestMasGuiltbase') as FormArray;
    }

    public dismiss = (e: any) => this.d.emit(e);
}