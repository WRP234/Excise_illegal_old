import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Ilg6003020000E21 } from './ilg60-03-02-00-00-e21.config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArrestProduct } from '../../models';
import { LocalStoreage as LS, ArrayForm as AF } from '../../entities';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'app/config/message';

@Component({
  selector: 'app-ilg60-03-02-00-00-e21',
  templateUrl: './ilg60-03-02-00-00-e21.component.html',
  styleUrls: ['./ilg60-03-02-00-00-e21.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ilg6003020000E21Component extends Ilg6003020000E21 implements OnInit, AfterViewInit, OnDestroy {
  ngOnDestroy(): void {
    this.destroy();
  }

  private destroy() {
    this.destroy$.next();
    this.destroy$.complete();
    localStorage.removeItem(LS.TrashArrestProduct);
  }

  constructor(
    private modelService: NgbModal,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef
  ) {
    super();
    this.destroy();
  }

  ngOnInit() {
    this.ArrestFG = this.fb.group({
      ArrestProduct: this.fb.array([])
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
            const newList = x.map(o => {
              let PRODUCT_NAME = "";
              for (var key in o) {
                if (o[key] === 'null') o[key] = null;
              }
              o.QUANTITY = this.AddComma(o.QUANTITY)
              o.VOLUMN = this.AddComma(o.VOLUMN.toFixed(this.setToFixedByPid(o.PRODUCT_GROUP_ID)))
              o.SUGAR = this.AddComma(o.SUGAR || '')
              o.CO2 = this.AddComma(o.CO2 || '')
              o.DEGREE = this.AddComma(o.DEGREE || '')
              // let productBrand = o.PRODUCT_BRAND_NAME_TH ? o.PRODUCT_BRAND_NAME_TH : o.PRODUCT_BRAND_NAME_EN;
              // let productSubBrand = o.PRODUCT_SUBBRAND_NAME_TH ? o.PRODUCT_SUBBRAND_NAME_TH : o.PRODUCT_SUBBRAND_NAME_EN;
              // productBrand = `${productBrand ? productBrand : ""} ${productSubBrand ? productSubBrand : ""}`;
              // let productModel = o.PRODUCT_MODEL_NAME_TH ? `รุ่น ${o.PRODUCT_MODEL_NAME_TH}` : "";

              // if (o.CATEGORY_CODE == "13") {
              //   PRODUCT_NAME = `${o.PRODUCT_GROUP_NAME} 
              //   ${o.PRODUCT_CATEGORY_NAME ? "ชนิด" + o.PRODUCT_CATEGORY_NAME : ""} 
              //   ${productBrand ? "ยี่ห้อ" + productBrand + productModel : ""} 
              //   ขนาด ${o.SIZES} ${o.SIZES_UNIT}`;

              // } else {

              //   PRODUCT_NAME = `${o.PRODUCT_CATEGORY_NAME ? o.PRODUCT_CATEGORY_NAME : ""} 
              //   ${o.PRODUCT_TYPE_NAME ? "ชนิด" + o.PRODUCT_TYPE_NAME : ""} 
              //   ${productBrand ? "ยี่ห้อ" + productBrand + productModel : ""} 
              //   ขนาด ${o.SIZES} ${o.SIZES_UNIT}`;
              // }
              return { ...o, ACTION: this.Action.EDIT, PRODUCT_NAME };
            });
            this.ILG60_03_02_00_00_E21.next(true);

            this.setItemFormArray(newList, AF.Product);

            this.emitValue(newList);

            this.formChange();

            this.chRef.markForCheck();
          })
        break;
    }

    this.subScriberIndictForDisableProduct();
  }

  formChange() {
    this.ArrestProduct.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        this.emitValue(x)
      });
  }

  emitValue(value: any[]) {
    const obj = Object.assign([], value);
    this.Output.emit(obj)
  }

  openModal(e) {
    this.modal = this.modelService.open(e, { size: 'lg', centered: true });
  }

  Ilg60O02000205_Output(event: ArrestProduct[]) {
    const newList = event.map(x => {
      for (var key in x) {
        if (x[key] === 'null') x[key] = null;
      }

      return {
        ...x,
        ACTION: this.Action.ADD
      };
    });

    let list = ([...this.ArrestProduct.value, ...newList]);

    // list = this.filterDuplicate(list, 'PRODUCT_REF_CODE');

    this.emitValue(list);

    this.setItemFormArray(list, AF.Product);

    this.formChange();
  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.ArrestFG.setControl(formControl, itemFormArray);
    }
  }

  public onChangeQuantity(index: number, value: number, P_ID: number) {
    let p = this.ArrestProduct.at(index);
    if (value)
      p.get('VOLUMN').patchValue(Number(parseFloat(this.removeComma(value)) * p.get('SIZES').value).toFixed(this.setToFixedByPid(P_ID)));
    else
      p.get('VOLUMN').patchValue('');
  }

  setToFixedByPid(P_ID: any): number {
    let toFixed: number;
    switch (parseInt(P_ID)) {
      case 1:
      case 2:
      case 13:
        toFixed = 3;
        break;
      default:
        toFixed = 0;
        break;
    }
    return toFixed;
  }

  subScriberIndictForDisableProduct() {
    this.ILG60_03_02_00_00_E25$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        let list = this.ArrestProduct.value.reduce((a, c, i) => {
          return [...a, { ...c, IS_USING: this.getIndictmentProductUsingCounter(i) }]
        }, []);

        this.setItemFormArray(list, AF.Product);

        this.formChange();

        this.chRef.markForCheck();
      })
  }

  getIndictmentProductUsingCounter(index: number) {
    let ArrestProduct = this.TrashArrestProduct;
    ArrestProduct = [...ArrestProduct, this.ArrestProduct.at(index).value];

    let E25: any[] = [];
    let E25_DT: any[] = [];
    let E25_PD: any[] = [];
    let PD_INDICT: number = 0;

    E25 = this.ILG60_03_02_00_00_E25$.getValue();

    if (E25['ArrestIndictment'])
      E25_DT = E25['ArrestIndictment'].reduce((a, c) => { return [...a, ...c.ArrestIndictmentDetail] }, []);
    else
      E25_DT = E25.reduce((a, c) => { return [...a, ...c.ArrestIndictmentDetail] }, []);

    if (E25_DT.length > 0)
      E25_PD = E25_DT.reduce((a, c) => { return [...a, ...c.ArrestIndictmentProduct] }, []);

    const REF_ID: any = ArrestProduct.reduce((a, c) => {
      return { PRODUCT_REF_CODE: c.PRODUCT_REF_CODE, PRODUCT_ID: c.PRODUCT_ID }
    }, {});

    if (REF_ID.PRODUCT_ID)
      PD_INDICT = E25_PD.filter(f => REF_ID.PRODUCT_ID == f.PRODUCT_ID).length;
    else
      PD_INDICT = E25_PD.filter(f => REF_ID.PRODUCT_REF_CODE == f.PRODUCT_REF_CODE).length;

    return PD_INDICT;
  }

  onDeleteProduct = (i: number) => {
    const PD_INDICT = this.getIndictmentProductUsingCounter(i);

    if (PD_INDICT) {
      this.swalFn('', Message.cannotDelItemIndictUsing, 'warning');
      return;
    } else {
      this.swalFnMulti('', Message.confirmAction, 'warning')
        .then((result) => {
          if (result.value) {
            const arrestProd = this.ArrestProduct.at(i).value;

            this.TempProdDel.push(arrestProd);

            this.delProd.emit(this.TempProdDel);

            this.trashIndex.emit(i);
            this.ArrestProduct.removeAt(i);
          }
        });
    }
  }

  getTooltip = (COMPANY, EFFECTIVE_DATE, IS_SYSTEM): string => {
    const COMPANY$ = COMPANY ? `ผู้ประกอบการ ${COMPANY}` : '';
    const EFFECTIVE_DATE$ = EFFECTIVE_DATE ? `วันที่เริ่มใช้งาน ${EFFECTIVE_DATE}` : '';
    const IS_SYSTEM$ = ` ข้อมูลอ้างอิง ${this.getIsSystem(IS_SYSTEM)}`;
    return `${COMPANY$}  ${EFFECTIVE_DATE$}  ${IS_SYSTEM$}`;
  }

  public getIsSystem = (IS_SYSTEM) => this.IS_SYSTEM.find(f => f.VALUE == IS_SYSTEM).SYSTEM;

  public setDisableEngineType(PRODUCT_GROUP_ID): boolean {
    let temp: boolean;
    switch (parseInt(PRODUCT_GROUP_ID)) {
      case 6:
      case 7:
      case 8:
        temp = false;
        break;
      default:
        temp = true;
        break;
    }
    return temp;
  }


}
