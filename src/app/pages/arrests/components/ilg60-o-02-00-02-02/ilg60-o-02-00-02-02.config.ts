import { ArrestHelper } from "../../arrest.helper";
import { FormGroup } from "@angular/forms";
import { pagination } from "../../../../config/pagination";
import { Output, EventEmitter } from "@angular/core";
import { ArrestSearchWarrantOutput } from "../../models";
import { IMyDateModel, IMyOptions } from "mydatepicker";
import { BehaviorSubject } from "rxjs";

export class Ilg60O02000202Config extends ArrestHelper {

    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();
    @Output() Output = new EventEmitter<ArrestSearchWarrantOutput>();

    public formGroup: FormGroup;
    public paginage = pagination;
    public advSearch: BehaviorSubject<Boolean>;
    public dataList = new Array<any>();
    public selectedEntry: any;

    _REQUEST_DATE_FROM: any;
    _REQUEST_DATE_TO: any;
    _CONSIDER_DATE_FROM: any;
    _CONSIDER_DATE_TO: any;
    _SEARCH_WARRANT_DATE_FROM: any;
    _SEARCH_WARRANT_DATE_TO: any;

    myDatePickerOptions: IMyOptions = {
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: true,
        height: '30px',
        alignSelectorRight: true,
        openSelectorOnInputClick: true,
        editableDateField: false,
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
    }

    requestDateFromOption = Object.assign({}, this.myDatePickerOptions);
    requestDateToOption = Object.assign({}, this.myDatePickerOptions);
    considerDateFromOptions = Object.assign({}, this.myDatePickerOptions);
    considerDateToOptions = Object.assign({}, this.myDatePickerOptions);
    warrantDateFromOptions = Object.assign({}, this.myDatePickerOptions);
    warrantDateToOptions = Object.assign({}, this.myDatePickerOptions);

    public dismiss = (e: any) => this.d.emit(e);

    getDisCurrDateMyDatePicker() {
        let currentdate = new Date();
        const disCurrDate = {
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
        }
        return disCurrDate;
    }

    //TEMP_DEFAULTs
    public TEMP_TEXT_SEARCH: any = '';
    public TEMP_REQUEST_CODE: any = '';
    public TEMP_REQUEST_NO: any = '';
    public TEMP_REQUEST_NO_YEAR: any = '';
    public TEMP_COURT_NAME: any = '';
    public TEMP_PERSON_NAME: any = '';
    public TEMP_STAFF_NAME: any = '';
    public TEMP_CONSIDER_UNDECIDE_NO: any = '';
    public TEMP_CONSIDER_UNDECIDE_NO_YEAR: any = '';
    public TEMP_CONSIDER_DECIDE_NO: any = '';
    public TEMP_CONSIDER_DECIDE_NO_YEAR: any = '';
    public TEMP_SEARCH_WARRANT_NO: any = '';
    public TEMP_SEARCH_WARRANT_NO_YEAR: any = '';
}