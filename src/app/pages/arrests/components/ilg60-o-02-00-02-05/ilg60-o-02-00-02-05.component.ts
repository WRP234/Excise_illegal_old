import { Component, OnInit, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';
import { Ilg60O02000205Config } from './ilg60-o-02-00-02-05.config';
import { MasterService } from '../../services';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  IMasProductMapping,
  ProductSRP,
  ArrestProduct,
  SearchByKeyword,
  IMasProductGroup,
  IMasProductCategoryRDB,
  IMasProductCategoryGroup,
  IMasProductGROUPCategoryForLiquor,
} from '../../models';
import { Message } from 'app/config/message';
import { Observable, forkJoin, merge, combineLatest } from 'rxjs';
import { LoaderService } from 'app/core/loader/loader.service';
import { mergeMap, map, catchError, mapTo, finalize } from 'rxjs/operators';


@Component({
  selector: 'app-ilg60-o-02-00-02-05',
  templateUrl: './ilg60-o-02-00-02-05.component.html',
  styleUrls: ['./ilg60-o-02-00-02-05.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg60O02000205Component extends Ilg60O02000205Config implements OnInit, OnDestroy, AfterViewInit {
  
  ngAfterViewInit(): void {

    this.loaderService.showLoader();

    combineLatest(this.s_MasMaster.DutyGroup(), this.s_MasMaster.MasProductGroupgetByCon())
      .pipe(finalize(() => this.loaderService.onEnd()))
      .subscribe(x => {
        this.ProductGroup = this.tranFormDutyGroup(x[0]);
        this.ProductGroup_illg_sys = x[1];
        this.ProductGroup = this.ProductGroup.concat(this.PRODUCT_GROUP_OTHER);
        // this.ProductGroup.splice(this.ProductGroup.findIndex(x => x.PRODUCT_GROUP_ID == 7000), 1) //ลบบาง index
      });
  }

  tranFormDutyGroup(o) {
    const result = o.reduce((a, c) =>
      [...a, {
        PRODUCT_GROUP_ID: c.GROUP_ID,
        PRODUCT_GROUP_CODE: null,
        PRODUCT_GROUP_NAME: c.GROUP_NAME,
        IS_ACTIVE: 1,
        CREATE_DATE: null,
        CREATE_USER_ACCOUNT_ID: null,
        UPDATE_DATE: c.UPD_DATE,
        UPDATE_USER_ACCOUNT_ID: c.UPD_USERID,
        GROUP_STATUS: c.GROUP_STATUS
      }], []).filter(f => f.GROUP_STATUS == 'N');
    return result;
  }

  ngOnDestroy(): void {
    this.paginage.TotalItems = 0;
  }

  public checkedAll: boolean;

  public ProductGROUPCategoryForLiquor: IMasProductGROUPCategoryForLiquor[];
  public ProductGroupCategory: IMasProductCategoryGroup[];
  public ProductCategory: IMasProductCategoryRDB[];
  public ProductGroup: IMasProductGroup[];
  public ProductGroup_illg_sys: IMasProductGroup[];

  constructor(
    private s_MasMaster: MasterService,
    private fb: FormBuilder,
    private loaderService: LoaderService
  ) {
    super();
  }

  ngOnInit() {

    this.formGroupProductAdded = this.fb.group({
      ArrestProduct: this.fb.array([])
    })
    this.formGroup = this.fb.group({
      ProductMapping: this.fb.array([])
    });
    // this.onSearchComplete(IMasProductMappingMock);
  }

  // loadProductCategory(PC: string, CATEGORY_GROUP: string) {
  //   this.loaderService.showLoader();
  //   let PRODUCT_CODE = this.rightPad(PC, 8, '0');
  //   this.s_MasMaster.MasProductCategoryRDBgetByCon({ PRODUCT_CODE, CATEGORY_GROUP })
  //     .pipe(finalize(() => this.loaderService.onEnd()))
  //     .subscribe(x => {
  //       this.ProductCategory = x.filter(o => o.IS_ACTIVE == 1)
  //     });
  // }

  public onSearchByKey(form: SearchByKeyword) {

    this.loaderService.showLoader();
    this.s_MasMaster.MasProductMappinggetByKeyword(form)
      .pipe(
        map((m) => m.reduce((a, c) => [...a, { ...c, EFFECTIVE_DATE: null, COMPANY: null, IS_SYSTEM: 0 }], [])),
        finalize(() => this.loaderService.onEnd()))
      .finally(() => this.setDefualtInputSearch(1))
      .subscribe(x => this.onSearchComplete(x));
  }

  public onAdvSearch(form: any) {

    let f = Object.assign({}, form);
    f = { ...f, IS_ACTIVE: 1 };
    this.loaderService.showLoader();

    const PRODUCT_GROUP_ID_FREEZE$ = f.PRODUCT_GROUP_ID;

    const FILTER_PRODUCT_GROUP_ID_FN = (p, f_PRODUCT_GROUP_ID): boolean => {
      if (p.PRODUCT_GROUP_CODE_OLD1 == f_PRODUCT_GROUP_ID) return true;
      else if (p.PRODUCT_GROUP_CODE_OLD2 == f_PRODUCT_GROUP_ID) return true;
      else return false;
    }

    const PRODUCT_GROUP = this.ProductGroup_illg_sys.find(p => FILTER_PRODUCT_GROUP_ID_FN(p, f.PRODUCT_GROUP_ID));

    const PRODUCT_GROUP_CODE$ = PRODUCT_GROUP ? PRODUCT_GROUP.PRODUCT_GROUP_CODE : '9999999999';

    f.PRODUCT_GROUP_ID = PRODUCT_GROUP_CODE$;

    let result = [];
    let zip$ = new Observable<any>();
    let response = new Observable<any>();
    response = this.s_MasMaster.MasProductMappinggetByConAdv(f)
      .pipe(
        mergeMap((x) => {

          x = x.reduce((a, c) => [...a, { ...c, EFFECTIVE_DATE: null, COMPANY: null, IS_SYSTEM: 0 }], []);

          return merge(
            Observable.of(x),
            this.s_MasMaster.SRP(PRODUCT_GROUP_ID_FREEZE$, f.PRODUCT_NAME_DESC,
              this.getEffectiveDate(this.OCCURRENCE_DATE.date))
          )
        }), finalize(() => {
          this.loaderService.onEnd(),
            this.setDefualtInputSearch(0)
        }))

    zip$ = Observable.zip(response)
      .pipe(map(x => { return result = [...result, ...x]; }))

    forkJoin(zip$)
      .subscribe(x => this.onSearchComplete(this.concatMasAndSRP(x[0])))
  }

  public concatMasAndSRP(res): any[] {
    return res[0].concat(this.setToMasProd_Model(res[1].ProductList));
  }

  public setToMasProd_Model(res$: any) {
    if (!res$) return [];
    else return this.mapProductSRP(res$);
  }

  public mapProductSRP(obj: ProductSRP[]) {
    return obj.map((o: any) => {
      return o['ProductInfo'].reduce((a, c) => {
        return {
          PRODUCT_ID: null,
          ARREST_ID: null,
          PRODUCT_MAPPING_ID: 0,// this.EndcodeToNumber(c.ExciseProductCode),
          PRODUCT_CODE: c.ProductCode,
          PRODUCT_REF_CODE: c.ExciseProductCode,
          PRODUCT_GROUP_ID: c.ProductCode ? c.ProductCode.slice(0, 2) : null,
          PRODUCT_CATEGORY_ID: null,
          PRODUCT_TYPE_ID: null,
          PRODUCT_SUBTYPE_ID: null,
          PRODUCT_SUBSETTYPE_ID: null,
          PRODUCT_BRAND_ID: null,
          PRODUCT_SUBBRAND_ID: null,
          PRODUCT_MODEL_ID: null,
          PRODUCT_TAXDETAIL_ID: null,
          SIZES_UNIT_ID: null,
          QUATITY_UNIT_ID: null,
          VOLUMN_UNIT_ID: null,
          PRODUCT_GROUP_CODE: c.ProductGroupCode,
          PRODUCT_GROUP_NAME: c.ProductGroupName,
          PRODUCT_CATEGORY_CODE: c.ProductCategoryCode,
          PRODUCT_CATEGORY_NAME: c.ProductCategoryName,
          PRODUCT_TYPE_CODE: null,
          PRODUCT_TYPE_NAME: null,
          PRODUCT_SUBTYPE_CODE: null,
          PRODUCT_SUBTYPE_NAME: null,
          PRODUCT_SUBSETTYPE_CODE: null,
          PRODUCT_SUBSETTYPE_NAME: null,
          PRODUCT_BRAND_CODE: c.BrandMainCode,
          PRODUCT_BRAND_NAME_TH: c.BrandMainTha,
          PRODUCT_BRAND_NAME_EN: c.BrandMainEng,
          PRODUCT_SUBBRAND_CODE: c.BrandSecondCode,
          PRODUCT_SUBBRAND_NAME_TH: c.BrandSecondNameTha,
          PRODUCT_SUBBRAND_NAME_EN: c.BrandSecondNameEng,
          PRODUCT_MODEL_CODE: null,
          PRODUCT_MODEL_NAME_TH: null,
          PRODUCT_MODEL_NAME_EN: null,
          PRODUCT_NAME_DESC: c.ProductName,
          IS_TAX_VALUE: null,
          IS_TAX_VOLUMN: null,
          TAX_VALUE: null,
          TAX_VOLUMN: null,
          TAX_VOLUMN_UNIT: null,
          LICENSE_PLATE: null,
          ENGINE_NO: null,
          CHASSIS_NO: null,
          PRODUCT_DESC: c.ProductName,
          SUGAR: c.SugarQuantity || '',
          CO2: c.Co2Quantity || '',
          DEGREE: c.Degree || '',
          PRICE: c.RetailPrice,
          SIZES: c.SizeDesc,
          SIZES_UNIT: c.SizeUnit,
          QUANTITY: null,
          QUANTITY_UNIT: c.UnitName,
          VOLUMN: null,
          VOLUMN_UNIT: c.SizeUnit,
          REMARK: null,
          IS_DOMESTIC: c.TypeSellCode,
          IS_ILLEGAL: null,
          IS_ACTIVE: 1,
          PRODUCT_NAME: c.ProductName,
          CATEGORY_CODE: null,
          EFFECTIVE_DATE:
            c.EffectiveDate
              ? this.setDateStruct(new Date(this.setFormDateStr(c.EffectiveDate)))
              : '',
          COMPANY: c.CompanyName,
          IS_SYSTEM: 1,
          ArrestProductMapping: []
        }
      }, {});
    });
  }

  public setFormDateStr = (d: any) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;

  public getEffectiveDate = (d) => `${d.year}${this.setZero(d.month)}${this.setZero(d.day)}`;

  public getIsSystem = (IS_SYSTEM) => this.IS_SYSTEM.find(f => f.VALUE == IS_SYSTEM).SYSTEM;

  private onSearchComplete(list: IMasProductMapping[]) {

    if (!list.length) {
      this.swalFn('', Message.noRecord, 'warning');
      this.formGroup = this.fb.group({
        ProductMapping: this.fb.array([])
      });
    }
    this.dataList = list.map((x, i) => {
      let PRODUCT_NAME = "";

      let productBrand = x.PRODUCT_BRAND_NAME_TH ? x.PRODUCT_BRAND_NAME_TH : x.PRODUCT_BRAND_NAME_EN;
      let productSubBrand = x.PRODUCT_SUBBRAND_NAME_TH ? x.PRODUCT_SUBBRAND_NAME_TH : x.PRODUCT_SUBBRAND_NAME_EN;
      productBrand = `${productBrand ? productBrand : ""} ${productSubBrand ? productSubBrand : ""}`;
      let productModel = x.PRODUCT_MODEL_NAME_TH ? `รุ่น ${x.PRODUCT_MODEL_NAME_TH}` : "";

      if (x.CATEGORY_CODE == "13") {
        PRODUCT_NAME = `${x.PRODUCT_GROUP_NAME} 
        ${x.PRODUCT_CATEGORY_NAME ? "ชนิด" + x.PRODUCT_CATEGORY_NAME : ""} 
        ${productBrand ? "ยี่ห้อ" + productBrand + productModel : ""} 
        ขนาด ${x.SIZES} ${x.SIZES_UNIT}`;

      } else {

        PRODUCT_NAME = `${x.PRODUCT_CATEGORY_NAME ? x.PRODUCT_CATEGORY_NAME : ""} 
         ${x.PRODUCT_TYPE_NAME ? "ชนิด" + x.PRODUCT_TYPE_NAME : ""} 
         ${productBrand ? "ยี่ห้อ" + productBrand + productModel : ""} 
         ขนาด ${x.SIZES} ${x.SIZES_UNIT}`;
      }

      return Object.assign(x, { IS_CHECKED: false, ROW_ID: i + 1, PRODUCT_NAME });
    });

    const __list = this.dataList.slice(0, 5);
    this.setItemFormArray(__list, this.formGroup, 'ProductMapping');
    this.paginage.TotalItems = list.length;
  }

  // searchMasProductGroup = this.s_MasMaster.searchMasProductGroup;

  // searchMasProductCategory = this.s_MasMaster.searchMasProductCategory;

  // searchMasProductType = this.s_MasMaster.searchMasProductType;

  // searchMasProductBrand = this.s_MasMaster.searchMasProductBrand;

  // searchMasProductSubBrand = this.s_MasMaster.searchMasProductSubBrand;

  // searchMasProductModel = this.s_MasMaster.searchMasProductModel;

  public onChangeQuantity(index: number, value: number) {
    let p = this.ArrestProduct.at(index);
    p.get('VOLUMN').patchValue(parseInt(this.removeComma(value)) * p.get('SIZES').value)
  }

  onDeleteProduct(index: number) {
    this.ArrestProduct.removeAt(index);
  }

  public checkAll(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    for (let index = 0; index < this.ProductMapping.value.length; index++) {
      this.ProductMapping.at(index).get('IS_CHECKED').patchValue(checkbox.checked);
    }

    if (checkbox.checked) {
      const productMapping = this.mapProduct(this.ProductMapping.value);
      let list = [...this.ArrestProduct.value, ...productMapping];
      this.selectedEntry = true;
      this.setItemFormArray(list, this.formGroupProductAdded, 'ArrestProduct');
    } else {
      while (this.ArrestProduct.length) this.ArrestProduct.removeAt(0);
      this.selectedEntry = false;
    }
  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }

  async pageChanges(event: any) {
    const list = await this.dataList.slice(event.startIndex - 1, event.endIndex);
    this.setItemFormArray(list, this.formGroup, 'ProductMapping');
  }

  public onSelect(e: Event, item: any) {
    const checkbox = e.target as HTMLInputElement;
    if (checkbox.checked) {
      const newObj = [item];
      const proudctObj = this.mapProduct(newObj);
      const list = ([...this.ArrestProduct.value, ...proudctObj]);
      this.setItemFormArray(list, this.formGroupProductAdded, 'ArrestProduct');
    } else {
      this.checkedAll = false;
      const index = this.ArrestProduct.value.findIndex(x => x['PRODUCT_CODE'] == item['PRODUCT_CODE']);
      this.ArrestProduct.removeAt(index);
    }

    const prodMapping = this.ArrestProduct.length
    if (prodMapping) this.selectedEntry = true;
    else this.selectedEntry = false;
  }

  private mapProduct(obj: IMasProductMapping[]) {
    return obj.map((x: IMasProductMapping) => {
      const product: ArrestProduct = {
        PRODUCT_ID: null,
        ARREST_ID: null,
        PRODUCT_MAPPING_ID: x.PRODUCT_MAPPING_ID,
        PRODUCT_CODE: x.PRODUCT_CODE,
        PRODUCT_REF_CODE: x.PRODUCT_REF_CODE,
        PRODUCT_GROUP_ID: x.PRODUCT_GROUP_ID,
        PRODUCT_CATEGORY_ID: x.PRODUCT_CATEGORY_ID,
        PRODUCT_TYPE_ID: x.PRODUCT_TYPE_ID,
        PRODUCT_SUBTYPE_ID: x.PRODUCT_SUBTYPE_ID,
        PRODUCT_SUBSETTYPE_ID: x.PRODUCT_SUBTYPE_ID,
        PRODUCT_BRAND_ID: x.PRODUCT_BRAND_ID,
        PRODUCT_SUBBRAND_ID: x.PRODUCT_SUBBRAND_ID,
        PRODUCT_MODEL_ID: x.PRODUCT_MODEL_ID,
        PRODUCT_TAXDETAIL_ID: x.PRODUCT_TAXDETAIL_ID,
        SIZES_UNIT_ID: null,
        QUATITY_UNIT_ID: null,
        VOLUMN_UNIT_ID: null,
        PRODUCT_GROUP_CODE: null,
        PRODUCT_GROUP_NAME: x.PRODUCT_GROUP_NAME,
        PRODUCT_CATEGORY_CODE: null,
        PRODUCT_CATEGORY_NAME: x.PRODUCT_CATEGORY_NAME,
        PRODUCT_TYPE_CODE: null,
        PRODUCT_TYPE_NAME: x.PRODUCT_TYPE_NAME,
        PRODUCT_SUBTYPE_CODE: null,
        PRODUCT_SUBTYPE_NAME: x.PRODUCT_SUBTYPE_NAME,
        PRODUCT_SUBSETTYPE_CODE: null,
        PRODUCT_SUBSETTYPE_NAME: x.PRODUCT_SUBTYPE_NAME,
        PRODUCT_BRAND_CODE: null,
        PRODUCT_BRAND_NAME_TH: x.PRODUCT_BRAND_NAME_TH,
        PRODUCT_BRAND_NAME_EN: x.PRODUCT_BRAND_NAME_EN,
        PRODUCT_SUBBRAND_CODE: null,
        PRODUCT_SUBBRAND_NAME_TH: x.PRODUCT_SUBBRAND_NAME_TH,
        PRODUCT_SUBBRAND_NAME_EN: x.PRODUCT_SUBBRAND_NAME_EN,
        PRODUCT_MODEL_CODE: null,
        PRODUCT_MODEL_NAME_TH: x.PRODUCT_MODEL_NAME_TH,
        PRODUCT_MODEL_NAME_EN: x.PRODUCT_MODEL_NAME_EN,
        PRODUCT_NAME_DESC: x.PRODUCT_NAME_DESC,
        IS_TAX_VALUE: x.TAX_VALUE ? 1 : 0, /////////// รอแก้ api
        IS_TAX_VOLUMN: x.TAX_VOLUMN ? 1 : 0, /////////// รอแก้ api
        TAX_VALUE: x.TAX_VALUE,
        TAX_VOLUMN: x.TAX_VOLUMN,
        TAX_VOLUMN_UNIT: x.TAX_VOLUMN_UNIT,
        LICENSE_PLATE: null,
        ENGINE_NO: null,
        CHASSIS_NO: null,
        PRODUCT_DESC: x.PRODUCT_NAME_DESC,
        SUGAR: x.SUGAR || '',
        CO2: x.CO2 || '',
        DEGREE: x.DEGREE || '',
        PRICE: x.PRICE,
        SIZES: x.SIZES,
        SIZES_UNIT: x.SIZES_UNIT,
        QUANTITY: null,
        QUANTITY_UNIT: x.QUANTITY_UNIT,
        VOLUMN: null,
        VOLUMN_UNIT: x.SIZES_UNIT,
        REMARK: x.REMARK,
        IS_DOMESTIC: x.IS_DOMESTIC,
        IS_ILLEGAL: null,
        IS_ACTIVE: x.IS_ACTIVE,
        ArrestProductMapping: [],
        PRODUCT_NAME: x.PRODUCT_NAME,
        CATEGORY_CODE: x.CATEGORY_CODE,
        COMPANY: x.COMPANY,
        EFFECTIVE_DATE: x.EFFECTIVE_DATE,
        IS_SYSTEM: x.IS_SYSTEM,
        IS_USING: 0
      }
      return product
    });
  }

  addProduct(e: string) {
    this.Output.emit(this.ArrestProduct.value);
    this.c.emit(e);
  }

  EndcodeToNumber(value): number {
    const l = value.length;
    let patt = /^([0-9])$/;
    let res: string = '';

    for (let i = 0; i <= l - 1; i++) {

      if (!patt.test(value.charAt(i)))
        res += value.charCodeAt(i).toString();
      else
        res += value.charAt(i).toString();
    }
    return Number(res);
  }

  setDefualtInputSearch(type: number) {
    switch (type) {
      case 0:
        this.TEMP_TEXT_SEARCH = '';
        break;
      case 1:
        this.TEMP_PRODUCT_GROUP_ID = '';
        this.TEMP_PRODUCT_NAME_DESC = '';
        break;
      default:
        break;
    }
  }

}
