import { Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ArrestHelper } from "../../arrest.helper";
import { pagination } from "../../../../config/pagination";

export class Ilg60Mas01010201Config extends ArrestHelper {
    @Output() d = new EventEmitter();

    public formGroup: FormGroup;
    public paginage = pagination;
    public dataList = new Array<any>();

    public dismiss = (e: any) => this.d.emit(e);
}