import { ManageConfig } from "../manage/manage.config";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { Output, EventEmitter, Input, ViewChild, ElementRef } from "@angular/core";
import { ArrestLawbreaker, ArrestIndictment } from "../../models";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class Ilg6003020000E15Config extends ManageConfig {

    @ViewChild('CreateLawbreakerModal') public CreateLawbreakerModal: ElementRef;

    @Output() ModeEmit: string = '';
    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();

    public PERSON_ID: number

    public formGroup: FormGroup;

    @Input() isEdit: boolean;
    @Input() mode: string;
    @Input() inputData = new BehaviorSubject<ArrestLawbreaker[]>([]);
    @Input() ILG60_03_02_00_00_E25$ = new BehaviorSubject<ArrestIndictment[]>([]);
    @Output() Output = new EventEmitter<ArrestLawbreaker[]>(null);
    @Output() trashIndex = new EventEmitter<number>(null);
    @Output() delLawb = new EventEmitter();

    public TempLawbDel: any[] = [];
    get ArrestLawbreaker(): FormArray {
        return this.ArrestFG.get('ArrestLawbreaker') as FormArray;
    }
}