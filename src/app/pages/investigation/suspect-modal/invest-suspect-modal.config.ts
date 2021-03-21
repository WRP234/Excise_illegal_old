import { InvestigationHelper } from "../investigation.helper";
import { ViewChild } from "@angular/core";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { EntityTypes_NEW, LawbreakerTypes_New } from 'app/models';
import { MasSuspect_New } from '../models/mas-suspect';
import { FormGroup, FormArray } from "@angular/forms";

export class InvestSuspectModalConfig extends InvestigationHelper {

    @ViewChild('alertSwal') public alertSwal: SwalComponent;

    public sub: any;
    isOpen = false;
    isCheckAll = false;
    suspectSeleted: any[] = [];
    advSearch = true;
    suspect = new Array<MasSuspect_New>();
    suspectTypes = LawbreakerTypes_New;
    entityType = EntityTypes_NEW;

    _EntityTypes_NEW = [
        {
            value: 1,
            text: 'ผู้ประกอบการ'
        },
        {
            value: 0,
            text: 'ชาวต่างชาติ'
        }, {
            value: 0,
            text: 'ชาวไทย'
        }
    ]

    paginage: any;

    suspectFormGroup: FormGroup;

    thaiType: boolean = true;
    foreignTpye: boolean;
    plainType: boolean;
    LegalentityType: boolean;
    taskModel: Task = new Task();

    // @Output() d = new EventEmitter();
    // @Output() c = new EventEmitter();

    get Suspect(): FormArray {
        return this.suspectFormGroup.get('Suspect') as FormArray;
    }
}


export class Task {
    title: string;
    priority: string;
    comment: string;

    constructor() {
        this.title = '';
        this.priority;
        this.comment = '';
    }
}