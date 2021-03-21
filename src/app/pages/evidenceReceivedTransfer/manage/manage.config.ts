import { ReceivedTransferHelper } from '../receivedTransfer.helper';
import { BehaviorSubject, Subject } from "rxjs";
import { FormGroup, FormArray } from '@angular/forms';
import { Types } from '../models/staff';
import { Action } from 'app/pages/model/mode';

export class ManageConfig extends ReceivedTransferHelper {

    public evidenceInOutFG: FormGroup;

    get EvidenceOutItem(): FormArray {
        return this.evidenceInOutFG.get('EvidenceOutItem') as FormArray;
    }

    get EvidenceOutStaff(): FormArray {
        return this.evidenceInOutFG.get('EvidenceOutStaff') as FormArray;
    }

    public STAFF_CONTRIBUTOR: Types[] = [];

    public btn_onPrint = new BehaviorSubject<Boolean>(false);
    public btn_onSave = new BehaviorSubject<Boolean>(false);
    public btn_onCancel = new BehaviorSubject<Boolean>(false);
    public btn_onDelete = new BehaviorSubject<Boolean>(false);
    public btn_onEdit = new BehaviorSubject<Boolean>(false);

    public isEdit: boolean = false;
    public mode: string;
    public modal: any;

    //toggleCollapse
    public COLLAPSE_1_TOGGLE = new BehaviorSubject<Boolean>(false);
    public COLLAPSE_2_TOGGLE = new BehaviorSubject<Boolean>(false);
    public COLLAPSE_3_TOGGLE = new BehaviorSubject<Boolean>(false);
    public COLLAPSE_4_TOGGLE = new BehaviorSubject<Boolean>(false);

    //Document
    public fileList: Document[] = [];
    public DOCUMENT_TYPE: string = "29";


    public destroy$: Subject<boolean> = new Subject<boolean>();

    public Action = Action;

    onCollapse(event: BehaviorSubject<Boolean>) {
        if (event.getValue()) {
            event.next(false);
        } else {
            event.next(true);
        }
    }

}