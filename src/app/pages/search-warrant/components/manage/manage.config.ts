import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormGroup, FormArray } from '@angular/forms';
import { Action } from '../../entities/action';
import { Mode } from '../../entities/mode';
import { SearchWarrantHelper } from '../../search-warrant.helper';
import {
  ArrestIndictment,
  ArrestIndictmentDetail,
  ArrestIndictmentProduct,
  ArrestLawbreaker,
  ArrestNotice,
  ArrestStaff,
  ArrestProduct, CONTRIBUTOR_ID
} from '../../models';
import { LocalStoreage } from '../../entities/local-storege';
import { Input } from '@angular/core';

export class ManageConfig extends SearchWarrantHelper {
  ILG60_03_02_00_00_E28 = new BehaviorSubject<Boolean>(true);
  ILG60_03_02_00_00_E13 = new BehaviorSubject<Boolean>(true);
  ILG60_03_02_00_00_E18 = new BehaviorSubject<Boolean>(true);

  public btn_onPrint = new BehaviorSubject<Boolean>(false);
  public btn_onSave = new BehaviorSubject<Boolean>(false);
  public btn_onCancel = new BehaviorSubject<Boolean>(false);
  public btn_onDelete = new BehaviorSubject<Boolean>(false);
  public btn_onEdit = new BehaviorSubject<Boolean>(false);

  public Action = Action;
  public isEdit = false;
  public mode: string;
  public searchWarrantFG: FormGroup;
  
  public ArrestFG: FormGroup;
  public ModeAction = Mode;

  requiredCompanyRegister = false;

  public TrashArrestNotice = (JSON.parse(localStorage.getItem(LocalStoreage.TrashArrestNotice)) || []) as ArrestNotice[];
  public TrashArrestStaff = (JSON.parse(localStorage.getItem(LocalStoreage.TrashArrestStaff)) || []) as ArrestStaff[];
  public TrashArrestProduct = (JSON.parse(localStorage.getItem(LocalStoreage.TrashArrestProduct)) || []) as ArrestProduct[];
  public TrashArrestLawbreaker = (JSON.parse(localStorage.getItem(LocalStoreage.TrashArrestLawbreaker)) || []) as ArrestLawbreaker[];
  public TrashArrestIndictment = (JSON.parse(localStorage.getItem(LocalStoreage.TrashArrestIndictment)) || []) as ArrestIndictment[];
  public TrashArrestIndictmentDetail = (JSON.parse(localStorage.getItem(LocalStoreage.TrashArrestIndictmentDetail)) || []) as ArrestIndictmentDetail[];
  public TrashArrestIndictmentProduct = (JSON.parse(localStorage.getItem(LocalStoreage.TrashArrestIndictmentProduct)) || []) as ArrestIndictmentProduct[];

  @Input() invalid = new BehaviorSubject<Boolean>(false);

  get ArrestLocale(): FormArray {
    return this.searchWarrantFG.get('ArrestLocale') as FormArray;
  }

  get ArrestNotice(): FormArray {
    return this.searchWarrantFG.get('ArrestNotice') as FormArray;
  }

  get ArrestStaff(): FormArray {
    return this.searchWarrantFG.get('ArrestStaff') as FormArray;
  }

  static onCollapse(event: BehaviorSubject<Boolean>) {
    if (event.getValue()) {
      event.next(false);
    } else {
      event.next(true);
    }
  }

  onCollapse(event: BehaviorSubject<Boolean>) {
    if (event.getValue()) {
      event.next(false);
    } else {
      event.next(true);
    }
  }

  public getContributorId(value: number) {
    return CONTRIBUTOR_ID.find(x => x.value === value).text;
  }
}
