import { InvestigationHelper } from "../investigation.helper";
import { BehaviorSubject, Subject, Observable } from "rxjs";
import * as fromModels from '../models';
import { toLocalShort, MyDatePickerOptions } from 'app/config/dateFormat';
import { FormGroup, FormArray } from "@angular/forms";
import { ViewChild, ElementRef } from "@angular/core";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { IMyOptions } from "mydatepicker-th";

export class ManageConfig extends InvestigationHelper {
    public saveButton = new BehaviorSubject<Boolean>(false);
    public cancelButton = new BehaviorSubject<Boolean>(false);
    public deleteButton = new BehaviorSubject<Boolean>(false);
    public printButton = new BehaviorSubject<Boolean>(false);
    public editButton = new BehaviorSubject<Boolean>(false);
    public isReq_No = new BehaviorSubject<boolean>(false);
    public isReq_DStart = new BehaviorSubject<boolean>(false);
    public isReq_TStart = new BehaviorSubject<boolean>(false);
    public isReq_DEnd = new BehaviorSubject<boolean>(false);
    public isReq_TEnd = new BehaviorSubject<boolean>(false);
    public isReq_Subject = new BehaviorSubject<boolean>(false);
    public isEdit = false;

    card1 = true;
    card2 = true;

    public destroy$: Subject<boolean> = new Subject<boolean>();

    public obInvest: Observable<fromModels.InvestigateModelUppercase>;
    stateInvest: fromModels.InvestigateModelUppercase;
    toLocalShort = toLocalShort;

    public mode: string;
    investCode: string;
    investId: number;
    StaffId: any;
    modal: any;

    _dateStartFrom: any;
    _dateStartTo: any;
    DateStartTo: any;

    model: any;
    showEditField: boolean;
    isRequired: boolean;
    investigateForm: FormGroup;

    // readonly myDatePickerOptions = MyDatePickerOptions;
    readonly _myDatePickerOptions: IMyOptions = {
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: false,
        height: '30px',
        alignSelectorRight: true,
        openSelectorOnInputClick: true,
        editableDateField: false,
        disableUntil: { year: 0, month: 0, day: 0 }
    };
    public dateFromOption = Object.assign({}, this._myDatePickerOptions);
    public dateToOption = Object.assign({}, this._myDatePickerOptions);

    sysdateStart;
    sysdateEnd;

    NOTICE_CODE: string = '';
    NOTICE_ID: string = '';

    investigateDetail;

    @ViewChild('alertSwal') private alertSwal: SwalComponent;
    @ViewChild('printDocModal') printDocModal: ElementRef;
    @ViewChild('investigateNo0') investigateNo0: ElementRef;
    @ViewChild('investigateNo1') investigateNo1: ElementRef;

    get InvestigateDetail(): FormArray {
        return this.investigateForm.get('INVESTIGATE_DETAIL') as FormArray;
    }

    get InvestigateDetailSuspect(): FormArray {
        return this.investigateForm.get('InvestigateDetailSuspect') as FormArray;
    }

    getInvestigateDetailStaff(form: any) {
        return form.controls.InvestigateDetailStaff.value;
    }


}