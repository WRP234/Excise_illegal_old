import { BehaviorSubject, Observable, Subject } from "rxjs";
import { ArrestHelper } from "../../arrest.helper";
import { FormGroup, FormArray } from "@angular/forms";
import { Action, LocalStoreage as LS } from "../../entities";
import {
    ArrestLocale,
    ArrestStaff,
    ArrestLawbreaker,
    ArrestProduct,
    ArrestNotice,
    Arrest,
    ArrestIndictment,
    ArrestIndictmentDetail,
    ArrestIndictmentProduct,
    IArrestDocument
} from "../../models";
import { Mode } from "../../entities/mode";
import { TextInitial } from "../../entities/text-initial";
import { Input, Output } from "@angular/core";
import { EventEmitter } from "events";
import { IMyOptions } from "mydatepicker";

export class ManageConfig extends ArrestHelper {

    get ArrestPurityCert(): FormArray {
        return this.ArrestFG.get('ArrestPurityCert') as FormArray;
    }

    get ArrestSearchWarrant(): FormArray {
        return this.ArrestFG.get('ArrestSearchWarrant') as FormArray;
    }

    public BEHAVIOR_INIT: string = "รับสารภาพตลอดข้อกล่าวหา";

    public ILG60_03_02_00_00_E08 = new BehaviorSubject<Boolean>(true);
    public ILG60_03_02_00_00_E10 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_02_00_00_E13 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_02_00_00_E18 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_02_00_00_E20 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_02_00_00_E21 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_03_00_00_E15 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_02_00_00_E25 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_02_00_00_E28 = new BehaviorSubject<Boolean>(false);

    public ILG60_03_02_00_00_E10$ = new BehaviorSubject<ArrestNotice[]>([])
    public ILG60_03_02_00_00_E13$ = new BehaviorSubject<ArrestStaff[]>([]);
    public ILG60_03_02_00_00_E18$ = new BehaviorSubject<ArrestLocale[]>([]);
    public ILG60_03_03_00_00_E15$ = new BehaviorSubject<ArrestLawbreaker[]>([]);
    public ILG60_03_02_00_00_E21$ = new BehaviorSubject<ArrestProduct[]>([]);
    public ILG60_03_02_00_00_E25$ = new BehaviorSubject<ArrestIndictment[]>([]);
    public ILG60_03_02_00_00_E28$ = new BehaviorSubject<IArrestDocument[]>([]);

    public _ILG60_03_02_00_00_E10$ = new BehaviorSubject<ArrestNotice[]>([])
    public _ILG60_03_02_00_00_E13$ = new BehaviorSubject<ArrestStaff[]>([]);
    public _ILG60_03_02_00_00_E18$ = new BehaviorSubject<ArrestLocale[]>([]);
    public _ILG60_03_03_00_00_E15$ = new BehaviorSubject<ArrestLawbreaker[]>([]);
    public _ILG60_03_02_00_00_E21$ = new BehaviorSubject<ArrestProduct[]>([]);
    public _ILG60_03_02_00_00_E25$ = new BehaviorSubject<ArrestIndictment[]>([]);
    public _ILG60_03_02_00_00_E28$ = new BehaviorSubject<IArrestDocument[]>([]);

    public INVALID_ILG60_03_02_00_00_E13 = new BehaviorSubject<Boolean>(false);
    public INVALID_ILG60_03_02_00_00_E18 = new BehaviorSubject<Boolean>(false);
    public INVALID_ILG60_03_02_00_00_E25 = new BehaviorSubject<Boolean>(false);

    public PRODUCT_ID_AFTER_UPD = new BehaviorSubject<any[]>([]);

    public OCCURRENCE_DATE$: any;

    public LOCATION_REQ_E18 = new BehaviorSubject<Boolean>(false);
    public REGION_REQ_E18 = new BehaviorSubject<Boolean>(false);
    public BEHAVIOR_1_REQ_M = new BehaviorSubject<Boolean>(false);

    public btn_onPrint = new BehaviorSubject<Boolean>(false);
    public btn_onSave = new BehaviorSubject<Boolean>(false);
    public btn_onCancel = new BehaviorSubject<Boolean>(false);
    public btn_onDelete = new BehaviorSubject<Boolean>(false);
    public btn_onEdit = new BehaviorSubject<Boolean>(false);

    public ArrestData: Observable<Arrest>;

    _myDatePickerOptions: IMyOptions = {
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: false,
        height: '30px',
        alignSelectorRight: true,
        openSelectorOnInputClick: true,
        editableDateField: false,
        disableUntil: { year: 0, month: 0, day: 0 }
    };

    public arDateFromOption = Object.assign({}, this._myDatePickerOptions);
    public ocDateToOption = Object.assign({}, this._myDatePickerOptions);

    public Action = Action;
    public ModeAction = Mode;
    public Text = TextInitial;
    public isEdit: boolean = false;
    public mode: string;
    public ArrestFG: FormGroup;

    public LOCALE_OFFICE_CODE = new BehaviorSubject<string>("");

    public TrashArrestNotice = (JSON.parse(localStorage.getItem(LS.TrashArrestNotice)) || []) as ArrestNotice[];
    public TrashArrestStaff = (JSON.parse(localStorage.getItem(LS.TrashArrestStaff)) || []) as ArrestStaff[];
    public TrashArrestProduct = (JSON.parse(localStorage.getItem(LS.TrashArrestProduct)) || []) as ArrestProduct[];
    public TrashArrestLawbreaker = (JSON.parse(localStorage.getItem(LS.TrashArrestLawbreaker)) || []) as ArrestLawbreaker[];
    public TrashArrestIndictment = (JSON.parse(localStorage.getItem(LS.TrashArrestIndictment)) || []) as ArrestIndictment[];
    public TrashArrestIndictmentDetail = (JSON.parse(localStorage.getItem(LS.TrashArrestIndictmentDetail)) || []) as ArrestIndictmentDetail[];
    public TrashArrestIndictmentProduct = (JSON.parse(localStorage.getItem(LS.TrashArrestIndictmentProduct)) || []) as ArrestIndictmentProduct[];
    public TrashArrestDocument = (JSON.parse(localStorage.getItem(LS.TrashArrestDoucment)) || []) as IArrestDocument[];
    public DELDOC_E28$ = new BehaviorSubject<any[]>([]);
    public DELSTAFF_E13$ = new BehaviorSubject<any[]>([]);
    public DELINDICTMENT_E25$ = new BehaviorSubject<any[]>([]);
    public DELPROD_E21$ = new BehaviorSubject<any[]>([]);
    public DELLAWB_E15$ = new BehaviorSubject<any[]>([]);

    public ILG60_03_03_00_00_E15_TrashIndex = new BehaviorSubject<number>(null);
    public ILG60_03_02_00_00_E21_TrashIndex = new BehaviorSubject<number>(null);

    public INPUT_WIZARD = new BehaviorSubject<object>(null);

    onCollapse(event: BehaviorSubject<Boolean>) {
        if (event.getValue()) {
            event.next(false);
        } else {
            event.next(true);
        }
    }

    public setFormatTimeControl(event: any, formControl: string, formGroup: FormGroup) {
        let str = event.target.value;
        let str_unSub = event.target.value;
        let substr: any[] = []
        let mm: string = '';
        let ss: string = '';
        substr = str.split(':');
        mm = substr[0] == undefined ? '' : substr[0].slice(0, 2);
        ss = substr[1] == undefined ? '' : substr[1].slice(0, 2);
        const K = event.keyCode;

        if (!/([0-9])$/.test(event.target.value))
            formGroup.controls[formControl].setValue(str_unSub.slice(0, str_unSub.length - 1));

        switch (true) {
            // NumPad 96-105
            case K >= 96 && K <= 105:
                if (str.length == 2)
                    formGroup.controls[formControl].setValue(`${mm}:${ss}`);
                else if (str.length == 3)
                    formGroup.controls[formControl].setValue(`${mm}:${str_unSub.substring(2)}`);
                break;
            // KeyPad 96-105
            case (K >= 48 && K <= 57):
                if (str.length == 2)
                    formGroup.controls[formControl].setValue(`${mm}:${ss}`);
                else if (str.length == 3)
                    formGroup.controls[formControl].setValue(`${mm}:${str_unSub.substring(2)}`);
                break;
            // backspace 8
            case K == 8:
                break;
            //delete 46
            case K == 46:
                break;
            default:
                break;
        }
    }

}