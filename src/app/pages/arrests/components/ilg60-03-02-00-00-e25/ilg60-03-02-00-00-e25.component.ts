import { Component, ViewEncapsulation, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import { Ilg6003020000E25Config } from "./ilg60-03-02-00-00-e25.config";
import { FormBuilder, FormArray } from "@angular/forms";
import { ArrestIndictment, ArrestIndictmentDetail, ArrestIndictmentProduct, ArrestProduct, ArrestLawbreaker, IArrestMasGuiltbase } from "../../models";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { LocalStoreage as LS, ArrayForm as AF } from '../../entities';
import swal from "sweetalert2";
import { Message } from "app/config/message";

@Component({
  selector: 'app-ilg60-03-02-00-00-e25',
  templateUrl: './ilg60-03-02-00-00-e25.component.html',
  styleUrls: ['./ilg60-03-02-00-00-e25.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ilg6003020000E25Component extends Ilg6003020000E25Config implements OnInit, AfterViewInit, OnDestroy {
  ngOnDestroy(): void {
    this.destroy();
  }

  private destroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.ILG60_03_03_00_00_E15_TrashIndex.next(null);
    this.ILG60_03_03_00_00_E15_TrashIndex.complete();
    this.ILG60_03_02_00_00_E21_TrashIndex.next(null);
    this.ILG60_03_02_00_00_E21_TrashIndex.complete();
    localStorage.removeItem(LS.TrashArrestIndictment);
    localStorage.removeItem(LS.TrashArrestIndictmentDetail);
    localStorage.removeItem(LS.TrashArrestIndictmentProduct);
  }

  @ViewChild('indictmentTable') indictmentTable: ElementRef;
  @ViewChild('sectionName') sectionName: ElementRef;

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private modelService: NgbModal,
    private chRef: ChangeDetectorRef
  ) {
    super();
    this.destroy();
  }

  ngOnInit() {
    this.ArrestFG = this.fb.group({
      ArrestIndictment: this.fb.array([])
    });

    Observable.combineLatest(this.ILG60_03_03_00_00_E15_TrashIndex, this.ILG60_03_02_00_00_E21_TrashIndex)
      .pipe(
        map(x => ({ law: x[0], pro: x[1] })),
        takeUntil(this.destroy$)
      )
      .subscribe(x => {
        if (x.law == null && x.pro == null) return;

        for (let index = 0; index < this.ArrestIndictment.length; index++) {
          let element = this.ArrestIndictment.at(index);
          if (x.law != null) {
            let dt = element.get(AF.IndictmentDetail) as FormArray;

            let IndictmentDetail = this.TrashArrestIndictmentDetail;
            IndictmentDetail = [...IndictmentDetail, dt.at(x.law).value];
            localStorage.setItem(LS.TrashArrestIndictmentDetail, JSON.stringify(IndictmentDetail));

            dt.removeAt(x.law);
          }

          if (x.pro != null) {
            let pd = element.get(AF.IndictmentProduct) as FormArray;

            let IndictmentProduct = this.TrashArrestIndictmentProduct;
            IndictmentProduct = [...IndictmentProduct, pd.at(x.pro).value];
            localStorage.setItem(LS.TrashArrestIndictmentProduct, JSON.stringify(IndictmentProduct));

            pd.removeAt(x.pro);
          }
        }

        if (x.law != null) {
          this.ILG60_03_03_00_00_E15_TrashIndex.next(null);
        }

        if (x.pro != null) {
          this.ILG60_03_02_00_00_E21_TrashIndex.next(null);
        }

        this.chRef.markForCheck();
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
            // Observable
            //   .combineLatest(this.ILG60_03_03_00_00_E15$, this.ILG60_03_02_00_00_E21$)
            //   .pipe(
            //     map(o => ({ law: o[0], pro: o[1] })),
            //     takeUntil(this.destroy$)
            //   ).subscribe((o) => {
            //     console.log('zip : ', o)
            const newItem = x.reduce((accu, curr) => {

              let detail = [];
              if (curr.ArrestIndictmentDetail) {
                detail = curr.ArrestIndictmentDetail
                  .reduce((a, c) => {

                    //*** checking string 'null' ***//
                    for (var key in c.ArrestLawbreaker)
                      if (c.ArrestLawbreaker[key] === 'null')
                        c.ArrestLawbreaker[key] = null;


                    let product = [];
                    if (c.ArrestIndictmentProduct) {
                      product = c.ArrestIndictmentProduct.reduce((subA, subC) => {

                        //***checking string 'null'***//
                        for (var key in subC)
                          if (subC[key] === 'null')
                            subC[key] = null;

                        // const PRODUCT_DESC = o.pro.find(_ => _.PRODUCT_ID == subC.PRODUCT_ID);
                        const PRODUCT_E21$ = this.ILG60_03_02_00_00_E21$.value.find(_ => _.PRODUCT_ID == subC.PRODUCT_ID);
                        return [
                          ...subA,
                          {
                            ...subC,
                            QUANTITY: this.AddComma(subC.QUANTITY),
                            VOLUMN: this.AddComma(subC.VOLUMN),
                            FINE_ESTIMATE: !subC.FINE_ESTIMATE ? null : this.AddComma(subC.FINE_ESTIMATE),
                            PRODUCT_DESC: PRODUCT_E21$ ? PRODUCT_E21$.PRODUCT_DESC : null,
                            ACTION: this.Action.EDIT,
                            // PRODUCT_IS_CHECKED: o.pro.find(x => x.PRODUCT_ID == subC.PRODUCT_ID) && true //OLD
                            PRODUCT_IS_CHECKED: this.ILG60_03_02_00_00_E21$.value.find(x => x.PRODUCT_ID == subC.PRODUCT_ID) && true
                          }
                        ]
                      }, []);
                      product = [...product].map(x => this.fb.group(x));
                    }

                    return [
                      ...a,
                      {
                        ...c,
                        ArrestLawbreaker: c.ArrestLawbreaker == null ? {} : c.ArrestLawbreaker, /////add new
                        ArrestIndictmentProduct: this.fb.array(product),
                        INDICTMENT_ID: curr.INDICTMENT_ID,
                        ACTION: this.Action.EDIT,
                        FINE_ESTIMATE: curr.FINE_ESTIMATE ? this.AddComma(curr.FINE_ESTIMATE) : '',
                        // LAWBREAKER_IS_CHECKED: o.law.find(x => x.LAWBREAKER_ID == c.LAWBREAKER_ID) && true //OLD
                        LAWBREAKER_IS_CHECKED: this.ILG60_03_03_00_00_E15$.value.find(x => x.LAWBREAKER_ID == c.LAWBREAKER_ID) && true
                      }
                    ]
                  }, []);
                detail = [...detail].map(x => this.fb.group(x));
              }
              return [
                ...accu,
                {
                  ...curr,
                  ArrestIndictmentDetail: this.fb.array(detail),
                  ACTION: this.Action.EDIT
                }
              ]
            }, []).map(x => this.fb.group(x));

            this.ArrestFG.setControl(AF.Indictment, this.fb.array(newItem));

            this.emitValue(this.ArrestFG.value);

            this.formChange();

            this.IndictmentDetailFormChange();

            this.chRef.markForCheck();

            // });
            this.ILG60_03_02_00_00_E25.next(true);
          });
        break;
    }
  }

  findItemNotMatch(maxArray: any[], minArray: any[], field: string) {
    const itemMax = maxArray.reduce((accu, curr) => [...accu, curr[field]], []);
    const itemMin = minArray.reduce((accu, curr) => [...accu, curr[field]], []);
    // ต้องการค้นหา item ใน minArray ที่ไม่มีใน maxArray
    const a = itemMin.filter((item) => !itemMax.includes(item));
    return minArray.filter(item => a.includes(item[field]));
  }

  openModal(e) {
    this.modal = this.modelService.open(e, { size: 'lg', centered: true });
  }

  openModalIlg60o02000206(e) {
    const E21 = this.ILG60_03_02_00_00_E21$.getValue() as ArrestProduct[];
    const E15 = this.ILG60_03_03_00_00_E15$.getValue() as ArrestLawbreaker[];
    const QUANTITY_ISNULL = E21.filter(f => !parseFloat(this.removeComma(f.QUANTITY || 0))).length;

    if (!E21.length && !E15.length) {
      this.swalFn('', 'กรุณาระบุข้อมูล "ผู้ต้องหา หรือ ของกลาง"', 'warning');
      return;
    }

    if (QUANTITY_ISNULL != 0) {
      this.swalFn('', 'กรุณาระบุจำนวน "ของกลาง"', 'warning');
      return;
    }

    this.modal = this.modelService.open(e, { size: 'lg', centered: true });
  }

  addIndictment(event) {

    const item: any = {
      INDICTMENT_ID: null,
      ARREST_ID: null,
      // GUILTBASE_ID: null,
      FINE_ESTIMATE: null,
      IS_LAWSUIT_COMPLETE: 0,
      IS_ACTIVE: 1,
      // GUILTBASE_NAME: null,
      // FINE: null,
      // IS_PROVE: null,
      // IS_COMPARE: null,
      // SUBSECTION_NAME: null,
      // SUBSECTION_DESC: null,
      // SECTION_NAME: null,
      // PENALTY_DESC: null,


      GUILTBASE_ID: event.GUILTBASE_ID,
      GUILTBASE_NAME: event.GUILTBASE_NAME,
      FINE: event.FINE,
      IS_PROVE: event.IS_PROVE,
      IS_COMPARE: event.IS_COMPARE,
      SUBSECTION_NAME: event.SUBSECTION_NAME,
      SUBSECTION_DESC: event.SUBSECTION_NAME,
      SECTION_NAME: event.SECTION_NAME,
      PENALTY_DESC: event.PENALTY_DESC,

    };

    // console.log('E25 event : ', event)
    // const checkGuiltBase = this.ArrestIndictment.value.filter(x => x.GUILTBASE_ID == event.GUILTBASE_ID);
    // if (checkGuiltBase.length == 0) {
    //   console.log('this.ArrestIndictment.value.length : ', this.ArrestIndictment.value.length)
    //   this.ArrestIndictment.at(this.ArrestIndictment.value.length).patchValue({
    //     GUILTBASE_ID: event.GUILTBASE_ID,
    //     GUILTBASE_NAME: event.GUILTBASE_NAME,
    //     FINE: event.FINE,
    //     IS_PROVE: event.IS_PROVE,
    //     IS_COMPARE: event.IS_COMPARE,
    //     SUBSECTION_NAME: event.SUBSECTION_NAME,
    //     SUBSECTION_DESC: event.SUBSECTION_NAME,
    //     SECTION_NAME: event.SECTION_NAME,
    //     PENALTY_DESC: event.PENALTY_DESC
    //   })
    //   this.ILG60_03_02_00_00_E25.next(true);
    //   this.invalid.next(false);
    // }

    const newItem = { ...item, ACTION: this.Action.ADD };
    this.setArrestIndictment([newItem], event.Lawbreaker, event.Products);
    // this.emitValue([newItem]);
    this.formChange();


  }

  emitValue(value: any[]) {
    const obj = Object.assign([], value);
    this.Output.emit(obj)
  }

  formChange() {
    this.ArrestIndictment.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((x: ArrestIndictment[]) => {

        this.emitValue(x);

        // this.sectionNameDropdown = x.reduce((a, c) => {
        //   if (c.SECTION_NAME != null && c.SECTION_NAME != '') {
        //     return [...a, { SECTION_NAME: c.SECTION_NAME }]
        //   } else {
        //     a;
        //   }
        // }, []);
      })
  }

  IndictmentDetailFormChange() {
    this.ArrestIndictment.controls.forEach(control => {
      control.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          const index = this.ArrestIndictment.controls.indexOf(control);
          let element = this.ArrestIndictment.at(index);
          let dt = element.get(AF.IndictmentDetail) as any //FormArray;
          let p = dt.at(0).get('ArrestIndictmentProduct'); //latest value

          //ดึง detail ออกมา
          dt = dt.value.reduce((accu, curr) => {

            let pd = curr['ArrestIndictmentProduct'].reduce((a, c, i) => {
              // set product ใน detail
              return [...a, {
                ...c,
                QUANTITY: p.value[i]['QUANTITY'],
                VOLUMN: p.value[i]['VOLUMN'],
                FINE_ESTIMATE: p.value[i]['FINE_ESTIMATE']
              }];
            }, [])
            // ส่ง product ที่ set กลับไปที่ ArrestIndictmentDetail
            return [...accu, {
              ...curr,
              ArrestIndictmentProduct: pd
            }];

          }, []);

          // set dt ที่แก้ไข กลับเข้าไปใน ArrestIndictment ก่อน emit
          this.ArrestIndictment.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((x: ArrestIndictment[]) => {
              x = x.map((m, i) => {
                if (i == index)
                  m.ArrestIndictmentDetail = dt;
                return m;
              })

              this.emitValue(x);
            })
        });
    })

  }

  setArrestIndictment(newItem: any[], Lawbreaker: any[], Products: any[]) {
    const list = newItem //([...this.ArrestIndictment.value, ...newItem])
      .map((x, i) => {
        return this.fb.group({
          ...x,
          ArrestIndictmentDetail: this.setArrestIndicmentDetail(i, x.INDICTMENT_ID, Lawbreaker, Products),
          // ArrestIndictmentProduct: this.setArrestIndictmentProduct(i, x.INDICTMENT_ID)//////
        });
      })

    const lastResult = ([...this.ArrestIndictment.controls, ...list]);

    this.ArrestFG.setControl(AF.Indictment, this.fb.array(lastResult));

    this.emitValue(this.ArrestIndictment.getRawValue());


  }

  setArrestIndicmentDetail(parentIndex: number, INDICTMENT_ID: number, Lawbreaker: any[], Products: any[]): FormArray {
    let arr = new FormArray([]);

    // .pipe(takeUntil(this.destroy$))
    // .subscribe((x) => {
    // console.log('in setArrestIndicmentDetail Lawbreaker', Lawbreaker)
    // console.log('in setArrestIndicmentDetail Products', Products)

    if (Lawbreaker.length == 0) {
      arr.push(this.setGroupArrestIndictmentDetailNotLawbreaker(parentIndex, {}, INDICTMENT_ID, Products));
      // return;
    } else {
      // let ArrestIndictment = this.ArrestIndictment.at(parentIndex);
      // if (ArrestIndictment != undefined) {
      //   arr = ArrestIndictment.get(AF.IndictmentDetail) as FormArray;

      //   Lawbreaker.forEach((ele: ArrestLawbreaker, index: number) => {
      //     const _arr = arr.at(index);
      //     if (_arr != undefined) {
      //       _arr.patchValue({
      //         IS_ACTIVE: ele.IS_ACTIVE,
      //         ACTION: ele['ACTION']
      //       });

      //       this.chRef.markForCheck();

      //     } else {
      //       arr.push(this.setGroupArrestIndictmentDetail(parentIndex, ele, INDICTMENT_ID, Products));
      //     }
      //   });

      // } else {
      Lawbreaker.forEach(ele => {
        arr.push(this.setGroupArrestIndictmentDetail(parentIndex, ele, INDICTMENT_ID, Products))
      });
      // }
    }

    // });
    return arr;
  }

  setGroupArrestIndictmentDetail(parentIndex: number, lawb: any, INDICTMENT_ID: number, Products: any[]) {
    const d: ArrestIndictmentDetail = {
      INDICTMENT_DETAIL_ID: null,
      // PERSON_ID: lawb.PERSON_ID,
      INDICTMENT_ID: INDICTMENT_ID,
      LAWBREAKER_ID: lawb.LAWBREAKER_ID,
      FINE_ESTIMATE: null,
      IS_ACTIVE: lawb.IS_ACTIVE,
      ArrestLawbreaker: lawb
      // TITLE_NAME_TH: lawb.TITLE_NAME_TH,
      // TITLE_NAME_EN: lawb.TITLE_NAME_EN,
      // TITLE_SHORT_NAME_TH: lawb.TITLE_SHORT_NAME_TH,
      // TITLE_SHORT_NAME_EN: lawb.TITLE_SHORT_NAME_EN,
      // FIRST_NAME: lawb.FIRST_NAME,
      // MIDDLE_NAME: lawb.MIDDLE_NAME,
      // LAST_NAME: lawb.LAST_NAME,
      // OTHER_NAME: lawb.OTHER_NAME
    };
    return this.fb.group({
      ...d,
      LAWBREAKER_IS_CHECKED: true,
      ACTION: lawb['ACTION'],
      ArrestIndictmentProduct: this.setArrestIndictmentProduct(parentIndex, INDICTMENT_ID, Products)
    })
  }

  setGroupArrestIndictmentDetailNotLawbreaker(parentIndex: number, lawb: any, INDICTMENT_ID: number, Products: any[]) {
    const d: any = {
      INDICTMENT_DETAIL_ID: null,
      INDICTMENT_ID: INDICTMENT_ID,
      LAWBREAKER_ID: null,
      IS_ACTIVE: 1,
      ArrestLawbreaker: lawb
    };
    return this.fb.group({
      ...d,
      LAWBREAKER_IS_CHECKED: false,
      ACTION: this.Action.ADD,//lawb['ACTION'],
      ArrestIndictmentProduct: this.setArrestIndictmentProduct(parentIndex, INDICTMENT_ID, Products)
    })
  }

  setArrestIndictmentProduct(parentIndex: number, INDICTMENT_ID: number, Products: any[]) {
    let arr = new FormArray([]);
    // this.ILG60_03_02_00_00_E21$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(x => {

    // console.log('in setArrestIndictmentProduct parentIndex :', parentIndex)
    if (Products == null || Products.length == 0) return arr;

    // let ArrestIndictment = this.ArrestIndictment.at(parentIndex);
    // console.log('in setArrestIndictmentProduct ArrestIndictment :', ArrestIndictment)

    // if (ArrestIndictment != undefined) {

    //   arr = ArrestIndictment.get(AF.IndictmentProduct) as FormArray;

    //   Products.forEach((ele: ArrestProduct, index: number) => {
    //     const _arr = arr.at(index);
    //     if (_arr != undefined) {

    //       _arr.patchValue({
    //         SIZES_UNIT_ID: ele.SIZES_UNIT_ID,
    //         QUATITY_UNIT_ID: ele.QUATITY_UNIT_ID,
    //         VOLUMN_UNIT_ID: ele.VOLUMN_UNIT_ID,
    //         SIZES: ele.SIZES,
    //         SIZES_UNIT: ele.SIZES_UNIT,
    //         QUANTITY: ele.QUANTITY,
    //         QUANTITY_UNIT: ele.QUANTITY_UNIT,
    //         VOLUMN: ele.VOLUMN,
    //         VOLUMN_UNIT: ele.VOLUMN_UNIT,
    //         IS_ACTIVE: ele.IS_ACTIVE,
    //         ACTION: ele['ACTION']
    //       });

    //       this.chRef.markForCheck();

    //     } else {
    //       const l = { ...ele, INDICTMENT_ID }
    //       arr.push(this.setGroupArrestIndictmentProduct(l));
    //     }
    //   })

    // } else {
    Products.forEach(o => {
      const l = { ...o, INDICTMENT_ID }
      arr.push(this.setGroupArrestIndictmentProduct(o))
    });
    // }

    // });
    return arr;
  }

  setGroupArrestIndictmentProduct(o: any) {
    const d: ArrestIndictmentProduct = {
      PRODUCT_INDICTMENT_ID: null,
      PRODUCT_ID: o.PRODUCT_ID,
      INDICTMENT_ID: o.INDICTMENT_ID,
      SIZES_UNIT_ID: o.SIZES_UNIT_ID,
      QUATITY_UNIT_ID: o.QUATITY_UNIT_ID,
      VOLUMN_UNIT_ID: o.VOLUMN_UNIT_ID,
      SIZES: o.SIZES,
      SIZES_UNIT: o.SIZES_UNIT,
      QUANTITY: o.QUANTITY,
      QUANTITY_UNIT: o.QUANTITY_UNIT,
      VOLUMN: this.AddComma(o.VOLUMN || ''),
      VOLUMN_UNIT: o.VOLUMN_UNIT,
      FINE_ESTIMATE: null,
      IS_ILLEGAL: o.IS_ILLEGAL ? 1 : 0,
      IS_ACTIVE: o.IS_ACTIVE,
      PRODUCT_REF_CODE: o.PRODUCT_REF_CODE,
      PRODUCT_MAPPING_ID: o.PRODUCT_MAPPING_ID,
      PRODUCT_GROUP_NAME: o.PRODUCT_GROUP_NAME,
      PRODUCT_CATEGORY_NAME: o.PRODUCT_CATEGORY_NAME,
      PRODUCT_TYPE_NAME: o.PRODUCT_TYPE_NAME,
      PRODUCT_SUBTYPE_NAME: o.PRODUCT_SUBTYPE_NAME,
      PRODUCT_SUBSETTYPE_NAME: o.PRODUCT_SUBSETTYPE_NAME,
      PRODUCT_BRAND_NAME_TH: o.PRODUCT_BRAND_NAME_TH,
      PRODUCT_BRAND_NAME_EN: o.PRODUCT_BRAND_NAME_EN,
      PRODUCT_SUBBRAND_NAME_TH: o.PRODUCT_SUBBRAND_NAME_TH,
      PRODUCT_SUBBRAND_NAME_EN: o.PRODUCT_SUBBRAND_NAME_EN,
      PRODUCT_MODEL_NAME_TH: o.PRODUCT_MODEL_NAME_TH,
      PRODUCT_MODEL_NAME_EN: o.PRODUCT_MODEL_NAME_EN,
      PRODUCT_DESC: o.PRODUCT_DESC
    };

    return this.fb.group({ ...d, PRODUCT_IS_CHECKED: true, ACTION: o['ACTION'] })

  }

  Ilg60O02000206_Output(event: any, index: number) {
    // const checkGuiltBase = this.ArrestIndictment.value.filter(x => x.GUILTBASE_ID == event.GUILTBASE_ID);
    // if (checkGuiltBase.length == 0) {
    //   console.log('this.ArrestIndictment.value.length : ', this.ArrestIndictment.value.length)
    //   this.ArrestIndictment.at(this.ArrestIndictment.value.length).patchValue({
    //     GUILTBASE_ID: event.GUILTBASE_ID,
    //     GUILTBASE_NAME: event.GUILTBASE_NAME,
    //     FINE: event.FINE,
    //     IS_PROVE: event.IS_PROVE,
    //     IS_COMPARE: event.IS_COMPARE,
    //     SUBSECTION_NAME: event.SUBSECTION_NAME,
    //     SUBSECTION_DESC: event.SUBSECTION_NAME,
    //     SECTION_NAME: event.SECTION_NAME,
    //     PENALTY_DESC: event.PENALTY_DESC
    //   })
    this.ILG60_03_02_00_00_E25.next(true);
    this.invalid.next(false);

    this.addIndictment(event);
    // }

  }

  onDeleteIndictment(i: number) {
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
        let ArrestIndictment = this.ArrestIndictment.at(i).value;

        this.TempIndictDel.push(ArrestIndictment);

        this.delIndict.emit(this.TempIndictDel);

        this.ArrestIndictment.removeAt(i);

      }
    });
  }


}
