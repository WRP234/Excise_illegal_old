import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ViewEncapsulation, } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { setDateMyDatepicker, setZero } from '../../../../config/dateFormat';
import { ManageConfig } from './manage.config';
import swal from 'sweetalert2';
import { MasterService } from '../../services/master.service';
import { IMyDateModel } from 'mydatepicker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArrestPurityCertOutPut, ArrestSearchWarrantOutput, Arrest, TransactionRunninggetByCon, TransactionRunning, ArrestLocale, ArrestIndictment, ArrestLawbreakerupdDelete, ArrestLawbreakerId, ArrestIndictmentDetail, ArrestLawbreaker, ArrestProduct, ArrestIndictmentProduct, ArrestProductId, ArrestStaff, MasSubDistrictgetByCon } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'rxjs/observable/merge';
import { Observable } from 'rxjs';
import { Message } from '../../../../config/message';
import {
   ArrestService,
   ArrestStaffService,
   ArrestLawbreakerService,
   ArrestProductService,
   ArrestNoticeService,
   ArrestIndictmentService,
   PurityCertService,
   ArrestSearchWarrantService,
   TransactionRunningService,
   ArrestDocumentService
} from '../../services';
import { mergeMap, map, catchError, mapTo, finalize } from 'rxjs/operators';
import { LoaderService } from '../../../../core/loader/loader.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { LocalStoreage as LS, IsLawsuitComplate } from '../../entities';
import { from } from 'rxjs/observable/from';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { MasSubDistrictService } from '../../services/mas-sub-district.service';
import { ArrestNotice } from 'app/pages/model';

@Component({
   selector: 'app-manage',
   templateUrl: './manage.component.html',
   styleUrls: ['./manage.component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class ManageComponent extends ManageConfig implements OnInit {

   public arrestCode: string;

   public searching = this.s_MasMaster.searching;
   public searchFailed = this.s_MasMaster.searchFailed;

   @ViewChild('printDocModal') printDocModel: ElementRef;

   constructor(
      private chRef: ChangeDetectorRef,
      private s_MasMaster: MasterService,
      private masSubDistrictService: MasSubDistrictService,
      private modelService: NgbModal,
      private activeRoute: ActivatedRoute,
      private router: Router,
      private s_Arrest: ArrestService,
      private s_Staff: ArrestStaffService,
      private s_Lawbreaker: ArrestLawbreakerService,
      private s_Product: ArrestProductService,
      private s_Notice: ArrestNoticeService,
      private s_Indictment: ArrestIndictmentService,
      private s_PurityCert: PurityCertService,
      private s_SearchWarrant: ArrestSearchWarrantService,
      private s_TransactionRunning: TransactionRunningService,
      private s_Document: ArrestDocumentService,
      private loaderService: LoaderService,
      private fb: FormBuilder,

   ) {
      super();
   }

   ngOnInit() {
      this.canOfficeSearch();
      this.disableOcDate(new Date());
      this.disableArDate(new Date());

      this.activeRoute.params.subscribe(p => {
         this.mode = p['mode'];
         const ARREST_ID = p['code'];

         this.ArrestFG = this.createForm();

         switch (this.mode) {
            case this.ModeAction.C:
               this.s_MasMaster.MasOfficegetByCon({ TEXT_SEARCH: this.officeCode })
                  .subscribe(x => {
                     if (!x.length) return;
                     this.ArrestFG.patchValue({
                        OFFICE_ID: x[0].OFFICE_ID,
                        OFFICE_CODE: x[0].OFFICE_CODE,
                        OFFICE_NAME: x[0].OFFICE_SHORT_NAME,
                        // OFFICE_SHORT_NAME: x[0].OFFICE_SHORT_NAME
                     });
                  })
               break;

            case this.ModeAction.R:

               this.s_Arrest.ArrestgetByCon({ ARREST_ID }).pipe(
                  mergeMap(x => {
                     this.arrestCode = x.ARREST_CODE;
                     const params = { DOCUMENT_TYPE: 3, REFERENCE_CODE: x.ARREST_ID };
                     return this.s_Document.GetDocumentByCon(params)
                        .pipe(map(o => { return { ...x, Document: o } }))
                  })
               ).subscribe(x => {
                  this.ILG60_03_02_00_00_E20.next(true);
                  this.ILG60_03_03_00_00_E15.next(true);
                  this.setArrestFormItem(x);
                  this.isBtnLock(x);
               });
               break;
         }
      });
      this.setButton();
      this.OCCURRENCE_DATE$ = this.ArrestFG.get('OCCURRENCE_DATE').value

      // combineLatest(
      //    // this.ILG60_03_02_00_00_E13$,
      //    // this.ILG60_03_03_00_00_E15$,
      //    // this.ILG60_03_02_00_00_E21$,
      //    this.ILG60_03_02_00_00_E25$
      // ).subscribe(x => {
      //    // console.log(JSON.stringify(x));

      // })

      // this.ILG60_03_02_00_00_E13$.subscribe((x: any[]) => {
      //    this.chRef.markForCheck();
      //    console.log(x.find(o => o.CONTRIBUTOR_ID == 14));

      // });
   }

   openModal(e) {
      this.modal = this.modelService.open(e, { size: 'lg', centered: true });
   }

   openModal_XL(e) {
      this.modal = this.modelService.open(e, { size: <any>'xl', centered: true });
   }

   setButton() {
      if (this.mode === this.ModeAction.C) {
         this.enableBtnCreate();
      } else if (this.mode === this.ModeAction.R) {
         this.enableBtnEdit();
      }
   }

   isBtnLock(Arrest) {
      let isLock: boolean;
      const IsLawsuitComplate = Arrest.IS_LAWSUIT_COMPLETE;
      isLock = IsLawsuitComplate == 1 ? false : true;
      this.btn_onEdit.next(isLock);
      this.btn_onDelete.next(isLock);
   }

   enableBtnCreate() {
      // set false
      this.btn_onPrint.next(false);
      this.btn_onEdit.next(false);
      this.btn_onDelete.next(false);
      this.isEdit = false;
      // set true
      this.btn_onSave.next(true);
      this.btn_onCancel.next(true);
   }

   enableBtnEdit() {
      // set false
      this.btn_onSave.next(false);
      this.btn_onCancel.next(false);
      // set true  
      this.btn_onPrint.next(true);
      this.btn_onEdit.next(true);
      this.btn_onDelete.next(true);
      this.isEdit = true;
   }

   setArrestFormItem(a: Arrest) {

      for (var key in a) {
         if (a[key] === 'null') a[key] = null;
      }

      const ARREST_DATE = setDateMyDatepicker(new Date(a.ARREST_DATE));
      const arDate = new Date(a.ARREST_DATE);
      const ARREST_TIME = `${setZero(arDate.getHours())}:${setZero(arDate.getMinutes())}`
      const OCCURRENCE_DATE = setDateMyDatepicker(new Date(a.OCCURRENCE_DATE));
      const ocDate = new Date(a.OCCURRENCE_DATE);
      const OCCURRENCE_TIME = `${setZero(ocDate.getHours())}:${setZero(ocDate.getMinutes())}`;

      // if (arDate) this.disableOcDate(arDate);

      // if (ocDate) this.disableArDate(ocDate);

      const UPDATE_USER_ACCOUNT_ID = this.userAccountId;
      const UPDATE_DATE = this.toDateTZ(new Date());

      const ArrestPurityCert$ = a.ArrestPurityCert.reduce((a, c) =>
         [...a, { ...c, ACTION: this.Action.EDIT }], []);

      const ArrestSearchWarrant$ = a.ArrestSearchWarrant.reduce((a, c) =>
         [...a, { ...c, ACTION: this.Action.EDIT }], []);

      this.INPUT_WIZARD.next({ 'VALUE': a.ARREST_CODE, 'RESERVE_VALUE': '' });

      this.ArrestFG.patchValue({
         ARREST_ID: a.ARREST_ID,
         OFFICE_ID: a.OFFICE_ID,
         ARREST_CODE: a.ARREST_CODE,
         OFFICE_CODE: a.OFFICE_CODE,
         OFFICE_NAME: a.OFFICE_NAME,
         ARREST_DATE: ARREST_DATE,
         ARREST_TIME: ARREST_TIME,

         OCCURRENCE_DATE: OCCURRENCE_DATE,
         OCCURRENCE_TIME: OCCURRENCE_TIME,

         PURITYCERT_CODE: a.ArrestPurityCert.length
            ? a.ArrestPurityCert[0]['PURITYCERT_CODE']
            : null,
         PURITYCERT_ID: a.ArrestPurityCert.length
            ? a.ArrestPurityCert[0]['PURITYCERT_ID']
            : null,

         REQUEST_CODE: a.ArrestSearchWarrant.length
            ? a.ArrestSearchWarrant[0]['REQUEST_CODE']
            : null,
         SEARCH_WARRANT_ID: a.ArrestSearchWarrant.length
            ? a.ArrestSearchWarrant[0]['SEARCH_WARRANT_ID']
            : null,
         //พฤติกรรมในการจับ
         BEHAVIOR_ALL: `${a.BEHAVIOR_1 || ''}${a.BEHAVIOR_2 || ''}${a.BEHAVIOR_3 || ''}${a.BEHAVIOR_4 || ''}${a.BEHAVIOR_5 || ''}`,
         TESTIMONY: a.TESTIMONY,
         IS_REQUEST: a.IS_REQUEST,
         REQUEST_DESC: a.REQUEST_DESC,
         IS_LAWSUIT_COMPLETE: a.IS_LAWSUIT_COMPLETE,
         IS_ACTIVE: a.IS_ACTIVE,
         CREATE_DATE: this.toDateTZ(new Date(a.CREATE_DATE)),
         CREATE_USER_ACCOUNT_ID: a.CREATE_USER_ACCOUNT_ID,
         UPDATE_DATE: UPDATE_DATE,
         UPDATE_USER_ACCOUNT_ID: UPDATE_USER_ACCOUNT_ID,

         ArrestPurityCert: ArrestPurityCert$,
         ArrestSearchWarrant: ArrestSearchWarrant$
      });

      this._ILG60_03_02_00_00_E10$.next(a.ArrestNotice);
      this._ILG60_03_02_00_00_E13$.next(a.ArrestStaff);
      this._ILG60_03_02_00_00_E18$.next(a.ArrestLocale);
      this._ILG60_03_03_00_00_E15$.next(a.ArrestLawbreaker);
      this._ILG60_03_02_00_00_E21$.next(a.ArrestProduct);
      this._ILG60_03_02_00_00_E25$.next(a.ArrestIndictment);
      this._ILG60_03_02_00_00_E28$.next(a['Document']);

      this.setItemFormArray(ArrestPurityCert$, 'ArrestPurityCert');
      this.setItemFormArray(ArrestSearchWarrant$, 'ArrestSearchWarrant');

   }

   public createForm(): FormGroup {
      let ArrestDate = setDateMyDatepicker(new Date());
      let ArrestTime = `${setZero((new Date).getHours())}:${setZero((new Date).getMinutes())}`;
      let CREATE_USER_ACCOUNT_ID = null;
      let CREATE_DATE = null;
      if (this.mode === this.ModeAction.C) {
         CREATE_USER_ACCOUNT_ID = this.userAccountId;
         CREATE_DATE = this.toDateTZ(new Date());
      };

      return new FormGroup({
         ARREST_ID: new FormControl(null),
         ARREST_CODE: new FormControl(null),
         OFFICE_ID: new FormControl(null, Validators.required),
         OFFICE_CODE: new FormControl(null, Validators.required),
         OFFICE_NAME: new FormControl(null, Validators.required),
         ARREST_DATE: new FormControl(ArrestDate, Validators.required),
         ARREST_TIME: new FormControl(ArrestTime, Validators.required),

         OCCURRENCE_DATE: new FormControl(ArrestDate, Validators.required),
         OCCURRENCE_TIME: new FormControl(ArrestTime, Validators.required),

         PURITYCERT_CODE: new FormControl(null),
         PURITYCERT_ID: new FormControl(null),

         REQUEST_CODE: new FormControl(null),
         SEARCH_WARRANT_ID: new FormControl(null),

         BEHAVIOR_1: new FormControl("", Validators.required),
         BEHAVIOR_2: new FormControl(""),
         BEHAVIOR_3: new FormControl(""),
         BEHAVIOR_4: new FormControl(""),
         BEHAVIOR_5: new FormControl(""),
         BEHAVIOR_ALL: new FormControl(this.BEHAVIOR_INIT, Validators.required),
         TESTIMONY: new FormControl(null),
         IS_REQUEST: new FormControl(true),
         REQUEST_DESC: new FormControl(this.Text.isRequest),
         IS_LAWSUIT_COMPLETE: new FormControl(IsLawsuitComplate.WAIT),
         IS_ACTIVE: new FormControl(1),
         CREATE_DATE: new FormControl(CREATE_DATE),
         CREATE_USER_ACCOUNT_ID: new FormControl(CREATE_USER_ACCOUNT_ID),
         UPDATE_DATE: new FormControl(CREATE_DATE),
         UPDATE_USER_ACCOUNT_ID: new FormControl(null),

         ArrestPurityCert: this.fb.array([]),
         ArrestSearchWarrant: this.fb.array([])
      })
   }

   serachOffice = this.s_MasMaster.serachOffice;

   setItemFormArray(array: any[], formControl: string) {
      if (array !== undefined && array.length) {
         const itemFGs = array.map(item => this.fb.group(item));
         const itemFormArray = this.fb.array(itemFGs);
         this.ArrestFG.setControl(formControl, itemFormArray);
      }
   }

   selectItemOffice(e) {
      this.ArrestFG.patchValue({
         OFFICE_ID: e.item ? e.item.OFFICE_ID : null,
         OFFICE_CODE: e.item ? e.item.OFFICE_CODE : null,
         OFFICE_NAME: e.item ? e.item.OFFICE_SHORT_NAME : null,
         OFFICE_SHORT_NAME: e.item ? e.item.OFFICE_SHORT_NAME : null
      })
   }

   deleteItemOffice(e) {
      if (!e.value)
         this.ArrestFG.patchValue({
            OFFICE_ID: '',
            OFFICE_CODE: '',
            OFFICE_NAME: ''
         })
   }

   onSDateChange(event: IMyDateModel) {
      let date = new Date(event.jsdate);
      date.setHours(0, -date.getTimezoneOffset(), 0, 0);
   }

   Ilg60O02000201_Output(event: ArrestPurityCertOutPut) {
      this.ArrestFG.patchValue({
         PURITYCERT_ID: event.PURITYCERT_ID,
         PURITYCERT_CODE: event.PURITYCERT_CODE
      });
   }

   Ilg60O02000202_Output(event: ArrestSearchWarrantOutput) {
      this.ArrestFG.patchValue({
         SEARCH_WARRANT_ID: event.SEARCH_WARRANT_ID,
         REQUEST_CODE: event.REQUEST_CODE
      });
   }

   clearPuritycertCode() {
      this.swalFnMulti('', Message.confirmAction, 'warning').then((t) => {
         if (t.value) {
            this.ArrestFG.patchValue({
               PURITYCERT_ID: null,
               PURITYCERT_CODE: null
            });

            const ArrestPurityCert$ = this.ArrestPurityCert.value.reduce((a, c) =>
               [...a, { ...c, ACTION: this.Action.DELETE }], []);
            this.setItemFormArray(ArrestPurityCert$, 'ArrestPurityCert');
         }
      })
   }

   clearRequestCode() {
      this.swalFnMulti('', Message.confirmAction, 'warning').then((t) => {
         if (t.value) {
            this.ArrestFG.patchValue({
               SEARCH_WARRANT_ID: null,
               REQUEST_CODE: null
            });

            const ArrestSearchWarrant$ = this.ArrestSearchWarrant.value.reduce((a, c) =>
               [...a, { ...c, ACTION: this.Action.DELETE }], []);
            this.setItemFormArray(ArrestSearchWarrant$, 'ArrestSearchWarrant');
         }
      })
   }

   // onArDateChange(event: IMyDateModel) {
   //    let d = new Date(event.jsdate)
   //    this.disableOcDate(d);
   // }

   // onOcDateChange(event: IMyDateModel) {
   //    let d = new Date(event.jsdate);
   //    this.disableArDate(d);
   // }

   disableArDate(d: Date) {
      // d.setDate(d.getDate() + 1);
      this.arDateFromOption = {
         ...this.arDateFromOption,
         disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }

      // this.dateToOption.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

   }

   disableOcDate(d: Date) {
      // d.setDate(d.getDate() - 1);
      this.ocDateToOption = {
         ...this.ocDateToOption,
         disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
   }

   public async clickSave() {

      if (this.ArrestFG.invalid) {

         if (this.ArrestFG.get('OFFICE_NAME').invalid || this.ArrestFG.get('OFFICE_CODE').invalid) {
            this.ArrestFG.get('OFFICE_NAME').markAsDirty();
            this.swalFn('', 'กรุณาระบุข้อมูล "เขียนที่"', 'warning');
            return;
         }

         if (this.ArrestFG.get('ARREST_DATE').invalid) {
            this.ArrestFG.get('ARREST_DATE').markAsDirty();
            this.swalFn('', 'กรุณาระบุข้อมูล "วันที่เขียน"', 'warning');
            return;
         }

         if (this.ArrestFG.get('ARREST_TIME').invalid) {
            this.ArrestFG.get('ARREST_TIME').markAsDirty();
            this.swalFn('', 'กรุณาระบุข้อมูล "เวลา"', 'warning');
            return;
         }

         if (this.ArrestFG.get('OCCURRENCE_DATE').invalid) {
            this.ArrestFG.get('OCCURRENCE_DATE').markAsDirty();
            this.swalFn('', 'กรุณาระบุข้อมูล "วันที่จับกุม"', 'warning');
            return;
         }

         if (this.ArrestFG.get('OCCURRENCE_TIME').invalid) {
            this.ArrestFG.get('OCCURRENCE_TIME').markAsDirty();
            this.swalFn('', 'กรุณาระบุข้อมูล "เวลา"', 'warning');
            return;
         }
      }

      const E13 = this.ILG60_03_02_00_00_E13$.getValue() as ArrestStaff[];
      const E13Invalid = E13.reduce((a, c) => {
         return c.FIRST_NAME == null ? true : a;
      }, false);

      if (E13Invalid) {
         this.INVALID_ILG60_03_02_00_00_E13.next(true);
         this.ILG60_03_02_00_00_E13.next(true);
         this.swalFn('', 'กรุณาระบุข้อมูล "ชื่อผู้จับกุม"', 'warning');
         return;
      }

      const E18 = this.ILG60_03_02_00_00_E18$.getValue() as ArrestLocale[];
      if (!E18.length || !E18[0].LOCATION) {
         this.INVALID_ILG60_03_02_00_00_E18.next(true);
         this.ILG60_03_02_00_00_E18.next(true);
         this.LOCATION_REQ_E18.next(true);
         this.swalFn('', 'กรุณาระบุข้อมูล "สถานที่เกิดเหตุ"', 'warning');
         return;
      }

      if (!E18.length || !E18[0].SUB_DISTRICT_NAME_TH || !E18[0].DISTRICT_NAME_TH || !E18[0].PROVINCE_NAME_TH) {
         this.INVALID_ILG60_03_02_00_00_E18.next(true);
         this.ILG60_03_02_00_00_E18.next(true);
         this.REGION_REQ_E18.next(true);
         this.swalFn('', 'กรุณาระบุข้อมูล "ตำบล/อำเภอ/จังหวัด"', 'warning');
         return;
      }

      const E25 = this.ILG60_03_02_00_00_E25$.getValue() as ArrestIndictment[];
      let E25_TEMP$: ArrestIndictment[];

      if (E25.length) E25_TEMP$ = E25;
      else E25_TEMP$ = E25['ArrestIndictment']
         ? E25['ArrestIndictment']
         : [];

      if (!E25_TEMP$.length) {
         this.INVALID_ILG60_03_02_00_00_E25.next(true);
         this.swalFn('', 'กรุณาระบุข้อมูล "ข้อกล่าวหา"', 'warning');
         return;
      }

      const E25Invalid = E25.reduce((a, c) => {
         return c.SECTION_NAME == null ? true : a;
      }, false);

      if (E25Invalid) {
         this.INVALID_ILG60_03_02_00_00_E25.next(true);
         this.swalFn('', 'กรุณาระบุข้อมูล "ฐานความผิดมาตรา"', 'warning');
         return;
      }

      if (this.ArrestFG.get('BEHAVIOR_ALL').invalid) {
         this.ILG60_03_02_00_00_E20.next(true);
         this.BEHAVIOR_1_REQ_M.next(true);
         this.swalFn('', 'กรุณาระบุข้อมูล "พฤติกรรมในการจับ"', 'warning');
         return;
      }

      const E10 = this.ILG60_03_02_00_00_E10$.getValue() as ArrestNotice[];
      if (!E10.length) {
         const callback = await this.swalFnMulti('', 'ใบแจ้งความมีผลต่อเงินสินบน ต้องการบันทึกโดยไม่มีใบแจ้งความใช่หรือไม่', 'warning');
         if (await !callback.value) return;
      }

      let Arrest = Object.assign({}, this.ArrestFG.value);
      let arDate = this.getDateMyDatepicker(Arrest.ARREST_DATE) as Date;
      let ocDate = this.getDateMyDatepicker(Arrest.OCCURRENCE_DATE) as Date;
      const acHours = parseInt(Arrest.ARREST_TIME.split(':')[0]);
      const acMin = parseInt(Arrest.ARREST_TIME.split(':')[1]);
      const ocHours = parseInt(Arrest.OCCURRENCE_TIME.split(':')[0]);
      const ocMin = parseInt(Arrest.OCCURRENCE_TIME.split(':')[1]);
      arDate.setHours(acHours, acMin);
      ocDate.setHours(ocHours, ocMin);

      Arrest.ARREST_DATE = this.toDateTZ(arDate);
      Arrest.OCCURRENCE_DATE = this.toDateTZ(ocDate);
      Arrest.IS_REQUEST = Arrest.IS_REQUEST ? 1 : 0;

      Arrest['BEHAVIOR_1'] = Arrest['BEHAVIOR_ALL'].substring(0, 2000);
      Arrest['BEHAVIOR_2'] = Arrest['BEHAVIOR_ALL'].substring(2000, 4000);
      Arrest['BEHAVIOR_3'] = Arrest['BEHAVIOR_ALL'].substring(4000, 6000);
      Arrest['BEHAVIOR_4'] = Arrest['BEHAVIOR_ALL'].substring(6000, 8000);
      Arrest['BEHAVIOR_5'] = Arrest['BEHAVIOR_ALL'].substring(8000, 10000);

      this.loaderService.showLoader();

      let result = [];
      let zip$ = new Observable<any>();
      let request = new Observable<any>();

      switch (this.mode) {
         case this.ModeAction.C:
            request = this.getTransactionRunning()
               .pipe(
                  map(ARREST_CODE => Arrest.ARREST_CODE = ARREST_CODE),
                  mergeMap(() => this.ArrestInsert(Arrest))
               ).finally(() => this.loaderService.onEnd())
            break;

         case this.ModeAction.R:
            request = this.ArrestUpdate(Arrest)
               .pipe(
                  finalize(() => this.loaderService.onEnd())
               );
            break;
      }

      zip$ = Observable.zip(request)
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
                     switch (this.mode) {
                        case this.ModeAction.C:
                           this.router.navigate(['/arrest/manage', 'R', objRes[0]['ARREST_ID']]);
                           setTimeout(() => {
                              location.reload();
                           }, 200);
                           break;

                        case this.ModeAction.R:
                           location.reload();
                           break;
                     }
                  }
               });
            }
         }, () => { //อย่าลืม uncomment
            swal({
               title: '',
               text: Message.saveFail,
               type: 'warning',
               showCancelButton: false,
               confirmButtonColor: '#3085d6',
               confirmButtonText: 'ตกลง'
            })
         })
   }

   public clickEdit() {
      this.enableBtnCreate();
   }

   public clickCancel() {
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
            this.router.navigate([`arrest/list`]);
            // switch (this.mode) {
            //    case this.ModeAction.C:
            //       this.router.navigate([`arrest/list`]);
            //       break;

            //    case this.ModeAction.R:
            //       location.reload();
            //       break;
            // }

         }
      })
   }

   public clickDelete() {

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
            this.ArrestDelete();
         }
      });
   }

   private ArrestDelete() {
      const ArrestNotice = this.reducerArrayItem(this._ILG60_03_02_00_00_E10$.getValue(), 'NOTICE_ID');
      const ArrestStaff = this.reducerArrayItem(this._ILG60_03_02_00_00_E13$.getValue(), 'STAFF_ID');
      const ArrestLawbreaker = this.reducerArrayItem(this._ILG60_03_03_00_00_E15$.getValue(), 'LAWBREAKER_ID');
      const ArrestProduct = this.reducerArrayItem(this._ILG60_03_02_00_00_E21$.getValue(), 'PRODUCT_ID');
      const ArrestIndictment = this.reducerArrayItem(this._ILG60_03_02_00_00_E25$.getValue(), 'INDICTMENT_ID');

      let ArrestIndictmentDetail = this._ILG60_03_02_00_00_E25$.getValue()
         .reduce((a, c) => [...a, ...c['ArrestIndictmentDetail']], []);
      let ArrestIndictmentProduct = ArrestIndictmentDetail.reduce((a, c) => [...a, ...c['ArrestIndictmentProduct']], []);
      ArrestIndictmentProduct = this.reducerArrayItem(ArrestIndictmentProduct, 'PRODUCT_INDICTMENT_ID');
      ArrestIndictmentDetail = this.reducerArrayItem(ArrestIndictmentDetail, 'INDICTMENT_DETAIL_ID');

      const ARREST_ID = this.ArrestFG.get('ARREST_ID').value as number;
      const PURITYCERT_ID = this.ArrestFG.get('PURITYCERT_ID').value as number;
      const SEARCH_WARRANT_ID = this.ArrestFG.get('SEARCH_WARRANT_ID').value as number;
      this.loaderService.showLoader();

      let result = [];
      let zip$ = new Observable<any>();

      const observe = merge(
         this.s_Arrest.ArrestupdDelete({ ARREST_ID }),
         PURITYCERT_ID
            ? this.s_PurityCert.ArrestPurityCertupdDelete([{ PURITYCERT_ID }])
            : Observable.of(),
         SEARCH_WARRANT_ID
            ? this.s_SearchWarrant.ArrestSearchWarrantupdDelete([{ SEARCH_WARRANT_ID }])
            : Observable.of(),
         ArrestStaff.length > 0
            ? this.s_Staff.ArrestStaffupdDelete(ArrestStaff)
            : Observable.of(),
         ArrestLawbreaker.length > 0
            ? this.s_Lawbreaker.ArrestLawbreakerupdDelete(ArrestLawbreaker)
            : Observable.of(),
         ArrestProduct.length > 0
            ? this.s_Product.ArrestProductupdDelete(ArrestProduct)
            : Observable.of(),
         ArrestNotice.length > 0
            ? this.s_Notice.ArrestNoticeupdDelete(ArrestNotice)
            : Observable.of(),
         ArrestIndictment.length > 0
            ? this.s_Indictment.ArrestIndictmentupdDelete(ArrestIndictment)
            : Observable.of(),
         ArrestIndictmentProduct.length > 0
            ? this.s_Indictment.ArrestIndictmentProductupdDelete(ArrestIndictmentProduct)
            : Observable.of(),
         ArrestIndictmentDetail.length > 0
            ? this.s_Indictment.ArrestIndictmentDetailupdDelete(ArrestIndictmentDetail)
            : Observable.of()
      ).finally(() => this.loaderService.onEnd());

      zip$ = Observable.zip(observe)
         .pipe(map(x => { return result = [...result, ...x]; }))

      forkJoin(zip$)
         .subscribe(x => {
            const objRes: any[] = x[0];

            if (objRes.filter(o => o['IsSuccess'] == 'False').length) {
               swal({
                  title: '',
                  text: Message.delFail,
                  type: 'warning',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'ตกลง'
               })
            } else {
               swal({
                  title: '',
                  text: Message.delComplete,
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'ตกลง'
               }).then((r) => {
                  if (r) this.router.navigate(['/arrest/list']);
               });
            }
         }, () => {
            swal({
               title: '',
               text: Message.delFail,
               type: 'warning',
               showCancelButton: false,
               confirmButtonColor: '#3085d6',
               confirmButtonText: 'ตกลง'
            })
         });
   }

   filterAction = (form: any[], action: string) =>
      form.filter(x => x['ACTION'] === action);

   reducerArrayItem = (form: any[], item: string): any[] =>
      form.reduce((accu, curr) => [...accu, { [item]: curr[item] }], []);

   getTransactionRunning() {
      const RUNNING_TABLE = 'OPS_ARREST';
      const RUNNING_MONTH = (new Date()).getMonth() + 1;
      const RUNNING_PREFIX = 'TN';

      const params: TransactionRunninggetByCon = {
         RUNNING_OFFICE_CODE: this.LOCALE_OFFICE_CODE.value,//this.officeCode,
         RUNNING_TABLE: RUNNING_TABLE
      }

      return this.s_TransactionRunning.TransactionRunninggetByCon(params)
         .pipe(
            mergeMap(x => {
               if (x.length) {
                  const tr = x.sort((a, b) => b.RUNNING_NO - a.RUNNING_NO)[0] // sort desc
                  let str = '' + (tr.RUNNING_NO + 1)
                  let pad = '00000';
                  let ans = pad.substring(0, pad.length - str.length) + str

                  return this.s_TransactionRunning.
                     TransactionRunningupdByCon({ RUNNING_ID: tr.RUNNING_ID })
                     .pipe(
                        catchError(this.loaderService.onCatch),
                        mapTo(`${tr.RUNNING_PREFIX}${tr.RUNNING_OFFICE_CODE}${tr.RUNNING_YEAR}${ans}`)
                     );

               } else {
                  const d: TransactionRunning = {
                     RUNNING_ID: 1,
                     RUNNING_MONTH: `${this.setZero(RUNNING_MONTH)}`,
                     RUNNING_NO: 1,
                     RUNNING_OFFICE_CODE: this.LOCALE_OFFICE_CODE.value,
                     RUNNING_OFFICE_ID: parseInt(this.officeId),
                     RUNNING_PREFIX: RUNNING_PREFIX,
                     RUNNING_TABLE: RUNNING_TABLE,
                     RUNNING_YEAR: this.yy_th
                  }
                  const ans = '00001'
                  return this.s_TransactionRunning.TransactionRunninginsAll(d)
                     .pipe(
                        catchError(this.loaderService.onCatch),
                        mapTo(`${RUNNING_PREFIX}${this.LOCALE_OFFICE_CODE.value}${this.yy_th}${ans}`)
                     );
               }
            })
         );
   }

   ArrestInsert(Arrest: any) {
      let insert = Object.assign({}, Arrest);
      const ArrestStaff = this.filterAction(this.ILG60_03_02_00_00_E13$.getValue(), this.Action.ADD);
      const ArrestLawbreaker = this.filterAction(this.ILG60_03_03_00_00_E15$.getValue(), this.Action.ADD);
      let ArrestProduct = this.filterAction(this.ILG60_03_02_00_00_E21$.getValue(), this.Action.ADD);

      ArrestProduct = ArrestProduct.map(m => {
         // m.ArrestProductMapping = [];
         m.QUANTITY = this.removeComma(m.QUANTITY);
         m.VOLUMN = this.removeComma(m.VOLUMN);
         m.SUGAR = this.removeComma(m.SUGAR);
         m.CO2 = this.removeComma(m.CO2);
         m.DEGREE = this.removeComma(m.DEGREE);
         return m;
      })

      insert = { ...insert, ArrestStaff };
      insert = { ...insert, ArrestLocale: this.ILG60_03_02_00_00_E18$.getValue() };
      insert = { ...insert, ArrestLawbreaker };
      insert = { ...insert, ArrestProduct };
      return this.s_Arrest.ArrestinsAll(insert).pipe(
         mergeMap(x => {

            const ARREST_ID = x['ARREST_ID'];
            const LB = x['ArrestLawbreaker'];
            const PD = x['ArrestProduct'].reduce((a, c) =>
               [...a, {
                  ...c, PRODUCT_ID: c.PRODUCT_ID,
               }], []) as ArrestProductId[];
            return merge(
               Observable.of(x),
               this.ArrestPurityCertModify(ARREST_ID),
               this.ArrestSearchWarrantModify(ARREST_ID),
               this.ArrestNoticeModify(ARREST_ID),
               this.ArrestIndictmentModify(ARREST_ID, LB, PD),
               this.ArrestDocumentModify(ARREST_ID)
            );
         })
      )

   }

   ArrestUpdate(a: any) {
      let upd = Object.assign({}, a);
      
      upd = { ...upd, ArrestLocale: this.ILG60_03_02_00_00_E18$.getValue() };
      let LB = this._ILG60_03_03_00_00_E15$.getValue() as any[];

      let productIns = this.filterAction(this.ILG60_03_02_00_00_E21$.getValue(), this.Action.ADD);
      if (productIns.length > 0) {
         productIns = productIns.reduce((accu, curr) => [...accu, { ...curr, ARREST_ID: a.ARREST_ID }], []);
         productIns = this.ArrestProdRemoveComma(productIns);
      }

      let lawbreakerIns = this.filterAction(this.ILG60_03_03_00_00_E15$.getValue(), this.Action.ADD);
      if (lawbreakerIns.length > 0)
         lawbreakerIns = lawbreakerIns.reduce((accu, curr) => [...accu, { ...curr, ARREST_ID: a.ARREST_ID }], []);

      return combineLatest(
         productIns.length > 0
            ? this.s_Product.ArrestProductinsAll(productIns)
            : Observable.of({ IsSuccess: "True", ArrestProduct: [] }),
         lawbreakerIns.length > 0
            ? this.s_Lawbreaker.ArrestLawbreakerinsAll(lawbreakerIns)
            : Observable.of({ IsSuccess: "True", ArrestLawbreaker: [] })
      ).pipe(
         mergeMap(x => {
            const PD = x[0]['ArrestProduct'];
            this.PRODUCT_ID_AFTER_UPD.next(PD);
            LB = [...x[1]['ArrestLawbreaker'] ? x[1]['ArrestLawbreaker'] : false, ...LB];
            LB = this.filterDuplicate(LB, 'PERSON_ID');

            return merge(
               Observable.of(x),
               this.s_Arrest.ArrestupdByCon(upd),
               this.ArrestProductModify(a.ARREST_ID),
               this.ArrestStaffModify(a.ARREST_ID),
               this.ArrestPurityCertModify(a.ARREST_ID),
               this.ArrestSearchWarrantModify(a.ARREST_ID),
               this.ArrestNoticeModify(a.ARREST_ID),
               this.ArrestIndictmentModify(a.ARREST_ID, LB, this.setArrestProductID()),
               this.ArrestIndictmentProductModify(this.setArrestProductID()),
               this.ArrestDocumentModify(a.ARREST_ID),
               this.ArrestLawbreakerModify(a.ARREST_ID, this.setArrestProductID())

            );
         })
      );
   }

   setArrestProductID() {
      let ArrestProduct: any[] = [];
      ArrestProduct = [...this._ILG60_03_02_00_00_E21$.getValue(), ...this.PRODUCT_ID_AFTER_UPD.getValue()]
      const PD = ArrestProduct.reduce((a, c) => [...a, { ...c, PRODUCT_ID: c.PRODUCT_ID }], []) as ArrestProductId[];
      return PD;
   }

   ArrestPurityCertModify(ARREST_ID: number): Observable<any> {
      var del_obj: any[] = [];
      var upd_obj: any[] = [];

      let del = this.filterAction(this.ArrestPurityCert.value, this.Action.DELETE);

      let upd = this.filterAction(this.ArrestPurityCert.value, this.Action.EDIT);

      let PURITYCERT_ID = this.ArrestFG.get('PURITYCERT_ID').value;

      if (del.length > 0) {
         const PURITYCERT_ID$ = del[0]['PURITYCERT_ID'];
         del_obj = [{ PURITYCERT_ID: PURITYCERT_ID$ }];
      }

      if (upd.length > 0) {
         const upd$ = upd.reduce((a, c) =>
            [...a, { PURITYCERT_ID: c.PURITYCERT_ID }], []);
         del_obj = [...del_obj, ...upd$];
      }

      if (PURITYCERT_ID)
         upd_obj = [{ PURITYCERT_ID, ARREST_ID }];

      return merge(
         del_obj.length > 0 ? this.s_PurityCert.ArrestPurityCertupdDelete(del_obj) : Observable.of(),
         upd_obj.length > 0 ? this.s_PurityCert.ArrestPurityCertupdByCon(upd_obj) : Observable.of()
      )
   }

   ArrestSearchWarrantModify(ARREST_ID: number): Observable<any> {
      var del_obj: any[] = [];
      var upd_obj: any[] = [];

      let del = this.filterAction(this.ArrestSearchWarrant.value, this.Action.DELETE);

      let upd = this.filterAction(this.ArrestSearchWarrant.value, this.Action.EDIT);

      let SEARCH_WARRANT_ID = this.ArrestFG.get('SEARCH_WARRANT_ID').value;

      if (del.length > 0) {
         const SEARCH_WARRANT_ID$ = del[0]['SEARCH_WARRANT_ID'];
         del_obj = [{ SEARCH_WARRANT_ID: SEARCH_WARRANT_ID$ }];
      }

      if (upd.length > 0) {
         const upd$ = upd.reduce((a, c) =>
            [...a, { SEARCH_WARRANT_ID: c.SEARCH_WARRANT_ID }], []);
         del_obj = [...del_obj, ...upd$];
      }

      if (SEARCH_WARRANT_ID)
         upd_obj = [{ SEARCH_WARRANT_ID, ARREST_ID }];

      return merge(
         del_obj.length > 0 ? this.s_SearchWarrant.ArrestSearchWarrantupdDelete(del_obj) : Observable.of(),
         upd_obj.length > 0 ? this.s_SearchWarrant.ArrestSearchWarrantupdByCon(upd_obj) : Observable.of()
      )
   }

   ArrestStaffModify(ARREST_ID: number): Observable<any> {
      let ins = this.filterAction(this.ILG60_03_02_00_00_E13$.getValue(), this.Action.ADD);
      let upd = this.filterAction(this.ILG60_03_02_00_00_E13$.getValue(), this.Action.EDIT);
      let del = this.DELSTAFF_E13$.getValue();

      if (ins.length > 0)
         ins = ins.reduce((accu, curr) => [...accu, { ...curr, ARREST_ID }], []);

      if (upd.length > 0)
         upd = upd.reduce((accu, curr) => [...accu, { ...curr, ARREST_ID }], []);

      if (del.length > 0)
         del = this.reducerArrayItem(del, 'STAFF_ID');

      return merge(
         ins.length > 0 ? this.s_Staff.ArrestStaffinsAll(ins) : Observable.of(),
         upd.length > 0 ? this.s_Staff.ArrestStaffupdByCon(upd) : Observable.of(),
         del.length > 0 ? this.s_Staff.ArrestStaffupdDelete(del) : Observable.of()
      );
   }

   ArrestLawbreakerModify(ARREST_ID: number, PDID?: any[]): Observable<any | ArrestLawbreakerId[]> {
      // let ins = this.filterAction(this.ILG60_03_03_00_00_E15$.getValue(), this.Action.ADD);

      let del = this.DELLAWB_E15$.getValue();

      // if (ins.length > 0)
      //    ins = ins.reduce((accu, curr) => [...accu, { ...curr, ARREST_ID }], []);

      if (del.length > 0)
         del = this.reducerArrayItem(del, 'LAWBREAKER_ID');

      return merge(
         // ins.length > 0
         //    ? this.s_Lawbreaker.ArrestLawbreakerinsAll(ins)
         // .pipe(
         //    mergeMap(o => {
         //       if (o.IsSuccess == true || "True") {
         //          return this.ArrestIndictmentDetailModify(o.ArrestLawbreaker, PDID);
         //       };
         //       return Observable.of(o);
         //    })
         // )
         // : Observable.of([]),
         del.length > 0 ? this.s_Lawbreaker.ArrestLawbreakerupdDelete(del) : Observable.of()
      )
   }

   ArrestProductModify(ARREST_ID: number): Observable<any> {
      // let ins = this.filterAction(this.ILG60_03_02_00_00_E21$.getValue(), this.Action.ADD);
      let upd = this.filterAction(this.ILG60_03_02_00_00_E21$.getValue(), this.Action.EDIT);
      let del = this.DELPROD_E21$.value;

      // if (ins.length > 0) {
      //    ins = ins.reduce((accu, curr) => [...accu, { ...curr, ARREST_ID }], []);
      //    ins = this.ArrestProdRemoveComma(ins);
      // }

      if (upd.length > 0)
         upd = this.ArrestProdRemoveComma(upd);

      if (del.length > 0)
         del = this.reducerArrayItem(del, 'PRODUCT_ID');

      return merge(
         // ins.length > 0 ? this.s_Product.ArrestProductinsAll(ins) : Observable.of(),
         upd.length > 0 ? this.s_Product.ArrestProductupdByCon(upd) : Observable.of(),
         del.length > 0 ? this.s_Product.ArrestProductupdDelete(del) : Observable.of()
      )
   }

   ArrestProdRemoveComma(ArrestProduct: any[]) {
      return ArrestProduct.map(m => {
         m.ArrestProductMapping = [];
         m.QUANTITY = !m.QUANTITY ? "" : Number(this.removeComma(m.QUANTITY));
         m.VOLUMN = !m.VOLUMN ? "" : Number(this.removeComma(m.VOLUMN));
         m.SUGAR = !m.SUGAR ? "" : Number(this.removeComma(m.SUGAR));
         m.CO2 = !m.CO2 ? "" : Number(this.removeComma(m.CO2));
         m.DEGREE = !m.DEGREE ? "" : Number(this.removeComma(m.DEGREE));
         return m;
      })
   }

   ArrestNoticeModify(ARREST_ID: number): Observable<any> {
      let upd = this.ILG60_03_02_00_00_E10$.getValue().filter(x => x['ACTION'] !== this.Action.DELETE) as any[];
      let del = (JSON.parse(localStorage.getItem(LS.TrashArrestNotice)) || []) as any[];
      if (upd.length > 0)
         upd = upd.reduce((accu, curr) =>
            [...accu, { ARREST_ID, NOTICE_ID: curr.NOTICE_ID, IS_MATCH: curr['IS_MATCH'] ? 1 : 0 }],
            []);

      if (del.length > 0)
         del = this.reducerArrayItem(del, 'NOTICE_ID');

      return merge(
         upd.length > 0 ? this.s_Notice.ArrestNoticeupdByCon(upd) : Observable.of(),
         del.length > 0 ? this.s_Notice.ArrestNoticeupdDelete(del) : Observable.of()
      )
   }

   ArrestIndictmentModify(ARREST_ID: number, LB: ArrestLawbreakerId[], PDID?: any[]): Observable<any> {
      let ins = this.filterAction(this.ILG60_03_02_00_00_E25$.getValue(), this.Action.ADD);
      let upd = this.filterAction(this.ILG60_03_02_00_00_E25$.getValue(), this.Action.EDIT);
      let del = this.DELINDICTMENT_E25$.getValue();

      if (ins.length > 0) {
         var FINE_ESTIMATE_DTL: any;

         ins = ins.reduce((accu, curr) => {
            let dt: any[] = [];

            dt = curr.ArrestIndictmentDetail.reduce((a, c) => {
               let LAWID$: any;
               LAWID$ = LB.find(o => o.PERSON_ID == c.ArrestLawbreaker.PERSON_ID)
               const LAWBREAKER_ID = !LAWID$ ? "" : LAWID$.LAWBREAKER_ID;
               c.ArrestLawbreaker.LAWBREAKER_ID = LAWBREAKER_ID;

               FINE_ESTIMATE_DTL = parseFloat(this.removeComma(c.FINE_ESTIMATE));

               return [...a, { ...c, LAWBREAKER_ID }]; // c.LAWBREAKER_IS_CHECKED ? [...a, { ...c, LAWBREAKER_ID }] : [...a, { ...c }];
            }, []);

            // ดึง Product ที่ CHECKED ออกมา
            let p = dt.slice(0, 1)
               .reduce((a, c) => {
                  return [...a, ...c.ArrestIndictmentProduct]
               }, []) //.filter(x => x['PRODUCT_IS_CHECKED'] == true) as ArrestIndictmentProduct[];

            if (p.length) {
               // SET FINE_ESTIMATE_DTL
               FINE_ESTIMATE_DTL = p.reduce((a, c) => a + parseFloat(this.removeComma(c.FINE_ESTIMATE)), 0);

               // set Product_Id ให้กับ Product
               p = p.reduce((a, c) =>
                  [...a, {
                     ...c,
                     PRODUCT_ID: this.ReferProductID(c.PRODUCT_REF_CODE, PDID),
                     QUANTITY: this.removeComma(c.QUANTITY),
                     VOLUMN: this.removeComma(c.VOLUMN),
                     FINE_ESTIMATE: this.removeComma(c.FINE_ESTIMATE)
                  }], []);
            }

            // set Product เข้าไปใน Detail เหมือนเดิม
            dt = dt.reduce((a, c) => [...a, { ...c, ArrestIndictmentProduct: p, FINE_ESTIMATE: FINE_ESTIMATE_DTL }], []);

            // SET FINE_ESTIMATE_ALL
            var FINE_ESTIMATE_ALL = dt.reduce((a, c) => a + parseFloat(this.removeComma(c.FINE_ESTIMATE)), 0);

            return [
               ...accu,
               {
                  ...curr,
                  ARREST_ID,
                  FINE_ESTIMATE: FINE_ESTIMATE_ALL,
                  ArrestIndictmentDetail: dt
               }];
         }, []);
      }

      if (upd.length > 0) {
         var FINE_ESTIMATE_DTL: any;

         upd = upd.reduce((accu, curr) => {
            let dt = curr.ArrestIndictmentDetail.reduce((a, c) => {
               let LAWID$: any;
               LAWID$ = LB.find(o => o.PERSON_ID == c.ArrestLawbreaker.PERSON_ID)
               const LAWBREAKER_ID = !LAWID$ ? "" : LAWID$.LAWBREAKER_ID;

               FINE_ESTIMATE_DTL = parseFloat(this.removeComma(c.FINE_ESTIMATE));

               return c.LAWBREAKER_IS_CHECKED ? [...a, { ...c, LAWBREAKER_ID }] : a;
            }, []);

            // ดึง Product ที่ CHECKED ออกมา
            let p = dt.slice(0, 1)
               .reduce((a, c) => {
                  return [...a, ...c.ArrestIndictmentProduct]
               }, []).filter(x => x['PRODUCT_IS_CHECKED'] == true) as ArrestIndictmentProduct[];


            if (p.length) {
               // SET FINE_ESTIMATE_DTL
               FINE_ESTIMATE_DTL = p.reduce((a, c) => a + parseFloat(this.removeComma(c.FINE_ESTIMATE)), 0);

               // set Product_Id ให้กับ Product
               p = p.reduce((a, c, i) => [...a, {
                  ...c,
                  PRODUCT_ID: c.PRODUCT_ID,//this.ReferProductID(c.PRODUCT_REF_CODE, PDID),
                  QUANTITY: this.removeComma(c.QUANTITY),
                  VOLUMN: this.removeComma(c.VOLUMN),
                  FINE_ESTIMATE: this.removeComma(c.FINE_ESTIMATE)
               }], []);
            }

            // set Product เข้าไปใน Detail เหมือนเดิม
            dt = dt.reduce((a, c) => [...a, { ...c, ArrestIndictmentProduct: p, FINE_ESTIMATE: FINE_ESTIMATE_DTL }], []);

            // SET FINE_ESTIMATE_ALL
            var FINE_ESTIMATE_ALL = dt.reduce((a, c) => a + parseFloat(this.removeComma(c.FINE_ESTIMATE)), 0);
            return [
               ...accu,
               {
                  ...curr,
                  FINE_ESTIMATE: FINE_ESTIMATE_ALL,
                  ARREST_ID,
                  ArrestIndictmentDetail: dt
               }];
         }, []);
      }

      if (del.length)
         del = this.reducerArrayItem(del, 'INDICTMENT_ID');

      return merge(
         ins.length > 0 ? this.s_Indictment.ArrestIndictmentinsAll(ins) : Observable.of(),
         upd.length > 0 ? this.s_Indictment.ArrestIndictmentupdByCon(upd) : Observable.of(),
         del.length > 0 ? this.s_Indictment.ArrestIndictmentupdDelete(del) : Observable.of()
      )
   }

   ArrestIndictmentProductModify(PDID?: any[]): Observable<any> {

      const t = this.ILG60_03_02_00_00_E25$.getValue();

      let dt = t.reduce((accu, curr) => {
         return [...accu, ...curr['ArrestIndictmentDetail']]
      }, []) as ArrestIndictmentDetail[];

      const p = dt.reduce((a, c) => {
         return [...a, ...c.ArrestIndictmentProduct]
      }, []) //.filter(x => x['PRODUCT_IS_CHECKED'] == true) as ArrestIndictmentProduct[];

      // let ins = this.filterAction(p, this.Action.ADD);
      let upd = this.filterAction(p, this.Action.EDIT);
      let del = this.TrashArrestIndictmentProduct as any[];

      // if (ins.length > 0)
      //    ins = ins.reduce((a, c, i) => [...a, {
      //       ...c,
      //       PRODUCT_ID: this.ReferProductID(c.PRODUCT_REF_CODE, PDID),
      //       QUANTITY: this.removeComma(c.QUANTITY),
      //       VOLUMN: this.removeComma(c.VOLUMN),
      //       FINE_ESTIMATE: this.removeComma(c.FINE_ESTIMATE)
      //    }], []);

      if (upd.length > 0)
         upd = upd.reduce((a, c) => [...a, {
            ...c,
            QUANTITY: this.removeComma(c.QUANTITY),
            VOLUMN: this.removeComma(c.VOLUMN),
            FINE_ESTIMATE: this.removeComma(c.FINE_ESTIMATE)
         }], []);

      if (del.length)
         del = this.reducerArrayItem(del, 'PRODUCT_INDICTMENT_ID');

      // if (upd.length > 0) {
      //    const del$ = upd.filter(x =>
      //       x['PRODUCT_IS_CHECKED'] == false &&
      //       x.PRODUCT_INDICTMENT_ID != null &&
      //       typeof Number(x.PRODUCT_INDICTMENT_ID) === 'number'
      //    );

      //    if (del$.length > 0)
      //       del = [...del, ...del$];

      //    upd = upd.filter(x => x['PRODUCT_IS_CHECKED'] == true);
      // }

      return merge(
         // ins.length > 0 ? this.s_Indictment.ArrestIndictmentProductinsAll(ins) : Observable.of(),
         upd.length > 0 ? this.s_Indictment.ArrestIndictmentProductupdByCon(upd) : Observable.of(),
         del.length > 0 ? this.s_Indictment.ArrestIndictmentProductupdDelete(del) : Observable.of()
      )
   }

   ArrestIndictmentDetailModify(LB: ArrestLawbreakerId[], PDID?: any[]): Observable<any> {
      const t = this.ILG60_03_02_00_00_E25$.getValue();
      let dt = t.reduce((accu, curr) => {
         return [...accu, ...curr['ArrestIndictmentDetail']]
      }, []).filter(x => x['LAWBREAKER_IS_CHECKED'] == true) as ArrestIndictmentDetail[];

      let prod = dt.reduce((a, c) => {
         return [...a, ...c.ArrestIndictmentProduct]
      }, []).filter(x => x['PRODUCT_IS_CHECKED'] == true) as ArrestIndictmentProduct[];

      if (prod.length > 0)
         prod = prod.reduce((a, c) => [...a, {
            ...c,
            PRODUCT_ID: this.ReferProductID(c.PRODUCT_REF_CODE, PDID),
            QUANTITY: this.removeComma(c.QUANTITY),
            VOLUMN: this.removeComma(c.VOLUMN),
            FINE_ESTIMATE: this.removeComma(c.FINE_ESTIMATE)
         }], []).filter(x => x['ACTION'] == 'ADD');

      let ins = this.filterAction(dt, this.Action.ADD) as ArrestIndictmentDetail[];
      let upd = this.filterAction(dt, this.Action.EDIT);
      let del = this.TrashArrestIndictmentDetail as any[];

      if (ins.length) {
         ins = ins.map(x => {
            const L = LB.find(o => o.PERSON_ID == x.ArrestLawbreaker.PERSON_ID);
            x.LAWBREAKER_ID = L ? L.LAWBREAKER_ID : null;
            x.ArrestLawbreaker.LAWBREAKER_ID = L ? L.LAWBREAKER_ID : null;
            x.ArrestIndictmentProduct = prod
            return x;
         });
      }

      if (del.length)
         del = this.reducerArrayItem(del, 'INDICTMENT_DETAIL_ID');

      if (upd.length > 0) {
         const del$ = upd.filter(x =>
            x['LAWBREAKER_IS_CHECKED'] == false &&
            x.INDICTMENT_DETAIL_ID != null &&
            typeof Number(x.INDICTMENT_DETAIL_ID) === 'number'
         );

         if (del$.length > 0)
            del = [...del, ...del$];
      }

      return merge(
         ins.length > 0
            ? this.s_Indictment.ArrestIndictmentDetailinsAll(ins) : Observable.of(),
         del.length > 0 ? this.s_Indictment.ArrestIndictmentDetailupdDelete(del) : Observable.of()
      )
   }

   ArrestDocumentModify(REFERENCE_CODE: string): Observable<any> {
      let ins = this.ILG60_03_02_00_00_E28$.getValue();

      let del = this.DELDOC_E28$.getValue();

      ins = this.filterAction(ins, this.Action.ADD);

      if (ins.length > 0)
         ins = ins.reduce((accu, curr) => [...accu, { ...curr, REFERENCE_CODE }], []);

      if (del.length)
         del = del.reduce((acc, curr) => [...acc, { DOCUMENT_ID: curr.DOCUMENT_ID }], []);

      let ins$ = () => from(ins).pipe(mergeMap(x => this.s_Document.DocumentinsAll(x)));

      let del$ = () => from(del).pipe(mergeMap(x => this.s_Document.DocumentupdDelete(x)));

      return merge(
         ins.length > 0 ? ins$() : Observable.of(),
         del.length > 0 ? del$() : Observable.of()
      )
   }

   clickPrint() {
      this.modal = this.modelService.open(this.printDocModel, { size: 'lg', centered: true });
   }

   IsRequestCheang(e) {
      if (e.target.checked)
         this.ArrestFG.controls['REQUEST_DESC'].setValue(this.Text.isRequest);
      else
         this.ArrestFG.controls['REQUEST_DESC'].setValue('');
   }

   // SetDefaultTextBehavior() {
   //    if (this.mode == this.ModeAction.C) {
   //       const temp = Object.assign({});
   //       let staff: string = '';
   //       let lawbreaker: string = '';
   //       let product: string = '';
   //       let Indictment: string = '';
   //       let isNull: string = "......"
   //       let comma = (i) => i != 0 ? ', ' : '';
   //       const t = this.Text

   //       Observable.zip(
   //          this.ILG60_03_02_00_00_E13$,
   //          this.ILG60_03_03_00_00_E15$,
   //          this.ILG60_03_02_00_00_E21$,
   //          this.ILG60_03_02_00_00_E25$
   //       ).subscribe(s => {
   //          temp.staff = s[0]
   //          temp.lawbreaker = s[1]
   //          temp.product = s[2]
   //          temp.indictment = s[3]
   //       })

   //       staff = temp.staff.reduce((a, c, i) => [...a, `${comma(i)}${c.TITLE_NAME_TH}${c.FIRST_NAME} ${c.LAST_NAME}`], "") || isNull;

   //       lawbreaker = temp.lawbreaker.reduce((a, c, i) => [...a, `${comma(i)}${c.TITLE_NAME_TH}${c.FIRST_NAME} ${c.LAST_NAME}`], "");

   //       product = temp.product.reduce((a, c, i) => [...a, `${comma(i)}${c.PRODUCT_DESC}`], "");

   //       Indictment = temp.indictment.reduce((a, c, i) => [...a, `${comma(i)}${c.GUILTBASE_NAME}`], "") || isNull;

   //       const result = t.beh_1_1 + ' ' + staff + ' ' + t.beh_1_2 + ' ' +
   //          this.toLocalShort(new Date) + ' ' + t.beh_1_3 + ' ' + (temp.lawbreaker.length || '0 คน') + ' ' +
   //          (temp.lawbreaker.length ? t.beh_1_4 : '') + ' ' + lawbreaker + ''
   //          + (temp.product.length ? t.beh_1_5 : '') + '' + product + ' ' + t.beh_1_6 + ' ' + Indictment;

   //       this.ArrestFG.controls['BEHAVIOR_1'].setValue(result);
   //    }
   // }

   ReferProductID = (PRODUCT_REF_CODE: any, PDID: any[]) => {
      let PDID$: any;
      PDID$ = PDID.find(f => f.PRODUCT_REF_CODE == PRODUCT_REF_CODE);
      return !PDID$ ? "" : PDID$.PRODUCT_ID;
   }

}
