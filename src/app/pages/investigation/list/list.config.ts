import { InvestigationHelper } from "../investigation.helper";
import { BehaviorSubject, Subject } from "rxjs";
import { InvestigateList } from './../models/investigate-list.model';
import { pagination } from 'app/config/pagination';
import { MyDatePickerOptions } from 'app/config/dateFormat';
import { ViewChild, ElementRef } from "@angular/core";

export class ListConfig extends InvestigationHelper {
    public advSearch: BehaviorSubject<Boolean>;

    public destroy$: Subject<boolean> = new Subject<boolean>();

    _dateStartFrom: any;
    _dateStartTo: any;
    DateStartTo: any;
    DATE_START;
    DATE_END;

    investigate = new Array<InvestigateList>();
    invesList = new Array<InvestigateList>();
    paginage = pagination;
    readonly myDatePickerOptions = MyDatePickerOptions;
    public dateFromOption = Object.assign({}, this.myDatePickerOptions);
    public dateToOption = Object.assign({}, this.myDatePickerOptions);

    @ViewChild('invesTable') invesTable: ElementRef;
}