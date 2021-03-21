import { BehaviorSubject } from "rxjs";
import { FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { Action } from "../arrests/entities/action";
import { Output } from "@angular/core";

export class MastersConfig {
    PrintButton = new BehaviorSubject<Boolean>(false);
    SaveButton = new BehaviorSubject<Boolean>(false);
    CancelButton = new BehaviorSubject<Boolean>(false);
    DeleteButton = new BehaviorSubject<Boolean>(false);
    EditButton = new BehaviorSubject<Boolean>(false);

    public Action = Action;
    public showEditField: boolean = false;
    public mode: string;

    onCollapse(event: BehaviorSubject<Boolean>) {
        if (event.getValue()) {
            event.next(false);
        } else {
            event.next(true);
        }
    }

    onSave(){
        
    }
}