import { ArrestHelper } from "../../arrest.helper";
import { FormGroup } from "@angular/forms";
import { pagination } from "../../../../config/pagination";
import { Output, EventEmitter } from "@angular/core";
import { ArrestPurityCertOutPut } from "../../models";
import { BehaviorSubject } from "rxjs";

export class Ilg60O02000201Config extends ArrestHelper {

    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();
    @Output() Output = new EventEmitter<ArrestPurityCertOutPut>();

    public formGroup: FormGroup;
    public paginage = pagination;
    public advSearch: BehaviorSubject<Boolean>;
    public dataList = new Array<any>();
    public selectedEntry: any;

    public sDateOption = Object.assign({}, this.myDatePickerOptions);
    public eDateOption = Object.assign({}, this.myDatePickerOptions);

    public DATE_START_FROM: any
    public DATE_START_TO: any

    searchFailed = false;
    searching = false;

    public dismiss = (e: any) => this.d.emit(e);

    //TEMP_DEFAULTs
    public TEMP_TEXT_SEARCH: any = '';
    public TEMP_PURITYCERT_CODE: any = '';
    public TEMP_STAFF_NAME: any = '';
    public TEMP_OFFICE_NAME: any = '';
    public TEMP_PERSON_NAME: any = '';


}