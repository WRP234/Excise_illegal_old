import { Component, OnInit, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Ilg6003020000E13Config } from './ilg60-03-02-00-00-e13.config';
import { MasStaffService } from '../../services';
import { IMasStaffgetByConAdv, ArrestStaff, ArrestStaffVariable } from '../../models';
import { takeUntil } from 'rxjs/operators';
import {LocalStoreage} from '../../entities/local-storege';
import {ArrayForm} from '../../../arrests/entities';

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
    localStorage.removeItem(LocalStoreage.TrashArrestStaff);
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
    const adv: IMasStaffgetByConAdv = {
      STAFF_CODE: this.staffCode,
      STAFF_NAME: null,
      OFFICE_NAME: null,
      ID_CARD: null,
      STATUS: 1
    };
    this.s_masStaff.MasStaffgetByConAdv(adv)
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        if (!x.length) { return; }
        let obj = x.filter(o => o.STAFF_CODE === this.staffCode);

        switch (this.mode) {
          case this.ModeAction.C:
            obj = obj.reduce((accu, curr) =>
              [...accu, { ...curr, ACTION: this.Action.ADD, CONTRIBUTOR_ID: 14 }],
              []);

            this.setItemFormArray(obj, ArrayForm.Staff);

            this.emitValue(obj);

            this.chRef.markForCheck();
            break;

          case this.ModeAction.R:
            this.inputData
              .pipe(takeUntil(this.destroy$))
              .subscribe(x => {
                const d = Object.assign([], x);
                obj = d.reduce((accu, curr) =>
                  [...accu, { ...curr, ACTION: this.Action.EDIT }], []);

                this.setItemFormArray(obj, ArrayForm.Staff);

                this.emitValue(obj);

                this.chRef.markForCheck();
              });

            break;
        }
      })
  }

  addStaff() {
    const staff = { ...ArrestStaffVariable, ACTION: this.Action.ADD };
    const newObj = [...this.ArrestStaff.value, staff];
    this.setItemFormArray(newObj, ArrayForm.Staff);

    this.formChange();
  }

  selectItemStaff(event: any, i: number) {
    const staff = this.ArrestStaff.at(i);
    const item = Object.assign(staff.value, event.item);
    this.ArrestStaff.at(i).patchValue(item)
  }

  onDeleteStaff(i: number) {
    let ArrestStaff = this.TrashArrestStaff;
    ArrestStaff = [...ArrestStaff, this.ArrestStaff.at(i).value];
    localStorage.setItem(LocalStoreage.TrashArrestStaff, JSON.stringify(ArrestStaff));

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
