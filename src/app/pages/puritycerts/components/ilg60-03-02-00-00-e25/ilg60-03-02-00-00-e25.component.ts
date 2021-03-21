import { Component, ViewEncapsulation, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Ilg6003020000E25Config } from "./ilg60-03-02-00-00-e25.config";
import { FormBuilder, FormArray } from "@angular/forms";
import {
  ArrestIndictment,
  ArrestIndictmentDetail,
  ArrestIndictmentProduct,
  ArrestProduct,
  ArrestLawbreaker,
  IArrestMasGuiltbase,
  ArrestStaffVariable
} from '../../model';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-ilg60-03-02-00-00-e25',
  templateUrl: './ilg60-03-02-00-00-e25.component.html',
  styleUrls: ['./ilg60-03-02-00-00-e25.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ilg6003020000E25Component extends Ilg6003020000E25Config implements OnInit {


  constructor(
    private fb: FormBuilder,
    private modelService: NgbModal,
    private chRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.PuritycertFG = this.fb.group({
      ArrestIndictment: this.fb.array([])
    });

    setTimeout(() => {
      // console.log(this.ILG60_03_02_00_00_E25$);
      if (this.ILG60_03_02_00_00_E25$.value.length > 0) {
        for (let i = 0 ; i < this.ILG60_03_02_00_00_E25$.value.length ; i++) {
          const item: ArrestIndictment = {
            INDICTMENT_ID: null,
            ARREST_ID: null,
            GUILTBASE_ID: null,
            FINE_ESTIMATE: null,
            IS_LAWSUIT_COMPLETE: null,
            IS_ACTIVE: 1,
            GUILTBASE_NAME: null,
            FINE: null,
            IS_PROVE: null,
            IS_COMPARE: null,
            SUBSECTION_NAME: null,
            SUBSECTION_DESC: null,
            SECTION_NAME: null,
            PENALTY_DESC: null
          };
          const newItem = {...item, ACTION: this.Action.ADD};
          const list = ([...this.ArrestIndictment.value, newItem])
            .map((x, j) => {
              return this.fb.group({
                ...x,
                ROW_ID: j + 1,
                ArrestIndictmentDetail: this.setArrestIndicmentDetail(j, x.INDICTMENT_ID),
                ArrestIndictmentProduct: this.setArrestIndictmentProduct(j, x.INDICTMENT_ID)
              });
            });
          this.PuritycertFG.setControl('ArrestIndictment', this.fb.array(list));
          const data = this.ILG60_03_02_00_00_E25$.value[i];
          this.ArrestIndictment.at(i).patchValue({
            INDICTMENT_ID: data.INDICTMENT_ID,
            ARREST_ID: data.ARREST_ID,
            GUILTBASE_ID: data.GUILTBASE_ID,
            FINE_ESTIMATE: data.FINE_ESTIMATE,
            IS_LAWSUIT_COMPLETE: data.IS_LAWSUIT_COMPLETE,
            IS_ACTIVE: item.IS_ACTIVE,
            GUILTBASE_NAME: data.GUILTBASE_NAME,
            FINE: data.FINE,
            IS_PROVE: data.IS_PROVE,
            IS_COMPARE: data.IS_COMPARE,
            SUBSECTION_NAME: data.SUBSECTION_NAME,
            SUBSECTION_DESC: data.SUBSECTION_DESC,
            SECTION_NAME: data.SECTION_NAME,
            PENALTY_DESC: data.PENALTY_DESC
          });
        }
        this.Output.emit(this.ArrestIndictment.value);
      } else {
        // console.log('เข้าไม่ทัน');
        this.PuritycertFG = this.fb.group({
          ArrestIndictment: this.fb.array([])
        });
        this.formChange()
      }
    },1000);


  }

  openModal(e) {
    this.modal = this.modelService.open(e, { size: 'lg', centered: true });
  }

  addIndictment() {

    const item: ArrestIndictment = {
      INDICTMENT_ID: null,
      ARREST_ID: null,
      GUILTBASE_ID: null,
      FINE_ESTIMATE: null,
      IS_LAWSUIT_COMPLETE: null,
      IS_ACTIVE: 1,
      GUILTBASE_NAME: null,
      FINE: null,
      IS_PROVE: null,
      IS_COMPARE: null,
      SUBSECTION_NAME: null,
      SUBSECTION_DESC: null,
      SECTION_NAME: null,
      PENALTY_DESC: null
    };
    const newItem = { ...item, ACTION: this.Action.ADD };
    const list = ([...this.ArrestIndictment.value, newItem])
      .map((x, i) => {
        return this.fb.group({
          ...x,
          ROW_ID: i + 1,
          ArrestIndictmentDetail: this.setArrestIndicmentDetail(i, x.INDICTMENT_ID),
          ArrestIndictmentProduct: this.setArrestIndictmentProduct(i, x.INDICTMENT_ID)
        });
      });

    this.PuritycertFG.setControl('ArrestIndictment', this.fb.array(list));
    this.formChange()
  }

  formChange() {
    this.ArrestIndictment.valueChanges
      .subscribe((x: ArrestIndictment[]) => {
        const obj = Object.assign([], x);
        this.Output.emit(obj);
        console.log(this.Output);
      })
  }

  setArrestIndicmentDetail(parentIndex: number, INDICTMENT_ID: number): FormArray {
    let arr = new FormArray([]);
    this.ILG60_03_03_00_00_E15$.subscribe((x) => {
      if (x == null || x.length == 0) return;

      let ArrestIndictment = this.ArrestIndictment.at(parentIndex);

      if (ArrestIndictment != undefined) {
        arr = ArrestIndictment.get('ArrestIndictmentDetail') as FormArray;

        x.forEach((ele: ArrestLawbreaker, index: number) => {
          if (arr.at(index) != undefined) {

            arr.at(index).patchValue({
              IS_ACTIVE: ele.IS_ACTIVE,
              ACTION: ele['ACTION']
            });

            this.chRef.markForCheck();

          } else {
            const l = { ...ele, INDICTMENT_ID }
            arr.push(this.setGroupArrestIndictmentDetail(l));
          }
        });

      } else {

        x.forEach(lawb => {
          const l = { ...lawb, INDICTMENT_ID }
          arr.push(this.setGroupArrestIndictmentDetail(l))
        });
      }
    });
    return arr;
  }

  setGroupArrestIndictmentDetail(lawb: any) {

    const d: ArrestIndictmentDetail = {
      INDICTMENT_DETAIL_ID: null,
      INDICTMENT_ID: lawb.INDICTMENT_ID,
      LAWBREAKER_ID: lawb.LAWBREAKER_ID,
      IS_ACTIVE: lawb.IS_ACTIVE,
      TITLE_NAME_TH: lawb.TITLE_NAME_TH,
      TITLE_NAME_EN: lawb.TITLE_NAME_EN,
      TITLE_SHORT_NAME_TH: lawb.TITLE_SHORT_NAME_TH,
      TITLE_SHORT_NAME_EN: lawb.TITLE_SHORT_NAME_EN,
      FIRST_NAME: lawb.FIRST_NAME,
      MIDDLE_NAME: lawb.MIDDLE_NAME,
      LAST_NAME: lawb.LAST_NAME,
      OTHER_NAME: lawb.OTHER_NAME
    };
    return this.fb.group({ ...d, LAWBREAKER_IS_CHECKED: false, ACTION: lawb['ACTION'] })
  }

  setArrestIndictmentProduct(parentIndex: number, INDICTMENT_ID: number) {
    let arr = new FormArray([]);
    this.ILG60_03_02_00_00_E21$.subscribe(x => {
      if (x == null || x.length == 0) return;

      let ArrestIndictment = this.ArrestIndictment.at(parentIndex);

      if (ArrestIndictment != undefined) {

        arr = ArrestIndictment.get('ArrestIndictmentProduct') as FormArray;

        x.forEach((ele: ArrestProduct, index: number) => {
          if (arr.at(index) != undefined) {

            arr.at(index).patchValue({
              SIZES_UNIT_ID: ele.SIZES_UNIT_ID,
              QUATITY_UNIT_ID: ele.QUATITY_UNIT_ID,
              VOLUMN_UNIT_ID: ele.VOLUMN_UNIT_ID,
              SIZES: ele.SIZES,
              SIZES_UNIT: ele.SIZES_UNIT,
              QUANTITY: ele.QUANTITY,
              QUANTITY_UNIT: ele.QUANTITY_UNIT,
              VOLUMN: ele.VOLUMN,
              VOLUMN_UNIT: ele.VOLUMN_UNIT,
              IS_ACTIVE: ele.IS_ACTIVE,
              ACTION: ele['ACTION']
            });

            this.chRef.markForCheck();

          } else {
            const l = {...ele, INDICTMENT_ID}
            arr.push(this.setGroupArrestIndictmentProduct(l));
          }
        })

      } else {
        x.forEach(o => {
          const l = {...o, INDICTMENT_ID}
          arr.push(this.setGroupArrestIndictmentProduct(o))
        });
      }

    });
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
      VOLUMN: o.VOLUMN,
      VOLUMN_UNIT: o.VOLUMN_UNIT,
      FINE_ESTIMATE: null,
      IS_ILLEGAL: o.IS_ILLEGAL,
      IS_ACTIVE: o.IS_ACTIVE,
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
      PRODUCT_MODEL_NAME_EN: o.PRODUCT_MODEL_NAME_EN
    };

    return this.fb.group({ ...d, PRODUCT_IS_CHECKED: false, ACTION: o['ACTION'] })

  }

  Ilg60O02000206_Output(event: IArrestMasGuiltbase) {

    this.addIndictment();
    var index = this.ArrestIndictment.value.length;
    console.log(index);
    this.ArrestIndictment.at(index - 1).patchValue({
      GUILTBASE_ID: event.GUILTBASE_ID,
      GUILTBASE_NAME: event.GUILTBASE_NAME,
      FINE: event.FINE,
      IS_PROVE: event.IS_PROVE,
      IS_COMPARE: event.IS_COMPARE,
      SUBSECTION_NAME: event.SUBSECTION_NAME,
      SUBSECTION_DESC: event.SUBSECTION_NAME,
      SECTION_NAME: event.SECTION_NAME,
      PENALTY_DESC: event.PENALTY_DESC
    });

    this.Output.emit(this.ArrestIndictment.value);
    // console.log(this.ArrestIndictment.value);
  }

  onDeleteIndictment(i: number) {
    // this.ArrestIndictment.at(i).patchValue({
    //   ACTION: this.Action.DELETE,
    //   IS_ACTIVE: 0
    // });
    this.ArrestIndictment.removeAt(i);
    console.log(this.isEdit);
    // if (this.isEdit === false) {
      this.Output.emit(this.ArrestIndictment.value);
    // }

  }

  onUndoDeleteIndictment(i: number) {
    let row = this.ArrestIndictment.at(i);
    const INDICTMENT_ID = row.get('INDICTMENT_ID');

    row.get('IS_ACTIVE').patchValue(1);

    if (INDICTMENT_ID != null && typeof Number(INDICTMENT_ID.value) === 'number') {
      row.get('ACTION').patchValue(this.Action.EDIT);
    } else {
      row.get('ACTION').patchValue(this.Action.ADD);
    }
  }

}
