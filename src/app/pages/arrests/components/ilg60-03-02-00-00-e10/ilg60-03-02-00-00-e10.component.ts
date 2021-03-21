import { ArrestNotice } from '../../models';
import { Component, ViewEncapsulation, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Ilg6003020000E10Config } from './ilg60-03-02-00-00-e10.config';
import { LocalStoreage as LS, ArrayForm as AF } from '../../entities';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'app/config/message';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ilg60-03-02-00-00-e10',
  templateUrl: './ilg60-03-02-00-00-e10.component.html',
  styleUrls: ['./ilg60-03-02-00-00-e10.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ilg6003020000E10Component extends Ilg6003020000E10Config implements OnInit, AfterViewInit, OnDestroy {

  ngOnDestroy(): void {
    this.destroy();
  }

  private destroy() {
    this.destroy$.next();
    this.destroy$.complete();
    localStorage.removeItem(LS.TrashArrestNotice)
  }

  constructor(
    private modelService: NgbModal,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef
  ) {
    super();
    this.destroy();
  }

  openModal(e) {
    this.modal = this.modelService.open(e, { size: 'lg', centered: true });
  }

  ngOnInit() {
    this.ArrestFG = this.fb.group({
      ArrestNotice: this.fb.array([])
    })
  }

  ngAfterViewInit(): void {
    switch (this.mode) {
      case this.ModeAction.C:
        break;

      case this.ModeAction.R:
        this.inputData
          .pipe(takeUntil(this.destroy$))
          .subscribe(x => {
            this.ILG60_03_02_00_00_E10.next(true);

            const c7 = x.filter(f => f['CONTRIBUTOR_ID'] == 7).length;
            const c8 = x.filter(f => f['CONTRIBUTOR_ID'] == 8).length;

            let temp: any[] = [];
            if (c7 > 0) temp = x.filter(f => f['CONTRIBUTOR_ID'] == 7);
            else if (c7 == 0 && c8 > 0) temp = x.filter(f => f['CONTRIBUTOR_ID'] == 8);

            const newList = temp
              .map(o => {
                return { ...o, IS_MATCH: false, ACTION: this.Action.EDIT };
              });

            this.setItemFormArray(newList, AF.Notice);

            this.emitValue(newList);
            this.formChange();

            this.chRef.markForCheck();
          });
        break;
    }
  }

  onDeleteNotice = (i: number) => {

    swal({
      title: '',
      text: Message.confirmAction,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        let ArrestNotice = this.TrashArrestNotice;

        ArrestNotice.push(this.ArrestNotice.at(i).value)

        localStorage.setItem(LS.TrashArrestNotice, JSON.stringify(ArrestNotice));

        this.ArrestNotice.removeAt(i);

        this.addNoticeCheck();
      }
    })

  }

  Ilg60O02000203_Output(event: ArrestNotice[]) {
    const newList = event.map(x => {
      return { ...x, IS_MATCH: false, ACTION: this.Action.ADD };
    });

    let list = ([...this.ArrestNotice.value, ...newList]);

    list = this.filterDuplicate(list, 'NOTICE_CODE');

    this.emitValue(list);

    this.setItemFormArray(list, AF.Notice);

    this.formChange();
  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.ArrestFG.setControl(formControl, itemFormArray);
    }
  }

  emitValue(value: any[]) {
    let obj = Object.assign([], value);
    obj = obj.reduce((a, c) => [...a, { ...c, IS_MATCH: c.IS_MATCH ? 1 : 0 }], []);
    this.Output.emit(obj)
  }

  formChange() {
    this.ArrestNotice.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((x: ArrestNotice[]) => {
        this.emitValue(x);
      })

    this.addNoticeCheck();
  }

  addNoticeCheck() {
    const notice = this.ArrestNotice.value;
    const r = notice.length ? true : false;
    this.addNoticeCheck$.next(r);
  }

}