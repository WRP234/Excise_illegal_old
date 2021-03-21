import { Component, ViewEncapsulation, OnInit, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Ilg6003020000E15Config } from './ilg60-03-03-00-00-e15.config';
import { ArrestLawbreaker } from '../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStoreage as LS, ArrayForm as AF } from '../../entities';
import { takeUntil } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Message } from 'app/config/message';

@Component({
  selector: 'app-ilg60-03-03-00-00-e15',
  templateUrl: './ilg60-03-03-00-00-e15.component.html',
  styleUrls: ['./ilg60-03-03-00-00-e15.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ilg6003030000E15Component extends Ilg6003020000E15Config implements OnInit, AfterViewInit, OnDestroy {
  ngOnDestroy(): void {
    this.destroy();
  }

  private destroy() {
    this.destroy$.next();
    this.destroy$.complete();
    localStorage.removeItem(LS.TrashArrestLawbreaker)
  }

  constructor(
    private fb: FormBuilder,
    private modelService: NgbModal,
    private chRef: ChangeDetectorRef
  ) {
    super();
    this.destroy();
  }

  ngOnInit() {
    this.ArrestFG = this.fb.group({
      ArrestLawbreaker: this.fb.array([])
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
            this.chRef.markForCheck();
            this.ILG60_03_03_00_00_E15.next(true);
            const newList = x.map(o => {
              for (var key in o) {
                if (o[key] === 'null') o[key] = null;
              }
              return { ...o, ACTION: this.Action.EDIT };
            });


            this.setItemFormArray(newList, AF.Lawbreaker);

            this.emitValue(newList);
            this.formChange();
          })
        break;
    }

  }

  Ilg60O02000204_Output(event: ArrestLawbreaker[]) {
    const newList = event.map(x => {
      return { ...x, ACTION: this.Action.ADD };
    });
    
    let list = ([...this.ArrestLawbreaker.value, ...newList]);

    list = this.filterDuplicate(list, 'PERSON_ID');

    this.emitValue(list)

    this.setItemFormArray(list, AF.Lawbreaker);

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
    const obj = Object.assign([], value);
    this.Output.emit(obj)
  }

  formChange() {
    this.ArrestLawbreaker.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((x: ArrestLawbreaker[]) => this.emitValue(x))
  }

  onDeleteLawbreaker = (i: number) => {
    let ArrestLawbreaker = this.TrashArrestLawbreaker;
    ArrestLawbreaker = [...ArrestLawbreaker, this.ArrestLawbreaker.at(i).value];

    let E25: any[] = [];
    let E25_DT: any[] = [];
    let E25_LB: any[] = [];
    E25 = this.ILG60_03_02_00_00_E25$.getValue();

    if (E25['ArrestIndictment'])
      E25_DT = E25['ArrestIndictment'].reduce((a, c) => { return [...a, ...c.ArrestIndictmentDetail] }, []);
    else
      E25_DT = E25.reduce((a, c) => { return [...a, ...c.ArrestIndictmentDetail] }, []);

    if (E25_DT.length > 0)
      E25_LB = E25_DT.reduce((a, c) => { return [...a, ...c.ArrestLawbreaker] }, []);

    const ARRESTLB_PERSON_ID: any = ArrestLawbreaker.reduce((a, c) => {
      return { PERSON_ID: c.PERSON_ID }
    }, {})

    const LB_INDICT = E25_LB.filter(f => ARRESTLB_PERSON_ID.PERSON_ID == f.PERSON_ID).length;

    if (LB_INDICT) {
      this.swalFn('', Message.cannotDelItemIndictUsing, 'warning');
      return;
    } else {
      this.swalFnMulti('', Message.confirmAction, 'warning')
        .then((result) => {
          if (result.value) {
            // this.trashIndex.emit(i);

            const arrestLawb = this.ArrestLawbreaker.at(i).value;

            this.TempLawbDel.push(arrestLawb);

            this.delLawb.emit(this.TempLawbDel);

            this.ArrestLawbreaker.removeAt(i);
          }
        });
    }

  }

  openModal(e) {
    this.modal = this.modelService.open(e, { size: 'lg', centered: true });
  }

  CreateLawBreaker(e) {
    this.ModeEmit = this.ModeAction.C;
    setTimeout(() => {
      this.modal = this.modelService.open(this.CreateLawbreakerModal, { size: <any>'xl', centered: true });
    }, 200);
  }

}
