import { Component, OnInit, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Ilg6003020000E13Config } from './ilg60-03-02-00-00-e13.config';
import { MasStaffService } from '../../services';
import { IMasStaffgetByConAdv, ArrestStaff, ArrestStaffVariable, IMasStaffgetByCon } from '../../models';
import { LocalStoreage as LS, ArrayForm as AF } from '../../entities';
import { takeUntil } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Message } from 'app/config/message';

@Component({
  selector: 'app-ilg60-03-02-00-00-e13',
  templateUrl: './ilg60-03-02-00-00-e13.component.html',
  styleUrls: ['./ilg60-03-02-00-00-e13.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ilg6003020000E13Component extends Ilg6003020000E13Config implements OnInit, AfterViewInit, OnDestroy {
  ngOnDestroy(): void {
    this.destroy();
  }

  private destroy() {
    this.destroy$.next();
    this.destroy$.complete();
    localStorage.removeItem(LS.TrashArrestStaff);
  }

  constructor(
    private fb: FormBuilder,
    private s_masStaff: MasStaffService,
    private chRef: ChangeDetectorRef
  ) {
    super();
    this.destroy();
  }

  searchStaff = this.s_masStaff.searchStaff;

  ngOnInit() {
    this.ArrestFG = this.fb.group({
      ArrestStaff: this.fb.array([])
    });

    if (this.userAccountId == null) {
      const obj: any[] = [
        {
          TITLE_NAME_TH: null,
          FIRST_NAME: null,
          LAST_NAME: null,
          OPREATION_POS_NAME: null,
          OPERATION_OFFICE_SHORT_NAME: null,
          ACTION: this.Action.ADD,
          CONTRIBUTOR_ID: 14
        }
      ]
      this.setItemFormArray(obj, AF.Staff);
      this.emitValue(obj);
    }
  }

  emitValue(value: any[]) {
    const obj = Object.assign([], value);
    this.Output.emit(obj)
  }

  formChange() {
    this.ArrestStaff.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((x: ArrestStaff[]) => {
        this.emitValue(x);
      })
  }

  ngAfterViewInit(): void {

    switch (this.mode) {
      case this.ModeAction.C:

        if (this.userAccountId == null) {
          return;
        };

        const form: IMasStaffgetByCon = {
          STAFF_ID: parseInt(this.userAccountId),
          TEXT_SEARCH: ''
        }
        this.s_masStaff.MasStaffgetByCon(form)
          .pipe(takeUntil(this.destroy$))
          .subscribe(x => {

            let obj = [...x];

            obj = obj.reduce((accu, curr) =>
              [...accu, {
                ...curr, ACTION: this.Action.ADD,
                CONTRIBUTOR_ID: 14,
                FULL_NAME: `${curr.TITLE_SHORT_NAME_TH || ''}${curr.FIRST_NAME || ''} ${curr.LAST_NAME || ''}`
              }], []);

            this.chRef.markForCheck();

            this.setItemFormArray(obj, AF.Staff);

            this.emitValue(obj);
          })

        break;

      case this.ModeAction.R:
        this.inputData
          .pipe(takeUntil(this.destroy$))
          .subscribe(x => {

            this.ILG60_03_02_00_00_E13.next(true);

            const d = Object.assign([], x);
            d.map(item => {
              for (var key in item) {
                if (item[key] === 'null')
                  item[key] = null;
              }
            })
            let obj = d.reduce((accu, curr) =>
              [...accu, {
                ...curr, ACTION: this.Action.EDIT,
                FULL_NAME: `${curr.TITLE_SHORT_NAME_TH || ''}${curr.FIRST_NAME || ''} ${curr.LAST_NAME || ''}`
              }], []);

            let ConId_Sorter = (Arr: any[] = []) => {
              return Arr.sort((a, b) => {
                return <any>(a.CONTRIBUTOR_ID) - <any>(b.CONTRIBUTOR_ID);
              });
            }

            obj = ConId_Sorter(obj);

            this.setItemFormArray(obj, AF.Staff);

            this.emitValue(obj);
            this.formChange();

            this.chRef.markForCheck();
          });

        break;
    }


  }

  addStaff() {
    const staff = { ...ArrestStaffVariable, ACTION: this.Action.ADD };
    const newObj = [...this.ArrestStaff.value, staff]
    this.setItemFormArray(newObj, AF.Staff);

    this.formChange();
  }

  selectItemStaff(event: any, i: number) {
    let staff = this.ArrestStaff.at(i);
    let ArrestFG = this.ArrestFG.getRawValue();
    if (!event.item) {
      for (var key in staff.value) {
        if (key != "CONTRIBUTOR_ID")
          staff.value[key] = null;
      }
      this.ArrestStaff.at(i).patchValue({ ...staff.value })
    } else {
      const item = Object.assign({}, event.item);
      item.FULL_NAME = `${item.TITLE_SHORT_NAME_TH || ''}${item.FIRST_NAME || ''} ${item.LAST_NAME || ''}`;

      let ArrestStaff = ArrestFG.ArrestStaff[i];
      const STAFF_ID$ = ArrestStaff.STAFF_ID;

      this.ArrestStaff.at(i).patchValue({ ...item, STAFF_ID: STAFF_ID$ });
      this.invalid.next(false);
      this.ILG60_03_02_00_00_E13.next(true);
    }
    this.formChange();
  }

  clearTextStaff(i) {
    let staff = this.ArrestStaff.at(i);
    if (i == 0) {
      for (var key in staff.value) {
        if (key != "CONTRIBUTOR_ID" && key != "STAFF_ID" && key != "ACTION")
          staff.value[key] = null;
      }
      this.ArrestStaff.at(0).patchValue({ ...staff.value });
    }

    this.formChange();
  }

  onDeleteStaff(i: number) {
    const staff = this.ArrestStaff.at(i).value
    if (!staff.STAFF_ID) {
      this.ArrestStaff.removeAt(i);
      return;
    }

    this.TempStaffDel.push(staff);

    this.delStaff.emit(this.TempStaffDel);

    this.ArrestStaff.removeAt(i);
  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.ArrestFG.setControl(formControl, itemFormArray);
    }
  }

}
