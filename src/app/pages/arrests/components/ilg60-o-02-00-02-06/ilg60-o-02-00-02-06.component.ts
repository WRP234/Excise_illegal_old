import { Component, OnInit, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';
import { IArrestMasGuiltbase, SearchByKeyword, ArrestProduct } from '../../models';
import { Message } from '../../../../config/message';
import { Ilg60O02000206Config } from './ilg60-o-02-00-02-06.config';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArrestMasGuiltBaseService } from '../../services';
import { from, BehaviorSubject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ilg60-o-02-00-02-06',
  templateUrl: './ilg60-o-02-00-02-06.component.html',
  styleUrls: ['./ilg60-o-02-00-02-06.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg60O02000206Component extends Ilg60O02000206Config implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private fb: FormBuilder,
    private s_GuiltBase: ArrestMasGuiltBaseService
  ) {
    super();
  }


  ngOnInit() {
    this.formGroup = this.fb.group({
      ArrestMasGuiltbase: this.fb.array([]),
      IndictmentLawbreaker: this.fb.array([]),
      IndictmentProducts: this.fb.array([])
    })
  }

  ngOnDestroy(): void {
    this.paginage.TotalItems = 0;
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {

    // switch (this.mode) {
    //   case this.ModeAction.C:
    //     break;

    //   case this.ModeAction.R:
    //     break;
    // }

    Observable
      .combineLatest(this.ILG60_03_03_00_00_E15$, this.ILG60_03_02_00_00_E21$)
      .pipe(
        map(o => [{ law: o[0], pro: o[1] }]),
        takeUntil(this.destroy$)
      ).subscribe((o) => {

        let Lawbreaker;
        let Products;

        if (o.length)
          o.map(m => {
            Lawbreaker = m.law
            Products = m.pro
          });

        /** set default select all */
        Lawbreaker.map(m => m.IS_CHECKED = true);
        Products.map(m => m.IS_CHECKED = true);
        this.LawbcheckedAll = true;
        this.ProdcheckedAll = true;

        if (Lawbreaker.length > 0)
          this.ILG60_o_02_00_02_06_C2.next(true);
        else
          this.ILG60_o_02_00_02_06_C2.next(false);

        if (Products.length > 0)
          this.ILG60_o_02_00_02_06_C3.next(true);
        else
          this.ILG60_o_02_00_02_06_C3.next(false);

        this.setItemFormArray(Lawbreaker, 'IndictmentLawbreaker');
        this.setItemFormArray(Products, 'IndictmentProducts');
      })

  }

  onCollapse(event: BehaviorSubject<Boolean>) {
    if (event.getValue()) {
      event.next(false);
    } else {
      event.next(true);
    }
  }

  public LawbcheckAll(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    for (let index = 0; index < this.IndictmentLawbreaker.value.length; index++) {
      this.IndictmentLawbreaker.at(index).get('IS_CHECKED').patchValue(checkbox.checked);
    }
    this.onSelectionChangeLP$();
  }

  public ProdcheckAll(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    for (let index = 0; index < this.IndictmentProducts.value.length; index++) {
      this.IndictmentProducts.at(index).get('IS_CHECKED').patchValue(checkbox.checked);
    }
    this.onSelectionChangeLP$();
  }

  onSearchByKey(form: SearchByKeyword) {
    this.s_GuiltBase.ArrestMasGuiltbasegetByKeyword(form)
      .subscribe(x => this.onSearchComplete(x));

    // this.onSearchComplete(IArrestMasGuiltbaseMock);
  }

  private onSearchComplete(list: IArrestMasGuiltbase[]) {
    if (!list.length) {
      this.swalFn('', Message.noRecord, 'warning');
    }
    this.dataList = list.map((x, i) => {
      return Object.assign(x, { ROW_ID: i + 1 });
    });
    const __list = this.dataList.slice(0, 5);
    this.setItemFormArray(__list, 'ArrestMasGuiltbase');
    this.paginage.TotalItems = list.length;
  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.formGroup.setControl(formControl, itemFormArray);
    }
  }

  onSelectionChange(entry: FormGroup) {
    this.selectedEntry = entry.value;
    this.onSelectionChangeLP$();
  }

  onSelectionChangeLP$() {

    let LAWB_PROD = [...this.IndictmentLawbreaker.getRawValue(), ...this.IndictmentProducts.getRawValue()];

    const IS_CHECKED$ = LAWB_PROD.reduce((a, c) => [...a, ...c.IS_CHECKED], []).some(e => e == true);

    const TEMP = [...[!!this.selectedEntry], ...IS_CHECKED$];

    this.INDICT_LP_SELECTED$ = !TEMP.every(e => e == true);
  }

  public async onSelect(e: any) {

    let E21: any[] = []
    E21 = this.ILG60_03_02_00_00_E21$;
    const ISP = this.selectedEntry.IS_PROVE;
    from(E21)
      .subscribe(s => {
        if (!s.length && ISP == 1) {
          this.swalFn('', 'กรุณาระบุข้อมูล "ของกลาง"', 'warning')
            .then(t => {
              if (t.value)
                this.c.emit(e);
            })
        } else {

          const Obj = Object.assign(this.selectedEntry, {
            Lawbreaker: this.IndictmentLawbreaker
              .getRawValue()
              .filter(f => f.IS_CHECKED == true),
            Products: this.IndictmentProducts
              .getRawValue()
              .filter(f => f.IS_CHECKED == true)
          });

          this.Output.emit(Obj);

          this.c.emit(e);
        }
      })
  }

  async pageChanges(event: any) {
    const list = this.dataList.slice(event.startIndex - 1, event.endIndex);
    this.setItemFormArray(list, 'ArrestMasGuiltbase');
  }
}
