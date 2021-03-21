import { ArrestHelper } from "../../arrest.helper";
import { pagination } from "app/config/pagination";
import { ArrestNotice } from "../../models";
import { Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";

export class Ilg60O02000203Config extends ArrestHelper {

    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();
    @Output() Output = new EventEmitter<ArrestNotice[]>();

    public noticeDateFormOption = Object.assign({}, this.myDatePickerOptions);
    public noticeDateToOption = Object.assign({}, this.myDatePickerOptions);
    public NOTICE_DATE_FROM: any
    public NOTICE_DATE_TO: any
    public formGroup: FormGroup;
    public paginage = pagination;
    public advSearch: BehaviorSubject<Boolean>;
    // public advSearch = true;
    public dataList = new Array<any>();
    public selectedEntry: any;

    searchFailed = false;
    searching = false;

    public dismiss = (e: any) => this.d.emit(e);

    //TEMP_DEFAULTs
    public TEMP_TEXT_SEARCH: any = '';
    public TEMP_NOTICE_CODE: any = '';
    public TEMP_STAFF_NAME: any = '';
    public TEMP_OFFICE_NAME: any = '';
}