import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { pagination } from '../../../config/pagination';
import { FormGroup, FormArray, FormBuilder, FormControlName, FormControl } from '@angular/forms';
import { Acceptability } from 'app/pages/arrests/models';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { NgForm } from '@angular/forms';
import swal from "sweetalert2";
import { Message } from '../../../config/message';
import { Product_dtl, Product_dtlFormControl } from './products.model'
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { ProductGroup } from '../models/investigate-product';
import { InvestgateService } from '../services';
import { DetailManageComponent } from '../detail-manage/detail-manage.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProductsComponent implements OnInit {

  // @ViewChild('addProductForm') addProductForm: NgForm;
  ProductsFG: FormGroup
  // @ViewChild('advForm') advForm: NgForm;

  isCheckAll: boolean = false;
  isCheckOne: boolean = false;
  ProductGroup = new Array<ProductGroup>();
  PRODUCT_CATEGORY_OPT = new Array<any>();
  PRODUCT_TYPE = new Array<any>();

  ProductUnit: any[] = [{ Unit_Name: '' },
  { Unit_Name: 'ขวด' },
  { Unit_Name: 'ลิตร' },
  { Unit_Name: 'มิลลิลิตร' }];
  IS_DOMESTIC: any[] = [
    { IS_DOMESTIC: 0, IS_DOMESTIC_NAME: 'ไม่ระบุ' },
    { IS_DOMESTIC: 1, IS_DOMESTIC_NAME: 'ในประเทศ' },
    { IS_DOMESTIC: 2, IS_DOMESTIC_NAME: 'ต่างประเทศ' }];

  PRODUCT_FROMSEARCH = new Array<Product_dtl>();
  PRODUCT_FROMSEARCH_OPTION = new Array<Product_dtl>();
  //############# DISABLE INPUT ################
  GetValueforDis = [
    { text: 'สุรา', value: 0 },
    { text: 'เครื่องดื่ม', value: 1 },
    { text: 'รถยนต์', value: 2 }
  ]
  DIS_DEGREE: boolean;
  DIS_SUGAR: boolean;
  DIS_CO2: boolean;
  DIS_CHASSIS_NO: boolean;
  DIS_LICENSE_PLATE: boolean;
  DIS_ENGINE_NO: boolean;
  //############# END DISABLE INPUT ################

  get _product_dtl(): FormArray {
    return this.ProductsFG.get('PRODUCT_DETAIL') as FormArray;
  }
  get _product_select(): FormArray {
    return this.ProductsFG.get('PRODUCT_SELECT') as FormArray;
  }
  public advSearch: boolean = true;
  /**onChangeCollapse */
  onAddProducts = new BehaviorSubject<Boolean>(false);
  onCreateProducts = new BehaviorSubject<Boolean>(true);

  paginage = pagination;

  myGroup: FormGroup

  constructor(private investgateService: InvestgateService,
    private preLoaderService: PreloaderService,
    private _manageComponent: DetailManageComponent,
    private fb: FormBuilder, ) {

    this.ProductsFG = this.fb.group({
      CO2: new FormControl(null),
      CREATE_DATE: new FormControl(null),
      CREATE_USER_ACCOUNT_ID: new FormControl(null),
      CREATE_USER_NAME: new FormControl(null),
      DEGREE: new FormControl(null),
      IS_ACTIVE: new FormControl(null),
      IS_DOMESTIC: new FormControl(null),
      PRICE: new FormControl(null),
      PRODUCT_BRAND_ID: new FormControl(null),
      PRODUCT_BRAND_NAME_EN: new FormControl(null),
      PRODUCT_BRAND_NAME_TH: new FormControl(null),
      PRODUCT_BRAND_FULLNAME: new FormControl(null),
      PRODUCT_CATEGORY_ID: new FormControl(null),
      PRODUCT_CATEGORY_NAME: new FormControl(null),
      PRODUCT_CODE: new FormControl(null),
      PRODUCT_GROUP_ID: new FormControl(null),
      PRODUCT_GROUP_NAME: new FormControl(null),
      PRODUCT_MAPPING_ID: new FormControl(null),
      PRODUCT_MODEL_ID: new FormControl(null),
      PRODUCT_MODEL_NAME_EN: new FormControl(null),
      PRODUCT_MODEL_NAME_TH: new FormControl(null),
      PRODUCT_REF_CODE: new FormControl(null),
      PRODUCT_SUBBRAND_ID: new FormControl(null),
      PRODUCT_SUBBRAND_NAME_EN: new FormControl(null),
      PRODUCT_SUBBRAND_NAME_TH: new FormControl(null),
      PRODUCT_SUBSETTYPE_ID: new FormControl(null),
      PRODUCT_SUBSETTYPE_NAME: new FormControl(null),
      PRODUCT_SUBTYPE_ID: new FormControl(null),
      PRODUCT_SUBTYPE_NAME: new FormControl(null),
      PRODUCT_TAXDETAIL_ID: new FormControl(null),
      PRODUCT_TYPE_ID: new FormControl(null),
      PRODUCT_TYPE_NAME: new FormControl(null),
      SIZES: new FormControl(null),
      SIZES_UNIT: new FormControl(null),
      SUGAR: new FormControl(null),
      UNIT_ID: new FormControl(null),
      UPDATE_DATE: new FormControl(null),
      UPDATE_USER_ACCOUNT_ID: new FormControl(null),
      UPDATE_USER_NAME: new FormControl(null),
      QUANTITY: new FormControl(null),
      QUANTITY_UNIT: new FormControl(null),
      VOLUMN: new FormControl(null),
      VOLUMN_UNIT: new FormControl(null),
      CHASSIS_NO: new FormControl(null),
      LICENSE_PLATE: new FormControl(null),
      ENGINE_NO: new FormControl(null),
      REMARK: new FormControl(null),

      //############# CUSTOMS #############
      IS_DOMESTIC_NAME: new FormControl(null),
      PRODUCT_DETAIL: this.fb.array([]),
      PRODUCT_SELECT: this.fb.array([])
    })
  }

  @Output() d = new EventEmitter();
  @Output() c = new EventEmitter();
  @Input() investCode: string;

  FG: FormGroup;
  ACCEPTABILITY = Acceptability;

  _investForm
  _investProduct

  async ngOnInit() {
    this.preLoaderService.setShowPreloader(true);
    await this.investgateService.MasProductGroupgetByCon('', '').then(res => {
      console.log(res)
      this.ProductGroup = res;
      console.log('onPagesload MasProductGroupgetByCon res : ', this.ProductGroup)
    })
    this.preLoaderService.setShowPreloader(false);
    this._investProduct = this._manageComponent.InvestigateDetailProduct;
    this._investForm = this._manageComponent.investigateFG;
  }

  ngOnDestroy(): void {
    this.paginage.TotalItems = 0;
}

  onPagesload() { }

  async checkAll() {
    this.isCheckAll = !this.isCheckAll;
    if (this.isCheckAll) {
      this.ProductsFG.value.PRODUCT_DETAIL.map(item => item.IsChecked = this.isCheckAll);
      let form = this.ProductsFG.value.PRODUCT_DETAIL;
      form = await form.filter(item => item.IsChecked === true);
      this.setItemFormArray(form, 'PRODUCT_SELECT');
    } else {
      let form = this.ProductsFG.value.PRODUCT_SELECT = [];
      this._product_select.value.map(m => {
        this._product_select.removeAt(0);
      })
    }
  }
  setAdvSearch() {
    if(this.advSearch){
      this.advSearch =false
    }
    else{
      this.advSearch = true;
    }
  }
  public async checkOne(e: any, value: any, i: any) {
    const checkbox = e.target;
    if (checkbox.checked) {
      this._product_dtl.at(i).patchValue({ IsChecked: true });
      let form = this._product_dtl.value;
      form = await form.filter(item => item.IsChecked === true);
      this.setItemFormArray(form, 'PRODUCT_SELECT');
    } else {
      let form = this._product_select.value;
      const index = form.findIndex(x => x['PRODUCT_BRAND_ID'] == value['PRODUCT_BRAND_ID']);
      this._product_select.removeAt(index);
    }
  }

  async selectOptionChange(name: string, ev: any, ) {
    const temp = ev.target.value;
    console.log(temp);

    if (name == 'GROUP' && this.ProductGroup.length > 0) {
      var product_code = `${temp + '00000000'}`;
      this.PRODUCT_CATEGORY_OPT = [];
      this.PRODUCT_TYPE = [];
      await this.preLoaderService.setShowPreloader(true);
      await this.investgateService.MasProductCategoryGroupgetByCon('', product_code).then(res => {
        console.log(res)
        this.PRODUCT_CATEGORY_OPT = res;
      })
      this.disableInputChange(ev.target.value);
      this.preLoaderService.setShowPreloader(false);
    } else if (name == 'CATEGORY' && this.PRODUCT_CATEGORY_OPT.length > 0) {
      await this.preLoaderService.setShowPreloader(true);
      let _temp = temp.split(',');
      const _category_group = _temp[0];
      const _product_code = _temp[1];
      await this.investgateService.MasProductCategoryRDBgetByCon(_category_group, _product_code).then(res => {
        console.log(res)
        this.PRODUCT_TYPE = res;
      })
      this.preLoaderService.setShowPreloader(false);
    }
  }

  disableInputChange(value: any) {
    this.DIS_DEGREE = true;
    this.DIS_SUGAR = true;
    this.DIS_CO2 = true;
    this.DIS_CHASSIS_NO = true;
    this.DIS_LICENSE_PLATE = true;
    this.DIS_ENGINE_NO = true;
    let value_dis
    this.GetValueforDis.map(m => { if (m.text == value) value_dis = m.value })
    if (value_dis == 0) this.DIS_DEGREE = false;
    else if (value_dis == 1) this.DIS_DEGREE = false, this.DIS_SUGAR = false;
    else if (value_dis == 2) this.DIS_CO2 = false, this.DIS_CHASSIS_NO = false, this.DIS_LICENSE_PLATE = false, this.DIS_ENGINE_NO = false;
  }

  // clickSeleteProduct(ev) {
  //   this.ProductsFG.patchValue({
  // PRODUCT_BRAND_FULLNAME: ev.PRODUCT_GROUP_NAME,
  // PRODUCT_GROUP_ID: ev.PRODUCT_GROUP_ID,
  // PRODUCT_GROUP_CODE: ev.PRODUCT_GROUP_CODE,
  // IS_ACTIVE: 1,
  // CREATE_DATE: ev.CREATE_DATE,
  // CREATE_USER_ACCOUNT_ID: ev.CREATE_USER_ACCOUNT_ID,
  // UPDATE_DATE: ev.UPDATE_DATE,
  // UPDATE_USER_ACCOUNT_ID: ev.UPDATE_USER_ACCOUNT_ID
  //   })
  // }

  clickChangeCollapse() {
    setTimeout(() => {
      if (this.onAddProducts.getValue()) {
        this.onAddProducts.next(false);
        this.onCreateProducts.next(true)
      } else {
        this.onAddProducts.next(true);
        this.onCreateProducts.next(false)
      }
    }, 250);
  }

  setIsChecked(ev) {
    console.log('ev', ev)
    this.ProductsFG.patchValue({
      //   CO2: ev.CO2,
      //   CREATE_DATE: ev.CREATE_DATE,
      //   CREATE_USER_ACCOUNT_ID: ev.CREATE_USER_ACCOUNT_ID,
      //   CREATE_USER_NAME: ev.CREATE_USER_NAME,
      //   DEGREE: ev.DEGREE,
      //   IS_ACTIVE: ev.IS_ACTIVE,
      //   IS_DOMESTIC: ev.IS_DOMESTIC,
      //   PRICE: ev.PRICE,
      //   PRODUCT_BRAND_ID: ev.PRODUCT_BRAND_ID,
      //   PRODUCT_BRAND_NAME_EN: ev.PRODUCT_BRAND_NAME_EN,
      //   PRODUCT_BRAND_NAME_TH: ev.PRODUCT_BRAND_NAME_TH,
      //   PRODUCT_BRAND_FULLNAME: `${ev.PRODUCT_BRAND_NAME_EN} ${ev.PRODUCT_BRAND_NAME_TH}`,
      //   PRODUCT_CATEGORY_ID: ev.PRODUCT_CATEGORY_ID,
      //   PRODUCT_CATEGORY_NAME: ev.PRODUCT_CATEGORY_NAME,
      //   PRODUCT_CODE: ev.PRODUCT_CODE,
      //   PRODUCT_GROUP_ID: ev.PRODUCT_GROUP_ID,
      //   PRODUCT_GROUP_NAME: ev.PRODUCT_GROUP_NAME,
      //   PRODUCT_MAPPING_ID: ev.PRODUCT_MAPPING_ID,
      //   PRODUCT_MODEL_ID: ev.PRODUCT_MODEL_ID,
      //   PRODUCT_MODEL_NAME_EN: ev.PRODUCT_MODEL_NAME_EN,
      //   PRODUCT_MODEL_NAME_TH: ev.PRODUCT_MODEL_NAME_TH,
      //   PRODUCT_REF_CODE: ev.PRODUCT_REF_CODE,
      //   PRODUCT_SUBBRAND_ID: ev.PRODUCT_SUBBRAND_ID,
      //   PRODUCT_SUBBRAND_NAME_EN: ev.PRODUCT_SUBBRAND_NAME_EN,
      //   PRODUCT_SUBBRAND_NAME_TH: ev.PRODUCT_SUBBRAND_NAME_TH,
      //   PRODUCT_SUBSETTYPE_ID: ev.PRODUCT_SUBSETTYPE_ID,
      //   PRODUCT_SUBSETTYPE_NAME: ev.PRODUCT_SUBSETTYPE_NAME,
      //   PRODUCT_SUBTYPE_ID: ev.PRODUCT_SUBTYPE_ID,
      //   PRODUCT_SUBTYPE_NAME: ev.PRODUCT_SUBTYPE_NAME,
      //   PRODUCT_TAXDETAIL_ID: ev.PRODUCT_TAXDETAIL_ID,
      //   PRODUCT_TYPE_ID: ev.PRODUCT_TYPE_ID,
      //   PRODUCT_TYPE_NAME: ev.PRODUCT_TYPE_NAME,
      //   SIZES: ev.SIZES,
      //   SIZES_UNIT: ev.SIZES_UNIT,
      //   SUGAR: ev.SUGAR,
      //   UNIT_ID: ev.UNIT_ID,
      //   UPDATE_DATE: ev.UPDATE_DATE,
      //   UPDATE_USER_ACCOUNT_ID: ev.UPDATE_USER_ACCOUNT_ID,
      //   UPDATE_USER_NAME: ev.UPDATE_USER_NAME,
      //   QUANTITY: ev.QUANTITY,
      //   QUANTITY_UNIT: ev.QUANTITY_UNIT,
      //   VOLUMN: ev.VOLUMN,
      //   VOLUMN_UNIT: ev.VOLUMN_UNIT,
      //   CHASSIS_NO: ev.CHASSIS_NO,
      //   LICENSE_PLATE: ev.LICENSE_PLATE,
      //   ENGINE_NO: ev.ENGINE_NO,
      //   REMARK: ev.REMARK
    })
  }

  async searchCreateProduct(value: any) {
    console.log('form : ', value)
    await this.preLoaderService.setShowPreloader(true);
    await this.investgateService.MasProductMappinggetByConAdv(value).then(res => {
      const product_dtl = res;

      product_dtl.map(m => m.IsChecked = false);
      this.PRODUCT_FROMSEARCH = res;
      this.PRODUCT_FROMSEARCH.map(m => {
        // m.PRODUCT_BRAND_NAME_TH = m.PRODUCT_BRAND_NAME_TH || m.PRODUCT_BRAND_NAME_EN
        m.SUGAR = m.PRODUCT_GROUP_ID == 2 ? 5 : null //fig for api don't return
        m.QUANTITY = "" //fig for api don't return
        // if (m.PRODUCT_GROUP_ID == '2') { }
        if (m.IS_DOMESTIC == 0) { m.IS_DOMESTIC_NAME = "ไม่ระบุ" }
        else if (m.IS_DOMESTIC == 1) { m.IS_DOMESTIC_NAME = "ในประเทศ" }
        else if (m.IS_DOMESTIC == 2) { m.IS_DOMESTIC_NAME = "ต่างประเทศ" }


        m.PRODUCT_DESC = m.PRODUCT_GROUP_NAME + ' ยี่ห้อ' + (m.PRODUCT_BRAND_NAME_TH || (m.PRODUCT_BRAND_NAME_EN || '')) +
          (m.PRODUCT_SUBBRAND_NAME_TH || (m.PRODUCT_SUBBRAND_NAME_EN || '')) + ' รุ่น' + (m.PRODUCT_MODEL_NAME_TH || (m.PRODUCT_MODEL_NAME_EN || '-')) + ' ขนาด ' + m.SIZES +' '+ m.SIZES_UNIT
        console.log('m.PRODUCT_DESC : ', m.PRODUCT_DESC)


      })
      this.onSearchComplete(res);
      this.setItemFormArray(product_dtl, 'PRODUCT_DETAIL');
      this.preLoaderService.setShowPreloader(false);
    })
  }

  onSearchComplete(list: Product_dtl[]) {
    console.log('onSearchComplete : ', list)
    this.paginage.TotalItems = list.length;
    this.PRODUCT_FROMSEARCH_OPTION = list.slice(0, this.paginage.RowsPerPageOptions[0]);
    this.setItemFormArray(this.PRODUCT_FROMSEARCH_OPTION, 'PRODUCT_DETAIL');
    this.preLoaderService.setShowPreloader(false);
  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.ProductsFG.setControl(formControl, itemFormArray);
    }
  }

  // private createProductForm(): FormGroup {
  //   Product_dtlFormControl.CO2 = new FormControl(null),
  //     Product_dtlFormControl.CREATE_DATE = new FormControl(null),
  //     Product_dtlFormControl.CREATE_USER_ACCOUNT_ID = new FormControl(null),
  //     Product_dtlFormControl.CREATE_USER_NAME = new FormControl(null),
  //     Product_dtlFormControl.DEGREE = new FormControl(null),
  //     Product_dtlFormControl.IS_ACTIVE = new FormControl(null),
  //     Product_dtlFormControl.IS_DOMESTIC = new FormControl(null),
  //     Product_dtlFormControl.PRICE = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_BRAND_ID = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_BRAND_NAME_EN = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_BRAND_NAME_TH = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_CATEGORY_ID = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_CATEGORY_NAME = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_CODE = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_GROUP_ID = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_GROUP_NAME = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_MAPPING_ID = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_MODEL_ID = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_MODEL_NAME_EN = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_MODEL_NAME_TH = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_REF_CODE = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_SUBBRAND_ID = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_SUBBRAND_NAME_EN = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_SUBBRAND_NAME_TH = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_SUBSETTYPE_ID = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_SUBSETTYPE_NAME = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_SUBTYPE_ID = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_SUBTYPE_NAME = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_TAXDETAIL_ID = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_TYPE_ID = new FormControl(null),
  //     Product_dtlFormControl.PRODUCT_TYPE_NAME = new FormControl(null),
  //     Product_dtlFormControl.SIZES = new FormControl(null),
  //     Product_dtlFormControl.SIZES_UNIT = new FormControl(null),
  //     Product_dtlFormControl.SUGAR = new FormControl(null),
  //     Product_dtlFormControl.UNIT_ID = new FormControl(null),
  //     Product_dtlFormControl.UPDATE_DATE = new FormControl(null),
  //     Product_dtlFormControl.UPDATE_USER_ACCOUNT_ID = new FormControl(null),
  //     Product_dtlFormControl.UPDATE_USER_NAME = new FormControl(null)

  //   return this.fb.group(Product_dtl)
  // }

  // private createProductDTLForm(): FormGroup {
  //   Product_dtl.CO2 = new FormControl(null),
  //     Product_dtl.CREATE_DATE = new FormControl(null),
  //     Product_dtl.CREATE_USER_ACCOUNT_ID = new FormControl(null),
  //     Product_dtl.CREATE_USER_NAME = new FormControl(null),
  //     Product_dtl.DEGREE = new FormControl(null),
  //     Product_dtl.IS_ACTIVE = new FormControl(null),
  //     Product_dtl.IS_DOMESTIC = new FormControl(null),
  //     Product_dtl.PRICE = new FormControl(null),
  //     Product_dtl.PRODUCT_BRAND_ID = new FormControl(null),
  //     Product_dtl.PRODUCT_BRAND_NAME_EN = new FormControl(null),
  //     Product_dtl.PRODUCT_BRAND_NAME_TH = new FormControl(null),
  //     Product_dtl.PRODUCT_CATEGORY_ID = new FormControl(null),
  //     Product_dtl.PRODUCT_CATEGORY_NAME = new FormControl(null),
  //     Product_dtl.PRODUCT_CODE = new FormControl(null),
  //     Product_dtl.PRODUCT_GROUP_ID = new FormControl(null),
  //     Product_dtl.PRODUCT_GROUP_NAME = new FormControl(null),
  //     Product_dtl.PRODUCT_MAPPING_ID = new FormControl(null),
  //     Product_dtl.PRODUCT_MODEL_ID = new FormControl(null),
  //     Product_dtl.PRODUCT_MODEL_NAME_EN = new FormControl(null),
  //     Product_dtl.PRODUCT_MODEL_NAME_TH = new FormControl(null),
  //     Product_dtl.PRODUCT_REF_CODE = new FormControl(null),
  //     Product_dtl.PRODUCT_SUBBRAND_ID = new FormControl(null),
  //     Product_dtl.PRODUCT_SUBBRAND_NAME_EN = new FormControl(null),
  //     Product_dtl.PRODUCT_SUBBRAND_NAME_TH = new FormControl(null),
  //     Product_dtl.PRODUCT_SUBSETTYPE_ID = new FormControl(null),
  //     Product_dtl.PRODUCT_SUBSETTYPE_NAME = new FormControl(null),
  //     Product_dtl.PRODUCT_SUBTYPE_ID = new FormControl(null),
  //     Product_dtl.PRODUCT_SUBTYPE_NAME = new FormControl(null),
  //     Product_dtl.PRODUCT_TAXDETAIL_ID = new FormControl(null),
  //     Product_dtl.PRODUCT_TYPE_ID = new FormControl(null),
  //     Product_dtl.PRODUCT_TYPE_NAME = new FormControl(null),
  //     Product_dtl.SIZES = new FormControl(null),
  //     Product_dtl.SIZES_UNIT = new FormControl(null),
  //     Product_dtl.SUGAR = new FormControl(null),
  //     Product_dtl.UNIT_ID = new FormControl(null),
  //     Product_dtl.UPDATE_DATE = new FormControl(null),
  //     Product_dtl.UPDATE_USER_ACCOUNT_ID = new FormControl(null),
  //     Product_dtl.UPDATE_USER_NAME = new FormControl(null)

  //   return this.fb.group(Product_dtl)
  // }

  addProduct() {
    let product_select = this._product_select.value;
    console.log('FN Add product_select : ', product_select)

    product_select.map(m => {
      m.PRODUCT_ID = '',
        m.PRODUCT_MAPPING_ID = m.PRODUCT_MAPPING_ID,
        m.PRODUCT_CODE = m.PRODUCT_CODE,
        m.PRODUCT_REF_CODE = m.PRODUCT_REF_CODE,
        m.PRODUCT_GROUP_ID = m.PRODUCT_GROUP_ID,
        m.PRODUCT_CATEGORY_ID = m.PRODUCT_CATEGORY_ID,
        m.PRODUCT_TYPE_ID = m.PRODUCT_TYPE_ID,
        m.PRODUCT_SUBTYPE_ID = m.PRODUCT_SUBTYPE_ID,
        m.PRODUCT_SUBSETTYPE_ID = m.PRODUCT_SUBSETTYPE_ID,
        m.PRODUCT_BRAND_ID = m.PRODUCT_BRAND_ID,
        m.PRODUCT_SUBBRAND_ID = m.PRODUCT_SUBBRAND_ID,
        m.PRODUCT_MODEL_ID = m.PRODUCT_MODEL_ID,
        m.PRODUCT_TAXDETAIL_ID = m.PRODUCT_TAXDETAIL_ID,
        m.SIZES_UNIT_ID = m.SIZES_UNIT_ID,
        m.QUATITY_UNIT_ID = m.QUATITY_UNIT_ID,
        m.VOLUMN_UNIT_ID = m.VOLUMN_UNIT_ID,
        m.PRODUCT_GROUP_CODE = m.PRODUCT_GROUP_CODE,
        m.PRODUCT_GROUP_NAME = m.PRODUCT_GROUP_NAME,
        m.PRODUCT_CATEGORY_CODE = m.PRODUCT_CATEGORY_CODE,
        m.PRODUCT_CATEGORY_NAME = m.PRODUCT_CATEGORY_NAME,
        m.PRODUCT_TYPE_CODE = m.PRODUCT_TYPE_CODE,
        m.PRODUCT_TYPE_NAME = m.PRODUCT_TYPE_NAME,
        m.PRODUCT_SUBTYPE_CODE = m.PRODUCT_SUBTYPE_CODE,
        m.PRODUCT_SUBTYPE_NAME = m.PRODUCT_SUBTYPE_NAME,
        m.PRODUCT_SUBSETTYPE_CODE = m.PRODUCT_SUBSETTYPE_CODE,
        m.PRODUCT_SUBSETTYPE_NAME = m.PRODUCT_SUBSETTYPE_NAME,
        m.PRODUCT_BRAND_CODE = m.PRODUCT_BRAND_CODE,
        m.PRODUCT_BRAND_NAME_TH = m.PRODUCT_BRAND_NAME_TH,
        m.PRODUCT_BRAND_NAME_EN = m.PRODUCT_BRAND_NAME_EN,
        m.PRODUCT_SUBBRAND_CODE = m.PRODUCT_SUBBRAND_CODE,
        m.PRODUCT_SUBBRAND_NAME_TH = m.PRODUCT_SUBBRAND_NAME_TH,
        m.PRODUCT_SUBBRAND_NAME_EN = m.PRODUCT_SUBBRAND_NAME_EN,
        m.PRODUCT_MODEL_CODE = m.PRODUCT_MODEL_CODE,
        m.PRODUCT_MODEL_NAME_TH = m.PRODUCT_MODEL_NAME_TH,
        m.PRODUCT_MODEL_NAME_EN = m.PRODUCT_MODEL_NAME_EN,
        m.IS_TAX_VALUE = m.IS_TAX_VALUE,
        m.TAX_VALUE = m.TAX_VALUE,
        m.IS_TAX_VOLUMN = m.IS_TAX_VOLUMN,
        m.TAX_VOLUMN = m.TAX_VOLUMN,
        m.TAX_VOLUMN_UNIT = m.TAX_VOLUMN_UNIT,
        m.LICENSE_PLATE = m.LICENSE_PLATE,
        m.ENGINE_NO = m.ENGINE_NO,
        m.CHASSIS_NO = m.CHASSIS_NO,
        m.PRODUCT_DESC = m.PRODUCT_DESC,
        m.SUGAR = m.SUGAR,
        m.CO2 = m.CO2,
        m.DEGREE = m.DEGREE,
        m.PRICE = m.PRICE,
        m.SIZES = m.SIZES,
        m.SIZES_UNIT = m.SIZES_UNIT,
        m.QUANTITY = m.QUANTITY,
        m.QUANTITY_UNIT = m.QUANTITY_UNIT,
        m.VOLUMN = m.VOLUMN,
        m.VOLUMN_UNIT = m.VOLUMN_UNIT,
        m.REMARK = m.REMARK,
        m.IS_DOMESTIC = m.IS_DOMESTIC,
        m.IS_ILLEGAL = m.IS_ILLEGAL,
        m.IS_ACTIVE = m.IS_ACTIVE,
        m.PRODUCT_DESC = m.PRODUCT_DESC,
        m.IsNewItem = true
      this._investProduct.push(this.fb.group(m));
      console.log('m : ', m)
    })
    // let addProd = {
    //   PRODUCT_ID: '',
    //   NOTICE_ID: this.NOTICE_ID,
    //   PRODUCT_MAPPING_ID: product_select.PRODUCT_MAPPING_ID,
    //   PRODUCT_CODE: product_select.PRODUCT_CODE,
    //   PRODUCT_REF_CODE: product_select.PRODUCT_REF_CODE,
    //   PRODUCT_GROUP_ID: product_select.PRODUCT_GROUP_ID,
    //   PRODUCT_CATEGORY_ID: product_select.PRODUCT_CATEGORY_ID,
    //   PRODUCT_TYPE_ID: product_select.PRODUCT_TYPE_ID,
    //   PRODUCT_SUBTYPE_ID: product_select.PRODUCT_SUBTYPE_ID,
    //   PRODUCT_SUBSETTYPE_ID: product_select.PRODUCT_SUBSETTYPE_ID,
    //   PRODUCT_BRAND_ID: product_select.PRODUCT_BRAND_ID,
    //   PRODUCT_SUBBRAND_ID: product_select.PRODUCT_SUBBRAND_ID,
    //   PRODUCT_MODEL_ID: product_select.PRODUCT_MODEL_ID,
    //   PRODUCT_TAXDETAIL_ID: product_select.PRODUCT_TAXDETAIL_ID,
    //   SIZES_UNIT_ID: product_select.SIZES_UNIT_ID,
    //   QUATITY_UNIT_ID: product_select.QUATITY_UNIT_ID,
    //   VOLUMN_UNIT_ID: product_select.VOLUMN_UNIT_ID,
    //   PRODUCT_GROUP_CODE: product_select.PRODUCT_GROUP_CODE,
    //   PRODUCT_GROUP_NAME: product_select.PRODUCT_GROUP_NAME,
    //   PRODUCT_CATEGORY_CODE: product_select.PRODUCT_CATEGORY_CODE,
    //   PRODUCT_CATEGORY_NAME: product_select.PRODUCT_CATEGORY_NAME,
    //   PRODUCT_TYPE_CODE: product_select.PRODUCT_TYPE_CODE,
    //   PRODUCT_TYPE_NAME: product_select.PRODUCT_TYPE_NAME,
    //   PRODUCT_SUBTYPE_CODE: product_select.PRODUCT_SUBTYPE_CODE,
    //   PRODUCT_SUBTYPE_NAME: product_select.PRODUCT_SUBTYPE_NAME,
    //   PRODUCT_SUBSETTYPE_CODE: product_select.PRODUCT_SUBSETTYPE_CODE,
    //   PRODUCT_SUBSETTYPE_NAME: product_select.PRODUCT_SUBSETTYPE_NAME,
    //   PRODUCT_BRAND_CODE: product_select.PRODUCT_BRAND_CODE,
    //   PRODUCT_BRAND_NAME_TH: product_select.PRODUCT_BRAND_NAME_TH,
    //   PRODUCT_BRAND_NAME_EN: product_select.PRODUCT_BRAND_NAME_EN,
    //   PRODUCT_SUBBRAND_CODE: product_select.PRODUCT_SUBBRAND_CODE,
    //   PRODUCT_SUBBRAND_NAME_TH: product_select.PRODUCT_SUBBRAND_NAME_TH,
    //   PRODUCT_SUBBRAND_NAME_EN: product_select.PRODUCT_SUBBRAND_NAME_EN,
    //   PRODUCT_MODEL_CODE: product_select.PRODUCT_MODEL_CODE,
    //   PRODUCT_MODEL_NAME_TH: product_select.PRODUCT_MODEL_NAME_TH,
    //   PRODUCT_MODEL_NAME_EN: product_select.PRODUCT_MODEL_NAME_EN,
    //   IS_TAX_VALUE: product_select.IS_TAX_VALUE,
    //   TAX_VALUE: product_select.TAX_VALUE,
    //   IS_TAX_VOLUMN: product_select.IS_TAX_VOLUMN,
    //   TAX_VOLUMN: product_select.TAX_VOLUMN,
    //   TAX_VOLUMN_UNIT: product_select.TAX_VOLUMN_UNIT,
    //   LICENSE_PLATE: product_select.LICENSE_PLATE,
    //   ENGINE_NO: product_select.ENGINE_NO,
    //   CHASSIS_NO: product_select.CHASSIS_NO,
    //   PRODUCT_DESC: product_select.PRODUCT_DESC,
    //   SUGAR: product_select.SUGAR,
    //   CO2: product_select.CO2,
    //   DEGREE: product_select.DEGREE,
    //   PRICE: product_select.PRICE,
    //   SIZES: product_select.SIZES,
    //   SIZES_UNIT: product_select.SIZES_UNIT,
    //   QUANTITY: product_select.QUANTITY,
    //   QUANTITY_UNIT: product_select.QUANTITY_UNIT,
    //   VOLUMN: product_select.VOLUMN,
    //   VOLUMN_UNIT: product_select.VOLUMN_UNIT,
    //   REMARK: product_select.REMARK,
    //   IS_DOMESTIC: product_select.IS_DOMESTIC,
    //   IS_ILLEGAL: product_select.IS_ILLEGAL,
    //   IS_ACTIVE: product_select.IS_ACTIVE,
    //   IsNewItem: true
    // }

    // this._NoticeProduct.push(this.fb.group(addProd));

    console.log('addProduct this._noticeForm : ', this._investForm)
    this.dismiss('Cross click');
  }



  async pageChanges(event) {
    this.PRODUCT_FROMSEARCH_OPTION = await this.PRODUCT_FROMSEARCH.slice(event.startIndex - 1, event.endIndex);
    this.setItemFormArray(this.PRODUCT_FROMSEARCH_OPTION, 'PRODUCT_DETAIL');
  }

  dismiss(e: any) {
    this.d.emit(e);
  }

  close(e: any) {
    this.c.emit(e);
  }

}

