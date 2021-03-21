import { BehaviorSubject } from "rxjs";
import { FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { Output } from "@angular/core";
import { Action } from '../entities';
import { ArrestLocale, ArrestStaff, ArrestLawbreaker, ArrestProduct, ArrestIndictment } from '../model';
import { Mode } from "../entities/mode";
import { Document } from '../model';


export class ManageConfig {

    public ILG60_03_02_00_00_E08 = new BehaviorSubject<Boolean>(true);
    public ILG60_03_02_00_00_E10 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_02_00_00_E13 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_02_00_00_E18 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_02_00_00_E20 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_02_00_00_E21 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_03_00_00_E15 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_02_00_00_E25 = new BehaviorSubject<Boolean>(false);
    public ILG60_03_02_00_00_E28 = new BehaviorSubject<Boolean>(false);

    public ILG60_03_02_00_00_E13$ = new BehaviorSubject<ArrestStaff[]>([]);
    public ILG60_03_02_00_00_E18$ = new BehaviorSubject<ArrestLocale[]>([]);
    public ILG60_03_03_00_00_E15$ = new BehaviorSubject<ArrestLawbreaker[]>([]);

    public ILG60_03_02_00_00_E21$ = new BehaviorSubject<ArrestProduct[]>([]);
    public ILG60_03_02_00_00_E25$ = new BehaviorSubject<ArrestIndictment[]>([]);
    public ILG60_03_02_00_00_E28$ = new BehaviorSubject<Document[]>([]);





    btn_onPrint = new BehaviorSubject<Boolean>(false);
    btn_onSave = new BehaviorSubject<Boolean>(false);
    btn_onCancel = new BehaviorSubject<Boolean>(false);
    btn_onDelete = new BehaviorSubject<Boolean>(false);
    btn_onEdit = new BehaviorSubject<Boolean>(false);

    public Action = Action;
    public isEdit: boolean = false;
    public mode: string;
    public ModeAction = Mode;
    public modal: any;


    public PuritycertFG: FormGroup;

    T_StaffFormatter = (x: { TITLE_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
    `${x.TITLE_NAME_TH || ''} ${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`;

    T_LocaleFormatter = (x: { SUB_DISTRICT_NAME_TH: string, DISTRICT_NAME_TH: string, PROVINCE_NAME_TH: string }) =>
    `${x.SUB_DISTRICT_NAME_TH || ''} ${x.DISTRICT_NAME_TH || ''} ${x.PROVINCE_NAME_TH || ''}`;





    onCollapse(event: BehaviorSubject<Boolean>) {
      // console.log(event);
        if (event.getValue()) {
            event.next(false);
        } else {
            event.next(true);
        }
    }
}
