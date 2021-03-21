import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Mode } from 'app/pages/arrests/entities/mode';
import { PreloaderService } from 'app/shared/preloader/preloader.component';
import { forkJoin, from, merge, Observable, Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { MasUnitService } from '../masUnit.service';
import { UnitMappingControl } from '../unitModels/UnitMapping';
import { ManageConfig } from './manage.config';
import { Message } from '../../../../config/message';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ManageComponent extends ManageConfig implements OnInit {

  private sub: Subscription

  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private preloader: PreloaderService,
    private masUnitService: MasUnitService,
    private router: Router) {
    super();
    this.createForm();
  }

  async ngOnInit() {
    await this.getProductGroup();
    await this.active_Route();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  createForm() {
    this.unitForm = this.fb.group({
      UNIT_ID: new FormControl(""),
      UNIT_CODE: new FormControl(""),
      UNIT_NAME_TH: new FormControl(""),
      UNIT_NAME_EN: new FormControl(""),
      UNIT_SHORT_NAME: new FormControl(""),
      CREATE_USER_ACCOUNT_ID: new FormControl(""),
      MasProductUnitMapping: this.fb.array([])
    });
  }

  private active_Route() {
    this.sub = this.activeRoute.params.subscribe(p => {
      this.mode = p['mode'];

      switch (this.mode) {
        case this.Mode.C:
          // set false
          this.PrintButton.next(false);
          this.EditButton.next(false);
          this.DeleteButton.next(false);
          this.showEditField = false;
          // set true
          this.SaveButton.next(true);
          this.CancelButton.next(true);
          break;

        case this.Mode.R:
          // set false
          this.SaveButton.next(false);
          this.CancelButton.next(false);
          this.PrintButton.next(false);

          // set true  
          this.EditButton.next(true);
          this.DeleteButton.next(true);
          this.showEditField = true;

          if (p['code']) {
            this.UNIT_ID = p['code'];
            this.getUnitByCon(p['code']);
          }
          break;
      }
    });
  }

  OnSave() {
    /** Req Unit */
    const u = this.unitForm.getRawValue();
    const uNameTh = u['UNIT_NAME_TH'];
    if (!uNameTh) {
      swal({
        text: `กรุณาระบุข้อมูล "ชื่อหน่วยนับภาษาไทย"`,
        type: 'warning',
        confirmButtonText: 'ตกลง'
      })
      return false;
    }

    /** Req Unit mapping */
    const uMap: any = u['MasProductUnitMapping'];
    if (!uMap.length) {
      swal({
        text: `กรุณาเพิ่มหมวดสินค้า`,
        type: 'warning',
        confirmButtonText: 'ตกลง'
      })
      return false;
    }

    if (uMap.length) {
      const group_null: boolean = uMap.every(e => e.PRODUCT_GROUP_CODE != "" || null);
      if (!group_null) {
        this.isReq_ProdGroup.next(!group_null);
        swal({
          text: `กรุณาระบุข้อมูล "หมวดสินค้า"`,
          type: 'warning',
          confirmButtonText: 'ตกลง'
        })
        return false;
      }

      const useFor_null: boolean = uMap.every(e => e.USED_FOR != "" || null);
      if (!useFor_null) {
        this.isReq_UsedType.next(!useFor_null);
        swal({
          text: `กรุณาระบุข้อมูล "ประเภทหน่วยนับ"`,
          type: 'warning',
          confirmButtonText: 'ตกลง'
        })
        return false;
      }
    }

    let response = new Observable<any>();
    switch (this.mode) {
      case Mode.C:
        response = this.OnInsertUnit(u);
        break;
      case Mode.R:
        response = this.OnUpdateUnit(u);
        break;
    }

    this.notifyResponse(response, this.mode);
  }

  OnDeleteUnit() {
    this.swalFnMulti('', Message.confirmAction, 'warning')
      .then((result) => {
        if (result.value) {
          let response = new Observable<any>();

          response = this.masUnitService.MasProductUnitupdDelete({ UNIT_ID: this.UNIT_ID });

          this.notifyResponse(response, Mode.D);
        }
      });
  }

  OnInsertUnit(unitForm: any): Observable<any> {
    console.log("onInsertUnit unitForm : ", unitForm);
    this.preloader.setShowPreloader(true);
    let request = new Observable<any>();

    return request = this.masUnitService.MasProductUnitinsAll(unitForm).pipe(
      mergeMap(x => {
        this.UNIT_ID = x['UNIT_ID'];
        return merge(
          Observable.of(x),
          this.productUnitMappingModify(x['UNIT_ID'], unitForm)
        );
      })
    ).finally(() => this.preloader.setShowPreloader(false));
  }

  OnUpdateUnit(unitForm: any): Observable<any> {
    console.log("onUpdateUnit unitForm : ", unitForm);
    this.preloader.setShowPreloader(true);
    let request = new Observable<any>();

    return request = this.masUnitService.MasProductUnitupdAll(unitForm).pipe(
      mergeMap(x => {
        return merge(
          Observable.of(x),
          this.productUnitMappingModify(this.UNIT_ID, unitForm)
        );
      })
    ).finally(() => this.preloader.setShowPreloader(false));
  }

  productUnitMappingModify(UNIT_ID: string, unitForm: any): Observable<any> {
    const uMap = this.MasProductUnitMapping.getRawValue()

    const ins = uMap.filter(f => f.IsNewItem == true)
      .reduce((accu, curr) => [...accu, {
        ...curr, UNIT_CODE: UNIT_ID,
        UNIT_NAME_TH: unitForm.UNIT_NAME_TH,
        UNIT_NAME_EN: unitForm.UNIT_NAME_EN,
        UNIT_SHORT_NAME: unitForm.UNIT_SHORT_NAME
      }], []);
    const upd = uMap.filter(f => f.IsNewItem == false);
    const del = this.unitDel;

    const ins$ = () => this.masUnitService.MasProductUnitMappinginsAll(ins);
    const upd$ = () => this.masUnitService.MasProductUnitMappingupdAll(upd);
    const del$ = () => this.masUnitService.MasProductUnitMappingupdDelete(del);

    return merge(
      ins.length > 0 ? ins$() : Observable.of(),
      upd.length > 0 ? upd$() : Observable.of(),
      del.length > 0 ? del$() : Observable.of()
    )
  }

  notifyResponse(res: Observable<any>, mode: any) {
    let result = [];
    let zip$ = new Observable<any>();

    zip$ = Observable.zip(res)
      .pipe(map(x => { return result = [...result, ...x]; }))

    forkJoin(zip$)
      .subscribe(x => {
        const objRes: any[] = x[0];
        if (objRes.filter(o => o['IsSuccess'] == 'False').length) {
          swal({
            title: '',
            text: Message.saveFail,
            type: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง'
          })
        } else {
          swal({
            title: '',
            text: Message.saveComplete,
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง'
          }).then((r) => {
            if (r) {
              switch (mode) {
                case Mode.C:
                case Mode.R:
                  this.router.navigateByUrl('/msUnit/manage/R/' + this.UNIT_ID);
                  setTimeout(() => {
                    location.reload();
                  }, 300);
                  break;
                case Mode.D:
                  this.router.navigateByUrl('/msUnit/list');
                  break;
              }
            }
          })
        }
      }), () => {
        swal({
          title: '',
          text: Message.saveFail,
          type: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'ตกลง'
        })
      }
  }

  OnEdit() {
    this.showEditField = false;
    this.SaveButton.next(true);
    this.CancelButton.next(true);

    this.EditButton.next(false);
    this.DeleteButton.next(false);
    this.DuplicateUnit();
  }

  getUnitByCon(unitID: string): void {
    this.masUnitService.MasProductUnitgetByConformas(unitID).subscribe(
      (res) => {
        console.log('res : ', res);
        if (res) {

          for (let key in res) {
            if (res[key] === "null")
              res[key] = null;
          }

          this.unitForm.patchValue({
            UNIT_CODE: res.UNIT_CODE,
            UNIT_ID: res.UNIT_ID,
            UNIT_NAME_EN: res.UNIT_NAME_EN,
            UNIT_NAME_TH: res.UNIT_NAME_TH,
            UNIT_SHORT_NAME: res.UNIT_SHORT_NAME,
            MasProductUnitMapping: res.MasProductUnitMapping
          });

          this.setItemFormArray(res.MasProductUnitMapping, 'MasProductUnitMapping');
          this.DuplicateUnit();
        } else {
          swal('', 'ไม่พบข้อมูล', 'warning')
        }

      }, (error) => { console.error(error); return false; });
  }

  AddUnit() {
    const prod = { ...UnitMappingControl, IsNewItem: true, PRODUCT_GROUP_CODE: "", USED_FOR: "" };

    const newObj = [...this.MasProductUnitMapping.value, prod];

    this.setItemFormArray(newObj, 'MasProductUnitMapping');

    this.DuplicateUnit();

    console.log('this.MasProductUnitMapping : ', this.MasProductUnitMapping.getRawValue());

  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.unitForm.setControl(formControl, itemFormArray);
    }
  }

  getProductGroup() {
    var paramsOther = {
      PRODUCT_GROUP_ID: "",
      PRODUCT_GROUP_CODE: ""
    }

    this.masUnitService.MasProductGroupgetByCon(paramsOther).subscribe(
      (list) => {
        this.ProductGroup = list;
        if (this.ProductGroup.length) {
          this.ProductGroup = this.ProductGroup.reduce((a, c) =>
            [...a, { ...c, IS_DISABLED: false }], [])
            .filter(f => f.PRODUCT_GROUP_ID != 88); //ตัดหมวด "ของอื่นๆจากระบบคดี" ออก
        }
      }, (error) => { console.error(error); return false; });
  }


  public DuplicateUnit() {
    const PROD = this.MasProductUnitMapping.getRawValue();

    this.ProductGroup.map(m => {
      const isSet =
        this.setProductGroupCode(PROD)
          .filter(f => m.PRODUCT_GROUP_CODE == f.PRODUCT_GROUP_CODE)
          .length;

      if (isSet)
        m.IS_DISABLED = true;
      else
        m.IS_DISABLED = false;
    });
  }

  public setProductGroupCode(PROD: any[]) {
    let PRODUCT_GROUP_CODE: any[] = [];
    PRODUCT_GROUP_CODE = PROD.reduce((a, c) =>
      [...a, { PRODUCT_GROUP_CODE: c.PRODUCT_GROUP_CODE }], [])
      .filter(f => f.PRODUCT_GROUP_CODE != '');
    return PRODUCT_GROUP_CODE;
  }

  public onDeleteUnitMapping(UNIT_MAPPING_ID: any, index: number) {
    this.swalFnMulti('', Message.confirmAction, 'warning').then((o) => {
      if (o.value) {
        if (this.mode === Mode.C)
          this.MasProductUnitMapping.removeAt(index);
        else if (this.mode === Mode.R) {
          if (this.MasProductUnitMapping.at(index).value.IsNewItem) {
            this.MasProductUnitMapping.removeAt(index);
            return;
          }
          this.unitDel.push({ UNIT_MAPPING_ID: UNIT_MAPPING_ID });
          this.MasProductUnitMapping.removeAt(index);
        }
      }
    });
  }

}
