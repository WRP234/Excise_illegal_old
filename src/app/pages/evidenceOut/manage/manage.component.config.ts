import { pagination } from '../../../config/pagination';
import { BehaviorSubject, Subject } from 'rxjs';
import { ElementRef, ViewChild, Input, OnInit, AfterViewInit, Output } from '@angular/core';
import { Document } from '../evidenceOut-Interface/evidenceOut-document';
import { setZeroHours } from 'app/config/dateFormat';
import swal from 'sweetalert2';
import { FormGroup, FormArray } from '@angular/forms';
import { Types } from '../evidenceOut-Interface/staff';
import { evidenceOutHelpers } from '../evidenceOut.helper';
import { Action } from '../evidenceOut-Interface/action';

export class ManageConfig extends evidenceOutHelpers {

    get EvidenceOutItem(): FormArray {
        return this.evidenceOutFG.get('EvidenceOutItem') as FormArray;
    }

    get EvidenceOutDetail(): FormArray {
        return this.evidenceOutFG.get('EvidenceOutDetail') as FormArray;
    }

    get EvidenceOutStaff(): FormArray {
        return this.evidenceOutFG.get('EvidenceOutStaff') as FormArray;
    }

    public destroy$: Subject<boolean> = new Subject<boolean>();

    public EVIDENCE_OUT_ID: string = '';
    public EVIDENCE_OUT_CODE: string = "Auto Generate";
    public EVIDENCE_OUT_PREFIX: string;
    public EVIDENCE_OUT_TYPE: number;
    public DOCUMENT_TYPE: string;

    public evidenceOutFG: FormGroup;

    public sub: any;

    public PrintButton = new BehaviorSubject<Boolean>(false);
    public SaveButton = new BehaviorSubject<Boolean>(false);
    public CancelButton = new BehaviorSubject<Boolean>(false);
    public DeleteButton = new BehaviorSubject<Boolean>(false);
    public EditButton = new BehaviorSubject<Boolean>(false);

    public Action = Action;
    public showEditField: boolean = false;
    public mode: string;

    public today = new Date();

    onCollapse(event: BehaviorSubject<Boolean>) {
        if (event.getValue()) {
            event.next(false);
        } else {
            event.next(true);
        }
    }

    public modal: any;
    public moduleType: any;
    public showEditByEvidencIn: any;
    public paginage = pagination;
    public isRequired: boolean | false;

    //Document
    public fileList: Document[] = [];

    //toggleCollapse
    public collapse_e_o_1 = new BehaviorSubject<Boolean>(true);
    public collapse_e_o_2 = new BehaviorSubject<Boolean>(true);
    public collapse_EvidenceOutDoc = new BehaviorSubject<Boolean>(true);
    public collapse_EvidenceStaff = new BehaviorSubject<Boolean>(true);

    //staff
    public searching = false;
    public searchFailed = false;
    public STAFF_CONTRIBUTOR: Types[] = [];

    //Temp delete all
    public staffDel: any[] = [];
    public docDel: any[] = [];
    public eOutItemDel: any[] = [];

    //staff contributor id 87
    @Output() public RECIPIENT_STAFF: any = {
        FULL_NAME: '', MANAGEMENT_POS_NAME: '', OPERATION_OFFICE_SHORT_NAME: '', //STAFF_ID: this.localUserAccountID, //fix for insert error
    }
    public RECIPIENT_FULL_NAME_REQ = new BehaviorSubject<Boolean>(false);
    public RECIPIENT_OFFICE_NAME_REQ = new BehaviorSubject<Boolean>(false);

    //staff contributor id 64
    @Output() public GETBACK_STAFF: any = {
        FULL_NAME: '', MANAGEMENT_POS_NAME: '', OPERATION_OFFICE_SHORT_NAME: '',// STAFF_ID: parseInt(this.localUserAccountID), //fix for insert error
    }

    // ----- Model ------ //
    @ViewChild('printDocModal') printDocModel: ElementRef;

    formatterStaff = (x: { TITLE_SHORT_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
        `${x.TITLE_SHORT_NAME_TH || ''}${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`


    // ***********************************************
    // ------------ DateTime & All Function ----------
    // ***********************************************
    getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    getCurrentTime() {
        let date = new Date();
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }) + " น.";
    }

    getIndexOf(arr, val, prop) {
        var l = arr.length,
            k = 0;
        for (k = 0; k < l; k = k + 1) {
            if (arr[k][prop] == val) {
                return k;
            }
        }
        return -1;
    }

    ConvertDateYYYYmmdd(_Date: any) {
        let tDate = _Date;

        if (tDate != undefined) {
            // return setZeroHours(new Date(`${tDate.year}-${tDate.month}-${tDate.day}`));
            return tDate.year + '-' + tDate.month + '-' + tDate.day + ' 00:00:00.0000';
        }

        return "";
    }

    ConvertDateYYYYmmddEvidenceIn(_Date: any) {
        let tDate = _Date;

        if (tDate != undefined) {
            return setZeroHours(new Date(`${tDate.year}-${tDate.month}-${tDate.day}`));
        }

        return "";
    }

}