import { BehaviorSubject } from "rxjs";
import { FormGroup, FormArray, FormBuilder, FormControl } from "@angular/forms";
import { Action } from "../../../arrests/entities/action";
import { Mode } from "app/pages/arrests/entities/mode";
import { MasUnitHelper } from "../masUnitHelper";

export class ManageConfig extends MasUnitHelper {
    PrintButton = new BehaviorSubject<Boolean>(false);
    SaveButton = new BehaviorSubject<Boolean>(false);
    CancelButton = new BehaviorSubject<Boolean>(false);
    DeleteButton = new BehaviorSubject<Boolean>(false);
    EditButton = new BehaviorSubject<Boolean>(false);


    //Req Unit
    public isReq_ProdGroup = new BehaviorSubject<boolean>(false);
    public isReq_UsedType = new BehaviorSubject<boolean>(false);

    public unitForm: FormGroup
    public Action = Action;
    public Mode = Mode
    public showEditField: boolean = false;
    public mode: string;

    UNIT_ID: string;
    ProductGroup: any[] = [];
    unitDel: any[] = [];

    public get MasProductUnitMapping(): FormArray {
        return this.unitForm.get('MasProductUnitMapping') as FormArray;
    }

    public UsedForType: any = [
        { USED_FOR_NAME: "หน่วยและขนาดสินค้า", USED_FOR: "A" },
        { USED_FOR_NAME: "หน่วยสินค้า", USED_FOR: "P" },
        { USED_FOR_NAME: "ขนาดสินค้า", USED_FOR: "S" },
    ]

    onCollapse(event: BehaviorSubject<Boolean>) {
        if (event.getValue()) {
            event.next(false);
        } else {
            event.next(true);
        }
    }
}