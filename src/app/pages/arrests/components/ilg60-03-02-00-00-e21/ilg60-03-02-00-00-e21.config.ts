import { ManageConfig } from "../manage/manage.config";
import { Output, EventEmitter, Input } from "@angular/core";
import { FormArray } from "@angular/forms";
import { ArrestProduct, ArrestIndictment } from "../../models";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class Ilg6003020000E21 extends ManageConfig {

  @Input() isEdit: boolean;
  @Input() mode: string;
  @Input() inputData: BehaviorSubject<ArrestProduct[]>;
  @Input() ILG60_03_02_00_00_E25$ = new BehaviorSubject<ArrestIndictment[]>([]);
  @Output() Output = new EventEmitter<ArrestProduct[]>();
  @Output() trashIndex = new EventEmitter<number>(null);
  @Output() delProd = new EventEmitter();

  @Input() public OCCURRENCE_DATE$: any;

  public TempProdDel: any[] = [];

  get ArrestProduct(): FormArray {
    return this.ArrestFG.get('ArrestProduct') as FormArray;
  }

  public IS_SYSTEM: any[] = [
    { SYSTEM: 'ระบบ ILG', VALUE: 0 },
    { SYSTEM: 'ระบบ SRP', VALUE: 1 }
  ]

}
