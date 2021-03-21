import { ArrestHelper } from "../../arrest.helper";
import { Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import { ArrestLawbreaker, PERSON_TYPE, ENTITY_TYPE, ArrestMasPerson } from "../../models";
import { FormGroup, FormArray } from "@angular/forms";
import { pagination } from "../../../../config/pagination";
import { Mode } from "../../entities/mode";
import { BehaviorSubject } from "rxjs";
import { Task } from "app/pages/component/notice-suspect-modal/notice-suspect-modal.component";


export class Ilg60O02000204Config extends ArrestHelper {

    @Output() ModeEmit: string = '';
    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();
    @Output() Output = new EventEmitter<ArrestLawbreaker[]>();
    @Output() Create = new EventEmitter<ArrestLawbreaker[]>();

    @ViewChild('LawbreakerModal') public LawbreakerModel: ElementRef;

    public ModeAction = Mode;
    public PERSON_ID: number

    public formGroup: FormGroup;
    public paginage = pagination;
    public dataList = new Array<any>();

    public PERSON_TYPE = PERSON_TYPE;
    public ENTITY_TYPE = ENTITY_TYPE;

    public advSearch: BehaviorSubject<Boolean>;

    taskModel: Task = new Task();

    get Person(): FormArray {
        return this.formGroup.get('Person') as FormArray;
    }

    get PersonList(): ArrestMasPerson[] {
        return this.Person.value.filter(x => x.IS_CHECKED == true);
    }

    get ArrestPersonAdded(): FormArray {
        return this.formGroup.get('ArrestPersonAdded') as FormArray;
    }

    public dismiss = (e: any) => this.d.emit(e);
}