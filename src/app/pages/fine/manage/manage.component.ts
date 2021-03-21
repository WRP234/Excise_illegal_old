import { Component, Injectable, OnInit, OnDestroy, Input, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FineService } from '../fine.service';
import { MatAutocomplete, _MatListItemMixinBase } from '@angular/material';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { FormGroup, FormControl, NgForm, FormArray, FormBuilder, FormControlName, Form, ValidatorFn, Validators } from '@angular/forms';
import { toLocalShort, setZero } from 'app/config/dateFormat';
import swal from 'sweetalert2';
import { PrintDocModalComponent } from '../../fine/printdoc-modal/printdoc-modal.component';
import { Observable, of, generate } from 'rxjs';
import { MasOfficeModel, MasOfficeModel_New } from '../../../models/mas-office.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MainMasterService } from '../../../services/main-master.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import { take } from 'rxjs/operators';
import { ILG60_O_05_00_02_01 } from '../ILG60_O_05_00_02_01/ILG60_O_05_00_02_01';
import { ILG60_O_05_00_02_02 } from '../ILG60_O_05_00_02_02/ILG60_O_05_00_02_02';
import { ILG60_O_05_00_02_03 } from '../ILG60_O_05_00_02_03/ILG60_O_05_00_02_03';
import { ILG60_O_05_00_02_04 } from '../ILG60_O_05_00_02_04/ILG60_O_05_00_02_04';
import { catchError } from 'rxjs/operators';
import { from, } from 'rxjs';
import * as moment from 'moment-timezone';
import { DomSanitizer } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';
import { compareDocument, compareDocumentFormControl, Document, FileType, ImageDocument, updDelete } from '../../fine/compare_document';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { YEAR } from '../compare';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

@Injectable()
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {

  ///////////////////////////////////////////////////////////////////////// parameter //////////////////////////////////////////////////////////////////////////////////////////
  mode: any;
  fine_detail_m: any[] = [];
  fine_detail_p: any[] = [];
  _staff_name: any;
  RECEIPT_BOOK_NO: any;
  RECEIPT_NO: any;
  APPROVE_TYPE: any;
  CompareDetailID: any;
  PERSON_NAME: any;
  NOTICE_ID: any;
  _COMPARE_NO: any;
  _COMPARE_ID: any;
  LAWSUIT_ID: any;
  _OFFICE_ID: any;
  _OFFICE_CODE: any;
  _OFFICE_NAME: any;
  _date: any;
  _day: any;
  _year: any;
  searchFailed = false;
  _IsRequestBribe = 20;
  _CaseBribe = false;
  _IsRequestReward = 20;
  _CaseReward = false;
  _IsRequestTRE = 60;
  // ######BUTTON#####
  setButton = false;
  setText = true;
  printButton: boolean = false;
  deleteButton: boolean = false;
  saveButton: boolean = false;
  saveButton_edit: boolean = false;
  cancelButton: boolean = false;
  editButton: boolean = false;
  editField: boolean = false;
  INDICTMENT_DETAIL_ID: any;
  COMPARE_ID: string = '';
  ARREST_ID: any;
  cancelEdit: boolean = false;
  // ######BUTTON#####
  searching = false;
  FINE_TYPE: any;
  _subsection_id: any;
  showEditField = false;
  showEditField_COMPARE_NO = false;
  imageSource;
  show_office: boolean = true;
  YEAR = new Array<YEAR>();
  isReq_OffName = new BehaviorSubject<boolean>(false);
  BANKING: any;
  SECTION_ID: any;
  office_code: any;
  office_id: any;
  COMPARE_NO: any;
  edit_payment = false;
  ///////////////////////////////////////////////////////////////////////// reacForm //////////////////////////////////////////////////////////////////////////////////////////
  compareForm: FormGroup;
  typeheadOffice = new Array<MasOfficeModel_New>();
  get CompareStaff(): FormArray { return this.compareForm.get('CompareStaff') as FormArray; }
  get AboutPayFine(): FormArray { return this.compareForm.get('aboutPayFine') as FormArray; }
  get CompareMapping(): FormArray { return this.compareForm.get('CompareMapping') as FormArray; }

  ///////////////////////////////////////////////////////////////////////// constructor //////////////////////////////////////////////////////////////////////////////////////////
  //Step wizard
  INPUT_WIZARD = new BehaviorSubject<object>(null);

  constructor(
    private mainMasterService: MainMasterService,
    private activeRoute: ActivatedRoute,
    private fineService: FineService,
    private router: Router,
    private preloader: PreloaderService,
    private fb: FormBuilder,
    private ngbModal: NgbModal,
    private _router: Router,
    private sanitizer: DomSanitizer,
    private currencyPipe: CurrencyPipe
  ) { }

  ///////////////////////////////////////////////////////////////////////// ngOnInit //////////////////////////////////////////////////////////////////////////////////////////
  async ngOnInit() {
    var staff_id = JSON.parse(localStorage.getItem("staffInfo"));
    this.office_code = localStorage.getItem('officeCode');
    let params = { OFFICE_ID: "", TEXT_SEARCH: localStorage.getItem('officeShortName') };

    this.fineService.MasOfficegetByCon("MasOfficegetByCon", params).then(res => { this.office_id = res.RESPONSE_DATA[0].OFFICE_ID; });

    var nums1 = this.office_code.charAt(0);
    var nums2 = this.office_code.charAt(1);
    var first2 = nums1 + nums2;
    if (first2 == "00") { this.show_office = false; } else { this.show_office = true; };

    this.myDatePickerNotSetFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

    const staff = { "STAFF_ID": staff_id.STAFF_ID, "TEXT_SEARCH": "" };
    this.fineService.MasStaffgetByCon("MasStaffgetByCon", staff).then(list => { localStorage.setItem('staffInfo', JSON.stringify(list.RESPONSE_DATA[0])); })
    const UserName = localStorage.getItem("UserName");
    const para = {
      "SystemId": "systemid",
      "UserName": "my_username",
      "Password": "bbbbb",
      "IpAddress": "10.11.1.10",
      "Operation": "1",
      "RequestData":
      {
        "UserName": UserName,
        "OffCode": this.office_code
      }
    }
    this.fineService.ViewImageSignatureColo("ViewImageSignatureColo", para).then(list => {
      if (list.ResponseData.FileBody == null) { console.log("ไม่พบข้อมูลลายเซ็น"); this.imageSource = null; }
      else { this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${list.ResponseData.FileBody}`); console.log("พบข้อมูลลายเซ็น"); }
    }).catch(e => { console.log("ไม่พบข้อมูลลายเซ็น"); this.imageSource = null; });


    const param = {
      "SystemId": "WSS",
      "UserName": "wss001",
      "Password": "123456",
      "IpAddress": "10.1.1.1",
      "RequestData": {
      }
    }
    this.fineService.InquiryBank("InquiryBank", param).then(list => {
      this.BANKING = list.ResponseData;
    }).catch(e => { console.log("ไม่พบข้อมูลธนาคาร"); });

    this.setOfficeStore();
    this.setForm();
    this.loadForm();
  }

  ngOnDestroy() { }

  USER_ACCOUNT_ID: any;
  ///////////////////////////////////////////////////////////////////////// SETFORM //////////////////////////////////////////////////////////////////////////////////////////
  setForm() {
    localStorage.setItem('programcode', 'ILG60-06-00');
    const offCode = localStorage.getItem("officeCode");
    const officeShortName = localStorage.getItem("officeShortName");
    const _staff_name = localStorage.getItem("fullName");
    this.USER_ACCOUNT_ID = localStorage.getItem("UserAccountID");
    this._staff_name = _staff_name;
    this._OFFICE_CODE = offCode;
    this._OFFICE_NAME = officeShortName;
    var _date = new Date();
    this._year = _date.getFullYear() + 543;
    this._date = this.toDatePickerFormat(_date);
  }

  ///////////////////////////////////////////////////////////////////////// SETMODE //////////////////////////////////////////////////////////////////////////////////////////
  loadForm() {
    this.activeRoute.params.subscribe(p => {
      this.ARREST_ID = p.code3;
      this.INDICTMENT_DETAIL_ID = p.code2;
      this.INPUT_WIZARD.next({ 'VALUE': p.code, 'RESERVE_VALUE': p.code3 });
      this.mode = p.mode
      if (p.mode == 'C') {
        this.COMPARE_ID = "";
        this.printButton = false;
        this.deleteButton = false;
        this.saveButton = true;
        this.saveButton_edit = false;
        this.cancelButton = true;
        this.editButton = false;
        this.editField = false;
        this.showEditField = false;
        this.showEditField_COMPARE_NO = false;
        this.setButton = false;
        this.setText = true;
        this.cancelEdit = false;
        this.setFormControl1();
        this.loadData1();
      }
      else if (p.mode == 'R') {
        this.COMPARE_ID = p.code;
        this.printButton = true;
        this.deleteButton = true;
        this.saveButton = false;
        this.saveButton_edit = false;
        this.cancelButton = false;
        this.editButton = true;
        this.editField = false;
        this.showEditField = true;
        this.showEditField_COMPARE_NO = true;
        this.setButton = true;
        this.setText = true;
        this.cancelEdit = false;
        this.show_office = true;

        this.collapse2 = new BehaviorSubject<Boolean>(true);
        this.collapse3 = new BehaviorSubject<Boolean>(true);
        this.collapse4 = new BehaviorSubject<Boolean>(true);
        this.collapse5 = new BehaviorSubject<Boolean>(true);
        this.collapse6 = new BehaviorSubject<Boolean>(true);
        this.collapse7 = new BehaviorSubject<Boolean>(true);
        this.setFormControl2();
        this.loadData2();
      }
    });
  }

  ///////////////////////////////////////////////////////////////////////// MODE C //////////////////////////////////////////////////////////////////////////////////////////
  setFormControl1() {
    this.compareForm = this.fb.group({
      OFFICE_CODE: new FormControl(""),
      OFFICE_ID: new FormControl(""),
      OFFICE_NAME: new FormControl(""),
      OFFICE_SHORT_NAME: new FormControl(""),
      COMPARE_DATE: this.toDatePickerFormat(new Date()),
      COMPARE_TIME: this.getTimeNow(new Date()),
      SET_COMPARE_DATE: this.toDatePickerFormat(new Date()),
      SET_COMPARE_TIME: this.getTimeNow(new Date()),
      IS_OUTSIDE: new FormControl(0, [Validators.requiredTrue]),
      COMPARE_NO: new FormControl(""),
      COMPARE_NO_YEAR: new FormControl(""),
      CompareStaff: this.fb.array([this.set_CONTRIBUTOR_ID27(), this.set_CONTRIBUTOR_ID29()
        , this.set_CONTRIBUTOR_ID30(), this.set_CONTRIBUTOR_ID31()]),
      aboutPayFine: this.fb.array([]),
      BRIBE_RATE: new FormControl(),
      REWARD_RATE: new FormControl(),
      TREASURY_RATE: new FormControl(),
      ARREST_CODE: new FormControl(""),
      OCCURRENCE_DATE: new FormControl(""),
      OCCURRENCE_TIME: new FormControl(""),
      ARREST_STAFF: new FormControl(""),
      ACCUSER_MANAGEMENT_POS_NAME: new FormControl(""),
      ACCUSER_OPERATION_OFFICE_SHORT_NAME: new FormControl(""),
      SUB_DISTRICT_NAME: new FormControl(""),
      ARREST_LAWSUIT_NO: new FormControl(""),
      ARREST_LAWSUIT_NO_YEAR: new FormControl(""),
      ARREST_LAWSUIT_DATE: new FormControl(""),
      ARREST_LAWSUIT_TIME: new FormControl(""),
      PROVE_NO: new FormControl(""),
      PROVE_NO_YEAR: new FormControl(""),
      PROVE_DATE: new FormControl(""),
      PROVE_TIME: new FormControl(""),
      RECEIVE_DOC_DATE: new FormControl(""),
      RECEIVE_DOC_TIME: new FormControl(""),
      SUBSECTION_NAME: new FormControl(""),
      SECTION_NAME: new FormControl(""),
      GUILTBASE_NAME: new FormControl(""),
      PENALTY_DESC: new FormControl(""),
    });
    this.setYear();

  }

  fine01 = new FormArray([]);
  loadData1() {
    ///////////////////////loadForm Mod C/////////////////////////

    const params = { INDICTMENT_ID: this.INDICTMENT_DETAIL_ID }

    this.fineService.CompareArrestgetByIndictmentID("CompareArrestgetByIndictmentID", params).then(map => {

      this.setDefaultOutside(map);

      ////////////////////////////////////////mapping////////////////////////////////////
      var PROVE_NO; var LAWSUIT_NO;
      if (map.PROVE_NO == null || map.PROVE_NO == 'null') { PROVE_NO = "" } else { PROVE_NO = map.PROVE_NO };
      if (map.LAWSUIT_NO == null || map.LAWSUIT_NO == 'null') { LAWSUIT_NO = "" } else { LAWSUIT_NO = map.LAWSUIT_NO };

      this.compareForm.patchValue({
        ARREST_CODE: map.ARREST_CODE,
        OCCURRENCE_DATE: this.convertDate(map.OCCURRENCE_DATE),
        OCCURRENCE_TIME: this.convertTime(map.OCCURRENCE_DATE),
        ARREST_STAFF: map.ARREST_STAFF_NAME,
        ACCUSER_MANAGEMENT_POS_NAME: map.OPREATION_POS_NAME,
        ACCUSER_OPERATION_OFFICE_SHORT_NAME: map.OPERATION_OFFICE_SHORT_NAME,
        SUB_DISTRICT_NAME: map.SUB_DISTRICT_NAME_TH + " " + map.DISTRICT_NAME_TH + " " + map.PROVINCE_NAME_TH,
        ARREST_LAWSUIT_NO: LAWSUIT_NO.substring(0, LAWSUIT_NO.length - 5),
        ARREST_LAWSUIT_NO_YEAR: map.LAWSUIT_NO_YEAR,
        ARREST_LAWSUIT_DATE: this.convertDate(map.LAWSUIT_DATE),
        ARREST_LAWSUIT_TIME: this.convertTime(map.LAWSUIT_DATE),
        PROVE_NO: PROVE_NO.substring(0, PROVE_NO.length - 5),
        PROVE_NO_YEAR: map.PROVE_NO_YEAR,
        RECEIVE_DOC_DATE: this.convertDate(map.RECEIVE_DOC_DATE),
        RECEIVE_DOC_TIME: this.convertTime(map.RECEIVE_DOC_DATE),
        PROVE_DATE: this.convertDate(map.PROVE_DATE),
        PROVE_TIME: this.convertTime(map.PROVE_DATE),
        SUBSECTION_NAME: map.SUBSECTION_NAME,
        SECTION_NAME: map.SECTION_NAME.substring(6),
        GUILTBASE_NAME: map.GUILTBASE_NAME,
        PENALTY_DESC: map.PENALTY_DESC,
      });

      this.LAWSUIT_ID = map.LAWSUIT_ID;
      this.FINE_TYPE = map.FINE_TYPE;
      this._subsection_id = map.SUBSECTION_ID

      // ////////////////////////////////////////mapping////////////////////////////////////
      var set = [];
      var CompareArrestIndictmentDetail = [];
      var IndictmentProduct = [];
      var ProveProduct = [];
      var CompareGuiltbaseFine = [];
      var map_ap = [];
      let control = <FormArray>this.compareForm.controls.aboutPayFine;

      set.push(map);

      set.map(m => {
        CompareArrestIndictmentDetail = m.CompareArrestIndictmentDetail;
        CompareGuiltbaseFine = m.CompareGuiltbaseFine;

        if (this.FINE_TYPE == 0 || this.FINE_TYPE == 1) {
          if (CompareArrestIndictmentDetail[0].CompareArrestIndictmentProduct.length !== 0) {
            CompareArrestIndictmentDetail[0].CompareArrestIndictmentProduct.map(p => {
              this.fine01.push(this.fb.group({
                FINE_ESTIMATE: p.FINE_ESTIMATE,
                INDICTMENT_DETAIL_ID: p.INDICTMENT_DETAIL_ID,
                IS_ACTIVE: p.IS_ACTIVE,
                IS_ILLEGAL: p.IS_ILLEGAL,
                PRODUCT_DESC: p.PRODUCT_DESC,
                PRODUCT_GROUP_CODE: p.PRODUCT_GROUP_CODE,
                PRODUCT_GROUP_ID: p.PRODUCT_GROUP_ID,
                PRODUCT_GROUP_NAME: p.PRODUCT_GROUP_NAME,
                PRODUCT_ID: p.PRODUCT_ID,
                PRODUCT_INDICTMENT_ID: p.PRODUCT_INDICTMENT_ID,
                PRICE: p.PRICE,
                QUANTITY: p.QUANTITY,
                QUANTITY_UNIT: p.QUANTITY_UNIT,
                QUATITY_UNIT_ID: p.QUATITY_UNIT_ID,
                SIZES: p.SIZES,
                SIZES_UNIT: p.SIZES_UNIT,
                SIZES_UNIT_ID: p.SIZES_UNIT_ID,
                VOLUMN: p.VOLUMN,
                VOLUMN_UNIT: p.VOLUMN_UNIT,
                VOLUMN_UNIT_ID: p.VOLUMN_UNIT_ID,
              }));
            });
          }
        }

        CompareArrestIndictmentDetail.map(async person => {
          IndictmentProduct = person.CompareArrestIndictmentProduct;
          ProveProduct = person.CompareProveProduct;

          ////////////////////////////////////////MISTREAT////////////////////////////////////
          this.SECTION_ID = m.SECTION_ID;
          let _temp = await this.fineService.CompareCountMistreatgetByCon("CompareCountMistreatgetByCon", { SUBSECTION_ID: m.SUBSECTION_ID, PERSON_ID: person.PERSON_ID });
          var MISTREAT = _temp.MISTREAT;
          let fine = new FormArray([]);

          const arrest_id = { "ARREST_ID": map.ARREST_ID }
          let NOTICE = await this.fineService.CompareNoticegetByArrestID("CompareNoticegetByArrestID", arrest_id);

          if (NOTICE.length == 0) {
            ////////////////////////////NOT NOTICE////////////////////////////////
            this.NOTICE_ID = 0;
            this.compareForm.get("BRIBE_RATE").setValue(0);
            this.compareForm.get("REWARD_RATE").setValue(20);
            this.compareForm.get("TREASURY_RATE").setValue(80);
            this._IsRequestBribe = 0;
            this._IsRequestReward = 20;
            this._IsRequestTRE = 80;

            if (this.FINE_TYPE == 0) {
              let g = CompareGuiltbaseFine[0];
              let FINE_AMOUNT: number = g ? g.FINE_AMOUNT : 0;
              let FINE_MAX = parseInt(map.FINE_MAX);  /** mark old is fine_max */
              if (IndictmentProduct.length == 0) {
                fine.push(this.fb.group({
                  PRODUCT_DESC: '',
                  PRODUCT_ID: '',
                  PRODUCT_GROUP_ID: '',
                  FINE_RATE: 0,
                  VAT: 0,
                  NET_FINE: FINE_AMOUNT,
                  PAYMENT_FINE: FINE_AMOUNT,
                  PAYMENT_FINE_PIPE: this.convert_Calculator(FINE_AMOUNT),
                  TREASURY_MONEY_PIPE: this.convert_Calculator(this.convert_TREASURY_MONEY_not(FINE_AMOUNT)),
                  BRIBE_MONEY_PIPE: this.convert_Calculator(this.convert_BRIBE_MONEY_not(FINE_AMOUNT)),
                  REWARD_MONEY_PIPE: this.convert_Calculator(this.convert_REWARD_MONEY_not(FINE_AMOUNT)),
                  TREASURY_MONEY: this.convert_TREASURY_MONEY_not(FINE_AMOUNT),
                  BRIBE_MONEY: this.convert_BRIBE_MONEY_not(FINE_AMOUNT),
                  REWARD_MONEY: this.convert_REWARD_MONEY_not(FINE_AMOUNT),
                }));
              }
              else {
                fine.push(this.fb.group({
                  PRODUCT_DESC: '',
                  PRODUCT_ID: '',
                  PRODUCT_GROUP_ID: '',
                  FINE_RATE: 0,
                  VAT: 0,
                  NET_FINE: FINE_AMOUNT,
                  PAYMENT_FINE: FINE_AMOUNT,
                  PAYMENT_FINE_PIPE: this.convert_Calculator(FINE_AMOUNT),
                  TREASURY_MONEY_PIPE: this.convert_Calculator(this.convert_TREASURY_MONEY_not(FINE_AMOUNT)),
                  BRIBE_MONEY_PIPE: this.convert_Calculator(this.convert_BRIBE_MONEY_not(FINE_AMOUNT)),
                  REWARD_MONEY_PIPE: this.convert_Calculator(this.convert_REWARD_MONEY_not(FINE_AMOUNT)),
                  TREASURY_MONEY: this.convert_TREASURY_MONEY_not(FINE_AMOUNT),
                  BRIBE_MONEY: this.convert_BRIBE_MONEY_not(FINE_AMOUNT),
                  REWARD_MONEY: this.convert_REWARD_MONEY_not(FINE_AMOUNT),
                }));
              }

            }
            else if (this.FINE_TYPE == 1) {
              if (IndictmentProduct.length == 0) {
                let FINE_RATE: any;
                let FINE_TAX: any;
                let FINE_AMOUNT: any;
                CompareGuiltbaseFine.map(g => {
                  if (MISTREAT <= 1 && g.MISTREAT_START_NO == 1 && g.MISTREAT_TO_NO == 1) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else if (MISTREAT == 2 && g.MISTREAT_START_NO == 2 && g.MISTREAT_TO_NO == 2) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  }
                  else if (MISTREAT == 2 && g.MISTREAT_START_NO == 2 && g.MISTREAT_TO_NO == 0) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else if (MISTREAT == 3 && g.MISTREAT_START_NO == 3 && g.MISTREAT_TO_NO == 0) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  }
                });

                fine.push(this.fb.group({
                  PRODUCT_DESC: "",
                  PRODUCT_ID: "",
                  PRODUCT_GROUP_ID: "",
                  FINE_RATE: FINE_RATE,
                  VAT: FINE_TAX,
                  NET_FINE: FINE_AMOUNT,
                  PAYMENT_FINE: FINE_AMOUNT,
                  PAYMENT_FINE_PIPE: this.convert_Calculator(FINE_AMOUNT),
                  TREASURY_MONEY_PIPE: this.convert_Calculator(this.convert_TREASURY_MONEY_not(FINE_AMOUNT)),
                  BRIBE_MONEY_PIPE: this.convert_Calculator(this.convert_BRIBE_MONEY_not(FINE_AMOUNT)),
                  REWARD_MONEY_PIPE: this.convert_Calculator(this.convert_REWARD_MONEY_not(FINE_AMOUNT)),
                  TREASURY_MONEY: this.convert_TREASURY_MONEY_not(FINE_AMOUNT),
                  BRIBE_MONEY: this.convert_BRIBE_MONEY_not(FINE_AMOUNT),
                  REWARD_MONEY: this.convert_REWARD_MONEY_not(FINE_AMOUNT),
                }));

              } else {
                let FINE_RATE: any;
                let FINE_TAX: any;
                let FINE_AMOUNT: any;
                CompareGuiltbaseFine.map(g => {
                  if (MISTREAT <= 1 && g.MISTREAT_START_NO == 1 && g.MISTREAT_TO_NO == 1) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else if (MISTREAT == 2 && g.MISTREAT_START_NO == 2 && g.MISTREAT_TO_NO == 2) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  }
                  else if (MISTREAT == 2 && g.MISTREAT_START_NO == 2 && g.MISTREAT_TO_NO == 0) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else if (MISTREAT == 3 && g.MISTREAT_START_NO == 3 && g.MISTREAT_TO_NO == 0) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  }
                  ////^  ไม่รู้ว่าเงื่อนไขข้างบนทำไว้เพื่ออะไร ^ ////
                  //// มันไม่เข้าเงื่อนไขข้างบนเลย error ////
                  //// เลยเขียน else ไว้ก่อน /////
                  else {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  }
                  ///////////////////////////////
                });

                fine.push(this.fb.group({
                  PRODUCT_DESC: '',
                  PRODUCT_ID: '',
                  PRODUCT_GROUP_ID: '',
                  FINE_RATE: FINE_RATE,
                  VAT: FINE_TAX,
                  NET_FINE: FINE_AMOUNT,
                  PAYMENT_FINE: FINE_AMOUNT,
                  PAYMENT_FINE_PIPE: this.convert_Calculator(FINE_AMOUNT),
                  TREASURY_MONEY_PIPE: this.convert_Calculator(this.convert_TREASURY_MONEY_not(FINE_AMOUNT)),
                  BRIBE_MONEY_PIPE: this.convert_Calculator(this.convert_BRIBE_MONEY_not(FINE_AMOUNT)),
                  REWARD_MONEY_PIPE: this.convert_Calculator(this.convert_REWARD_MONEY_not(FINE_AMOUNT)),
                  TREASURY_MONEY: this.convert_TREASURY_MONEY_not(FINE_AMOUNT),
                  BRIBE_MONEY: this.convert_BRIBE_MONEY_not(FINE_AMOUNT),
                  REWARD_MONEY: this.convert_REWARD_MONEY_not(FINE_AMOUNT),
                }));
              }
            }

            else if (this.FINE_TYPE == 2) {
              ProveProduct.map(p => {
                let FINE_RATE: any;
                let FINE_TAX: any;
                let FINE_AMOUNT: any;
                CompareGuiltbaseFine.map(g => {
                  if (p.VOLUMN <= 1 && g.MISTREAT_START_VOLUMN == 0 && g.MISTREAT_TO_VOLUMN == 1) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else if (p.VOLUMN >= 1 && p.VOLUMN <= 10 && g.MISTREAT_START_VOLUMN == 1 && g.MISTREAT_TO_VOLUMN == 10) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else if (p.VOLUMN > 10 && g.MISTREAT_START_VOLUMN == 10 && g.MISTREAT_TO_VOLUMN == 0) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  }
                });
                fine.push(this.fb.group({
                  PRODUCT_DESC: p.PRODUCT_DESC,
                  PRODUCT_ID: p.PRODUCT_ID,
                  PRODUCT_GROUP_ID: p.PRODUCT_GROUP_ID,
                  FINE_RATE: FINE_RATE,
                  VAT: p.VAT,
                  NET_FINE: FINE_AMOUNT,
                  PAYMENT_FINE: FINE_AMOUNT,
                  PAYMENT_FINE_PIPE: this.convert_Calculator(FINE_AMOUNT),
                  TREASURY_MONEY_PIPE: this.convert_Calculator(this.convert_TREASURY_MONEY_not(FINE_AMOUNT)),
                  BRIBE_MONEY_PIPE: this.convert_Calculator(this.convert_BRIBE_MONEY_not(FINE_AMOUNT)),
                  REWARD_MONEY_PIPE: this.convert_Calculator(this.convert_REWARD_MONEY_not(FINE_AMOUNT)),
                  TREASURY_MONEY: this.convert_TREASURY_MONEY_not(FINE_AMOUNT),
                  BRIBE_MONEY: this.convert_BRIBE_MONEY_not(FINE_AMOUNT),
                  REWARD_MONEY: this.convert_REWARD_MONEY_not(FINE_AMOUNT),
                }))
              });
            }

            else if (this.FINE_TYPE == 3) {
              ProveProduct.map(p => {
                let FINE_RATE: any;
                let PRODUCT_GROUP_ID = parseInt(p.PRODUCT_GROUP_ID);
                CompareGuiltbaseFine.map(g => {
                  if (PRODUCT_GROUP_ID == 1400 && g.PRODUCT_GROUP_ID == 1400) {
                    FINE_RATE = g.FINE_RATE;
                  } else if (PRODUCT_GROUP_ID == 13 && g.PRODUCT_GROUP_ID == 13) {
                    FINE_RATE = g.FINE_RATE;
                  } else if (PRODUCT_GROUP_ID == 100 && g.PRODUCT_GROUP_ID == 100 && MISTREAT <= 1 && g.MISTREAT_START_NO == 1) {
                    FINE_RATE = g.FINE_RATE;
                  } else if (PRODUCT_GROUP_ID == 100 && g.PRODUCT_GROUP_ID == 100 && MISTREAT >= 2 && g.MISTREAT_START_NO == 2) {
                    FINE_RATE = g.FINE_RATE;
                  } else if (PRODUCT_GROUP_ID !== 1400 && PRODUCT_GROUP_ID !== 13 && PRODUCT_GROUP_ID !== 100 && g.PRODUCT_GROUP_ID != 1400 && g.PRODUCT_GROUP_ID != 13 && g.PRODUCT_GROUP_ID != 100 && MISTREAT <= 1 && g.MISTREAT_START_NO == 1) {
                    FINE_RATE = g.FINE_RATE;
                  } else if (PRODUCT_GROUP_ID !== 1400 && PRODUCT_GROUP_ID !== 13 && PRODUCT_GROUP_ID !== 100 && g.PRODUCT_GROUP_ID != 1400 && g.PRODUCT_GROUP_ID != 13 && g.PRODUCT_GROUP_ID != 100 && MISTREAT == 2 && g.MISTREAT_START_NO == 2) {
                    FINE_RATE = g.FINE_RATE;
                  } else if (PRODUCT_GROUP_ID !== 1400 && PRODUCT_GROUP_ID !== 13 && PRODUCT_GROUP_ID !== 100 && g.PRODUCT_GROUP_ID != 1400 && g.PRODUCT_GROUP_ID != 13 && g.PRODUCT_GROUP_ID != 100 && MISTREAT >= 3 && g.MISTREAT_START_NO >= 3) {
                    FINE_RATE = g.FINE_RATE;
                  }
                });

                fine.push(this.fb.group({
                  PRODUCT_DESC: p.PRODUCT_DESC,
                  PRODUCT_ID: p.PRODUCT_ID,
                  PRODUCT_GROUP_ID: p.PRODUCT_GROUP_ID,
                  FINE_RATE: FINE_RATE,
                  VAT: p.VAT,
                  NET_FINE: FINE_RATE * p.VAT,
                  PAYMENT_FINE: FINE_RATE * p.VAT,
                  PAYMENT_FINE_PIPE: this.convert_Calculator(FINE_RATE * p.VAT),
                  TREASURY_MONEY_PIPE: this.convert_Calculator(this.convert_TREASURY_MONEY_not(FINE_RATE * p.VAT)),
                  BRIBE_MONEY_PIPE: this.convert_Calculator(this.convert_BRIBE_MONEY_not(FINE_RATE * p.VAT)),
                  REWARD_MONEY_PIPE: this.convert_Calculator(this.convert_REWARD_MONEY_not(FINE_RATE * p.VAT)),
                  TREASURY_MONEY: this.convert_TREASURY_MONEY_not(FINE_RATE * p.VAT),
                  BRIBE_MONEY: this.convert_BRIBE_MONEY_not(FINE_RATE * p.VAT),
                  REWARD_MONEY: this.convert_REWARD_MONEY_not(FINE_RATE * p.VAT),
                }));
              });
            }


          } else {
            ////////////////////////////HAVE NOTICE////////////////////////////////
            this.NOTICE_ID = NOTICE[0].NOTICE_ID;
            this.compareForm.get("BRIBE_RATE").setValue(20);
            this.compareForm.get("REWARD_RATE").setValue(20);
            this.compareForm.get("TREASURY_RATE").setValue(60);
            this._IsRequestBribe = 20;
            this._IsRequestReward = 20;
            this._IsRequestTRE = 60;

            if (this.FINE_TYPE == 0) {
              let g = CompareGuiltbaseFine[0];
              let FINE_AMOUNT: number = g ? g.FINE_AMOUNT : 0;
              let FINE_MAX = map.FINE_MAX;  /** mark old is fine_max */
              if (IndictmentProduct.length == 0) {
                console.log("ไม่มีของกลาง , finetype : 0");
                fine.push(this.fb.group({
                  PRODUCT_DESC: '',
                  PRODUCT_ID: '',
                  PRODUCT_GROUP_ID: '',
                  FINE_RATE: 0,
                  VAT: 0,
                  NET_FINE: FINE_AMOUNT,
                  PAYMENT_FINE: FINE_AMOUNT,
                  PAYMENT_FINE_PIPE: this.convert_Calculator(FINE_AMOUNT),
                  TREASURY_MONEY_PIPE: this.convert_Calculator(this.convert_TREASURY_MONEY(FINE_AMOUNT)),
                  BRIBE_MONEY_PIPE: this.convert_Calculator(this.convert_BRIBE_MONEY(FINE_AMOUNT)),
                  REWARD_MONEY_PIPE: this.convert_Calculator(this.convert_REWARD_MONEY(FINE_AMOUNT)),
                  TREASURY_MONEY: this.convert_TREASURY_MONEY(FINE_AMOUNT),
                  BRIBE_MONEY: this.convert_BRIBE_MONEY(FINE_AMOUNT),
                  REWARD_MONEY: this.convert_REWARD_MONEY(FINE_AMOUNT),
                }));
              }
              else {
                fine.push(this.fb.group({
                  PRODUCT_DESC: '',
                  PRODUCT_ID: '',
                  PRODUCT_GROUP_ID: '',
                  FINE_RATE: 0,
                  VAT: 0,
                  NET_FINE: FINE_AMOUNT,
                  PAYMENT_FINE: FINE_AMOUNT,
                  PAYMENT_FINE_PIPE: this.convert_Calculator(FINE_AMOUNT),
                  TREASURY_MONEY_PIPE: this.convert_Calculator(this.convert_TREASURY_MONEY(FINE_AMOUNT)),
                  BRIBE_MONEY_PIPE: this.convert_Calculator(this.convert_BRIBE_MONEY(FINE_AMOUNT)),
                  REWARD_MONEY_PIPE: this.convert_Calculator(this.convert_REWARD_MONEY(FINE_AMOUNT)),
                  TREASURY_MONEY: this.convert_TREASURY_MONEY(FINE_AMOUNT),
                  BRIBE_MONEY: this.convert_BRIBE_MONEY(FINE_AMOUNT),
                  REWARD_MONEY: this.convert_REWARD_MONEY(FINE_AMOUNT),
                }));
              }


            } else if (this.FINE_TYPE == 1) {
              if (IndictmentProduct.length == 0) {
                let FINE_RATE: any;
                let FINE_TAX: any;
                let FINE_AMOUNT: any;
                CompareGuiltbaseFine.map(g => {
                  if (MISTREAT <= 1 && g.MISTREAT_START_NO == 1 && g.MISTREAT_TO_NO == 1) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else if (MISTREAT == 2 && g.MISTREAT_START_NO == 2 && g.MISTREAT_TO_NO == 2) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  }
                  else if (MISTREAT == 2 && g.MISTREAT_START_NO == 2 && g.MISTREAT_TO_NO == 0) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else if (MISTREAT == 3 && g.MISTREAT_START_NO == 3 && g.MISTREAT_TO_NO == 0) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  }
                });
                fine.push(this.fb.group({
                  PRODUCT_DESC: "",
                  PRODUCT_ID: "",
                  PRODUCT_GROUP_ID: "",
                  FINE_RATE: FINE_RATE,
                  VAT: FINE_TAX,
                  NET_FINE: FINE_AMOUNT,
                  PAYMENT_FINE: FINE_AMOUNT,
                  PAYMENT_FINE_PIPE: this.convert_Calculator(FINE_AMOUNT),
                  TREASURY_MONEY_PIPE: this.convert_Calculator(this.convert_TREASURY_MONEY(FINE_AMOUNT)),
                  BRIBE_MONEY_PIPE: this.convert_Calculator(this.convert_BRIBE_MONEY(FINE_AMOUNT)),
                  REWARD_MONEY_PIPE: this.convert_Calculator(this.convert_REWARD_MONEY(FINE_AMOUNT)),
                  TREASURY_MONEY: this.convert_TREASURY_MONEY(FINE_AMOUNT),
                  BRIBE_MONEY: this.convert_BRIBE_MONEY(FINE_AMOUNT),
                  REWARD_MONEY: this.convert_REWARD_MONEY(FINE_AMOUNT),
                }));
              } else {
                let FINE_RATE: any;
                let FINE_TAX: any;
                let FINE_AMOUNT: any;
                CompareGuiltbaseFine.map(g => {
                  if (MISTREAT <= 1 && g.MISTREAT_START_NO == 1 && g.MISTREAT_TO_NO == 1) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else if (MISTREAT == 2 && g.MISTREAT_START_NO == 2 && g.MISTREAT_TO_NO == 2) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  }
                  else if (MISTREAT == 2 && g.MISTREAT_START_NO == 2 && g.MISTREAT_TO_NO == 0) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else if (MISTREAT == 3 && g.MISTREAT_START_NO == 3 && g.MISTREAT_TO_NO == 0) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  }
                });
                fine.push(this.fb.group({
                  PRODUCT_DESC: '',
                  PRODUCT_ID: '',
                  PRODUCT_GROUP_ID: '',
                  FINE_RATE: FINE_RATE,
                  VAT: FINE_TAX,
                  NET_FINE: FINE_AMOUNT,
                  PAYMENT_FINE: FINE_AMOUNT,
                  PAYMENT_FINE_PIPE: this.convert_Calculator(FINE_AMOUNT),
                  TREASURY_MONEY_PIPE: this.convert_Calculator(this.convert_TREASURY_MONEY(FINE_AMOUNT)),
                  BRIBE_MONEY_PIPE: this.convert_Calculator(this.convert_BRIBE_MONEY(FINE_AMOUNT)),
                  REWARD_MONEY_PIPE: this.convert_Calculator(this.convert_REWARD_MONEY(FINE_AMOUNT)),
                  TREASURY_MONEY: this.convert_TREASURY_MONEY(FINE_AMOUNT),
                  BRIBE_MONEY: this.convert_BRIBE_MONEY(FINE_AMOUNT),
                  REWARD_MONEY: this.convert_REWARD_MONEY(FINE_AMOUNT),
                }));
              }


            } else if (this.FINE_TYPE == 2) {
              ProveProduct.map(p => {
                let FINE_RATE: any;
                let FINE_TAX: any;
                let FINE_AMOUNT: any;
                CompareGuiltbaseFine.map(g => {
                  if (p.VOLUMN <= 1 && g.MISTREAT_START_VOLUMN == 0 && g.MISTREAT_TO_VOLUMN == 1) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else if (p.VOLUMN >= 1 && p.VOLUMN <= 10 && g.MISTREAT_START_VOLUMN == 1 && g.MISTREAT_TO_VOLUMN == 10) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  } else if (p.VOLUMN > 10 && g.MISTREAT_START_VOLUMN == 10 && g.MISTREAT_TO_VOLUMN == 0) {
                    FINE_RATE = g.FINE_RATE;
                    FINE_TAX = g.FINE_TAX;
                    FINE_AMOUNT = g.FINE_AMOUNT;
                  }
                });
                fine.push(this.fb.group({
                  PRODUCT_DESC: p.PRODUCT_DESC,
                  PRODUCT_ID: p.PRODUCT_ID,
                  PRODUCT_GROUP_ID: p.PRODUCT_GROUP_ID,
                  FINE_RATE: FINE_RATE,
                  VAT: p.VAT,
                  NET_FINE: FINE_AMOUNT,
                  PAYMENT_FINE: FINE_AMOUNT,
                  PAYMENT_FINE_PIPE: this.convert_Calculator(FINE_AMOUNT),
                  TREASURY_MONEY_PIPE: this.convert_Calculator(this.convert_TREASURY_MONEY(FINE_AMOUNT)),
                  BRIBE_MONEY_PIPE: this.convert_Calculator(this.convert_BRIBE_MONEY(FINE_AMOUNT)),
                  REWARD_MONEY_PIPE: this.convert_Calculator(this.convert_REWARD_MONEY(FINE_AMOUNT)),
                  TREASURY_MONEY: this.convert_TREASURY_MONEY(FINE_AMOUNT),
                  BRIBE_MONEY: this.convert_BRIBE_MONEY(FINE_AMOUNT),
                  REWARD_MONEY: this.convert_REWARD_MONEY(FINE_AMOUNT),
                }))
              });


            } else if (this.FINE_TYPE == 3) {
              ProveProduct.map(p => {
                let FINE_RATE: any;
                let PRODUCT_GROUP_ID = parseInt(p.PRODUCT_GROUP_ID);
                CompareGuiltbaseFine.map(g => {
                  if (PRODUCT_GROUP_ID == 1400 && g.PRODUCT_GROUP_ID == 1400) {
                    FINE_RATE = g.FINE_RATE;
                  } else if (PRODUCT_GROUP_ID == 13 && g.PRODUCT_GROUP_ID == 13) {
                    FINE_RATE = g.FINE_RATE;
                  } else if (PRODUCT_GROUP_ID == 100 && g.PRODUCT_GROUP_ID == 100 && MISTREAT <= 1 && g.MISTREAT_START_NO == 1) {
                    FINE_RATE = g.FINE_RATE;
                  } else if (PRODUCT_GROUP_ID == 100 && g.PRODUCT_GROUP_ID == 100 && MISTREAT >= 2 && g.MISTREAT_START_NO == 2) {
                    FINE_RATE = g.FINE_RATE;
                  } else if (PRODUCT_GROUP_ID !== 1400 && PRODUCT_GROUP_ID !== 13 && PRODUCT_GROUP_ID !== 100 && g.PRODUCT_GROUP_ID != 1400 && g.PRODUCT_GROUP_ID != 13 && g.PRODUCT_GROUP_ID != 100 && MISTREAT <= 1 && g.MISTREAT_START_NO == 1) {
                    FINE_RATE = g.FINE_RATE;
                  } else if (PRODUCT_GROUP_ID !== 1400 && PRODUCT_GROUP_ID !== 13 && PRODUCT_GROUP_ID !== 100 && g.PRODUCT_GROUP_ID != 1400 && g.PRODUCT_GROUP_ID != 13 && g.PRODUCT_GROUP_ID != 100 && MISTREAT == 2 && g.MISTREAT_START_NO == 2) {
                    FINE_RATE = g.FINE_RATE;
                  } else if (PRODUCT_GROUP_ID !== 1400 && PRODUCT_GROUP_ID !== 13 && PRODUCT_GROUP_ID !== 100 && g.PRODUCT_GROUP_ID != 1400 && g.PRODUCT_GROUP_ID != 13 && g.PRODUCT_GROUP_ID != 100 && MISTREAT >= 3 && g.MISTREAT_START_NO >= 3) {
                    FINE_RATE = g.FINE_RATE;
                  }
                });
                fine.push(this.fb.group({
                  PRODUCT_DESC: p.PRODUCT_DESC,
                  PRODUCT_ID: p.PRODUCT_ID,
                  PRODUCT_GROUP_ID: p.PRODUCT_GROUP_ID,
                  FINE_RATE: FINE_RATE,
                  VAT: p.VAT,
                  NET_FINE: FINE_RATE * p.VAT,
                  PAYMENT_FINE: FINE_RATE * p.VAT,
                  PAYMENT_FINE_PIPE: this.convert_Calculator(FINE_RATE * p.VAT),
                  TREASURY_MONEY_PIPE: this.convert_Calculator(this.convert_TREASURY_MONEY(FINE_RATE * p.VAT)),
                  BRIBE_MONEY_PIPE: this.convert_Calculator(this.convert_BRIBE_MONEY(FINE_RATE * p.VAT)),
                  REWARD_MONEY_PIPE: this.convert_Calculator(this.convert_REWARD_MONEY(FINE_RATE * p.VAT)),
                  TREASURY_MONEY: this.convert_TREASURY_MONEY(FINE_RATE * p.VAT),
                  BRIBE_MONEY: this.convert_BRIBE_MONEY(FINE_RATE * p.VAT),
                  REWARD_MONEY: this.convert_REWARD_MONEY(FINE_RATE * p.VAT),
                }));
              });
            }


          }

          ///////////////////////////person////////////////////////////
          if (person.TITLE_SHORT_NAME_TH == 'null') { person.TITLE_SHORT_NAME_TH = ''; };
          if (person.TITLE_SHORT_NAME_EN == 'null') { person.TITLE_SHORT_NAME_EN = ''; };
          if (person.FIRST_NAME == 'null') { person.FIRST_NAME = ''; };
          if (person.MIDDLE_NAME == 'null') { person.MIDDLE_NAME = ''; };
          if (person.LAST_NAME == 'null') { person.LAST_NAME = ''; };
          if (person.COMPANY_NAME == 'null') { person.COMPANY_NAME = ''; };

          var name = '';
          if (person.PERSON_TYPE == 0) { name = `${person.TITLE_SHORT_NAME_TH || ''}${person.FIRST_NAME || ''} ${person.MIDDLE_NAME || ''} ${person.LAST_NAME || ''}`; }
          else if (person.PERSON_TYPE == 1) { name = `${person.TITLE_SHORT_NAME_EN || ''}${person.FIRST_NAME || ''} ${person.MIDDLE_NAME || ''} ${person.LAST_NAME || ''}`; }
          else { name = `${person.TITLE_SHORT_NAME_TH || ''}${person.COMPANY_NAME || ''}`; };

          ///////////////////////////set money////////////////////////////
          var PAYMENT_FINE: number = 0;
          var TREASURY_MONEY: number = 0;
          var BRIBE_MONEY: number = 0;
          var REWARD_MONEY: number = 0;

          for (var i = 0; i < fine.value.length; i++) {
            let f = fine.value[i];
            PAYMENT_FINE += parseFloat(f.PAYMENT_FINE);
            TREASURY_MONEY += parseFloat(f.TREASURY_MONEY);
            BRIBE_MONEY += parseFloat(f.BRIBE_MONEY);
            REWARD_MONEY += parseFloat(f.REWARD_MONEY);
          }

          control.push(
            this.fb.group({
              /////////////////////////////set detail//////////////////////////////
              COMPARE_TYPE: 1,
              IS_TEMP_RELEASE: 0,
              IS_REVENUE: 0,
              IS_AUTHORITY: 0,
              product: fine,
              PAYMENT_FINE: new FormControl(parseFloat(PAYMENT_FINE.toFixed(2))),
              TREASURY_MONEY: new FormControl(parseFloat(TREASURY_MONEY.toFixed(2))),
              BRIBE_MONEY: new FormControl(parseFloat(BRIBE_MONEY.toFixed(2))),
              REWARD_MONEY: new FormControl(parseFloat(REWARD_MONEY.toFixed(2))),

              CompareStaffDetail: this.fb.array([this.set_CONTRIBUTOR_ID28(), this.set_CONTRIBUTOR_ID34(), this.set_CONTRIBUTOR_ID32(),
              this.set_CONTRIBUTOR_ID33(), this.set_CONTRIBUTOR_ID84(), this.set_CONTRIBUTOR_ID85(), this.set_CONTRIBUTOR_ID27(),
              this.set_CONTRIBUTOR_ID29(), this.set_CONTRIBUTOR_ID30(), this.set_CONTRIBUTOR_ID31()]),

              /////////////////////////////person detail//////////////////////////////
              FINE_MAX: new FormControl(map.FINE_MAX),
              NAME: new FormControl(name),
              MISTREAT: new FormControl(MISTREAT),
              PERSON_ID: new FormControl(person.PERSON_ID),
              SUBSECTION_NAME: new FormControl(map.SUBSECTION_NAME || ''),
              COMPANY_REGISTRATION_NO: new FormControl(person.COMPANY_REGISTRATION_NO || ''),
              ENTITY_TYPE: new FormControl(person.ENTITY_TYPE || ''),
              EXCISE_REGISTRATION_NO: new FormControl(person.EXCISE_REGISTRATION_NO || ''),
              FIRST_NAME: new FormControl(person.FIRST_NAME || ''),
              ID_CARD: new FormControl(person.ID_CARD || ''),
              INDICTMENT_DETAIL_ID: new FormControl(person.INDICTMENT_DETAIL_ID || ''),
              INDICTMENT_ID: new FormControl(person.INDICTMENT_ID || ''),
              LAST_NAME: new FormControl(person.LAST_NAME || ''),
              LAWBREAKER_ID: new FormControl(person.LAWBREAKER_ID || ''),
              MIDDLE_NAME: new FormControl(person.MIDDLE_NAME || ''),
              OTHER_NAME: new FormControl(person.OTHER_NAME || ''),
              PASSPORT_NO: new FormControl(person.PASSPORT_NO || ''),
              PERSON_TYPE: new FormControl(person.PERSON_TYPE || ''),
              TITLE_NAME_EN: new FormControl(person.TITLE_NAME_EN || ''),
              TITLE_NAME_TH: new FormControl(person.TITLE_NAME_TH || ''),
              TITLE_SHORT_NAME_EN: new FormControl(person.TITLE_SHORT_NAME_EN || ''),
              TITLE_SHORT_NAME_TH: new FormControl(person.TITLE_SHORT_NAME_TH || ''),

              /////////////////////////////request detail//////////////////////////////
              //html
              PAYMENT_FINE_DUE_DATE: this.toDatePickerFormat(new Date()),
              PAYMENT_FINE_DUE_DATE_TIME: new FormControl("23:59"),
              PAYMENT_VAT_DUE_DATE: this.toDatePickerFormat(new Date()),
              PAYMENT_VAT_DUE_DATE_TIME: new FormControl("23:59"),
              //popup
              IS_CHECK: new FormControl(""),
              IS_REQUEST: new FormControl(0),
              IS_INSURANCE: new FormControl(0, [Validators.requiredTrue]),
              INSURANCE: new FormControl(""),
              IS_GAURANTEE: new FormControl(0, [Validators.requiredTrue]),
              GAURANTEE: new FormControl(""),

              /////////////////////////////payment detail//////////////////////////////
              //html
              PAYMENT_OFFICE_NAME: new FormControl(""),
              RECEIPT_OFFICE_ID: new FormControl(""),
              PAYMENT_OFFICE_CODE: new FormControl(""),
              PAYMENT_AMOUNT: new FormControl(""),
              STAFF_NAME_28: new FormControl(""),
              //popup
              PAYMENT_DATE: new FormControl(""),
              PAYMENT_TIME: new FormControl(""),
              RECEIPT_BOOK_NO: new FormControl(""),
              RECEIPT_NO: new FormControl(""),
              RECEIPT_TYPE: new FormControl(0),
              IS_PAYMENT: new FormControl(0),
              payment: [],

              /////////////////////////////approve detail//////////////////////////////
              APPROVE_OFFICE_NAME: new FormControl(""),
              APPROVE_OFFICE_ID: new FormControl(""),
              APPROVE_OFFICE_CODE: new FormControl(""),
              APPROVE_TYPE: new FormControl(""),
              APPROVE_DATE: new FormControl(""),
              APPROVE_TIME: new FormControl(""),
              COMMAND_DATE: new FormControl(""),
              COMMAND_TIME: new FormControl(""),
              COMMAND_NO: new FormControl(""),
              COMPARE_REASON: new FormControl(""),
              FACT: new FormControl(""),
              IS_APPROVE: new FormControl(0),
              IS_AGREE: new FormControl(0),
              REMARK_NOT_AGREE: new FormControl(""),
              REMARK_NOT_APPROVE: new FormControl(""),
              CHECK_APPROVE: new FormControl(""),
            }));
          // this.preloader.setShowPreloader(false);

        });
      });//map
    });
  }

  ///////////////////////////////////////////////////////////////////////// MODE R //////////////////////////////////////////////////////////////////////////////////////////
  setFormControl2() {
    const UAT = JSON.parse(localStorage.getItem("UAT"));
    if (UAT == true) { this.setText = false; this.setButton = false; };
    this.compareForm = this.fb.group({
      OFFICE_CODE: new FormControl(""),
      OFFICE_ID: new FormControl(""),
      OFFICE_NAME: new FormControl(""),
      OFFICE_SHORT_NAME: new FormControl(""),
      COMPARE_DATE: new FormControl(""),
      COMPARE_TIME: new FormControl(""),
      SET_COMPARE_DATE: new FormControl(""),
      SET_COMPARE_TIME: new FormControl(""),
      IS_OUTSIDE: new FormControl(""),
      COMPARE_NO: new FormControl(""),
      COMPARE_NO_YEAR: new FormControl(""),
      SET_COMPARE_NO_YEAR: new FormControl(""),
      CompareStaff: this.fb.array([this.set_CONTRIBUTOR_ID27(), this.set_CONTRIBUTOR_ID29(), this.set_CONTRIBUTOR_ID30(), this.set_CONTRIBUTOR_ID31()]),
      aboutPayFine: this.fb.array([]),
      BRIBE_RATE: new FormControl(""),
      REWARD_RATE: new FormControl(""),
      TREASURY_RATE: new FormControl(""),
      ARREST_CODE: new FormControl(""),
      OCCURRENCE_DATE: new FormControl(""),
      OCCURRENCE_TIME: new FormControl(""),
      ARREST_STAFF: new FormControl(""),
      ACCUSER_MANAGEMENT_POS_NAME: new FormControl(""),
      ACCUSER_OPERATION_OFFICE_SHORT_NAME: new FormControl(""),
      SUB_DISTRICT_NAME: new FormControl(""),
      ARREST_LAWSUIT_NO: new FormControl(""),
      ARREST_LAWSUIT_NO_YEAR: new FormControl(""),
      ARREST_LAWSUIT_DATE: new FormControl(""),
      ARREST_LAWSUIT_TIME: new FormControl(""),
      PROVE_NO: new FormControl(""),
      PROVE_NO_YEAR: new FormControl(""),
      RECEIVE_DOC_DATE: new FormControl(""),
      RECEIVE_DOC_TIME: new FormControl(""),
      PROVE_DATE: new FormControl(""),
      PROVE_TIME: new FormControl(""),
      SUBSECTION_NAME: new FormControl(""),
      SECTION_NAME: new FormControl(""),
      GUILTBASE_NAME: new FormControl(""),
      PENALTY_DESC: new FormControl(""),
      COMPARE_ID: new FormControl(""),
      LAWSUIT_ID: new FormControl(""),
      IS_ACTIVE: new FormControl(""),
      CREATE_DATE: new FormControl(""),
      CREATE_USER_ACCOUNT_ID: new FormControl(""),
      UPDATE_DATE: new FormControl(""),
      UPDATE_USER_ACCOUNT_ID: new FormControl(""),
    });
  }

  loadData2() {
    ///////////////////////loadForm Mod R/////////////////////////

    this.setButton = false;
    this.preloader.setShowPreloader(true);
    const params = { INDICTMENT_ID: this.INDICTMENT_DETAIL_ID };
    this.fineService.CompareArrestgetByIndictmentID("CompareArrestgetByIndictmentID", params).then(map => {

      this.SECTION_ID = map.SECTION_ID;
      var PROVE_NO; var LAWSUIT_NO;

      if (map.PROVE_NO == null || map.PROVE_NO == 'null') { PROVE_NO = "" } else { PROVE_NO = map.PROVE_NO };
      if (map.LAWSUIT_NO == null || map.LAWSUIT_NO == 'null') { LAWSUIT_NO = "" } else { LAWSUIT_NO = map.LAWSUIT_NO };

      this.compareForm.patchValue({
        ARREST_CODE: map.ARREST_CODE,
        OCCURRENCE_DATE: this.convertDate(map.OCCURRENCE_DATE),
        OCCURRENCE_TIME: this.convertTime(map.OCCURRENCE_DATE),
        ARREST_STAFF: map.ARREST_STAFF_NAME,
        ACCUSER_MANAGEMENT_POS_NAME: map.OPREATION_POS_NAME,
        ACCUSER_OPERATION_OFFICE_SHORT_NAME: map.OPERATION_OFFICE_SHORT_NAME,
        SUB_DISTRICT_NAME: map.SUB_DISTRICT_NAME_TH + " " + map.DISTRICT_NAME_TH + " " + map.PROVINCE_NAME_TH,
        ARREST_LAWSUIT_NO: LAWSUIT_NO.substring(0, LAWSUIT_NO.length - 5),
        ARREST_LAWSUIT_NO_YEAR: map.LAWSUIT_NO_YEAR,
        ARREST_LAWSUIT_DATE: this.convertDate(map.LAWSUIT_DATE),
        ARREST_LAWSUIT_TIME: this.convertTime(map.LAWSUIT_DATE),
        PROVE_NO: PROVE_NO.substring(0, PROVE_NO.length - 5),
        PROVE_NO_YEAR: map.PROVE_NO_YEAR,
        RECEIVE_DOC_DATE: this.convertDate(map.RECEIVE_DOC_DATE),
        RECEIVE_DOC_TIME: this.convertTime(map.RECEIVE_DOC_DATE),
        PROVE_DATE: this.convertDate(map.PROVE_DATE),
        PROVE_TIME: this.convertTime(map.PROVE_DATE),
        SUBSECTION_NAME: map.SUBSECTION_NAME,
        SECTION_NAME: map.SECTION_NAME.substring(6),
        GUILTBASE_NAME: map.GUILTBASE_NAME,
        PENALTY_DESC: map.PENALTY_DESC,
      });

      map.CompareArrestIndictmentDetail.map(m => {
        m.CompareArrestIndictmentProduct.map(p => {
          this.fine01.push(this.fb.group({
            FINE_ESTIMATE: p.FINE_ESTIMATE,
            INDICTMENT_DETAIL_ID: p.INDICTMENT_DETAIL_ID,
            IS_ACTIVE: p.IS_ACTIVE,
            IS_ILLEGAL: p.IS_ILLEGAL,
            PRODUCT_DESC: p.PRODUCT_DESC,
            PRODUCT_GROUP_CODE: p.PRODUCT_GROUP_CODE,
            PRODUCT_GROUP_ID: p.PRODUCT_GROUP_ID,
            PRODUCT_GROUP_NAME: p.PRODUCT_GROUP_NAME,
            PRODUCT_ID: p.PRODUCT_ID,
            PRODUCT_INDICTMENT_ID: p.PRODUCT_INDICTMENT_ID,
            PRICE: p.PRICE,
            QUANTITY: p.QUANTITY,
            QUANTITY_UNIT: p.QUANTITY_UNIT,
            QUATITY_UNIT_ID: p.QUATITY_UNIT_ID,
            SIZES: p.SIZES,
            SIZES_UNIT: p.SIZES_UNIT,
            SIZES_UNIT_ID: p.SIZES_UNIT_ID,
            VOLUMN: p.VOLUMN,
            VOLUMN_UNIT: p.VOLUMN_UNIT,
            VOLUMN_UNIT_ID: p.VOLUMN_UNIT_ID,
          }));
        });
      });

      ///////////////////////////////////////////////get notice_id//////////////////////////////////////////////

      const arrest_id = { "ARREST_ID": map.ARREST_ID }
      this.fineService.CompareNoticegetByArrestID("CompareNoticegetByArrestID", arrest_id).then(list => { if (list.length == 0) { this.NOTICE_ID = 0; } else { this.NOTICE_ID = list[0].NOTICE_ID; }; });
      this.LAWSUIT_ID = map.LAWSUIT_ID;
      this.FINE_TYPE = map.FINE_TYPE;
      this._subsection_id = map.SUBSECTION_ID

      ///////////////////////////////////////////////ComparegetByCon//////////////////////////////////////////////

      const ComparegetByCon = { COMPARE_ID: this.COMPARE_ID }
      this.fineService.ComparegetByCon("ComparegetByCon", ComparegetByCon).then(result => {
        this.isRevenueCheck(result);
        if (result.BRIBE_RATE == 0) { this._CaseBribe = true; this._IsRequestBribe = 0; this._IsRequestTRE += 20; } else { this._CaseBribe = false; }
        if (result.REWARD_RATE == 0) { this._CaseReward = true; this._IsRequestReward = 0; this._IsRequestTRE += 20; } else { this._CaseReward = false; }
        this.compareForm.patchValue({
          OFFICE_CODE: result.OFFICE_CODE,
          OFFICE_ID: result.OFFICE_ID,
          OFFICE_NAME: result.OFFICE_NAME,
          OFFICE_SHORT_NAME: result.OFFICE_NAME,
          COMPARE_DATE: this.convertDate(result.CREATE_DATE),
          COMPARE_TIME: this.convertTime(result.CREATE_DATE),
          SET_COMPARE_DATE: this.convertDate(result.COMPARE_DATE),
          SET_COMPARE_TIME: this.convertTime(result.COMPARE_DATE),
          IS_OUTSIDE: result.IS_OUTSIDE,
          COMPARE_NO: result.COMPARE_NO,
          COMPARE_NO_YEAR: "",
          SET_COMPARE_NO_YEAR: parseInt(result.COMPARE_NO_YEAR.slice(0, 4)) + 543,
          BRIBE_RATE: result.BRIBE_RATE,
          REWARD_RATE: result.REWARD_RATE,
          TREASURY_RATE: result.TREASURY_RATE,
          COMPARE_ID: result.COMPARE_ID,
          LAWSUIT_ID: this.LAWSUIT_ID,
          IS_ACTIVE: result.IS_ACTIVE,
          CREATE_DATE: result.CREATE_DATE,
          CREATE_USER_ACCOUNT_ID: result.CREATE_USER_ACCOUNT_ID,
          UPDATE_DATE: result.UPDATE_DATE || '',
          UPDATE_USER_ACCOUNT_ID: result.UPDATE_USER_ACCOUNT_ID || '',
        });

        this.changeyear(parseInt(result.COMPARE_NO_YEAR.slice(0, 4)));

        let control = <FormArray>this.compareForm.controls.aboutPayFine;
        result.CompareMapping.map(m => {
          m.CompareArrestIndictmentDetail.map(person => {

            ///////////////////////////person////////////////////////////
            if (person.TITLE_SHORT_NAME_TH == 'null') { person.TITLE_SHORT_NAME_TH = ''; };
            if (person.TITLE_SHORT_NAME_EN == 'null') { person.TITLE_SHORT_NAME_EN = ''; };
            if (person.FIRST_NAME == 'null') { person.FIRST_NAME = ''; };
            if (person.MIDDLE_NAME == 'null') { person.MIDDLE_NAME = ''; };
            if (person.LAST_NAME == 'null') { person.LAST_NAME = ''; };
            if (person.COMPANY_NAME == 'null') { person.COMPANY_NAME = ''; };

            var name = '';
            if (person.PERSON_TYPE == 0) { name = `${person.TITLE_SHORT_NAME_TH || ''}${person.FIRST_NAME || ''} ${person.MIDDLE_NAME || ''} ${person.LAST_NAME || ''}`; }
            else if (person.PERSON_TYPE == 1) { name = `${person.TITLE_SHORT_NAME_EN || ''}${person.FIRST_NAME || ''} ${person.MIDDLE_NAME || ''} ${person.LAST_NAME || ''}`; }
            else { name = `${person.TITLE_SHORT_NAME_TH || ''}${person.COMPANY_NAME || ''}`; };

            m.CompareDetail.map(detail => {
              if (detail.COMPARE_TYPE == 1) {

                ///////////////////////////////product//////////////////////////
                let product = new FormArray([]);
                detail.CompareDetailFine.map(f => {
                  product.push(
                    this.fb.group({
                      PRODUCT_DESC: f.PRODUCT_DESC,
                      PRODUCT_GROUP_ID: f.PRODUCT_GROUP_ID,
                      BRIBE_MONEY: f.BRIBE_MONEY,
                      COMPARE_DETAIL_ID: f.COMPARE_DETAIL_ID,
                      DIFFERENCE_PAYMENT_FINE: f.DIFFERENCE_PAYMENT_FINE,
                      FINE: f.FINE,
                      FINE_ID: f.FINE_ID,
                      FINE_RATE: f.FINE_RATE,
                      IS_ACTIVE: f.IS_ACTIVE,
                      NET_FINE: f.NET_FINE,
                      OLD_PAYMENT_FINE: f.OLD_PAYMENT_FINE,
                      PAYMENT_FINE: f.PAYMENT_FINE,
                      PAYMENT_FINE_PIPE: this.convert_Calculator(f.PAYMENT_FINE),
                      TREASURY_MONEY_PIPE: this.convert_Calculator(f.TREASURY_MONEY),
                      BRIBE_MONEY_PIPE: this.convert_Calculator(f.BRIBE_MONEY),
                      REWARD_MONEY_PIPE: this.convert_Calculator(f.REWARD_MONEY),
                      PRODUCT_BRAND_NAME_EN: f.PRODUCT_BRAND_NAME_EN,
                      PRODUCT_BRAND_NAME_TH: f.PRODUCT_BRAND_NAME_TH,
                      PRODUCT_CATEGORY_NAME: f.PRODUCT_CATEGORY_NAME,
                      PRODUCT_GROUP_NAME: f.PRODUCT_GROUP_NAME,
                      PRODUCT_ID: f.PRODUCT_ID,
                      PRODUCT_MODEL_NAME_EN: f.PRODUCT_MODEL_NAME_EN,
                      PRODUCT_MODEL_NAME_TH: f.PRODUCT_MODEL_NAME_TH,
                      PRODUCT_SUBBRAND_NAME_EN: f.PRODUCT_SUBBRAND_NAME_EN,
                      PRODUCT_SUBBRAND_NAME_TH: f.PRODUCT_SUBBRAND_NAME_TH,
                      PRODUCT_SUBSETTYPE_NAME: f.PRODUCT_SUBSETTYPE_NAME,
                      PRODUCT_SUBTYPE_NAME: f.PRODUCT_SUBTYPE_NAME,
                      PRODUCT_TYPE_NAME: f.PRODUCT_TYPE_NAME,
                      QUANTITY: f.QUANTITY,
                      QUANTITY_UNIT: f.QUANTITY_UNIT,
                      REWARD_MONEY: f.REWARD_MONEY,
                      SIZES: f.SIZES,
                      SIZES_UNIT: f.SIZES_UNIT,
                      TREASURY_MONEY: f.TREASURY_MONEY,
                      VAT: f.VAT,
                      VOLUMN: f.VOLUMN,
                      VOLUMN_UNIT: f.VOLUMN_UNIT,
                    }));
                });

                ///////////////////////////////main staff//////////////////////////
                var staff = detail.CompareStaff;
                for (var i = 0; i < this.CompareStaff.length; i++) {
                  for (var j = 0; j < staff.length; j++) {
                    if (this.CompareStaff.at(i).get("CONTRIBUTOR_ID").value == staff[j].CONTRIBUTOR_ID) {
                      this.CompareStaff.at(i).patchValue(this.set_loadStaff(staff[j]));
                    }
                  }
                }

                ///////////////////////////////sub staff//////////////////////////
                let set = this.fb.array([
                  this.set_CONTRIBUTOR_ID28(), this.set_CONTRIBUTOR_ID34(), this.set_CONTRIBUTOR_ID32(), this.set_CONTRIBUTOR_ID33(),
                  this.set_CONTRIBUTOR_ID84(), this.set_CONTRIBUTOR_ID85(), this.set_NULL_CONTRIBUTOR_ID27(), this.set_CONTRIBUTOR_ID29(),
                  this.set_CONTRIBUTOR_ID30(), this.set_CONTRIBUTOR_ID31()]);
                var staff = detail.CompareStaff;
                for (var i = 0; i < set.getRawValue().length; i++) {
                  for (var j = 0; j < staff.length; j++) {
                    if (set.at(i).get("CONTRIBUTOR_ID").value == staff[j].CONTRIBUTOR_ID) {
                      set.at(i).patchValue(this.set_loadStaff(staff[j]));
                    }
                  }
                }

                let backup_set = this.fb.array([this.set_CONTRIBUTOR_ID28(), this.set_CONTRIBUTOR_ID34(), this.set_CONTRIBUTOR_ID32(),
                this.set_CONTRIBUTOR_ID33(), this.set_CONTRIBUTOR_ID84(), this.set_CONTRIBUTOR_ID85(), this.set_NULL_CONTRIBUTOR_ID27(),
                this.set_CONTRIBUTOR_ID29(), this.set_CONTRIBUTOR_ID30(), this.set_CONTRIBUTOR_ID31()]);

                for (var i = 0; i < backup_set.getRawValue().length; i++) {
                  for (var j = 0; j < staff.length; j++) {
                    if (backup_set.at(i).get("CONTRIBUTOR_ID").value == staff[j].CONTRIBUTOR_ID) {
                      backup_set.at(i).patchValue(this.set_loadStaff(staff[j]));
                    }
                  }
                }

                ///////////////////////////////payment//////////////////////////
                let _payment = [];
                let _backup_payment = [];
                let _compare_payment = [];

                if (detail.ComparePayment.length == 0) { }
                else {
                  detail.ComparePayment.map(c => {
                    let BANK_NAME;
                    if (this.BANKING) {
                      this.BANKING.map(m => {
                        if (m.BANK_CODE == c.PAYMENT_BANK) {
                          BANK_NAME = m.BANK_NAME
                        }
                      });
                    }

                    if (c.ComparePaymentDetail.length == 0) {
                      _payment.push({
                        PAYMENT_ID: c.PAYMENT_ID,
                        DETAIL_PAYMENT_ID: c.PAYMENT_ID,
                        COMPARE_DETAIL_ID: c.COMPARE_DETAIL_ID,
                        PAYMENT_TYPE: c.PAYMENT_CHANNEL,
                        PAYMENT_FINE: c.FINE,
                        REFFERENCE_NO: c.PAYMENT_REF_NO || '',
                        PAYMENT_FINE_PIPE: this.convert_Calculator(c.FINE),
                        PAYMENT_BANK: BANK_NAME || '',
                        PAYMENT_CODE: c.PAYMENT_BANK || '',
                        LAWSUIT_DETAIL_ID: c.LAWSUIT_DETAIL_ID,
                        FINE_TYPE: c.FINE_TYPE,
                        FINE: c.FINE,
                        PAYMENT_PERIOD_NO: c.PAYMENT_PERIOD_NO,
                        PAYMENT_DATE: c.PAYMENT_DATE,
                        IS_REQUEST_REWARD: c.IS_REQUEST_REWARD,
                        IS_ACTIVE: c.IS_ACTIVE,
                        PAYMENT_CHANNEL: c.PAYMENT_CHANNEL,
                        PAYMENT_REF_NO: c.PAYMENT_REF_NO,
                        IS_REVENUE: c.IS_REVENUE,
                        ComparePaymentDetail_PAYMENT_DETAIL_ID: '',
                        ComparePaymentDetail_PAYMENT_ID: '',
                        ComparePaymentDetail_NOTICE_ID: '',
                        ComparePaymentDetail_IS_REQUEST_BRIBE: '',
                        ComparePaymentDetail_IS_ACTIVE: ''

                      });
                      _backup_payment.push({
                        PAYMENT_ID: c.PAYMENT_ID,
                        DETAIL_PAYMENT_ID: c.PAYMENT_ID,
                        COMPARE_DETAIL_ID: c.COMPARE_DETAIL_ID,
                        PAYMENT_TYPE: c.PAYMENT_CHANNEL,
                        PAYMENT_FINE: c.FINE,
                        REFFERENCE_NO: c.PAYMENT_REF_NO || '',
                        PAYMENT_FINE_PIPE: this.convert_Calculator(c.FINE),
                        PAYMENT_BANK: BANK_NAME || '',
                        PAYMENT_CODE: c.PAYMENT_BANK || '',
                        LAWSUIT_DETAIL_ID: c.LAWSUIT_DETAIL_ID,
                        FINE_TYPE: c.FINE_TYPE,
                        FINE: c.FINE,
                        PAYMENT_PERIOD_NO: c.PAYMENT_PERIOD_NO,
                        PAYMENT_DATE: c.PAYMENT_DATE,
                        IS_REQUEST_REWARD: c.IS_REQUEST_REWARD,
                        IS_ACTIVE: c.IS_ACTIVE,
                        PAYMENT_CHANNEL: c.PAYMENT_CHANNEL,
                        PAYMENT_REF_NO: c.PAYMENT_REF_NO,
                        IS_REVENUE: c.IS_REVENUE,
                        ComparePaymentDetail_PAYMENT_DETAIL_ID: '',
                        ComparePaymentDetail_PAYMENT_ID: '',
                        ComparePaymentDetail_NOTICE_ID: '',
                        ComparePaymentDetail_IS_REQUEST_BRIBE: '',
                        ComparePaymentDetail_IS_ACTIVE: ''
                      });
                      _compare_payment.push({
                        PAYMENT_ID: c.PAYMENT_ID,
                        DETAIL_PAYMENT_ID: c.PAYMENT_ID,
                        COMPARE_DETAIL_ID: c.COMPARE_DETAIL_ID,
                        PAYMENT_TYPE: c.PAYMENT_CHANNEL,
                        PAYMENT_FINE: c.FINE,
                        REFFERENCE_NO: c.PAYMENT_REF_NO || '',
                        PAYMENT_FINE_PIPE: this.convert_Calculator(c.FINE),
                        PAYMENT_BANK: BANK_NAME || '',
                        PAYMENT_CODE: c.PAYMENT_BANK || '',
                        LAWSUIT_DETAIL_ID: c.LAWSUIT_DETAIL_ID,
                        FINE_TYPE: c.FINE_TYPE,
                        FINE: c.FINE,
                        PAYMENT_PERIOD_NO: c.PAYMENT_PERIOD_NO,
                        PAYMENT_DATE: c.PAYMENT_DATE,
                        IS_REQUEST_REWARD: c.IS_REQUEST_REWARD,
                        IS_ACTIVE: c.IS_ACTIVE,
                        PAYMENT_CHANNEL: c.PAYMENT_CHANNEL,
                        PAYMENT_REF_NO: c.PAYMENT_REF_NO,
                        IS_REVENUE: c.IS_REVENUE,
                        ComparePaymentDetail_PAYMENT_DETAIL_ID: '',
                        ComparePaymentDetail_PAYMENT_ID: '',
                        ComparePaymentDetail_NOTICE_ID: '',
                        ComparePaymentDetail_IS_REQUEST_BRIBE: '',
                        ComparePaymentDetail_IS_ACTIVE: ''
                      });
                    } else {
                      c.ComparePaymentDetail.map(pd => {
                        _payment.push({
                          PAYMENT_ID: c.PAYMENT_ID,
                          DETAIL_PAYMENT_ID: c.PAYMENT_ID,
                          COMPARE_DETAIL_ID: c.COMPARE_DETAIL_ID,
                          PAYMENT_TYPE: c.PAYMENT_CHANNEL,
                          PAYMENT_FINE: c.FINE,
                          REFFERENCE_NO: c.PAYMENT_REF_NO || '',
                          PAYMENT_FINE_PIPE: this.convert_Calculator(c.FINE),
                          PAYMENT_BANK: BANK_NAME || '',
                          PAYMENT_CODE: c.PAYMENT_BANK || '',
                          LAWSUIT_DETAIL_ID: c.LAWSUIT_DETAIL_ID,
                          FINE_TYPE: c.FINE_TYPE,
                          FINE: c.FINE,
                          PAYMENT_PERIOD_NO: c.PAYMENT_PERIOD_NO,
                          PAYMENT_DATE: c.PAYMENT_DATE,
                          IS_REQUEST_REWARD: c.IS_REQUEST_REWARD,
                          IS_ACTIVE: c.IS_ACTIVE,
                          PAYMENT_CHANNEL: c.PAYMENT_CHANNEL,
                          PAYMENT_REF_NO: c.PAYMENT_REF_NO,
                          IS_REVENUE: c.IS_REVENUE,
                          ComparePaymentDetail_PAYMENT_DETAIL_ID: pd.PAYMENT_DETAIL_ID,
                          ComparePaymentDetail_PAYMENT_ID: pd.PAYMENT_ID,
                          ComparePaymentDetail_NOTICE_ID: pd.NOTICE_ID,
                          ComparePaymentDetail_IS_REQUEST_BRIBE: pd.IS_REQUEST_BRIBE,
                          ComparePaymentDetail_IS_ACTIVE: pd.IS_ACTIVE

                        });
                        _backup_payment.push({
                          PAYMENT_ID: c.PAYMENT_ID,
                          DETAIL_PAYMENT_ID: c.PAYMENT_ID,
                          COMPARE_DETAIL_ID: c.COMPARE_DETAIL_ID,
                          PAYMENT_TYPE: c.PAYMENT_CHANNEL,
                          PAYMENT_FINE: c.FINE,
                          REFFERENCE_NO: c.PAYMENT_REF_NO || '',
                          PAYMENT_FINE_PIPE: this.convert_Calculator(c.FINE),
                          PAYMENT_BANK: BANK_NAME || '',
                          PAYMENT_CODE: c.PAYMENT_BANK || '',
                          LAWSUIT_DETAIL_ID: c.LAWSUIT_DETAIL_ID,
                          FINE_TYPE: c.FINE_TYPE,
                          FINE: c.FINE,
                          PAYMENT_PERIOD_NO: c.PAYMENT_PERIOD_NO,
                          PAYMENT_DATE: c.PAYMENT_DATE,
                          IS_REQUEST_REWARD: c.IS_REQUEST_REWARD,
                          IS_ACTIVE: c.IS_ACTIVE,
                          PAYMENT_CHANNEL: c.PAYMENT_CHANNEL,
                          PAYMENT_REF_NO: c.PAYMENT_REF_NO,
                          IS_REVENUE: c.IS_REVENUE,
                          ComparePaymentDetail_PAYMENT_DETAIL_ID: pd.PAYMENT_DETAIL_ID,
                          ComparePaymentDetail_PAYMENT_ID: pd.PAYMENT_ID,
                          ComparePaymentDetail_NOTICE_ID: pd.NOTICE_ID,
                          ComparePaymentDetail_IS_REQUEST_BRIBE: pd.IS_REQUEST_BRIBE,
                          ComparePaymentDetail_IS_ACTIVE: pd.IS_ACTIVE
                        });
                        _compare_payment.push({
                          PAYMENT_ID: c.PAYMENT_ID,
                          DETAIL_PAYMENT_ID: c.PAYMENT_ID,
                          COMPARE_DETAIL_ID: c.COMPARE_DETAIL_ID,
                          PAYMENT_TYPE: c.PAYMENT_CHANNEL,
                          PAYMENT_FINE: c.FINE,
                          REFFERENCE_NO: c.PAYMENT_REF_NO || '',
                          PAYMENT_FINE_PIPE: this.convert_Calculator(c.FINE),
                          PAYMENT_BANK: BANK_NAME || '',
                          PAYMENT_CODE: c.PAYMENT_BANK || '',
                          LAWSUIT_DETAIL_ID: c.LAWSUIT_DETAIL_ID,
                          FINE_TYPE: c.FINE_TYPE,
                          FINE: c.FINE,
                          PAYMENT_PERIOD_NO: c.PAYMENT_PERIOD_NO,
                          PAYMENT_DATE: c.PAYMENT_DATE,
                          IS_REQUEST_REWARD: c.IS_REQUEST_REWARD,
                          IS_ACTIVE: c.IS_ACTIVE,
                          PAYMENT_CHANNEL: c.PAYMENT_CHANNEL,
                          PAYMENT_REF_NO: c.PAYMENT_REF_NO,
                          IS_REVENUE: c.IS_REVENUE,
                          ComparePaymentDetail_PAYMENT_DETAIL_ID: pd.PAYMENT_DETAIL_ID,
                          ComparePaymentDetail_PAYMENT_ID: pd.PAYMENT_ID,
                          ComparePaymentDetail_NOTICE_ID: pd.NOTICE_ID,
                          ComparePaymentDetail_IS_REQUEST_BRIBE: pd.IS_REQUEST_BRIBE,
                          ComparePaymentDetail_IS_ACTIVE: pd.IS_ACTIVE
                        });
                      });
                    }

                  });
                }

                var IS_CHECK; if (detail.IS_INSURANCE == 1 || detail.IS_GAURANTEE == 1) { IS_CHECK = "/" } else { IS_CHECK = "" };
                var STAFF_NAME = set.at(0).get("FULL_NAME").value;
                var CHECK_APPROVE;
                if (detail.COMMAND_NO == '' || detail.COMMAND_NO == null) { CHECK_APPROVE = '' }
                else if (detail.APPROVE_TYPE == 1) { CHECK_APPROVE = 1 }
                else if (detail.APPROVE_TYPE == 2) { CHECK_APPROVE = 2 }
                else if (detail.APPROVE_TYPE == 3) { CHECK_APPROVE = 3 }
                else if (detail.APPROVE_TYPE == 4) { CHECK_APPROVE = 4 }
                else if (detail.COMMAND_NO !== '' || detail.COMMAND_NO !== null) { CHECK_APPROVE = 5 };

                var PAYMENT_FINE = 0;
                var TREASURY_MONEY = 0;
                var BRIBE_MONEY = 0;
                var REWARD_MONEY = 0;
                for (var i = 0; i < product.value.length; i++) {
                  PAYMENT_FINE += product.value[i].PAYMENT_FINE;
                  TREASURY_MONEY += product.value[i].TREASURY_MONEY;
                  BRIBE_MONEY += product.value[i].BRIBE_MONEY;
                  REWARD_MONEY += product.value[i].REWARD_MONEY;
                }

                if (detail.RECEIPT_NO == '' || detail.RECEIPT_NO == null || detail.RECEIPT_NO == 0 || detail.RECEIPT_NO == '0') { detail.RECEIPT_NO = "" } else { detail.RECEIPT_NO = detail.RECEIPT_NO.toString(); };
                if (detail.RECEIPT_BOOK_NO == '' || detail.RECEIPT_BOOK_NO == null || detail.RECEIPT_BOOK_NO == 0 || detail.RECEIPT_BOOK_NO == '0') { detail.RECEIPT_BOOK_NO = "" } else { detail.RECEIPT_BOOK_NO = detail.RECEIPT_BOOK_NO.toString(); };

                var PAYMENT_AMOUNT; if (detail.IS_PAYMENT == 1) { PAYMENT_AMOUNT = detail.PAYMENT_FINE } else { PAYMENT_AMOUNT = '' }

                control.push(this.fb.group({
                  COMPARE_MAPPING_ID: new FormControl(m.COMPARE_MAPPING_ID),
                  COMPARE_ID: new FormControl(m.COMPARE_ID),
                  PAST_LAWSUIT_ID: new FormControl(m.PAST_LAWSUIT_ID),
                  IS_EVER_WRONG: new FormControl(m.IS_EVER_WRONG),
                  MAP_IS_ACTIVE: new FormControl(m.IS_ACTIVE),
                  COMPARE_DETAIL_ID: new FormControl(detail.COMPARE_DETAIL_ID),
                  DID: new FormControl(detail.DID || ''),
                  DE_IS_ACTIVE: new FormControl(detail.IS_ACTIVE),
                  DE_COMPARE_MAPPING_ID: new FormControl(detail.COMPARE_MAPPING_ID),
                  MAP_INDICTMENT_DETAIL_ID: new FormControl(m.INDICTMENT_DETAIL_ID),
                  OLD_PAYMENT_FINE: new FormControl(detail.OLD_PAYMENT_FINE),
                  DIFFERENCE_PAYMENT_FINE: new FormControl(detail.DIFFERENCE_PAYMENT_FINE),
                  ADJUST_REASON: new FormControl(detail.ADJUST_REASON),

                  COMPARE_TYPE: new FormControl(detail.COMPARE_TYPE),
                  IS_TEMP_RELEASE: new FormControl(detail.IS_TEMP_RELEASE),
                  IS_REVENUE: new FormControl(detail.IS_REVENUE),
                  IS_AUTHORITY: new FormControl(detail.IS_AUTHORITY),
                  product: product,
                  PAYMENT_FINE: new FormControl(parseFloat(PAYMENT_FINE.toFixed(2))),
                  TREASURY_MONEY: new FormControl(parseFloat(TREASURY_MONEY.toFixed(2))),
                  BRIBE_MONEY: new FormControl(parseFloat(BRIBE_MONEY.toFixed(2))),
                  REWARD_MONEY: new FormControl(parseFloat(REWARD_MONEY.toFixed(2))),
                  CompareStaffDetail: set,
                  backup_CompareStaffDetail: backup_set,
                  /////////////////////////////person detail//////////////////////////////
                  NAME: new FormControl(name),
                  MISTREAT: new FormControl(detail.MISTREAT_NO),
                  PERSON_ID: new FormControl(person.PERSON_ID),
                  SUBSECTION_NAME: new FormControl(map.SUBSECTION_NAME || ''),
                  COMPANY_REGISTRATION_NO: new FormControl(person.COMPANY_REGISTRATION_NO || ''),
                  ENTITY_TYPE: new FormControl(person.ENTITY_TYPE || ''),
                  EXCISE_REGISTRATION_NO: new FormControl(person.EXCISE_REGISTRATION_NO || ''),
                  FIRST_NAME: new FormControl(person.FIRST_NAME || ''),
                  ID_CARD: new FormControl(person.ID_CARD || ''),
                  INDICTMENT_DETAIL_ID: new FormControl(person.INDICTMENT_DETAIL_ID || ''),
                  INDICTMENT_ID: new FormControl(person.INDICTMENT_ID || ''),
                  LAST_NAME: new FormControl(person.LAST_NAME || ''),
                  LAWBREAKER_ID: new FormControl(person.LAWBREAKER_ID || ''),
                  MIDDLE_NAME: new FormControl(person.MIDDLE_NAME || ''),
                  OTHER_NAME: new FormControl(person.OTHER_NAME || ''),
                  PASSPORT_NO: new FormControl(person.PASSPORT_NO || ''),
                  PERSON_TYPE: new FormControl(person.PERSON_TYPE || ''),
                  TITLE_NAME_EN: new FormControl(person.TITLE_NAME_EN || ''),
                  TITLE_NAME_TH: new FormControl(person.TITLE_NAME_TH || ''),
                  TITLE_SHORT_NAME_EN: new FormControl(person.TITLE_SHORT_NAME_EN || ''),
                  TITLE_SHORT_NAME_TH: new FormControl(person.TITLE_SHORT_NAME_TH || ''),

                  /////////////////////////////request detail//////////////////////////////
                  //html
                  PAYMENT_FINE_DUE_DATE: this.convertDate(detail.PAYMENT_FINE_DUE_DATE),
                  PAYMENT_FINE_DUE_DATE_TIME: this.convertTime(detail.PAYMENT_FINE_DUE_DATE),
                  PAYMENT_VAT_DUE_DATE: this.convertDate(detail.PAYMENT_VAT_DUE_DATE),
                  PAYMENT_VAT_DUE_DATE_TIME: this.convertTime(detail.PAYMENT_VAT_DUE_DATE),
                  //popup
                  IS_CHECK: new FormControl(IS_CHECK),
                  IS_REQUEST: new FormControl(detail.IS_REQUEST),
                  IS_INSURANCE: new FormControl(detail.IS_INSURANCE, [Validators.requiredTrue]),
                  INSURANCE: new FormControl(detail.INSURANCE || ''),
                  IS_GAURANTEE: new FormControl(detail.IS_GAURANTEE, [Validators.requiredTrue]),
                  GAURANTEE: new FormControl(detail.GAURANTEE || ''),

                  /////////////////////////////payment detail//////////////////////////////
                  //html
                  PAYMENT_OFFICE_NAME: new FormControl(detail.RECEIPT_OFFICE_NAME),
                  RECEIPT_OFFICE_ID: new FormControl(detail.RECEIPT_OFFICE_ID),
                  PAYMENT_OFFICE_CODE: new FormControl(detail.RECEIPT_OFFICE_CODE),
                  PAYMENT_AMOUNT: new FormControl(PAYMENT_AMOUNT),
                  STAFF_NAME_28: new FormControl(STAFF_NAME),
                  //popup
                  PAYMENT_DATE: this.convertDate(detail.PAYMENT_DATE),
                  PAYMENT_TIME: this.convertTime(detail.PAYMENT_DATE),
                  RECEIPT_BOOK_NO: new FormControl(this.conVNUMFIVE(detail.RECEIPT_BOOK_NO)),
                  RECEIPT_NO: new FormControl(this.conVNUMTWO(detail.RECEIPT_NO)),
                  RECEIPT_TYPE: new FormControl(detail.RECEIPT_TYPE),
                  IS_PAYMENT: new FormControl(detail.IS_PAYMENT),
                  BACKUP_IS_PAYMENT: new FormControl(detail.IS_PAYMENT),
                  payment: [_payment],
                  backup_payment: [_backup_payment],
                  compare_payment: [_compare_payment],
                  /////////////////////////////approve detail//////////////////////////////
                  APPROVE_OFFICE_NAME: new FormControl(detail.APPROVE_OFFICE_NAME || ''),
                  APPROVE_OFFICE_ID: new FormControl(detail.APPROVE_OFFICE_ID || ''),
                  APPROVE_OFFICE_CODE: new FormControl(detail.APPROVE_OFFICE_CODE || ''),
                  APPROVE_TYPE: new FormControl(detail.APPROVE_TYPE),
                  APPROVE_DATE: this.convertDate(detail.APPROVE_DATE),
                  APPROVE_TIME: this.convertTime(detail.APPROVE_DATE),
                  COMMAND_DATE: this.convertDate(detail.COMMAND_DATE),
                  COMMAND_TIME: this.convertTime(detail.COMMAND_DATE),
                  COMMAND_NO: new FormControl(detail.COMMAND_NO || ''),
                  COMPARE_REASON: new FormControl(detail.COMPARE_REASON || ''),
                  FACT: new FormControl(detail.FACT || ''),
                  IS_APPROVE: new FormControl(detail.IS_APPROVE),
                  IS_AGREE: new FormControl(detail.IS_AGREE),
                  REMARK_NOT_AGREE: new FormControl(detail.REMARK_NOT_AGREE || ''),
                  REMARK_NOT_APPROVE: new FormControl(detail.REMARK_NOT_APPROVE || ''),
                  CHECK_APPROVE: new FormControl(CHECK_APPROVE),
                }));

                this.preloader.setShowPreloader(false);
              }
            });
          });
        });
        this.fineService.GetDocumentByCon(6, this.COMPARE_ID).subscribe(async res => {
          this.fileList = [];
          let temp: any;
          temp = res;
          temp.map(m => {
            if (m.IS_ACTIVE === "1") {
              let f = m;
              let idx = f.FILE_PATH.lastIndexOf('.');
              let FILE_TYPE = (idx < 1) ? "" : f.FILE_PATH.substr(idx + 1);
              switch (FILE_TYPE) {
                case FileType.xlsx:
                case FileType.xls:
                  m.IMAGE_SHOW = ImageDocument.xlsx;
                  break;
                case FileType.doc:
                case FileType.docx:
                  m.IMAGE_SHOW = ImageDocument.docx;
                  break;
                case FileType.pdf:
                  m.IMAGE_SHOW = ImageDocument.pdf;
                  break;
                case FileType.jpg:
                case FileType.jpeg:
                case FileType.png:
                case FileType.gif:
                  m.IMAGE_SHOW = this.fineService.getImage(f.DOCUMENT_ID);
                  break;
              }
              this.fileList.push(m);
              this.BACKUP_fileList.push(m);
            }
          })
        })
        this.preloader.setShowPreloader(false);

      }).catch(e => {
        console.log("e : ", e)
        // this.preloader.setShowPreloader(false);
        // swal({
        //   type: 'warning',
        //   text: "ไม่สามารถโหลดข้อมูลได้",
        //   confirmButtonText: 'ตกลง',
        //   buttonsStyling: true,
        // }).then(s => {
        //   location.reload();
        // });
      });
    }).catch(e => {
      console.log("e : ", e)
      this.preloader.setShowPreloader(false);
      swal({
        type: 'warning',
        text: "ไม่สามารถโหลดข้อมูลได้",
        confirmButtonText: 'ตกลง',
        buttonsStyling: true,
      }).then(s => {
        location.reload();
      });
    });
  }

  conVNUMFIVE(e) {
    let para;
    if (e == '') { return para = '' }
    else if (e.length == 5) { return para = `${e}` }
    else if (e.length == 4) { return para = `${"0"}${e}` }
    else if (e.length == 3) { return para = `${"00"}${e}` }
    else if (e.length == 2) { return para = `${"000"}${e}` }
    else if (e.length == 1) { return para = `${"0000"}${e}` }
    else if (e.length == 0) { return para = `${"00001"}` }
    else { return para = `${e}` }
  }

  conVNUMTWO(e) {
    let para;
    if (e == '') { return para = '' }
    else if (e.length == 2) { return para = `${e}` }
    else if (e.length == 1) { return para = `${"0"}${e}` }
    else if (e.length == 0) { return para = `${"01"}` }
    else { return para = `${e}` }
  }

  private set_loadStaff(e) {
    const staff = e;
    var title; if (staff.TITLE_SHORT_NAME_TH == '' || staff.TITLE_SHORT_NAME_TH == null) { title = staff.TITLE_NAME_TH; } else { title = staff.TITLE_SHORT_NAME_TH }

    const CompareFormControl = {
      FULL_NAME: `${title}${staff.FIRST_NAME} ${staff.LAST_NAME}`,
      STAFF_ID: staff.STAFF_ID || '',
      COMPARE_ID: this.COMPARE_ID || '',
      COMPARE_DETAIL_ID: this.COMPARE_DETAIL_ID || '',
      STAFF_REF_ID: staff.STAFF_REF_ID || '',
      TITLE_ID: staff.TITLE_ID || '',
      STAFF_CODE: staff.STAFF_CODE || '',
      ID_CARD: staff.ID_CARD || '',
      STAFF_TYPE: staff.STAFF_TYPE || '',
      TITLE_NAME_TH: staff.TITLE_NAME_TH || '',
      TITLE_NAME_EN: staff.TITLE_NAME_EN || '',
      TITLE_SHORT_NAME_TH: staff.TITLE_SHORT_NAME_TH || '',
      TITLE_SHORT_NAME_EN: staff.TITLE_SHORT_NAME_EN || '',
      FIRST_NAME: staff.FIRST_NAME || '',
      LAST_NAME: staff.LAST_NAME || '',
      AGE: staff.AGE || '',
      OPERATION_POS_CODE: staff.OPERATION_POS_CODE || '',
      OPREATION_POS_NAME: staff.OPREATION_POS_NAME || '',
      OPREATION_POS_LEVEL: staff.OPREATION_POS_LEVEL || '',
      OPERATION_POS_LEVEL_NAME: staff.OPERATION_POS_LEVEL_NAME || '',
      OPERATION_DEPT_CODE: staff.OPERATION_DEPT_CODE || '',
      OPERATION_DEPT_NAME: staff.OPERATION_DEPT_NAME || '',
      OPERATION_DEPT_LEVEL: staff.OPERATION_DEPT_LEVEL || '',
      OPERATION_UNDER_DEPT_CODE: staff.OPERATION_UNDER_DEPT_CODE || '',
      OPERATION_UNDER_DEPT_NAME: staff.OPERATION_UNDER_DEPT_NAME || '',
      OPERATION_UNDER_DEPT_LEVEL: staff.OPERATION_UNDER_DEPT_LEVEL || '',
      OPERATION_WORK_DEPT_CODE: staff.OPERATION_WORK_DEPT_CODE || '',
      OPERATION_WORK_DEPT_NAME: staff.OPERATION_WORK_DEPT_NAME || '',
      OPERATION_WORK_DEPT_LEVEL: staff.OPERATION_WORK_DEPT_LEVEL || '',
      OPERATION_OFFICE_CODE: staff.OPERATION_OFFICE_CODE || '',
      OPERATION_OFFICE_NAME: staff.OPERATION_OFFICE_NAME || '',
      OPERATION_OFFICE_SHORT_NAME: staff.OPERATION_OFFICE_SHORT_NAME || '',
      MANAGEMENT_POS_CODE: staff.MANAGEMENT_POS_CODE || '',
      MANAGEMENT_POS_NAME: staff.MANAGEMENT_POS_NAME || '',
      MANAGEMENT_POS_LEVEL: staff.MANAGEMENT_POS_LEVEL || '',
      MANAGEMENT_POS_LEVEL_NAME: staff.MANAGEMENT_POS_LEVEL_NAME || '',
      MANAGEMENT_DEPT_CODE: staff.MANAGEMENT_DEPT_CODE || '',
      MANAGEMENT_DEPT_NAME: staff.MANAGEMENT_DEPT_NAME || '',
      MANAGEMENT_DEPT_LEVEL: staff.MANAGEMENT_DEPT_LEVEL || '',
      MANAGEMENT_UNDER_DEPT_CODE: staff.MANAGEMENT_UNDER_DEPT_CODE || '',
      MANAGEMENT_UNDER_DEPT_NAME: staff.MANAGEMENT_UNDER_DEPT_NAME || '',
      MANAGEMENT_UNDER_DEPT_LEVEL: staff.MANAGEMENT_UNDER_DEPT_LEVEL || '',
      MANAGEMENT_WORK_DEPT_CODE: staff.MANAGEMENT_WORK_DEPT_CODE || '',
      MANAGEMENT_WORK_DEPT_NAME: staff.MANAGEMENT_WORK_DEPT_NAME || '',
      MANAGEMENT_WORK_DEPT_LEVEL: staff.MANAGEMENT_WORK_DEPT_LEVEL || '',
      MANAGEMENT_OFFICE_CODE: staff.MANAGEMENT_OFFICE_CODE || '',
      MANAGEMENT_OFFICE_NAME: staff.MANAGEMENT_OFFICE_NAME || '',
      MANAGEMENT_OFFICE_SHORT_NAME: staff.MANAGEMENT_OFFICE_SHORT_NAME || '',
      REPRESENTATION_POS_CODE: staff.REPRESENTATION_POS_CODE || '',
      REPRESENTATION_POS_NAME: staff.REPRESENTATION_POS_NAME || '',
      REPRESENTATION_POS_LEVEL: staff.REPRESENTATION_POS_LEVEL || '',
      REPRESENTATION_POS_LEVEL_NAME: staff.REPRESENTATION_POS_LEVEL_NAME || '',
      REPRESENTATION_DEPT_CODE: staff.REPRESENTATION_DEPT_CODE || '',
      REPRESENTATION_DEPT_NAME: staff.REPRESENTATION_DEPT_NAME || '',
      REPRESENTATION_DEPT_LEVEL: staff.REPRESENTATION_DEPT_LEVEL || '',
      REPRESENTATION_UNDER_DEPT_CODE: staff.REPRESENTATION_UNDER_DEPT_CODE || '',
      REPRESENTATION_UNDER_DEPT_NAME: staff.REPRESENTATION_UNDER_DEPT_NAME || '',
      REPRESENTATION_UNDER_DEPT_LEVEL: staff.REPRESENTATION_UNDER_DEPT_LEVEL || '',
      REPRESENT_WORK_DEPT_CODE: staff.REPRESENT_WORK_DEPT_CODE || '',
      REPRESENT_WORK_DEPT_NAME: staff.REPRESENT_WORK_DEPT_NAME || '',
      REPRESENT_WORK_DEPT_LEVEL: staff.REPRESENT_WORK_DEPT_LEVEL || '',
      REPRESENT_OFFICE_CODE: staff.REPRESENT_OFFICE_CODE || '',
      REPRESENT_OFFICE_NAME: staff.REPRESENT_OFFICE_NAME || '',
      REPRESENT_OFFICE_SHORT_NAME: staff.REPRESENT_OFFICE_SHORT_NAME || '',
      STATUS: staff.STATUS || '',
      REMARK: staff.REMARK || '',
      CONTRIBUTOR_ID: staff.CONTRIBUTOR_ID || '',
      IS_ACTIVE: staff.IS_ACTIVE || ''
    }
    return CompareFormControl
  }

  ///////////////////////////////////////////////////////////////////////// ILG60_MAS_01_01_02_01 //////////////////////////////////////////////////////////////////////////////////////////
  mistPopup(item, i) {
    this.fine_detail_m = [];
    this.fineService.PersonDetailgetByPersonId("PersonDetailgetByPersonId", { PERSON_ID: item.PERSON_ID, SUBSECTION_ID: this._subsection_id }).then(list => {

      var ARREST_LAWBREAKER_DETAILS = list.ARREST_LAWBREAKER_DETAILS;
      ARREST_LAWBREAKER_DETAILS.map(m => {
        if (m.SECTION_ID == this.SECTION_ID) {
          var _year = m.LAWSUIT_NO_YEAR.slice(0, 4) + "";
          var __year = parseInt(_year);
          var year = __year + 543;
          var pay; if (m.PAYMENT_FINE == null) { pay = "ยังไม่ทำการเปรียบเทียบคดี"; } else { pay = m.PAYMENT_FINE; };
          var LAWSUIT_NO; if (m.LAWSUIT_NO == null || m.LAWSUIT_NO_YEAR == null) { LAWSUIT_NO = '' } else { LAWSUIT_NO = m.LAWSUIT_NO + '/' + (parseInt(m.LAWSUIT_NO_YEAR.slice(0, 4)) + 543) };
          this.fine_detail_m.push({
            ARREST_CODE: m.ARREST_CODE || '',
            LAWSUIT_NO: m.LAWSUIT_NO + '/' + year || '',
            LOCALE_ADDRESS: m.LOCALE_ADDRESS || '',
            SECTION_ID: m.SECTION_ID || '',
            SUBSECTION_NAME: m.GUILTBASE_NAME || '',
            PRODUCT_GROUP_NAME: m.PRODUCT_GROUP_NAMES || '',
            ARREST_STAFF_NAME: m.ARREST_STAFF_NAME || '',
            ARREST_STAFF_OFFICE_NAME: m.ARREST_STAFF_OFFICE_NAME || '',
            LAWSUIT_STAFF_NAME: m.LAWSUIT_STAFF_NAME || '',
            LAWSUIT_END: m.LAWSUIT_END || '',
            PAYMENT_FINE: pay || '',
            LAWSUIT_NO_YEAR: m.LAWSUIT_NO_YEAR || '',
            COMPARE_NO: LAWSUIT_NO || '',
          });
        }
      });
    }).catch(e => {
      swal({
        type: 'warning',
        text: "ไม่สามารถโหลดข้อมูลได้",
        confirmButtonText: 'ตกลง',
        buttonsStyling: true,
      });
    });
  }

  ///////////////////////////////////////////////////////////////////////// ILG60_MAS_01_01_02_02 //////////////////////////////////////////////////////////////////////////////////////////
  productPopup(item, i) {
    let list = this.fine01.getRawValue();
    this.fine_detail_p = list;
    if (list.length == 0) {
      swal({
        type: 'warning',
        text: "ไม่พบข้อมูลของกลาง",
        confirmButtonText: 'ตกลง',
        reverseButtons: false,
      });
    }
  }

  setToFixedByPid(P_ID: any): string {
    let toFixed: string;
    switch (parseInt(P_ID)) {
      case 1:
      case 2:
      case 13:
        toFixed = '1.3-3';
        break;
      default:
        toFixed = '1.0';
        break;
    }
    return toFixed;
  }

  /////////////////////////////////////////////////////////////////////////// ILG60_O_05_00_02_01 //////////////////////////////////////////////////////////////////////////////////////////

  ILG60_O_05_00_02_01(item, i) {
    this.Return_ILG60_O_05_00_02_01(
      item.NAME, item.INSURANCE, item.GAURANTEE, item.IS_INSURANCE, item.IS_GAURANTEE, this.showEditField
    ).pipe(take(1) // take() manages unsubscription for us
    ).subscribe(result => { this.Result_ILG60_O_05_00_02_01(result, i); });
  };

  Return_ILG60_O_05_00_02_01(
    NAME: string, INSURANCE: string, GAURANTEE: string, INSURANCE_CHECKBOX: number, GAURANTEE_CHECKBOX: number, showEditField: any,
  ): Observable<string> {
    const modal = this.ngbModal.open(ILG60_O_05_00_02_01, { size: 'lg', centered: true });

    modal.componentInstance.NAME = NAME;
    modal.componentInstance.INSURANCE = INSURANCE;
    modal.componentInstance.GAURANTEE = GAURANTEE;
    modal.componentInstance.INSURANCE_CHECKBOX = INSURANCE_CHECKBOX;
    modal.componentInstance.GAURANTEE_CHECKBOX = GAURANTEE_CHECKBOX;
    modal.componentInstance.showEditField = showEditField;
    return from(modal.result).pipe(
      catchError(error => {
        console.warn(error);
        return of(undefined);
      })
    );
  }

  Result_ILG60_O_05_00_02_01(result, i) {
    if (result == null) {
      // console.log("dissmiss");
    }
    else if (result[0].INSURANCE_CHECKBOX == 0 && result[0].GAURANTEE_CHECKBOX == 0) {
      this.AboutPayFine.at(i).patchValue({
        IS_REQUEST: 0,
        IS_CHECK: "",
        IS_INSURANCE: 0,
        IS_GAURANTEE: 0,
        INSURANCE: "",
        GAURANTEE: ""
      });
    } else {
      this.AboutPayFine.at(i).patchValue({
        IS_REQUEST: 1,
        IS_CHECK: "/",
        IS_INSURANCE: result[0].INSURANCE_CHECKBOX,
        IS_GAURANTEE: result[0].GAURANTEE_CHECKBOX,
        INSURANCE: result[0].INSURANCE,
        GAURANTEE: result[0].GAURANTEE
      });
    }
  }

  status_IS_REQUEST(e, i) {
    if (this.AboutPayFine.at(i).get("IS_REQUEST").value == 0) {
      this.AboutPayFine.at(i).patchValue({
        IS_REQUEST: 0,
        IS_CHECK: "",
        IS_INSURANCE: 0,
        IS_GAURANTEE: 0,
        INSURANCE: "",
        GAURANTEE: ""
      })
    }
  }

  /////////////////////////////////////////////////////////////////////////// ILG60_O_05_00_02_02 //////////////////////////////////////////////////////////////////////////////////////////

  ILG60_O_05_00_02_02(item, index, aboutPayFine) {
    this.Return_ILG60_O_05_00_02_02(
      this.BANKING,
      item.NAME,
      item.RECEIPT_TYPE,
      item.CompareStaffDetail,
      item.PAYMENT_FINE_DUE_DATE,
      item.PAYMENT_FINE_DUE_DATE_TIME,
      item.PAYMENT_DATE,
      item.PAYMENT_TIME,
      item.PAYMENT_FINE,
      item.IS_PAYMENT,
      this.imageSource,
      item.payment,
      item.RECEIPT_BOOK_NO,
      item.RECEIPT_NO,
      item.PAYMENT_OFFICE_NAME,
      item.PAYMENT_OFFICE_CODE,
      item.RECEIPT_OFFICE_ID,
      this.typeheadOffice,
      this.showEditField,
      this.mode,
      this.COMPARE_ID,
      index,
      this.edit_payment,
      aboutPayFine,
      item.COMPARE_DETAIL_ID
    )
      .pipe(take(1))
      .subscribe(result => {
        this.Result_ILG60_O_05_00_02_02(result, index);
      });
  }

  Return_ILG60_O_05_00_02_02(
    BANKING: any,
    NAME: any,
    RECEIPT_TYPE: any,
    CompareStaffDetail: any,
    PAYMENT_FINE_DUE_DATE: any,
    PAYMENT_FINE_DUE_DATE_TIME: any,
    PAYMENT_DATE: any,
    PAYMENT_TIME: any,
    PAYMENT_FINE: number,
    IS_PAYMENT: any,
    imageSource: any,
    payment: any,
    RECEIPT_BOOK_NO: any,
    RECEIPT_NO: any,
    PAYMENT_OFFICE_NAME: any,
    PAYMENT_OFFICE_CODE: any,
    RECEIPT_OFFICE_ID: any,
    typeheadOffice: any,
    showEditField: any,
    mode: any,
    COMPARE_ID: any,
    index,
    edit_payment: any,
    _aboutPayFine: any,
    COMPARE_DETAIL_ID: any
  ): Observable<string> {
    const modal = this.ngbModal.open(ILG60_O_05_00_02_02, { size: 'lg', centered: true });
    modal.componentInstance.BANKING = BANKING;
    modal.componentInstance.NAME = NAME;
    modal.componentInstance.RECEIPT_TYPE = RECEIPT_TYPE;
    modal.componentInstance.PAYMENT_FINE_DUE_DATE = PAYMENT_FINE_DUE_DATE;
    modal.componentInstance.PAYMENT_FINE_DUE_DATE_TIME = PAYMENT_FINE_DUE_DATE_TIME;
    modal.componentInstance.CompareStaffDetail = CompareStaffDetail;
    modal.componentInstance.PAYMENT_DATE = PAYMENT_DATE;
    modal.componentInstance.PAYMENT_TIME = PAYMENT_TIME;
    modal.componentInstance.PAYMENT_FINE = PAYMENT_FINE;
    modal.componentInstance.IS_PAYMENT = IS_PAYMENT;
    modal.componentInstance.imageSource = imageSource;
    modal.componentInstance.PAYMENT_DETAIL = payment;
    modal.componentInstance.RECEIPT_BOOK_NO = RECEIPT_BOOK_NO;
    modal.componentInstance.RECEIPT_NO = RECEIPT_NO;
    modal.componentInstance.PAYMENT_OFFICE_NAME = PAYMENT_OFFICE_NAME;
    modal.componentInstance.PAYMENT_OFFICE_CODE = PAYMENT_OFFICE_CODE;
    modal.componentInstance.RECEIPT_OFFICE_ID = RECEIPT_OFFICE_ID;
    modal.componentInstance.typeheadOffice = typeheadOffice;
    modal.componentInstance.showEditField = showEditField;
    modal.componentInstance.mode = mode;
    modal.componentInstance.COMPARE_ID = COMPARE_ID;
    modal.componentInstance._aboutPayFine = _aboutPayFine
    modal.componentInstance.COMPARE_DETAIL_ID = COMPARE_DETAIL_ID
    if (this.mode == 'R') { modal.componentInstance.edit_payment = edit_payment; }
    if (this.mode == 'R' && this.showEditField == true) { modal.componentInstance.set_DID = this.set_DID(this.AboutPayFine.at(index).value, index) };
    if (this.AboutPayFine.value[index].DID == '') { modal.componentInstance.DID = false; } else { modal.componentInstance.DID = true; };

    return from(modal.result).pipe(
      catchError(error => {
        console.warn(error);
        return of(undefined);
      })
    );
  }

  Result_ILG60_O_05_00_02_02(result, i) {
    if (result == null) {
      // console.log("dissmiss");
    } else if (result == "cancel") {
      this.AboutPayFine.at(i).patchValue({
        PAYMENT_AMOUNT: "",
        STAFF_NAME_28: "",
        PAYMENT_DATE: "",
        PAYMENT_TIME: "",
        RECEIPT_BOOK_NO: "",
        RECEIPT_NO: "",
        RECEIPT_TYPE: 0,
        IS_PAYMENT: 0,
        PAYMENT_OFFICE_NAME: "",
        PAYMENT_OFFICE_CODE: "",
        RECEIPT_OFFICE_ID: "",
        payment: null
      });
      this.modal_delete(i, 0);
      this.modal_delete(i, 1);
    } else if (result == "cancel_payment") {
      this.AboutPayFine.at(i).patchValue({
        PAYMENT_AMOUNT: "",
        STAFF_NAME_28: "",
        PAYMENT_DATE: "",
        PAYMENT_TIME: "",
        RECEIPT_BOOK_NO: "",
        RECEIPT_NO: "",
        RECEIPT_TYPE: 0,
        IS_PAYMENT: 0,
        PAYMENT_OFFICE_NAME: "",
        PAYMENT_OFFICE_CODE: "",
        RECEIPT_OFFICE_ID: "",
        payment: null
      });
      this.modal_delete(i, 0);
      this.modal_delete(i, 1);
      this.edit_payment = true;
    } else {
      this.AboutPayFine.at(i).patchValue({
        RECEIPT_BOOK_NO: result.RECEIPT_BOOK_NO,
        RECEIPT_NO: result.RECEIPT_NO,
        STAFF_NAME_28: result.COMPARE_STAFF[0].FULL_NAME,
        PAYMENT_DATE: result.PAYMENT_DATE,
        PAYMENT_TIME: result.PAYMENT_TIME,
        IS_PAYMENT: result.IS_PAYMENT,
        PAYMENT_AMOUNT: result.PAYMENT_FINE,
        RECEIPT_TYPE: result.RECEIPT_TYPE,
        PAYMENT_OFFICE_NAME: result.PAYMENT_OFFICE_NAME,
        PAYMENT_OFFICE_CODE: result.PAYMENT_OFFICE_CODE,
        RECEIPT_OFFICE_ID: result.RECEIPT_OFFICE_ID,
        payment: result.PAYMENT_DETAIL
      });

      let control = this.AboutPayFine.at(i).get("CompareStaffDetail") as FormArray;
      control.at(0).patchValue(result.COMPARE_STAFF[0]);
      control.at(1).patchValue(result.COMPARE_STAFF[1]);
    }
  }

  set_DID(value, i) {
    var PAYMENT_FINE_DUE_DATE;
    var PAYMENT_VAT_DUE_DATE;
    var PAYMENT_DATE;
    var APPROVE_DATE;
    var COMMAND_DATE;

    if (value.PAYMENT_FINE_DUE_DATE == "") { PAYMENT_FINE_DUE_DATE = "" } else { PAYMENT_FINE_DUE_DATE = this.getDatepiker(value.PAYMENT_FINE_DUE_DATE, value.PAYMENT_FINE_DUE_DATE_TIME) };
    if (value.PAYMENT_VAT_DUE_DATE == "") { PAYMENT_VAT_DUE_DATE = "" } else { PAYMENT_VAT_DUE_DATE = this.getDatepiker(value.PAYMENT_VAT_DUE_DATE, value.PAYMENT_VAT_DUE_DATE_TIME) }
    if (value.PAYMENT_DATE == "") { PAYMENT_DATE = "" } else { PAYMENT_DATE = this.getDatepiker(value.PAYMENT_DATE, value.PAYMENT_TIME) }
    if (value.APPROVE_DATE == "") { APPROVE_DATE = "" } else { APPROVE_DATE = this.getDatepiker(value.APPROVE_DATE, value.APPROVE_TIME) }
    if (value.COMMAND_DATE == "") { COMMAND_DATE = "" } else { COMMAND_DATE = this.getDatepiker(value.COMMAND_DATE, value.COMMAND_TIME) }
    var CompareDetail = {
      COMPARE_DETAIL_ID: value.COMPARE_DETAIL_ID,
      COMPARE_MAPPING_ID: value.DE_COMPARE_MAPPING_ID,
      RECEIPT_OFFICE_ID: value.RECEIPT_OFFICE_ID,
      APPROVE_OFFICE_ID: value.APPROVE_OFFICE_ID,
      MISTREAT_NO: value.MISTREAT,
      OLD_PAYMENT_FINE: value.OLD_PAYMENT_FINE,
      PAYMENT_FINE: this.all_PAYMENT_FINE()[i].total,
      DIFFERENCE_PAYMENT_FINE: value.DIFFERENCE_PAYMENT_FINE,
      TREASURY_MONEY: this.all_TREASURY_MONEY()[i].total,
      BRIBE_MONEY: this.all_BRIBE_MONEY()[i].total,
      REWARD_MONEY: this.all_REWARD_MONEY()[i].total,
      PAYMENT_FINE_DUE_DATE: PAYMENT_FINE_DUE_DATE,
      PAYMENT_VAT_DUE_DATE: PAYMENT_VAT_DUE_DATE,
      INSURANCE: value.INSURANCE,
      GAURANTEE: value.GAURANTEE,
      PAYMENT_DATE: PAYMENT_DATE,
      RECEIPT_TYPE: value.RECEIPT_TYPE,
      RECEIPT_BOOK_NO: value.RECEIPT_BOOK_NO,
      RECEIPT_NO: value.RECEIPT_NO,
      RECEIPT_OFFICE_CODE: value.PAYMENT_OFFICE_CODE,
      RECEIPT_OFFICE_NAME: value.PAYMENT_OFFICE_NAME,
      APPROVE_OFFICE_CODE: value.APPROVE_OFFICE_CODE,
      APPROVE_OFFICE_NAME: value.APPROVE_OFFICE_NAME,
      APPROVE_DATE: APPROVE_DATE,
      APPROVE_TYPE: value.APPROVE_TYPE,
      COMMAND_NO: value.COMMAND_NO,
      COMMAND_DATE: COMMAND_DATE,
      REMARK_NOT_AGREE: value.REMARK_NOT_AGREE,
      REMARK_NOT_APPROVE: value.REMARK_NOT_APPROVE,
      FACT: value.FACT,
      COMPARE_REASON: value.COMPARE_REASON,
      ADJUST_REASON: value.ADJUST_REASON,
      COMPARE_TYPE: value.COMPARE_TYPE,
      IS_REQUEST: value.IS_REQUEST,
      IS_TEMP_RELEASE: value.IS_TEMP_RELEASE,
      IS_INSURANCE: value.IS_INSURANCE,
      IS_GAURANTEE: value.IS_GAURANTEE,
      IS_PAYMENT: value.IS_PAYMENT,
      IS_REVENUE: value.IS_REVENUE,
      IS_AGREE: value.IS_AGREE,
      IS_APPROVE: value.IS_APPROVE,
      IS_AUTHORITY: value.IS_AUTHORITY,
      DID: value.DID,
      IS_ACTIVE: value.DE_IS_ACTIVE,
      CompareStaff: [],
      CompareDetailPayment: [],
      CompareDetailFine: [],
      ComparePayment: [],
    }
    return CompareDetail;
  }

  /////////////////////////////////////////////////////////////////////////// ILG60_O_05_00_02_03 //////////////////////////////////////////////////////////////////////////////////////////
  ILG60_O_05_00_02_03(item, index) {
    this.Return_ILG60_O_05_00_02_03(
      item.APPROVE_TYPE,
      item.APPROVE_DATE,
      item.APPROVE_TIME,
      item.COMMAND_DATE,
      item.COMMAND_TIME,
      item.COMMAND_NO,
      item.COMPARE_REASON,
      item.FACT,
      item.IS_APPROVE,
      item.NAME,
      item.IS_PAYMENT,
      item.PAYMENT_FINE,
      item.PAYMENT_DATE,
      item.PAYMENT_TIME,
      index,
      item.APPROVE_OFFICE_NAME,
      item.APPROVE_OFFICE_CODE,
      item.APPROVE_OFFICE_ID,
      this.typeheadOffice,
      item.CompareStaffDetail,
      item.REMARK_NOT_AGREE,
      item.REMARK_NOT_APPROVE,
      item.IS_AGREE,
      this.showEditField,
    ).pipe(take(1) // take() manages unsubscription for us
    ).subscribe(result => { this.Result_ILG60_O_05_00_02_03(result, index); });
  }

  Return_ILG60_O_05_00_02_03(
    APPROVE_TYPE: any,
    APPROVE_DATE: any,
    APPROVE_TIME: any,
    COMMAND_DATE: any,
    COMMAND_TIME: any,
    COMMAND_NO: any,
    COMPARE_REASON: any,
    FACT: any,
    IS_APPROVE: any,
    NAME: string,
    IS_PAYMENT: any,
    PAYMENT_FINE: any,
    PAYMENT_DATE: any,
    PAYMENT_TIME: any,
    i: any,
    APPROVE_OFFICE_NAME: any,
    APPROVE_OFFICE_CODE: any,
    APPROVE_OFFICE_ID: any,
    typeheadOffice: any,
    CompareStaffDetail: any,
    REMARK_NOT_AGREE: any,
    REMARK_NOT_APPROVE: any,
    IS_AGREE: any,
    showEditField: any,
  ): Observable<string> {

    const modal = this.ngbModal.open(ILG60_O_05_00_02_03, { size: 'lg', centered: true });
    modal.componentInstance.APPROVE_OFFICE_NAME = APPROVE_OFFICE_NAME;
    modal.componentInstance.APPROVE_TYPE = APPROVE_TYPE;
    modal.componentInstance.APPROVE_DATE = APPROVE_DATE;
    modal.componentInstance.APPROVE_TIME = APPROVE_TIME;
    modal.componentInstance.COMMAND_DATE = COMMAND_DATE;
    modal.componentInstance.COMMAND_TIME = COMMAND_TIME;
    modal.componentInstance.COMMAND_NO = COMMAND_NO;
    modal.componentInstance.COMPARE_REASON = COMPARE_REASON;
    modal.componentInstance.FACT = FACT;
    modal.componentInstance.IS_APPROVE = IS_APPROVE;
    modal.componentInstance.NAME = NAME;
    modal.componentInstance.PAYMENT_DATE = PAYMENT_DATE;
    modal.componentInstance.PAYMENT_TIME = PAYMENT_TIME;
    modal.componentInstance.PAYMENT_FINE = PAYMENT_FINE;
    modal.componentInstance.APPROVE_OFFICE_CODE = APPROVE_OFFICE_CODE;
    modal.componentInstance.APPROVE_OFFICE_ID = APPROVE_OFFICE_ID;
    modal.componentInstance.typeheadOffice = typeheadOffice;
    modal.componentInstance.CompareStaffDetail = CompareStaffDetail;
    modal.componentInstance.REMARK_NOT_AGREE = REMARK_NOT_AGREE;
    modal.componentInstance.REMARK_NOT_APPROVE = REMARK_NOT_APPROVE;
    modal.componentInstance.IS_AGREE = IS_AGREE;
    modal.componentInstance.showEditField = showEditField;

    return from(modal.result).pipe(
      catchError(error => {
        console.warn(error);
        return of(undefined);
      })
    );

  }

  Result_ILG60_O_05_00_02_03(result, i) {
    if (result == null) {
      // console.log("dissmiss");
    } else if (result == "cancel") {
      this.AboutPayFine.at(i).patchValue({
        APPROVE_OFFICE_NAME: "",
        APPROVE_OFFICE_CODE: "",
        APPROVE_OFFICE_ID: "",
        APPROVE_TYPE: "",
        APPROVE_DATE: "",
        APPROVE_TIME: "",
        COMMAND_DATE: "",
        COMMAND_TIME: "",
        COMMAND_NO: "",
        COMPARE_REASON: "",
        FACT: "",
        IS_APPROVE: 0,
        IS_AGREE: 0,
        REMARK_NOT_AGREE: "",
        REMARK_NOT_APPROVE: "",
        CHECK_APPROVE: "",
      });
      this.modal_delete(i, 2);
      this.modal_delete(i, 3);
      this.modal_delete(i, 4);
      this.modal_delete(i, 5);
    } else {
      var CHECK_APPROVE;
      if (result.APPROVE_TYPE == 0) { CHECK_APPROVE = 5; }
      else if (result.APPROVE_TYPE == 1) { CHECK_APPROVE = 1; }
      else if (result.APPROVE_TYPE == 2) { CHECK_APPROVE = 2; }
      else if (result.APPROVE_TYPE == 3) { CHECK_APPROVE = 3; }
      else if (result.APPROVE_TYPE == 4) { CHECK_APPROVE = 4; }
      else { CHECK_APPROVE = ''; };

      this.AboutPayFine.at(i).patchValue({
        APPROVE_OFFICE_NAME: result.APPROVE_OFFICE_NAME,
        APPROVE_OFFICE_CODE: result.APPROVE_OFFICE_CODE,
        APPROVE_OFFICE_ID: result.APPROVE_OFFICE_ID,
        APPROVE_TYPE: result.APPROVE_TYPE,
        APPROVE_DATE: result.APPROVE_DATE,
        APPROVE_TIME: result.APPROVE_TIME,
        COMMAND_DATE: result.COMMAND_DATE,
        COMMAND_TIME: result.COMMAND_TIME,
        COMMAND_NO: result.COMMAND_NO,
        COMPARE_REASON: result.COMPARE_REASON,
        FACT: result.FACT,
        IS_APPROVE: result.IS_APPROVE,
        IS_AGREE: result.IS_AGREE,
        REMARK_NOT_AGREE: result.REMARK_NOT_AGREE,
        REMARK_NOT_APPROVE: result.REMARK_NOT_APPROVE,
        CHECK_APPROVE: CHECK_APPROVE,
      });
      let control = this.AboutPayFine.at(i).get("CompareStaffDetail") as FormArray;
      control.at(2).patchValue(result.COMPARE_STAFF[0]);
      control.at(3).patchValue(result.COMPARE_STAFF[1]);
      control.at(4).patchValue(result.COMPARE_STAFF[2]);
      control.at(5).patchValue(result.COMPARE_STAFF[3]);
    }
  }


  /////////////////////////////////////////////////////////////////////////// ILG60_O_05_00_02_04 //////////////////////////////////////////////////////////////////////////////////////////
  ILG60_O_05_00_02_04(item, i) {
    var Uid = "PDF"
    this.Return_ILG60_O_05_00_02_04(
      Uid,
      this.imageSource,
      this.setText,
      this.RECEIPT_NO,
    ).pipe(take(1) // take() manages unsubscription for us
    ).subscribe(result => { this.Result_ILG60_O_05_00_02_04(result, i); });
  }

  Return_ILG60_O_05_00_02_04(
    Uid: string,
    imageSource,
    setText,
    RECEIPT_NO
  ): Observable<string> {
    const modal = this.ngbModal.open(ILG60_O_05_00_02_04, { size: 'lg', centered: true });
    modal.componentInstance.Uid = Uid;
    modal.componentInstance.imageSource = imageSource;
    modal.componentInstance.setText = setText;
    modal.componentInstance.RECEIPT_NO = RECEIPT_NO;
    return from(modal.result).pipe(
      catchError(error => {
        console.warn(error);
        return of(undefined);
      })
    );
  }

  Result_ILG60_O_05_00_02_04(result, i) {
    if (result == undefined) {
      this.setButton = true;
      this.setText = true;
    } else {
      const staff = JSON.parse(localStorage.getItem("staffInfo"));
      this.setText = result;
      this.setButton = result;
    }
  }

  /////////////////////////////////////////////////////////////////////////// PRINT DOCUMENT //////////////////////////////////////////////////////////////////////////////////////////
  clickPrint() {
    const modal = this.ngbModal.open(PrintDocModalComponent, { size: 'lg', centered: true })
    modal.componentInstance.form = this.compareForm.getRawValue();
    modal.componentInstance.compare_id = this.COMPARE_ID;
    modal.componentInstance.LawsuitID = this.LAWSUIT_ID;
  }


  ///////////////////////////////////////////////////////////////////////// SETMasOffice //////////////////////////////////////////////////////////////////////////////////////////
  private async setOfficeStore() {
    await this.mainMasterService.MasOfficegetByCon().then(res => this.typeheadOffice = res.RESPONSE_DATA)
    let officeCode = localStorage.getItem("officeCode");
    for (let l of this.typeheadOffice) {
      let code = l.OFFICE_CODE;
      if (officeCode == code) {
        this.compareForm.patchValue({
          OFFICE_CODE: l.OFFICE_CODE || '',
          OFFICE_NAME: l.OFFICE_NAME,
          OFFICE_SHORT_NAME: l.OFFICE_SHORT_NAME,
          OFFICE_ID: l.OFFICE_ID
        }); break;
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////// convert data //////////////////////////////////////////////////////////////////////////////////////////
  convertDate(date) { var fomat = ""; if (date == null) { return fomat } else { return this.toDatePickerFormat(new Date(date)); } }

  convertTime(time) { var fomat = ""; if (time == null) { return fomat } else { return time.slice(10, 16).replace(/\s+/g, ''); } }

  convertNo(No) { var fomat = ""; if (No == 0) { return fomat } else { return No } }

  convertYear(Year) { var fomat = ""; if (Year == null) { return fomat } else { return parseInt(Year.slice(0, 4)) + 543; } }


  changeyear(ev: Number): void {
    const newDate = new Date();
    let m = setZero((newDate).getMonth() + 1);
    let d = setZero((newDate).getDate());
    let h = setZero((newDate).getHours());
    let min = setZero((newDate).getMinutes());
    let s = setZero((newDate).getSeconds());
    let ms = newDate.getMilliseconds();
    const seted = `${Number(ev)}-${m}-${d} ${h}:${min}:${s}.00`;
    this.compareForm.controls['COMPARE_NO_YEAR'].setValue(seted);
  }

  changeyear2(ev) {
    this.fineService.CompareRunningCompareNo("CompareRunningCompareNo", {
      OFFICE_CODE: this.office_code,
      YEAR: parseInt(ev) + 543,
      IS_OUTSIDE: this.compareForm.get("IS_OUTSIDE").value
    }).then(res => {
      this.compareForm.get("COMPARE_NO").setValue(res.RUNNING_NO);
    });
  }

  setYear() {
    const _date = new Date;
    const yy = _date.getFullYear() + 543;
    this.fineService.CompareRunningCompareNo("CompareRunningCompareNo", {
      OFFICE_CODE: this.office_code,
      YEAR: yy.toString(),
      IS_OUTSIDE: 0
    }).then(res => {
      this.compareForm.get("COMPARE_NO").setValue(res.RUNNING_NO);
    });
    this.YEAR = [];
    let newDate = new Date();
    let temp = newDate.getFullYear() + 543
    let YearSelected = (acc, curr) => acc == curr ? true : false;
    for (let i = 0; i <= 1; i++) {
      let _temp = temp - i;
      let js: any = {
        year: _temp,
        value: _temp - 543,
        selected: YearSelected(newDate.getFullYear(), _temp - 543)
      }
      this.YEAR.push(js);
    }
    /// set yesr in case 'C'
    const year = this.YEAR.find(f => YearSelected(newDate.getFullYear(), f.value)).value;

    this.changeyear(year);
  }

  setYear2() {
    let newDate = new Date();
    let temp = newDate.getFullYear() + 543
    let YearSelected = (acc, curr) => acc == curr ? true : false;
    for (let i = 0; i <= 1; i++) {
      let _temp = temp - i;
      let js: any = {
        year: _temp,
        value: _temp - 543,
        selected: YearSelected(newDate.getFullYear(), _temp - 543)
      }
      this.YEAR.push(js);
    }
  }

  newDate(val) {
    const _date = new Date;
    const dd = setZero(_date.getDate());
    const mm = setZero(_date.getMonth() + 1);
    const yy = _date.getFullYear();
    const _hours = _date.getHours();
    const _minutes = _date.getMinutes();
    const _seconds = _date.getSeconds();
    const _millimi = _date.getMilliseconds();
    let date = yy + "-" + mm + "-" + dd + " " + _hours + ":" + _minutes + ":" + _seconds + "." + _millimi;

    console.log(val, " : ", date)
    return date;
  }

  /////////////////////////////////////////////////////////////////////////// SEARCH OFFICE //////////////////////////////////////////////////////////////////////////////////////////
  serachOffice = (text3$: Observable<string>) =>
    text3$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term === '' ? []
        : this.typeheadOffice
          .filter(v =>
            (`${v.OFFICE_NAME || ''} ${v.OFFICE_SHORT_NAME || ''}`.toLowerCase().indexOf(term.toLowerCase()) > -1)
          ).slice(0, 10));

  formatterOffice1 = (x: { OFFICE_SHORT_NAME: string }) => x.OFFICE_SHORT_NAME
  formatterOffice2 = (x: { OFFICE_SHORT_NAME: string }) => x.OFFICE_SHORT_NAME

  selectItemOffice(e) {
    this.compareForm.patchValue({
      OFFICE_SHORT_NAME: e.item.OFFICE_SHORT_NAME,
      OFFICE_CODE: e.item.OFFICE_CODE,
      OFFICE_ID: e.item.OFFICE_ID,
      OFFICE_NAME: e.item.OFFICE_NAME
    });
  }

  blurSelectItemOffice(input) {
    let val = input.value
    if (!val) {
      this.compareForm.patchValue({
        OFFICE_CODE: "",
        OFFICE_ID: "",
        OFFICE_NAME: "",
        OFFICE_SHORT_NAME: ""
      });
    }
  }

  getTimeNow(d: any = new Date, isZero: any = null) {
    let h = d.getHours().toString();
    let m = d.getMinutes().toString();
    if ((+h) < 10) { h = '0' + h; }
    if ((+m) < 10) m = '0' + m;
    return h + ':' + m + '';
  }
  toDatePickerFormat(d: any) {
    return { date: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }, formatted: toLocalShort(d.toString()).replace(/ /g, ' ') };
  }

  ////////////////////////////////////////////////////////////////////////// SEARCH STAFF //////////////////////////////////////////////////////////////////////////////////////////
  public searchStaff = (text2$: Observable<string>) =>
    text2$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.fineService.MasStaffgetByCon_Search({ TEXT_SEARCH: term })
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          })
      )
      .do(() => this.searching = false);

  formatterStaff = (x: { TITLE_SHORT_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
    `${x.TITLE_SHORT_NAME_TH || ''}${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`

  private set_delStaff(e) {
    const CompareFormControl = {
      FULL_NAME: "",
      STAFF_ID: "",
      COMPARE_ID: "",
      COMPARE_DETAIL_ID: "",
      STAFF_REF_ID: "",
      TITLE_ID: "",
      STAFF_CODE: "",
      ID_CARD: "",
      STAFF_TYPE: "",
      TITLE_NAME_TH: "",
      TITLE_NAME_EN: "",
      TITLE_SHORT_NAME_TH: "",
      TITLE_SHORT_NAME_EN: "",
      FIRST_NAME: "",
      LAST_NAME: "",
      AGE: "",
      OPERATION_POS_CODE: "",
      OPREATION_POS_NAME: "",
      OPREATION_POS_LEVEL: "",
      OPERATION_POS_LEVEL_NAME: "",
      OPERATION_DEPT_CODE: "",
      OPERATION_DEPT_NAME: "",
      OPERATION_DEPT_LEVEL: "",
      OPERATION_UNDER_DEPT_CODE: "",
      OPERATION_UNDER_DEPT_NAME: "",
      OPERATION_UNDER_DEPT_LEVEL: "",
      OPERATION_WORK_DEPT_CODE: "",
      OPERATION_WORK_DEPT_NAME: "",
      OPERATION_WORK_DEPT_LEVEL: "",
      OPERATION_OFFICE_CODE: "",
      OPERATION_OFFICE_NAME: "",
      OPERATION_OFFICE_SHORT_NAME: "",
      MANAGEMENT_POS_CODE: "",
      MANAGEMENT_POS_NAME: "",
      MANAGEMENT_POS_LEVEL: "",
      MANAGEMENT_POS_LEVEL_NAME: "",
      MANAGEMENT_DEPT_CODE: "",
      MANAGEMENT_DEPT_NAME: "",
      MANAGEMENT_DEPT_LEVEL: "",
      MANAGEMENT_UNDER_DEPT_CODE: "",
      MANAGEMENT_UNDER_DEPT_NAME: "",
      MANAGEMENT_UNDER_DEPT_LEVEL: "",
      MANAGEMENT_WORK_DEPT_CODE: "",
      MANAGEMENT_WORK_DEPT_NAME: "",
      MANAGEMENT_WORK_DEPT_LEVEL: "",
      MANAGEMENT_OFFICE_CODE: "",
      MANAGEMENT_OFFICE_NAME: "",
      MANAGEMENT_OFFICE_SHORT_NAME: "",
      REPRESENTATION_POS_CODE: "",
      REPRESENTATION_POS_NAME: "",
      REPRESENTATION_POS_LEVEL: "",
      REPRESENTATION_POS_LEVEL_NAME: "",
      REPRESENTATION_DEPT_CODE: "",
      REPRESENTATION_DEPT_NAME: "",
      REPRESENTATION_DEPT_LEVEL: "",
      REPRESENTATION_UNDER_DEPT_CODE: "",
      REPRESENTATION_UNDER_DEPT_NAME: "",
      REPRESENTATION_UNDER_DEPT_LEVEL: "",
      REPRESENT_WORK_DEPT_CODE: "",
      REPRESENT_WORK_DEPT_NAME: "",
      REPRESENT_WORK_DEPT_LEVEL: "",
      REPRESENT_OFFICE_CODE: "",
      REPRESENT_OFFICE_NAME: "",
      REPRESENT_OFFICE_SHORT_NAME: "",
      STATUS: "",
      REMARK: "",
      CONTRIBUTOR_ID: e,
      IS_ACTIVE: 0
    }
    return CompareFormControl
  }

  modal_delete(i, j) {
    var _ContributorID;
    if (j == 0) { _ContributorID = 28; }
    else if (j == 1) { _ContributorID = 34; }
    else if (j == 2) { _ContributorID = 32; }
    else if (j == 3) { _ContributorID = 33; }
    else if (j == 4) { _ContributorID = 84; }
    else if (j == 5) { _ContributorID = 85; }

    let control = this.AboutPayFine.at(i).get("CompareStaffDetail") as FormArray;
    control.at(j).patchValue(this.set_delStaff(_ContributorID));
  }

  deleteContri(i) {
    var _ContributorID;
    if (i == 0) { _ContributorID = 27; }
    else if (i == 1) { _ContributorID = 29; }
    else if (i == 2) { _ContributorID = 30; }
    else if (i == 3) { _ContributorID = 31; }
    this.CompareStaff.at(i).patchValue(this.set_delStaff(_ContributorID));

    if (i == 0) {
      for (var a = 0; a < this.AboutPayFine.value.length; a++) {
        let control = this.AboutPayFine.at(a).get("CompareStaffDetail") as FormArray;
        control.at(6).patchValue(this.set_delStaff(_ContributorID));
      }
    }

    if (i == 1) {
      for (var a = 0; a < this.AboutPayFine.value.length; a++) {
        let control = this.AboutPayFine.at(a).get("CompareStaffDetail") as FormArray;
        control.at(7).patchValue(this.set_delStaff(_ContributorID));
      }
    }

    if (i == 2) {
      for (var a = 0; a < this.AboutPayFine.value.length; a++) {
        let control = this.AboutPayFine.at(a).get("CompareStaffDetail") as FormArray;
        control.at(8).patchValue(this.set_delStaff(_ContributorID));
      }
    }

    if (i == 3) {
      for (var a = 0; a < this.AboutPayFine.value.length; a++) {
        let control = this.AboutPayFine.at(a).get("CompareStaffDetail") as FormArray;
        control.at(9).patchValue(this.set_delStaff(_ContributorID));
      }
    }
  }

  private set_Staff(e, c) {
    const staff = e;
    var title; if (staff.TITLE_SHORT_NAME_TH == '' || staff.TITLE_SHORT_NAME_TH == null) { title = staff.TITLE_NAME_TH; } else { title = staff.TITLE_SHORT_NAME_TH }

    const CompareFormControl = {
      FULL_NAME: `${title}${staff.FIRST_NAME} ${staff.LAST_NAME}`,
      STAFF_ID: staff.STAFF_ID || '',
      COMPARE_ID: this.COMPARE_ID || '',
      COMPARE_DETAIL_ID: this.COMPARE_DETAIL_ID || '',
      STAFF_REF_ID: staff.STAFF_REF_ID || '',
      TITLE_ID: staff.TITLE_ID || '',
      STAFF_CODE: staff.STAFF_CODE || '',
      ID_CARD: staff.ID_CARD || '',
      STAFF_TYPE: staff.STAFF_TYPE || '',
      TITLE_NAME_TH: staff.TITLE_NAME_TH || '',
      TITLE_NAME_EN: staff.TITLE_NAME_EN || '',
      TITLE_SHORT_NAME_TH: staff.TITLE_SHORT_NAME_TH || '',
      TITLE_SHORT_NAME_EN: staff.TITLE_SHORT_NAME_EN || '',
      FIRST_NAME: staff.FIRST_NAME || '',
      LAST_NAME: staff.LAST_NAME || '',
      AGE: staff.AGE || '',
      OPERATION_POS_CODE: staff.OPERATION_POS_CODE || '',
      OPREATION_POS_NAME: staff.OPREATION_POS_NAME || '',
      OPREATION_POS_LEVEL: staff.OPREATION_POS_LEVEL || '',
      OPERATION_POS_LEVEL_NAME: staff.OPERATION_POS_LEVEL_NAME || '',
      OPERATION_DEPT_CODE: staff.OPERATION_DEPT_CODE || '',
      OPERATION_DEPT_NAME: staff.OPERATION_DEPT_NAME || '',
      OPERATION_DEPT_LEVEL: staff.OPERATION_DEPT_LEVEL || '',
      OPERATION_UNDER_DEPT_CODE: staff.OPERATION_UNDER_DEPT_CODE || '',
      OPERATION_UNDER_DEPT_NAME: staff.OPERATION_UNDER_DEPT_NAME || '',
      OPERATION_UNDER_DEPT_LEVEL: staff.OPERATION_UNDER_DEPT_LEVEL || '',
      OPERATION_WORK_DEPT_CODE: staff.OPERATION_WORK_DEPT_CODE || '',
      OPERATION_WORK_DEPT_NAME: staff.OPERATION_WORK_DEPT_NAME || '',
      OPERATION_WORK_DEPT_LEVEL: staff.OPERATION_WORK_DEPT_LEVEL || '',
      OPERATION_OFFICE_CODE: staff.OPERATION_OFFICE_CODE || '',
      OPERATION_OFFICE_NAME: staff.OPERATION_OFFICE_NAME || '',
      OPERATION_OFFICE_SHORT_NAME: staff.OPERATION_OFFICE_SHORT_NAME || '',
      MANAGEMENT_POS_CODE: staff.MANAGEMENT_POS_CODE || '',
      MANAGEMENT_POS_NAME: staff.MANAGEMENT_POS_NAME || '',
      MANAGEMENT_POS_LEVEL: staff.MANAGEMENT_POS_LEVEL || '',
      MANAGEMENT_POS_LEVEL_NAME: staff.MANAGEMENT_POS_LEVEL_NAME || '',
      MANAGEMENT_DEPT_CODE: staff.MANAGEMENT_DEPT_CODE || '',
      MANAGEMENT_DEPT_NAME: staff.MANAGEMENT_DEPT_NAME || '',
      MANAGEMENT_DEPT_LEVEL: staff.MANAGEMENT_DEPT_LEVEL || '',
      MANAGEMENT_UNDER_DEPT_CODE: staff.MANAGEMENT_UNDER_DEPT_CODE || '',
      MANAGEMENT_UNDER_DEPT_NAME: staff.MANAGEMENT_UNDER_DEPT_NAME || '',
      MANAGEMENT_UNDER_DEPT_LEVEL: staff.MANAGEMENT_UNDER_DEPT_LEVEL || '',
      MANAGEMENT_WORK_DEPT_CODE: staff.MANAGEMENT_WORK_DEPT_CODE || '',
      MANAGEMENT_WORK_DEPT_NAME: staff.MANAGEMENT_WORK_DEPT_NAME || '',
      MANAGEMENT_WORK_DEPT_LEVEL: staff.MANAGEMENT_WORK_DEPT_LEVEL || '',
      MANAGEMENT_OFFICE_CODE: staff.MANAGEMENT_OFFICE_CODE || '',
      MANAGEMENT_OFFICE_NAME: staff.MANAGEMENT_OFFICE_NAME || '',
      MANAGEMENT_OFFICE_SHORT_NAME: staff.MANAGEMENT_OFFICE_SHORT_NAME || '',
      REPRESENTATION_POS_CODE: staff.REPRESENTATION_POS_CODE || '',
      REPRESENTATION_POS_NAME: staff.REPRESENTATION_POS_NAME || '',
      REPRESENTATION_POS_LEVEL: staff.REPRESENTATION_POS_LEVEL || '',
      REPRESENTATION_POS_LEVEL_NAME: staff.REPRESENTATION_POS_LEVEL_NAME || '',
      REPRESENTATION_DEPT_CODE: staff.REPRESENTATION_DEPT_CODE || '',
      REPRESENTATION_DEPT_NAME: staff.REPRESENTATION_DEPT_NAME || '',
      REPRESENTATION_DEPT_LEVEL: staff.REPRESENTATION_DEPT_LEVEL || '',
      REPRESENTATION_UNDER_DEPT_CODE: staff.REPRESENTATION_UNDER_DEPT_CODE || '',
      REPRESENTATION_UNDER_DEPT_NAME: staff.REPRESENTATION_UNDER_DEPT_NAME || '',
      REPRESENTATION_UNDER_DEPT_LEVEL: staff.REPRESENTATION_UNDER_DEPT_LEVEL || '',
      REPRESENT_WORK_DEPT_CODE: staff.REPRESENT_WORK_DEPT_CODE || '',
      REPRESENT_WORK_DEPT_NAME: staff.REPRESENT_WORK_DEPT_NAME || '',
      REPRESENT_WORK_DEPT_LEVEL: staff.REPRESENT_WORK_DEPT_LEVEL || '',
      REPRESENT_OFFICE_CODE: staff.REPRESENT_OFFICE_CODE || '',
      REPRESENT_OFFICE_NAME: staff.REPRESENT_OFFICE_NAME || '',
      REPRESENT_OFFICE_SHORT_NAME: staff.REPRESENT_OFFICE_SHORT_NAME || '',
      STATUS: staff.STATUS || '',
      REMARK: staff.REMARK || '',
      CONTRIBUTOR_ID: c,
      IS_ACTIVE: 1
    }
    return CompareFormControl
  }

  selectItemStaff(e, i) {

    var _ContributorID;
    if (i == 0) { _ContributorID = 27; }
    else if (i == 1) { _ContributorID = 29; }
    else if (i == 2) { _ContributorID = 30; }
    else if (i == 3) { _ContributorID = 31; }
    this.CompareStaff.at(i).patchValue(this.set_Staff(e.item, _ContributorID));

    if (i == 0) {
      for (var a = 0; a < this.AboutPayFine.value.length; a++) {
        let control = this.AboutPayFine.at(a).get("CompareStaffDetail") as FormArray;
        control.at(6).patchValue(this.set_Staff(e.item, _ContributorID));
      }
    }

    if (i == 1) {
      for (var a = 0; a < this.AboutPayFine.value.length; a++) {
        let control = this.AboutPayFine.at(a).get("CompareStaffDetail") as FormArray;
        control.at(7).patchValue(this.set_Staff(e.item, _ContributorID));
      }
    }

    if (i == 2) {
      for (var a = 0; a < this.AboutPayFine.value.length; a++) {
        let control = this.AboutPayFine.at(a).get("CompareStaffDetail") as FormArray;
        control.at(8).patchValue(this.set_Staff(e.item, _ContributorID));
      }
    }

    if (i == 3) {
      for (var a = 0; a < this.AboutPayFine.value.length; a++) {
        let control = this.AboutPayFine.at(a).get("CompareStaffDetail") as FormArray;
        control.at(9).patchValue(this.set_Staff(e.item, _ContributorID));
      }
    }
  }

  COMPARE_DETAIL_ID: string = '';
  private set_CONTRIBUTOR_ID27(): FormGroup {
    const staff = JSON.parse(localStorage.getItem("staffInfo"));
    // console.log(staff);
    var title;
    if (staff.TITLE_SHORT_NAME_TH == '' || staff.TITLE_SHORT_NAME_TH == null) {
      title = staff.TITLE_NAME_TH;
    } else { title = staff.TITLE_SHORT_NAME_TH }

    const CompareFormControl = {
      FULL_NAME: new FormControl(title + staff.FIRST_NAME + " " + staff.LAST_NAME),
      STAFF_ID: new FormControl(staff.STAFF_ID || ''),
      COMPARE_ID: new FormControl(this.COMPARE_ID || ''),
      COMPARE_DETAIL_ID: new FormControl(this.COMPARE_DETAIL_ID || ''),
      STAFF_REF_ID: new FormControl(staff.STAFF_REF_ID || ''),
      TITLE_ID: new FormControl(staff.TITLE_ID || ''),
      STAFF_CODE: new FormControl(staff.STAFF_CODE || ''),
      ID_CARD: new FormControl(staff.ID_CARD || ''),
      STAFF_TYPE: new FormControl(staff.STAFF_TYPE || ''),
      TITLE_NAME_TH: new FormControl(staff.TITLE_NAME_TH || ''),
      TITLE_NAME_EN: new FormControl(staff.TITLE_NAME_EN || ''),
      TITLE_SHORT_NAME_TH: new FormControl(staff.TITLE_SHORT_NAME_TH || ''),
      TITLE_SHORT_NAME_EN: new FormControl(staff.TITLE_SHORT_NAME_EN || ''),
      FIRST_NAME: new FormControl(staff.FIRST_NAME || ''),
      LAST_NAME: new FormControl(staff.LAST_NAME || ''),
      AGE: new FormControl(staff.AGE || ''),
      OPERATION_POS_CODE: new FormControl(staff.OPERATION_POS_CODE || ''),
      OPREATION_POS_NAME: new FormControl(staff.OPREATION_POS_NAME || ''),
      OPREATION_POS_LEVEL: new FormControl(staff.OPREATION_POS_LEVEL || ''),
      OPERATION_POS_LEVEL_NAME: new FormControl(staff.OPERATION_POS_LEVEL_NAME || ''),
      OPERATION_DEPT_CODE: new FormControl(staff.OPERATION_DEPT_CODE || ''),
      OPERATION_DEPT_NAME: new FormControl(staff.OPERATION_DEPT_NAME || ''),
      OPERATION_DEPT_LEVEL: new FormControl(staff.OPERATION_DEPT_LEVEL || ''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(staff.OPERATION_UNDER_DEPT_CODE || ''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(staff.OPERATION_UNDER_DEPT_NAME || ''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(staff.OPERATION_UNDER_DEPT_LEVEL || ''),
      OPERATION_WORK_DEPT_CODE: new FormControl(staff.OPERATION_WORK_DEPT_CODE || ''),
      OPERATION_WORK_DEPT_NAME: new FormControl(staff.OPERATION_WORK_DEPT_NAME || ''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(staff.OPERATION_WORK_DEPT_LEVEL || ''),
      OPERATION_OFFICE_CODE: new FormControl(staff.OPERATION_OFFICE_CODE || ''),
      OPERATION_OFFICE_NAME: new FormControl(staff.OPERATION_OFFICE_NAME || ''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(staff.OPERATION_OFFICE_SHORT_NAME || ''),
      MANAGEMENT_POS_CODE: new FormControl(staff.MANAGEMENT_POS_CODE || ''),
      MANAGEMENT_POS_NAME: new FormControl(staff.MANAGEMENT_POS_NAME || ''),
      MANAGEMENT_POS_LEVEL: new FormControl(staff.MANAGEMENT_POS_LEVEL || ''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(staff.MANAGEMENT_POS_LEVEL_NAME || ''),
      MANAGEMENT_DEPT_CODE: new FormControl(staff.MANAGEMENT_DEPT_CODE || ''),
      MANAGEMENT_DEPT_NAME: new FormControl(staff.MANAGEMENT_DEPT_NAME || ''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(staff.MANAGEMENT_DEPT_LEVEL || ''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(staff.MANAGEMENT_UNDER_DEPT_CODE || ''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(staff.MANAGEMENT_UNDER_DEPT_NAME || ''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(staff.MANAGEMENT_UNDER_DEPT_LEVEL || ''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(staff.MANAGEMENT_WORK_DEPT_CODE || ''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(staff.MANAGEMENT_WORK_DEPT_NAME || ''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(staff.MANAGEMENT_WORK_DEPT_LEVEL || ''),
      MANAGEMENT_OFFICE_CODE: new FormControl(staff.MANAGEMENT_OFFICE_CODE || ''),
      MANAGEMENT_OFFICE_NAME: new FormControl(staff.MANAGEMENT_OFFICE_NAME || ''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(staff.MANAGEMENT_OFFICE_SHORT_NAME || ''),
      REPRESENTATION_POS_CODE: new FormControl(staff.REPRESENTATION_POS_CODE || ''),
      REPRESENTATION_POS_NAME: new FormControl(staff.REPRESENTATION_POS_NAME || ''),
      REPRESENTATION_POS_LEVEL: new FormControl(staff.REPRESENTATION_POS_LEVEL || ''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(staff.REPRESENTATION_POS_LEVEL_NAME || ''),
      REPRESENTATION_DEPT_CODE: new FormControl(staff.REPRESENTATION_DEPT_CODE || ''),
      REPRESENTATION_DEPT_NAME: new FormControl(staff.REPRESENTATION_DEPT_NAME || ''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(staff.REPRESENTATION_DEPT_LEVEL || ''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(staff.REPRESENTATION_UNDER_DEPT_CODE || ''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(staff.REPRESENTATION_UNDER_DEPT_NAME || ''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(staff.REPRESENTATION_UNDER_DEPT_LEVEL || ''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(staff.REPRESENT_WORK_DEPT_CODE || ''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(staff.REPRESENT_WORK_DEPT_NAME || ''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(staff.REPRESENT_WORK_DEPT_LEVEL || ''),
      REPRESENT_OFFICE_CODE: new FormControl(staff.REPRESENT_OFFICE_CODE || ''),
      REPRESENT_OFFICE_NAME: new FormControl(staff.REPRESENT_OFFICE_NAME || ''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(staff.REPRESENT_OFFICE_SHORT_NAME || ''),
      STATUS: new FormControl(staff.STATUS || ''),
      REMARK: new FormControl(staff.REMARK || ''),
      CONTRIBUTOR_ID: new FormControl(27),
      IS_ACTIVE: new FormControl(1)
    }
    return this.fb.group(CompareFormControl)
  }

  private set_NULL_CONTRIBUTOR_ID27(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl(''),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(27),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  private set_CONTRIBUTOR_ID28(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl(''),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(28),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  private set_CONTRIBUTOR_ID29(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl(''),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(29),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  private set_CONTRIBUTOR_ID30(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl(''),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(30),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  private set_CONTRIBUTOR_ID31(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl(''),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(31),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  private set_CONTRIBUTOR_ID32(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl(''),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(32),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  private set_CONTRIBUTOR_ID33(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl(''),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(33),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  private set_CONTRIBUTOR_ID34(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl(''),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(34),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  private set_CONTRIBUTOR_ID84(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl(''),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(84),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  private set_CONTRIBUTOR_ID85(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl('', Validators.required),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(85),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  deleteStaff(ev, i) { }

  /////////////////////////////////////////////////////////////////////////// clickCancel //////////////////////////////////////////////////////////////////////////////////////////
  clickCancel() {

    console.log("FORM COMPARE : ", this.compareForm.getRawValue())
    console.log("FORM ABOUT DETAIL : ", this.AboutPayFine.getRawValue())

    if (this.compareForm.get("BRIBE_RATE").value == 0 && this.compareForm.get("REWARD_RATE").value == 0) { this.compareForm.patchValue({ TREASURY_RATE: 100 }); }
    var COMPARE_DATE = this.getDatepiker(this.compareForm.get("SET_COMPARE_DATE").value, this.compareForm.get("SET_COMPARE_TIME").value);
    var CREATE_DATE = this.getDatepiker(this.toDatePickerFormat(new Date()), this.getTimeNow(new Date()));
    const params = {
      COMPARE_ID: "",
      LAWSUIT_ID: this.LAWSUIT_ID,
      TREASURY_RATE: this.compareForm.get("TREASURY_RATE").value,
      BRIBE_RATE: this.compareForm.get("BRIBE_RATE").value,
      REWARD_RATE: this.compareForm.get("REWARD_RATE").value,
      OFFICE_ID: this.compareForm.get("OFFICE_ID").value,
      OFFICE_CODE: this.compareForm.get("OFFICE_CODE").value,
      OFFICE_NAME: this.compareForm.get("OFFICE_SHORT_NAME").value,
      COMPARE_NO: this.compareForm.get('COMPARE_NO').value,
      COMPARE_NO_YEAR: this.compareForm.get("COMPARE_NO_YEAR").value,
      COMPARE_DATE: COMPARE_DATE,
      IS_OUTSIDE: this.compareForm.get("IS_OUTSIDE").value,
      IS_ACTIVE: 1,
      CREATE_DATE: CREATE_DATE,
      CREATE_USER_ACCOUNT_ID: this.USER_ACCOUNT_ID,
      UPDATE_DATE: "",
      UPDATE_USER_ACCOUNT_ID: "",
      CompareMapping: this.set_CompareMapping(this.AboutPayFine.value),

    }

    console.log("params : ", params)
    swal({
      type: 'warning',
      text: "ยืนยันการทำรายการหรือไม่" + ' ?',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: true,

    }).then((result) => {
      if (result.value == true) {
        this.router.navigate([`/fine/list/`]);
      }
    })
  }

  /////////////////////////////////////////////////////////////////////////// clickEdit //////////////////////////////////////////////////////////////////////////////////////////
  clickEdit() {
    this.showEditField = false;
    this.setButton = false;
    this.setText = true;
    this.printButton = false;
    this.deleteButton = false;
    this.saveButton = false;
    this.saveButton_edit = true;
    this.cancelButton = false;
    this.editButton = false;
    this.editField = false;
    this.cancelEdit = true;
    this.setYear2();
  }

  /////////////////////////////////////////////////////////////////////////// clickSave_edit //////////////////////////////////////////////////////////////////////////////////////////
  async clickSave_edit() {

    var COMPARE_DATE = this.getDatepiker(this.compareForm.get("SET_COMPARE_DATE").value, this.compareForm.get("SET_COMPARE_TIME").value);
    var CREATE_DATE = this.getDatepiker(this.toDatePickerFormat(new Date()), this.getTimeNow(new Date()));

    var arr1 = 0; var arr2 = 0; var arr3 = 0; var arr4 = 0;

    if (this.CompareStaff.value[0].IS_ACTIVE == 0) {
      this._swal('กรุณาระบุข้อมูล "ผู้เปรียบเทียบคดี"');
      this.collapse6 = new BehaviorSubject<Boolean>(true);
      arr3 = 0;
    } else { arr3 = 1; }

    if (this.compareForm.value.OFFICE_NAME == '') {
      this.isReq_OFFICE_NAME.next(true);
      this._swal('กรุณาระบุข้อมูล "สถานที่เปรียบเทียบ"');
      this.collapse4 = new BehaviorSubject<Boolean>(true);
    } else {
      this.isReq_OFFICE_NAME.next(false);
    }

    if (this.compareForm.value.SET_COMPARE_TIME == '') {
      this.isReq_SET_COMPARE_TIME = true;
      this._swal('กรุณาระบุข้อมูล "เวลาเปรียบเทียบ"');
      this.collapse4 = new BehaviorSubject<Boolean>(true);
    } else {
      this.isReq_SET_COMPARE_TIME = false;
    }

    if (this.compareForm.value.SET_COMPARE_DATE == null) {
      this.isReq_SET_COMPARE_DATE = true;
      this._swal('กรุณาระบุข้อมูล "วันที่กำหนดชำระค่าปรับ"');
      this.collapse4 = new BehaviorSubject<Boolean>(true);
    } else {
      this.isReq_SET_COMPARE_DATE = false;
    }

    if (this.compareForm.get('COMPARE_NO').value == '') {
      this.isReq_COMPARE_NO = true;
      this._swal('กรุณาระบุข้อมูล "คดีเปรียบเทียบที่"');
      this.collapse4 = new BehaviorSubject<Boolean>(true);
    } else {
      this.isReq_COMPARE_NO = false;
    }

    this.AboutPayFine.value.map(m => {
      if (m.PAYMENT_FINE_DUE_DATE == null || m.PAYMENT_FINE_DUE_DATE == '') {
        swal({
          type: 'warning',
          html: 'กรุณาระบุข้อมูล "วันที่กำหนดชำระค่าปรับ" ของ <br /> "' + m.NAME + '"',
          confirmButtonText: 'ตกลง',
          buttonsStyling: true,
        })
        this.collapse3 = new BehaviorSubject<Boolean>(true);
        arr4 = 0
      } else { arr4 = 1 }
    });

    this.AboutPayFine.value.map(m => {
      if (m.IS_REQUEST == 1) {
        if (m.IS_INSURANCE == 0 && m.IS_GAURANTEE == 0) {
          this.isReq_IS_REQUEST = true;
          swal({
            type: 'warning',
            html: 'กรุณาระบุข้อมูล "ปล่อยตัว" ของ <br /> "' + m.NAME + '"',
            confirmButtonText: 'ตกลง',
            buttonsStyling: true,
          })
          this.collapse3 = new BehaviorSubject<Boolean>(true);
          arr1 = 0
        }
        else { arr1 = 1; this.isReq_IS_REQUEST = false; }
      } else { arr1 = 1; this.isReq_IS_REQUEST = false; }
    });

    this.AboutPayFine.value.map(m => {
      if (m.IS_REQUEST == 0 && m.IS_PAYMENT == 0) {
        swal({
          type: 'warning',
          html: 'กรุณาระบุข้อมูล "ชำระค่าปรับ"',
          confirmButtonText: 'ตกลง',
          buttonsStyling: true,
        });
        this.collapse4 = new BehaviorSubject<Boolean>(true);
        arr2 = 0
      } else { arr2 = 1; }
    });

    if (this.compareForm.get('COMPARE_NO').value !== ''
      && this.compareForm.value.SET_COMPARE_TIME !== ''
      && this.compareForm.value.SET_COMPARE_DATE !== null
      && this.CompareStaff.value[0].IS_ACTIVE !== 0
      && arr1 == 1 && arr2 == 1 && arr3 == 1 && arr4 == 1
      && this.compareForm.value.OFFICE_NAME !== '') {
      const params = {
        COMPARE_ID: this.compareForm.get("COMPARE_ID").value,
        LAWSUIT_ID: this.LAWSUIT_ID,
        TREASURY_RATE: this._IsRequestTRE,
        BRIBE_RATE: this._IsRequestBribe,
        REWARD_RATE: this._IsRequestReward,
        OFFICE_ID: this.compareForm.get("OFFICE_ID").value,
        OFFICE_CODE: this.compareForm.get("OFFICE_CODE").value,
        OFFICE_NAME: this.compareForm.get("OFFICE_SHORT_NAME").value,
        COMPARE_NO: this.compareForm.get('COMPARE_NO').value,
        COMPARE_NO_YEAR: this.compareForm.get("COMPARE_NO_YEAR").value,
        COMPARE_DATE: COMPARE_DATE,
        IS_OUTSIDE: this.compareForm.get("IS_OUTSIDE").value,
        IS_ACTIVE: this.compareForm.get("IS_ACTIVE").value,
        CREATE_DATE: this.compareForm.get("CREATE_DATE").value + ".00",
        CREATE_USER_ACCOUNT_ID: this.compareForm.get("CREATE_USER_ACCOUNT_ID").value,
        UPDATE_DATE: CREATE_DATE,
        UPDATE_USER_ACCOUNT_ID: parseInt(this.USER_ACCOUNT_ID),
        CompareMapping: await this.set_update_CompareMapping(this.AboutPayFine.value)
      }
      console.log("params", params)
      this.fineService.CompareupdByCon("CompareupdByCon", params).then(async success => {
        console.log("success", success);
        if (success.IsSuccess == "True") {

          if (this.BACKUP_fileList.length == 0 && this.fileList.length == 0) {
            // console.log("ไม่มีไฟล์")
          } else if (this.BACKUP_fileList.length !== 0 && this.fileList.length == 0) {
            // console.log("ต้องลบไฟล์ออก")
            this.BACKUP_fileList.map(async docs => {
              var id = { "DOCUMENT_ID": docs.DOCUMENT_ID }
              let result = await this.fineService.DocumentupdDelete("DocumentupdDelete", id);
              console.log("result : ", result)
            });
          } else if (this.BACKUP_fileList.length == 0 && this.fileList.length !== 0) {
            // console.log("ต้องเพิ่มไฟล์")
            this.fileList.map(async doc => {
              // console.log("fileList",doc)
              if (doc.IsNewItem) {
                const formData = new FormData();
                formData.append('FILE', doc.FILE);
                formData.append('DOCUMENT_NAME', doc.DOCUMENT_NAME);
                formData.append('DOCUMENT_OLD_NAME', doc.DOCUMENT_OLD_NAME);
                formData.append('DOCUMENT_TYPE', '6');
                formData.append('FOLDER', doc.FOLDER);
                formData.append('REFERENCE_CODE', this.compareForm.get("COMPARE_ID").value);

                let result = await this.fineService.DocumentinsAll(formData);

                if (result.IsSuccess == "True") {
                  console.log("insert file status : ", result);

                } else {
                  swal({
                    type: 'error',
                    text: 'ไม่สามารถบันทึกเอกสารภายในได้',
                    confirmButtonText: 'ตกลง',
                    buttonsStyling: true,
                  })
                }
              }
            });
          } else if (this.BACKUP_fileList.length !== 0 && this.fileList.length !== 0) {
            // console.log("4-4");

            for (var j = 0; j < this.fileList.length; j++) {
              if (this.fileList[j].DOCUMENT_ID == null) {
                console.log("this.fileList", this.fileList[j])
                var doc = this.fileList[j];
                if (doc.IsNewItem) {
                  const formData = new FormData();
                  formData.append('FILE', doc.FILE);
                  formData.append('DOCUMENT_NAME', doc.DOCUMENT_NAME);
                  formData.append('DOCUMENT_OLD_NAME', doc.DOCUMENT_OLD_NAME);
                  formData.append('DOCUMENT_TYPE', '6');
                  formData.append('FOLDER', doc.FOLDER);
                  formData.append('REFERENCE_CODE', this.compareForm.get("COMPARE_ID").value);

                  let result = await this.fineService.DocumentinsAll(formData);

                  if (result.IsSuccess == "True") {
                    console.log("insert file status ", j, " :", result);
                  } else {
                    swal({
                      type: 'error',
                      text: 'ไม่สามารถบันทึกเอกสารภายในได้',
                      confirmButtonText: 'ตกลง',
                      buttonsStyling: true,
                    })
                  }
                }
              }
            }

            var set = this.BACKUP_fileList;

            for (var i = 0; i < set.length; i++) {
              for (var j = 0; j < this.fileList.length; j++) {
                if (set[i].DOCUMENT_ID == this.fileList[j].DOCUMENT_ID) {
                  set[i].DOCUMENT_ID = 0;
                }
              }
            }

            for (var i = 0; i < set.length; i++) {
              if (set[i].DOCUMENT_ID !== 0) {
                var id = { "DOCUMENT_ID": set[i].DOCUMENT_ID }
                let result = await this.fineService.DocumentupdDelete("DocumentupdDelete", id);
                console.log("result : ", result)
              }
            }

          }
          swal({
            type: 'success',
            text: 'บันทึกข้อมูลสำเร็จ',
            confirmButtonText: 'ตกลง',
            buttonsStyling: true,
          }).then(list => {
            location.reload();
          });
        } else {
          swal({
            type: 'error',
            text: 'ไม่สามารถบันทึกข้อมูลได้',
            confirmButtonText: 'ตกลง',
            buttonsStyling: true,
          }).then(e => {
            location.reload();
          })
        }
      });
    }


  }

  async set_update_CompareMapping(value) {
    var set = [];
    var IS_EVER_WRONG;
    var PAYMENT_FINE_DUE_DATE;
    var PAYMENT_VAT_DUE_DATE;
    var PAYMENT_DATE;
    var APPROVE_DATE;
    var COMMAND_DATE;
    console.log("value : ", value)

    for (var i = 0; i < value.length; i++) {

      if (value[i].MISTREAT == 0) { IS_EVER_WRONG = 0; } else { IS_EVER_WRONG = 1; };
      if (value[i].PAYMENT_FINE_DUE_DATE == "") { PAYMENT_FINE_DUE_DATE = "" } else { PAYMENT_FINE_DUE_DATE = this.getDatepiker(value[i].PAYMENT_FINE_DUE_DATE, value[i].PAYMENT_FINE_DUE_DATE_TIME) };
      if (value[i].PAYMENT_VAT_DUE_DATE == "") { PAYMENT_VAT_DUE_DATE = "" } else { PAYMENT_VAT_DUE_DATE = this.getDatepiker(value[i].PAYMENT_VAT_DUE_DATE, value[i].PAYMENT_VAT_DUE_DATE_TIME) }
      if (value[i].PAYMENT_DATE == "") { PAYMENT_DATE = "" } else { PAYMENT_DATE = this.getDatepiker(value[i].PAYMENT_DATE, value[i].PAYMENT_TIME) }
      if (value[i].APPROVE_DATE == "") { APPROVE_DATE = "" } else { APPROVE_DATE = this.getDatepiker(value[i].APPROVE_DATE, value[i].APPROVE_TIME) }
      if (value[i].COMMAND_DATE == "") { COMMAND_DATE = "" } else { COMMAND_DATE = this.getDatepiker(value[i].COMMAND_DATE, value[i].COMMAND_TIME) }

      set.push({
        COMPARE_MAPPING_ID: value[i].COMPARE_MAPPING_ID,
        COMPARE_ID: value[i].COMPARE_ID,
        INDICTMENT_DETAIL_ID: value[i].MAP_INDICTMENT_DETAIL_ID,
        PAST_LAWSUIT_ID: value[i].PAST_LAWSUIT_ID || '',
        IS_EVER_WRONG: value[i].IS_EVER_WRONG || '',
        IS_ACTIVE: value[i].MAP_IS_ACTIVE,
        CompareDetail: []
        ,
        CompareArrestIndictmentDetail: [{
          COMPANY_REGISTRATION_NO: value[i].COMPANY_REGISTRATION_NO || '',
          ENTITY_TYPE: value[i].ENTITY_TYPE || '',
          EXCISE_REGISTRATION_NO: value[i].EXCISE_REGISTRATION_NO || '',
          FIRST_NAME: value[i].FIRST_NAME || '',
          ID_CARD: value[i].ID_CARD || '',
          INDICTMENT_DETAIL_ID: value[i].INDICTMENT_DETAIL_ID || '',
          INDICTMENT_ID: value[i].INDICTMENT_ID || '',
          LAST_NAME: value[i].LAST_NAME || '',
          LAWBREAKER_ID: value[i].LAWBREAKER_ID || '',
          MIDDLE_NAME: value[i].MIDDLE_NAME || '',
          OTHER_NAME: value[i].OTHER_NAME || '',
          PASSPORT_NO: value[i].PASSPORT_NO || '',
          PERSON_ID: value[i].PERSON_ID || '',
          PERSON_TYPE: value[i].PERSON_TYPE || '',
          TITLE_NAME_EN: value[i].TITLE_NAME_EN || '',
          TITLE_NAME_TH: value[i].TITLE_NAME_TH || '',
          TITLE_SHORT_NAME_EN: value[i].TITLE_SHORT_NAME_EN || '',
          TITLE_SHORT_NAME_TH: value[i].TITLE_SHORT_NAME_TH || '',
        }],
      });

      var RECEIPT_CODE;
      if (value[i].RECEIPT_TYPE == 1) {
        await this.CAL_RECEIPT_CODE();
        RECEIPT_CODE = this.RECEIPT_CODE;
      } else {
        RECEIPT_CODE = value[i].RECEIPT_NO;
      }

      var CompareDetail = {
        COMPARE_DETAIL_ID: value[i].COMPARE_DETAIL_ID,
        COMPARE_MAPPING_ID: value[i].DE_COMPARE_MAPPING_ID,
        RECEIPT_OFFICE_ID: value[i].RECEIPT_OFFICE_ID || '',
        APPROVE_OFFICE_ID: value[i].APPROVE_OFFICE_ID || '',
        MISTREAT_NO: value[i].MISTREAT || '',
        OLD_PAYMENT_FINE: value[i].OLD_PAYMENT_FINE || '',
        PAYMENT_FINE: this.all_PAYMENT_FINE()[i].total || '',
        DIFFERENCE_PAYMENT_FINE: value[i].DIFFERENCE_PAYMENT_FINE || '',
        TREASURY_MONEY: this.all_TREASURY_MONEY()[i].total || '',
        BRIBE_MONEY: this.all_BRIBE_MONEY()[i].total || '',
        REWARD_MONEY: this.all_REWARD_MONEY()[i].total || '',
        PAYMENT_FINE_DUE_DATE: PAYMENT_FINE_DUE_DATE || '',
        PAYMENT_VAT_DUE_DATE: PAYMENT_VAT_DUE_DATE || '',
        INSURANCE: value[i].INSURANCE || '',
        GAURANTEE: value[i].GAURANTEE || '',
        PAYMENT_DATE: PAYMENT_DATE || '',
        RECEIPT_TYPE: value[i].RECEIPT_TYPE || '',
        RECEIPT_BOOK_NO: parseInt(value[i].RECEIPT_BOOK_NO) || '',
        RECEIPT_NO: parseInt(RECEIPT_CODE) || '',
        RECEIPT_OFFICE_CODE: value[i].PAYMENT_OFFICE_CODE || '',
        RECEIPT_OFFICE_NAME: value[i].PAYMENT_OFFICE_NAME || '',
        APPROVE_OFFICE_CODE: value[i].APPROVE_OFFICE_CODE || '',
        APPROVE_OFFICE_NAME: value[i].APPROVE_OFFICE_NAME || '',
        APPROVE_DATE: APPROVE_DATE || '',
        APPROVE_TYPE: value[i].APPROVE_TYPE || '',
        COMMAND_NO: value[i].COMMAND_NO || '',
        COMMAND_DATE: COMMAND_DATE || '',
        REMARK_NOT_AGREE: value[i].REMARK_NOT_AGREE || '',
        REMARK_NOT_APPROVE: value[i].REMARK_NOT_APPROVE || '',
        FACT: value[i].FACT || '',
        COMPARE_REASON: value[i].COMPARE_REASON || '',
        ADJUST_REASON: value[i].ADJUST_REASON || '',
        COMPARE_TYPE: value[i].COMPARE_TYPE || '',
        IS_REQUEST: value[i].IS_REQUEST || '',
        IS_TEMP_RELEASE: value[i].IS_TEMP_RELEASE || '',
        IS_INSURANCE: value[i].IS_INSURANCE || '',
        IS_GAURANTEE: value[i].IS_GAURANTEE || '',
        IS_PAYMENT: value[i].IS_PAYMENT || '',
        IS_REVENUE: value[i].IS_REVENUE || '',
        IS_AGREE: value[i].IS_AGREE || '',
        IS_APPROVE: value[i].IS_APPROVE || '',
        IS_AUTHORITY: value[i].IS_AUTHORITY || '',
        DID: value[i].DID || '',
        IS_ACTIVE: value[i].DE_IS_ACTIVE || '',
        CompareStaff: [],
        CompareDetailPayment: [],
        CompareDetailFine: [],
        ComparePayment: [],
      }

      this.set_update_CompareDetail(CompareDetail);
      this.set_update_CompareStaff(value[i].CompareStaffDetail, value[i].backup_CompareStaffDetail, value[i].COMPARE_ID, value[i].COMPARE_DETAIL_ID);
      // this.set_update_CompareDetailPayment(value[i]);
      this.set_update_CompareDetailFine(value[i]);
      if (this.edit_payment == true) { this.set_update_ComparePayment(value[i]); }
    }
    return set
  }

  set_update_CompareDetail(list) {
    console.log("CompareDetail : ", list)
    this.fineService.CompareDetailupdByCon("CompareDetailupdByCon", list).then(res => {
      console.log("CompareDetailupdByCon : ", res)
    })
  }

  set_update_CompareStaff(compareStaff, backup_compareStaff, COMPARE_ID, COMPARE_DETAIL_ID) {
    var set = [];
    var set_backup = [];
    var staff = compareStaff;
    var staff_backup = backup_compareStaff;

    // console.log("staff : ",compareStaff);
    // console.log("backup_staff : ",backup_compareStaff);
    for (var j = 0; j < staff_backup.length; j++) {
      for (var i = 0; i < staff.length; i++) {
        if (staff_backup[j].IS_ACTIVE == 0) {
          if (staff_backup[j].CONTRIBUTOR_ID == staff[i].CONTRIBUTOR_ID) {
            if (staff[i].COMPARE_ID == "" && staff[i].IS_ACTIVE == 1) {
              this.set_insert_CompareStaff(staff[i], COMPARE_ID, COMPARE_DETAIL_ID);
            }
          }
        }
      }
    }

    for (var j = 0; j < staff_backup.length; j++) {
      for (var i = 0; i < staff.length; i++) {
        if (staff_backup[j].IS_ACTIVE == 1) {
          if (staff_backup[j].CONTRIBUTOR_ID == staff[i].CONTRIBUTOR_ID) {
            if (staff[i].COMPARE_ID == "" && staff[i].IS_ACTIVE == 0) {
              set.push({
                STAFF_ID: staff_backup[j].STAFF_ID,
                COMPARE_ID: COMPARE_ID,
                COMPARE_DETAIL_ID: COMPARE_DETAIL_ID,
                STAFF_REF_ID: staff_backup[j].STAFF_REF_ID,
                TITLE_ID: staff_backup[j].TITLE_ID,
                STAFF_CODE: staff_backup[j].STAFF_CODE,
                ID_CARD: staff_backup[j].ID_CARD,
                STAFF_TYPE: staff_backup[j].STAFF_TYPE,
                TITLE_NAME_TH: staff_backup[j].TITLE_NAME_TH,
                TITLE_NAME_EN: staff_backup[j].TITLE_NAME_EN,
                TITLE_SHORT_NAME_TH: staff_backup[j].TITLE_SHORT_NAME_TH,
                TITLE_SHORT_NAME_EN: staff_backup[j].TITLE_SHORT_NAME_EN,
                FIRST_NAME: staff_backup[j].FIRST_NAME,
                LAST_NAME: staff_backup[j].LAST_NAME,
                AGE: staff_backup[j].AGE,
                OPERATION_POS_CODE: staff_backup[j].OPERATION_POS_CODE,
                OPREATION_POS_NAME: staff_backup[j].OPREATION_POS_NAME,
                OPREATION_POS_LEVEL: staff_backup[j].OPREATION_POS_LEVEL,
                OPERATION_POS_LEVEL_NAME: staff_backup[j].OPERATION_POS_LEVEL_NAME,
                OPERATION_DEPT_CODE: staff_backup[j].OPERATION_DEPT_CODE,
                OPERATION_DEPT_NAME: staff_backup[j].OPERATION_DEPT_NAME,
                OPERATION_DEPT_LEVEL: staff_backup[j].OPERATION_DEPT_LEVEL,
                OPERATION_UNDER_DEPT_CODE: staff_backup[j].OPERATION_UNDER_DEPT_CODE,
                OPERATION_UNDER_DEPT_NAME: staff_backup[j].OPERATION_UNDER_DEPT_NAME,
                OPERATION_UNDER_DEPT_LEVEL: staff_backup[j].OPERATION_UNDER_DEPT_LEVEL,
                OPERATION_WORK_DEPT_CODE: staff_backup[j].OPERATION_WORK_DEPT_CODE,
                OPERATION_WORK_DEPT_NAME: staff_backup[j].OPERATION_WORK_DEPT_NAME,
                OPERATION_WORK_DEPT_LEVEL: staff_backup[j].OPERATION_WORK_DEPT_LEVEL,
                OPERATION_OFFICE_CODE: staff_backup[j].OPERATION_OFFICE_CODE,
                OPERATION_OFFICE_NAME: staff_backup[j].OPERATION_OFFICE_NAME,
                OPERATION_OFFICE_SHORT_NAME: staff_backup[j].OPERATION_OFFICE_SHORT_NAME,
                MANAGEMENT_POS_CODE: staff_backup[j].MANAGEMENT_POS_CODE,
                MANAGEMENT_POS_NAME: staff_backup[j].MANAGEMENT_POS_NAME,
                MANAGEMENT_POS_LEVEL: staff_backup[j].MANAGEMENT_POS_LEVEL,
                MANAGEMENT_POS_LEVEL_NAME: staff_backup[j].MANAGEMENT_POS_LEVEL_NAME,
                MANAGEMENT_DEPT_CODE: staff_backup[j].MANAGEMENT_DEPT_CODE,
                MANAGEMENT_DEPT_NAME: staff_backup[j].MANAGEMENT_DEPT_NAME,
                MANAGEMENT_DEPT_LEVEL: staff_backup[j].MANAGEMENT_DEPT_LEVEL,
                MANAGEMENT_UNDER_DEPT_CODE: staff_backup[j].MANAGEMENT_UNDER_DEPT_CODE,
                MANAGEMENT_UNDER_DEPT_NAME: staff_backup[j].MANAGEMENT_UNDER_DEPT_NAME,
                MANAGEMENT_UNDER_DEPT_LEVEL: staff_backup[j].MANAGEMENT_UNDER_DEPT_LEVEL,
                MANAGEMENT_WORK_DEPT_CODE: staff_backup[j].MANAGEMENT_WORK_DEPT_CODE,
                MANAGEMENT_WORK_DEPT_NAME: staff_backup[j].MANAGEMENT_WORK_DEPT_NAME,
                MANAGEMENT_WORK_DEPT_LEVEL: staff_backup[j].MANAGEMENT_WORK_DEPT_LEVEL,
                MANAGEMENT_OFFICE_CODE: staff_backup[j].MANAGEMENT_OFFICE_CODE,
                MANAGEMENT_OFFICE_NAME: staff_backup[j].MANAGEMENT_OFFICE_NAME,
                MANAGEMENT_OFFICE_SHORT_NAME: staff_backup[j].MANAGEMENT_OFFICE_SHORT_NAME,
                REPRESENTATION_POS_CODE: staff_backup[j].REPRESENTATION_POS_CODE,
                REPRESENTATION_POS_NAME: staff_backup[j].REPRESENTATION_POS_NAME,
                REPRESENTATION_POS_LEVEL: staff_backup[j].REPRESENTATION_POS_LEVEL,
                REPRESENTATION_POS_LEVEL_NAME: staff_backup[j].REPRESENTATION_POS_LEVEL_NAME,
                REPRESENTATION_DEPT_CODE: staff_backup[j].REPRESENTATION_DEPT_CODE,
                REPRESENTATION_DEPT_NAME: staff_backup[j].REPRESENTATION_DEPT_NAME,
                REPRESENTATION_DEPT_LEVEL: staff_backup[j].REPRESENTATION_DEPT_LEVEL,
                REPRESENTATION_UNDER_DEPT_CODE: staff_backup[j].REPRESENTATION_UNDER_DEPT_CODE,
                REPRESENTATION_UNDER_DEPT_NAME: staff_backup[j].REPRESENTATION_UNDER_DEPT_NAME,
                REPRESENTATION_UNDER_DEPT_LEVEL: staff_backup[j].REPRESENTATION_UNDER_DEPT_LEVEL,
                REPRESENT_WORK_DEPT_CODE: staff_backup[j].REPRESENT_WORK_DEPT_CODE,
                REPRESENT_WORK_DEPT_NAME: staff_backup[j].REPRESENT_WORK_DEPT_NAME,
                REPRESENT_WORK_DEPT_LEVEL: staff_backup[j].REPRESENT_WORK_DEPT_LEVEL,
                REPRESENT_OFFICE_CODE: staff_backup[j].REPRESENT_OFFICE_CODE,
                REPRESENT_OFFICE_NAME: staff_backup[j].REPRESENT_OFFICE_NAME,
                REPRESENT_OFFICE_SHORT_NAME: staff_backup[j].REPRESENT_OFFICE_SHORT_NAME,
                STATUS: staff_backup[j].STATUS,
                REMARK: staff_backup[j].REMARK,
                CONTRIBUTOR_ID: staff_backup[j].CONTRIBUTOR_ID,
                IS_ACTIVE: 0,
              })
            } else {
              set.push({
                STAFF_ID: staff_backup[j].STAFF_ID,
                COMPARE_ID: COMPARE_ID,
                COMPARE_DETAIL_ID: COMPARE_DETAIL_ID,
                STAFF_REF_ID: staff[i].STAFF_ID,
                TITLE_ID: staff[i].TITLE_ID,
                STAFF_CODE: staff[i].STAFF_CODE,
                ID_CARD: staff[i].ID_CARD,
                STAFF_TYPE: staff[i].STAFF_TYPE,
                TITLE_NAME_TH: staff[i].TITLE_NAME_TH,
                TITLE_NAME_EN: staff[i].TITLE_NAME_EN,
                TITLE_SHORT_NAME_TH: staff[i].TITLE_SHORT_NAME_TH,
                TITLE_SHORT_NAME_EN: staff[i].TITLE_SHORT_NAME_EN,
                FIRST_NAME: staff[i].FIRST_NAME,
                LAST_NAME: staff[i].LAST_NAME,
                AGE: staff[i].AGE,
                OPERATION_POS_CODE: staff[i].OPERATION_POS_CODE,
                OPREATION_POS_NAME: staff[i].OPREATION_POS_NAME,
                OPREATION_POS_LEVEL: staff[i].OPREATION_POS_LEVEL,
                OPERATION_POS_LEVEL_NAME: staff[i].OPERATION_POS_LEVEL_NAME,
                OPERATION_DEPT_CODE: staff[i].OPERATION_DEPT_CODE,
                OPERATION_DEPT_NAME: staff[i].OPERATION_DEPT_NAME,
                OPERATION_DEPT_LEVEL: staff[i].OPERATION_DEPT_LEVEL,
                OPERATION_UNDER_DEPT_CODE: staff[i].OPERATION_UNDER_DEPT_CODE,
                OPERATION_UNDER_DEPT_NAME: staff[i].OPERATION_UNDER_DEPT_NAME,
                OPERATION_UNDER_DEPT_LEVEL: staff[i].OPERATION_UNDER_DEPT_LEVEL,
                OPERATION_WORK_DEPT_CODE: staff[i].OPERATION_WORK_DEPT_CODE,
                OPERATION_WORK_DEPT_NAME: staff[i].OPERATION_WORK_DEPT_NAME,
                OPERATION_WORK_DEPT_LEVEL: staff[i].OPERATION_WORK_DEPT_LEVEL,
                OPERATION_OFFICE_CODE: staff[i].OPERATION_OFFICE_CODE,
                OPERATION_OFFICE_NAME: staff[i].OPERATION_OFFICE_NAME,
                OPERATION_OFFICE_SHORT_NAME: staff[i].OPERATION_OFFICE_SHORT_NAME,
                MANAGEMENT_POS_CODE: staff[i].MANAGEMENT_POS_CODE,
                MANAGEMENT_POS_NAME: staff[i].MANAGEMENT_POS_NAME,
                MANAGEMENT_POS_LEVEL: staff[i].MANAGEMENT_POS_LEVEL,
                MANAGEMENT_POS_LEVEL_NAME: staff[i].MANAGEMENT_POS_LEVEL_NAME,
                MANAGEMENT_DEPT_CODE: staff[i].MANAGEMENT_DEPT_CODE,
                MANAGEMENT_DEPT_NAME: staff[i].MANAGEMENT_DEPT_NAME,
                MANAGEMENT_DEPT_LEVEL: staff[i].MANAGEMENT_DEPT_LEVEL,
                MANAGEMENT_UNDER_DEPT_CODE: staff[i].MANAGEMENT_UNDER_DEPT_CODE,
                MANAGEMENT_UNDER_DEPT_NAME: staff[i].MANAGEMENT_UNDER_DEPT_NAME,
                MANAGEMENT_UNDER_DEPT_LEVEL: staff[i].MANAGEMENT_UNDER_DEPT_LEVEL,
                MANAGEMENT_WORK_DEPT_CODE: staff[i].MANAGEMENT_WORK_DEPT_CODE,
                MANAGEMENT_WORK_DEPT_NAME: staff[i].MANAGEMENT_WORK_DEPT_NAME,
                MANAGEMENT_WORK_DEPT_LEVEL: staff[i].MANAGEMENT_WORK_DEPT_LEVEL,
                MANAGEMENT_OFFICE_CODE: staff[i].MANAGEMENT_OFFICE_CODE,
                MANAGEMENT_OFFICE_NAME: staff[i].MANAGEMENT_OFFICE_NAME,
                MANAGEMENT_OFFICE_SHORT_NAME: staff[i].MANAGEMENT_OFFICE_SHORT_NAME,
                REPRESENTATION_POS_CODE: staff[i].REPRESENTATION_POS_CODE,
                REPRESENTATION_POS_NAME: staff[i].REPRESENTATION_POS_NAME,
                REPRESENTATION_POS_LEVEL: staff[i].REPRESENTATION_POS_LEVEL,
                REPRESENTATION_POS_LEVEL_NAME: staff[i].REPRESENTATION_POS_LEVEL_NAME,
                REPRESENTATION_DEPT_CODE: staff[i].REPRESENTATION_DEPT_CODE,
                REPRESENTATION_DEPT_NAME: staff[i].REPRESENTATION_DEPT_NAME,
                REPRESENTATION_DEPT_LEVEL: staff[i].REPRESENTATION_DEPT_LEVEL,
                REPRESENTATION_UNDER_DEPT_CODE: staff[i].REPRESENTATION_UNDER_DEPT_CODE,
                REPRESENTATION_UNDER_DEPT_NAME: staff[i].REPRESENTATION_UNDER_DEPT_NAME,
                REPRESENTATION_UNDER_DEPT_LEVEL: staff[i].REPRESENTATION_UNDER_DEPT_LEVEL,
                REPRESENT_WORK_DEPT_CODE: staff[i].REPRESENT_WORK_DEPT_CODE,
                REPRESENT_WORK_DEPT_NAME: staff[i].REPRESENT_WORK_DEPT_NAME,
                REPRESENT_WORK_DEPT_LEVEL: staff[i].REPRESENT_WORK_DEPT_LEVEL,
                REPRESENT_OFFICE_CODE: staff[i].REPRESENT_OFFICE_CODE,
                REPRESENT_OFFICE_NAME: staff[i].REPRESENT_OFFICE_NAME,
                REPRESENT_OFFICE_SHORT_NAME: staff[i].REPRESENT_OFFICE_SHORT_NAME,
                STATUS: staff[i].STATUS,
                REMARK: staff[i].REMARK,
                CONTRIBUTOR_ID: staff[i].CONTRIBUTOR_ID,
                IS_ACTIVE: staff[i].IS_ACTIVE,
              })
            }
          }
        }
      }
    }
    // console.log("CompareDetailStaffupdByCon",set)
    this.fineService.CompareDetailStaffupdByCon("CompareDetailStaffupdByCon", set).then(res => {
      console.log("CompareDetailStaffupdByCon : ", res)
    });
  }

  // set_update_CompareDetailPayment(list) {
  //   var set = [];
  //   if (list.BACKUP_IS_PAYMENT == 0 && list.IS_PAYMENT == 0) {
  //     // console.log("0-0")
  //     return set;
  //   } else if (list.BACKUP_IS_PAYMENT == 1 && list.IS_PAYMENT == 0) {
  //     var payment = list.backup_payment;
  //     for (var i = 0; i < payment.length; i++) {
  //       set.push({
  //         PAYMENT_ID: payment[i].DETAIL_PAYMENT_ID,
  //         COMPARE_DETAIL_ID: payment[i].COMPARE_DETAIL_ID,
  //         PAYMENT_TYPE: payment[i].PAYMENT_TYPE,
  //         PAYMENT_FINE: payment[i].PAYMENT_FINE,
  //         REFFERENCE_NO: payment[i].REFFERENCE_NO,
  //         IS_ACTIVE: 0,
  //       });
  //     }
  //     // console.log("1-0")
  //     // return set;
  //     this.fineService.CompareDetailPaymentupdByCon("CompareDetailPaymentupdByCon", set).then(res => {
  //       console.log("CompareDetailPaymentupdByCon : ", res)
  //     });
  //   } else if (list.BACKUP_IS_PAYMENT == 0 && list.IS_PAYMENT == 1) {
  //     var payment = list.payment;
  //     for (var i = 0; i < payment.length; i++) {
  //       if (payment[i].DETAIL_PAYMENT_ID == 0) {
  //         var newins = [];
  //         newins.push({
  //           PAYMENT_ID: "",
  //           COMPARE_DETAIL_ID: list.COMPARE_DETAIL_ID,
  //           PAYMENT_TYPE: payment[i].PAYMENT_TYPE,
  //           PAYMENT_FINE: payment[i].PAYMENT_FINE,
  //           REFFERENCE_NO: payment[i].REFFERENCE_NO,
  //           IS_ACTIVE: 1,
  //         });
  //         this.set_insert_CompareDetailPayment(newins)
  //       }
  //     }
  //   } else {
  //     // console.log("1-1")
  //     var payment = list.payment;
  //     var backup = list.backup_payment;
  //     for (var i = 0; i < payment.length; i++) {
  //       if (payment[i].DETAIL_PAYMENT_ID == 0) {
  //         var newins = [];
  //         newins.push({
  //           PAYMENT_ID: "",
  //           COMPARE_DETAIL_ID: list.COMPARE_DETAIL_ID,
  //           PAYMENT_TYPE: payment[i].PAYMENT_TYPE,
  //           PAYMENT_FINE: payment[i].PAYMENT_FINE,
  //           REFFERENCE_NO: payment[i].REFFERENCE_NO,
  //           IS_ACTIVE: 1,
  //         });
  //         this.set_insert_CompareDetailPayment(newins)
  //       }
  //     }

  //     for (var i = 0; i < backup.length; i++) {
  //       for (var j = 0; j < payment.length; j++) {
  //         if (backup[i].DETAIL_PAYMENT_ID == payment[j].DETAIL_PAYMENT_ID) {
  //           // console.log(payment[j])
  //           set.push({
  //             PAYMENT_ID: payment[j].DETAIL_PAYMENT_ID,
  //             COMPARE_DETAIL_ID: payment[j].COMPARE_DETAIL_ID,
  //             PAYMENT_TYPE: payment[j].PAYMENT_TYPE,
  //             PAYMENT_FINE: payment[j].PAYMENT_FINE,
  //             REFFERENCE_NO: payment[j].REFFERENCE_NO,
  //             IS_ACTIVE: 1,
  //           });
  //           backup[i].DETAIL_PAYMENT_ID = "dis";
  //         }
  //       }
  //     }

  //     for (var i = 0; i < backup.length; i++) {
  //       if (backup[i].DETAIL_PAYMENT_ID !== "dis") {
  //         set.push({
  //           PAYMENT_ID: backup[i].DETAIL_PAYMENT_ID,
  //           COMPARE_DETAIL_ID: backup[i].COMPARE_DETAIL_ID,
  //           PAYMENT_TYPE: backup[i].PAYMENT_TYPE,
  //           PAYMENT_FINE: backup[i].PAYMENT_FINE,
  //           REFFERENCE_NO: backup[i].REFFERENCE_NO,
  //           IS_ACTIVE: 0,
  //         });
  //       }
  //     }

  //     // console.log("set : ",set)
  //     // console.log("backup : ",backup)
  //     // return set;
  //     this.fineService.CompareDetailPaymentupdByCon("CompareDetailPaymentupdByCon", set).then(res => {
  //       console.log("CompareDetailPaymentupdByCon : ", res)
  //     });

  //   }

  // }

  set_update_CompareDetailFine(list) {
    var set = [];
    var product = list.product;
    for (var i = 0; i < product.length; i++) {
      set.push({
        FINE_ID: product[i].FINE_ID,
        COMPARE_DETAIL_ID: product[i].COMPARE_DETAIL_ID,
        PRODUCT_ID: product[i].PRODUCT_ID,
        FINE_RATE: product[i].FINE_RATE,
        VAT: product[i].VAT,
        FINE: product[i].NET_FINE,
        NET_FINE: product[i].NET_FINE,
        OLD_PAYMENT_FINE: product[i].OLD_PAYMENT_FINE,
        PAYMENT_FINE: product[i].PAYMENT_FINE,
        DIFFERENCE_PAYMENT_FINE: product[i].DIFFERENCE_PAYMENT_FINE,
        TREASURY_MONEY: product[i].TREASURY_MONEY,
        BRIBE_MONEY: product[i].BRIBE_MONEY,
        REWARD_MONEY: product[i].REWARD_MONEY,
        IS_ACTIVE: 1
      })
    }
    this.fineService.CompareDetailFineupdByCon("CompareDetailFineupdByCon", set).then(res => {
      console.log("CompareDetailFineupdByCon : ", res)
    });
    // return set
  }

  set_update_ComparePayment(list) {

    var PAYMENT_DATE;
    if (list.PAYMENT_DATE == "") { PAYMENT_DATE = "" } else { PAYMENT_DATE = this.getDatepiker(list.PAYMENT_DATE, list.PAYMENT_TIME) }

    var set = [];
    if (list.BACKUP_IS_PAYMENT == 0 && list.IS_PAYMENT == 0) {
      return set;
    } else if (list.BACKUP_IS_PAYMENT == 1 && list.IS_PAYMENT == 0) {
      var backup = list.compare_payment;

      for (var i = 0; i < backup.length; i++) {
        this.set_del_ComparePaymentupdDelete(backup[i].PAYMENT_ID);
      }
      return set;
    } else if (list.BACKUP_IS_PAYMENT == 0 && list.IS_PAYMENT == 1) {
      var payment = list.payment;
      for (var i = 0; i < payment.length; i++) {
        if (payment[i].PAYMENT_ID == 0) {
          var newins = [];
          if (this.NOTICE_ID == 0) {
            newins.push({
              PAYMENT_ID: "",
              LAWSUIT_DETAIL_ID: "",
              COMPARE_DETAIL_ID: list.COMPARE_DETAIL_ID,
              FINE_TYPE: 1,
              FINE: payment[i].PAYMENT_FINE,
              PAYMENT_PERIOD_NO: "",
              PAYMENT_DATE: PAYMENT_DATE,
              IS_REQUEST_REWARD: 0,
              IS_ACTIVE: 1,
              PAYMENT_CHANNEL: payment[i].PAYMENT_TYPE,
              PAYMENT_BANK: payment[i].PAYMENT_BANK,
              PAYMENT_REF_NO: payment[i].REFFERENCE_NO,
              IS_REVENUE: 0,
              ComparePaymentDetail: [
                // {
                //   PAYMENT_DETAIL_ID: "",
                //   PAYMENT_ID: "",
                //   NOTICE_ID: this.NOTICE_ID,
                //   IS_REQUEST_BRIBE: 0,
                //   IS_ACTIVE: 1
                // }
              ]
            });
          } else {
            newins.push({
              PAYMENT_ID: "",
              LAWSUIT_DETAIL_ID: "",
              COMPARE_DETAIL_ID: list.COMPARE_DETAIL_ID,
              FINE_TYPE: 1,
              FINE: payment[i].PAYMENT_FINE,
              PAYMENT_PERIOD_NO: "",
              PAYMENT_DATE: PAYMENT_DATE,
              IS_REQUEST_REWARD: 0,
              IS_ACTIVE: 1,
              PAYMENT_CHANNEL: payment[i].PAYMENT_TYPE,
              PAYMENT_BANK: payment[i].PAYMENT_BANK,
              PAYMENT_REF_NO: payment[i].REFFERENCE_NO,
              IS_REVENUE: 0,
              ComparePaymentDetail: [
                {
                  PAYMENT_DETAIL_ID: "",
                  PAYMENT_ID: "",
                  NOTICE_ID: this.NOTICE_ID,
                  IS_REQUEST_BRIBE: 0,
                  IS_ACTIVE: 1
                }
              ]
            });
          }
          this.set_insert_ComparePayment(newins)
        }
      }
    } else {
      // console.log("1-1")
      var payment = list.payment;
      var backup = list.compare_payment;

      for (var i = 0; i < backup.length; i++) {
        this.set_del_ComparePaymentupdDelete(backup[i].PAYMENT_ID);
      }

      for (var i = 0; i < payment.length; i++) {
        if (payment[i].PAYMENT_ID == 0) {
          var newins = [];
          if (this.NOTICE_ID == 0) {
            newins.push({
              PAYMENT_ID: "",
              LAWSUIT_DETAIL_ID: "",
              COMPARE_DETAIL_ID: list.COMPARE_DETAIL_ID,
              FINE_TYPE: 1,
              FINE: payment[i].PAYMENT_FINE,
              PAYMENT_PERIOD_NO: "",
              PAYMENT_DATE: PAYMENT_DATE,
              IS_REQUEST_REWARD: 0,
              IS_ACTIVE: 1,
              PAYMENT_CHANNEL: payment[i].PAYMENT_TYPE,
              PAYMENT_BANK: payment[i].PAYMENT_BANK,
              PAYMENT_REF_NO: payment[i].REFFERENCE_NO,
              IS_REVENUE: 0,
              ComparePaymentDetail: [
                // {
                //   PAYMENT_DETAIL_ID: "",
                //   PAYMENT_ID: "",
                //   NOTICE_ID: this.NOTICE_ID,
                //   IS_REQUEST_BRIBE: 0,
                //   IS_ACTIVE: 1
                // }
              ]
            });
          } else {
            newins.push({
              PAYMENT_ID: "",
              LAWSUIT_DETAIL_ID: "",
              COMPARE_DETAIL_ID: list.COMPARE_DETAIL_ID,
              FINE_TYPE: 1,
              FINE: payment[i].PAYMENT_FINE,
              PAYMENT_PERIOD_NO: "",
              PAYMENT_DATE: PAYMENT_DATE,
              IS_REQUEST_REWARD: 0,
              IS_ACTIVE: 1,
              PAYMENT_CHANNEL: payment[i].PAYMENT_TYPE,
              PAYMENT_BANK: payment[i].PAYMENT_BANK,
              PAYMENT_REF_NO: payment[i].REFFERENCE_NO,
              IS_REVENUE: 0,
              ComparePaymentDetail: [
                {
                  PAYMENT_DETAIL_ID: "",
                  PAYMENT_ID: "",
                  NOTICE_ID: this.NOTICE_ID,
                  IS_REQUEST_BRIBE: 0,
                  IS_ACTIVE: 1
                }
              ]
            });
          }
          this.set_insert_ComparePayment(newins)
        }
      }

      for (var i = 0; i < backup.length; i++) {
        for (var j = 0; j < payment.length; j++) {
          if (backup[i].PAYMENT_ID == payment[j].PAYMENT_ID) {
            // console.log(payment[j])
            if (payment[j].ComparePaymentDetail_PAYMENT_DETAIL_ID == "") {
              set.push({
                PAYMENT_ID: payment[j].PAYMENT_ID,
                LAWSUIT_DETAIL_ID: payment[j].LAWSUIT_DETAIL_ID,
                COMPARE_DETAIL_ID: payment[j].COMPARE_DETAIL_ID,
                FINE_TYPE: payment[j].FINE_TYPE,
                FINE: payment[j].PAYMENT_FINE,
                PAYMENT_PERIOD_NO: payment[j].PAYMENT_PERIOD_NO,
                PAYMENT_DATE: PAYMENT_DATE,
                IS_REQUEST_REWARD: payment[j].IS_REQUEST_REWARD,
                IS_ACTIVE: 1,
                PAYMENT_CHANNEL: payment[j].PAYMENT_TYPE,
                PAYMENT_BANK: payment[j].PAYMENT_CODE,
                PAYMENT_REF_NO: payment[j].REFFERENCE_NO,
                IS_REVENUE: payment[j].IS_REVENUE,
                ComparePaymentDetail: [
                  // {
                  //   PAYMENT_DETAIL_ID: 1,
                  //   PAYMENT_ID: 1,
                  //   NOTICE_ID: 0,
                  //   IS_REQUEST_BRIBE: 0,
                  //   IS_ACTIVE: 1
                  // }
                ]
              });
            } else {
              set.push({
                PAYMENT_ID: payment[j].PAYMENT_ID,
                LAWSUIT_DETAIL_ID: payment[j].LAWSUIT_DETAIL_ID,
                COMPARE_DETAIL_ID: payment[j].COMPARE_DETAIL_ID,
                FINE_TYPE: payment[j].FINE_TYPE,
                FINE: payment[j].PAYMENT_FINE,
                PAYMENT_PERIOD_NO: payment[j].PAYMENT_PERIOD_NO,
                PAYMENT_DATE: PAYMENT_DATE,
                IS_REQUEST_REWARD: payment[j].IS_REQUEST_REWARD,
                IS_ACTIVE: 1,
                PAYMENT_CHANNEL: payment[j].PAYMENT_TYPE,
                PAYMENT_BANK: payment[j].PAYMENT_CODE,
                PAYMENT_REF_NO: payment[j].REFFERENCE_NO,
                IS_REVENUE: payment[j].IS_REVENUE,
                ComparePaymentDetail: [
                  {
                    PAYMENT_DETAIL_ID: payment[j].ComparePaymentDetail_PAYMENT_DETAIL_ID,
                    PAYMENT_ID: payment[j].ComparePaymentDetail_PAYMENT_ID,
                    NOTICE_ID: payment[j].ComparePaymentDetail_NOTICE_ID,
                    IS_REQUEST_BRIBE: payment[j].ComparePaymentDetail_IS_REQUEST_BRIBE,
                    IS_ACTIVE: 1
                  }
                ]
              });
            }
            backup[i].PAYMENT_ID = "dis";
          }
        }
      }

      for (var i = 0; i < backup.length; i++) {
        if (backup[i].PAYMENT_ID !== "dis") {
          if (backup[i].ComparePaymentDetail_PAYMENT_DETAIL_ID == "") {
            set.push({
              PAYMENT_ID: backup[i].PAYMENT_ID,
              LAWSUIT_DETAIL_ID: backup[i].LAWSUIT_DETAIL_ID,
              COMPARE_DETAIL_ID: backup[i].COMPARE_DETAIL_ID,
              FINE_TYPE: backup[i].FINE_TYPE,
              FINE: backup[i].FINE,
              PAYMENT_PERIOD_NO: backup[i].PAYMENT_PERIOD_NO,
              PAYMENT_DATE: PAYMENT_DATE,
              IS_REQUEST_REWARD: backup[i].IS_REQUEST_REWARD,
              IS_ACTIVE: 0,
              PAYMENT_CHANNEL: backup[i].PAYMENT_TYPE,
              PAYMENT_BANK: backup[i].PAYMENT_CODE,
              PAYMENT_REF_NO: backup[i].REFFERENCE_NO,
              IS_REVENUE: backup[i].IS_REVENUE,
              ComparePaymentDetail: [
                // {
                //   PAYMENT_DETAIL_ID: 1,
                //   PAYMENT_ID: 1,
                //   NOTICE_ID: 0,
                //   IS_REQUEST_BRIBE: 0,
                //   IS_ACTIVE: 1
                // }
              ]
            });
          } else {
            set.push({
              PAYMENT_ID: backup[i].PAYMENT_ID,
              LAWSUIT_DETAIL_ID: backup[i].LAWSUIT_DETAIL_ID,
              COMPARE_DETAIL_ID: backup[i].COMPARE_DETAIL_ID,
              FINE_TYPE: backup[i].FINE_TYPE,
              FINE: backup[i].FINE,
              PAYMENT_PERIOD_NO: backup[i].PAYMENT_PERIOD_NO,
              PAYMENT_DATE: PAYMENT_DATE,
              IS_REQUEST_REWARD: backup[i].IS_REQUEST_REWARD,
              IS_ACTIVE: 0,
              PAYMENT_CHANNEL: backup[i].PAYMENT_TYPE,
              PAYMENT_BANK: backup[i].PAYMENT_CODE,
              PAYMENT_REF_NO: backup[i].REFFERENCE_NO,
              IS_REVENUE: backup[i].IS_REVENUE,
              ComparePaymentDetail: [
                {
                  PAYMENT_DETAIL_ID: backup[i].ComparePaymentDetail_PAYMENT_DETAIL_ID,
                  PAYMENT_ID: backup[i].ComparePaymentDetail_PAYMENT_ID,
                  NOTICE_ID: backup[i].ComparePaymentDetail_NOTICE_ID,
                  IS_REQUEST_BRIBE: backup[i].ComparePaymentDetail_IS_REQUEST_BRIBE,
                  IS_ACTIVE: 0
                }
              ]
            });
          }
        }
      }

      // console.log("set : ",set)
      // console.log("backup : ",backup)


      return set;

    }

  }

  // set_insert_CompareDetailPayment(list) {
  //   console.log("insert detail Payment : ",list)
  //   // this.fineService.CompareDetailPaymentinsAll("CompareDetailPaymentinsAll", list).then(res => {
  //   //   console.log("CompareDetailPaymentinsAll : ", res)
  //   // })
  // }

  set_del_ComparePaymentupdDelete(list) {
    let para = [
      {
        "PAYMENT_ID": list
      }
    ]

    console.log("insert Payment : ", para)
    this.fineService.ComparePaymentupdDelete("ComparePaymentupdDelete", para).then(res => {
      console.log("ComparePaymentinsAll : ", res)
    })
  }

  set_insert_ComparePayment(list) {
    console.log("insert Payment : ", list)
    this.fineService.ComparePaymentinsAll("ComparePaymentinsAll", list).then(res => {
      console.log("ComparePaymentinsAll : ", res)
    })
  }

  set_insert_CompareStaff(compareStaff, COMPARE_ID, COMPARE_DETAIL_ID) {
    var set = [];
    var staff = compareStaff;
    set.push({
      STAFF_ID: "",
      COMPARE_ID: COMPARE_ID,
      COMPARE_DETAIL_ID: COMPARE_DETAIL_ID,
      STAFF_REF_ID: staff.STAFF_ID,
      TITLE_ID: staff.TITLE_ID,
      STAFF_CODE: staff.STAFF_CODE,
      ID_CARD: staff.ID_CARD,
      STAFF_TYPE: staff.STAFF_TYPE,
      TITLE_NAME_TH: staff.TITLE_NAME_TH,
      TITLE_NAME_EN: staff.TITLE_NAME_EN,
      TITLE_SHORT_NAME_TH: staff.TITLE_SHORT_NAME_TH,
      TITLE_SHORT_NAME_EN: staff.TITLE_SHORT_NAME_EN,
      FIRST_NAME: staff.FIRST_NAME,
      LAST_NAME: staff.LAST_NAME,
      AGE: staff.AGE,
      OPERATION_POS_CODE: staff.OPERATION_POS_CODE,
      OPREATION_POS_NAME: staff.OPREATION_POS_NAME,
      OPREATION_POS_LEVEL: staff.OPREATION_POS_LEVEL,
      OPERATION_POS_LEVEL_NAME: staff.OPERATION_POS_LEVEL_NAME,
      OPERATION_DEPT_CODE: staff.OPERATION_DEPT_CODE,
      OPERATION_DEPT_NAME: staff.OPERATION_DEPT_NAME,
      OPERATION_DEPT_LEVEL: staff.OPERATION_DEPT_LEVEL,
      OPERATION_UNDER_DEPT_CODE: staff.OPERATION_UNDER_DEPT_CODE,
      OPERATION_UNDER_DEPT_NAME: staff.OPERATION_UNDER_DEPT_NAME,
      OPERATION_UNDER_DEPT_LEVEL: staff.OPERATION_UNDER_DEPT_LEVEL,
      OPERATION_WORK_DEPT_CODE: staff.OPERATION_WORK_DEPT_CODE,
      OPERATION_WORK_DEPT_NAME: staff.OPERATION_WORK_DEPT_NAME,
      OPERATION_WORK_DEPT_LEVEL: staff.OPERATION_WORK_DEPT_LEVEL,
      OPERATION_OFFICE_CODE: staff.OPERATION_OFFICE_CODE,
      OPERATION_OFFICE_NAME: staff.OPERATION_OFFICE_NAME,
      OPERATION_OFFICE_SHORT_NAME: staff.OPERATION_OFFICE_SHORT_NAME,
      MANAGEMENT_POS_CODE: staff.MANAGEMENT_POS_CODE,
      MANAGEMENT_POS_NAME: staff.MANAGEMENT_POS_NAME,
      MANAGEMENT_POS_LEVEL: staff.MANAGEMENT_POS_LEVEL,
      MANAGEMENT_POS_LEVEL_NAME: staff.MANAGEMENT_POS_LEVEL_NAME,
      MANAGEMENT_DEPT_CODE: staff.MANAGEMENT_DEPT_CODE,
      MANAGEMENT_DEPT_NAME: staff.MANAGEMENT_DEPT_NAME,
      MANAGEMENT_DEPT_LEVEL: staff.MANAGEMENT_DEPT_LEVEL,
      MANAGEMENT_UNDER_DEPT_CODE: staff.MANAGEMENT_UNDER_DEPT_CODE,
      MANAGEMENT_UNDER_DEPT_NAME: staff.MANAGEMENT_UNDER_DEPT_NAME,
      MANAGEMENT_UNDER_DEPT_LEVEL: staff.MANAGEMENT_UNDER_DEPT_LEVEL,
      MANAGEMENT_WORK_DEPT_CODE: staff.MANAGEMENT_WORK_DEPT_CODE,
      MANAGEMENT_WORK_DEPT_NAME: staff.MANAGEMENT_WORK_DEPT_NAME,
      MANAGEMENT_WORK_DEPT_LEVEL: staff.MANAGEMENT_WORK_DEPT_LEVEL,
      MANAGEMENT_OFFICE_CODE: staff.MANAGEMENT_OFFICE_CODE,
      MANAGEMENT_OFFICE_NAME: staff.MANAGEMENT_OFFICE_NAME,
      MANAGEMENT_OFFICE_SHORT_NAME: staff.MANAGEMENT_OFFICE_SHORT_NAME,
      REPRESENTATION_POS_CODE: staff.REPRESENTATION_POS_CODE,
      REPRESENTATION_POS_NAME: staff.REPRESENTATION_POS_NAME,
      REPRESENTATION_POS_LEVEL: staff.REPRESENTATION_POS_LEVEL,
      REPRESENTATION_POS_LEVEL_NAME: staff.REPRESENTATION_POS_LEVEL_NAME,
      REPRESENTATION_DEPT_CODE: staff.REPRESENTATION_DEPT_CODE,
      REPRESENTATION_DEPT_NAME: staff.REPRESENTATION_DEPT_NAME,
      REPRESENTATION_DEPT_LEVEL: staff.REPRESENTATION_DEPT_LEVEL,
      REPRESENTATION_UNDER_DEPT_CODE: staff.REPRESENTATION_UNDER_DEPT_CODE,
      REPRESENTATION_UNDER_DEPT_NAME: staff.REPRESENTATION_UNDER_DEPT_NAME,
      REPRESENTATION_UNDER_DEPT_LEVEL: staff.REPRESENTATION_UNDER_DEPT_LEVEL,
      REPRESENT_WORK_DEPT_CODE: staff.REPRESENT_WORK_DEPT_CODE,
      REPRESENT_WORK_DEPT_NAME: staff.REPRESENT_WORK_DEPT_NAME,
      REPRESENT_WORK_DEPT_LEVEL: staff.REPRESENT_WORK_DEPT_LEVEL,
      REPRESENT_OFFICE_CODE: staff.REPRESENT_OFFICE_CODE,
      REPRESENT_OFFICE_NAME: staff.REPRESENT_OFFICE_NAME,
      REPRESENT_OFFICE_SHORT_NAME: staff.REPRESENT_OFFICE_SHORT_NAME,
      STATUS: staff.STATUS,
      REMARK: staff.REMARK,
      CONTRIBUTOR_ID: staff.CONTRIBUTOR_ID,
      IS_ACTIVE: staff.IS_ACTIVE,
    });
    // console.log("CompareDetailStaffinsAll : ",set)
    this.fineService.CompareDetailStaffinsAll("CompareDetailStaffinsAll", set).then(res => {
      console.log("CompareDetailStaffinsAll : ", res)
    })
  }


  /////////////////////////////////////////////////////////////////////////// clickcancelEdit //////////////////////////////////////////////////////////////////////////////////////////
  clickcancelEdit() {

    console.log("FORM COMPARE : ", this.compareForm.getRawValue())
    console.log("FORM ABOUT DETAIL : ", this.AboutPayFine.getRawValue())

    swal({
      type: 'warning',
      text: "ยืนยันการทำรายการหรือไม่" + ' ?',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: true,

    }).then((result) => {
      if (result.value == true) {
        location.reload();
      }
    })
  }

  isReq_COMPARE_NO = false;
  isReq_SET_COMPARE_DATE = false;
  isReq_SET_COMPARE_TIME = false;
  isReq_OFFICE_NAME = new BehaviorSubject<boolean>(false);
  isReq_IS_REQUEST = false;
  _swal(e) {
    swal({
      type: 'warning',
      text: e,
      confirmButtonText: 'ตกลง',
      buttonsStyling: true,
    })
  }

  getDatepiker(d, t) {
    if (d.date.month < 10 && d.date.day < 10) {
      var date = d.date.year + "-0" + d.date.month + "-0" + d.date.day + " " + t + ":00.00";
      return date;
    } else if (d.date.month < 10 && d.date.day >= 10) {
      var date = d.date.year + "-0" + d.date.month + "-" + d.date.day + " " + t + ":00.00";
      return date;
    } else if (d.date.day < 10 && d.date.month >= 10) {
      var date = d.date.year + "-" + d.date.month + "-0" + d.date.day + " " + t + ":00.00";
      return date;
    } else {
      var date = d.date.year + "-" + d.date.month + "-" + d.date.day + " " + t + ":00.00";
      return date;
    }
  }

  /////////////////////////////////////////////////////////////////////////// clickSave //////////////////////////////////////////////////////////////////////////////////////////
  async clickSave() {

    var arr1 = 0; var arr2 = 0; var arr3 = 0; var arr4 = 0;

    if (this.CompareStaff.value[0].IS_ACTIVE == 0) {
      this._swal('กรุณาระบุข้อมูล "ผู้เปรียบเทียบคดี"');
      this.collapse6 = new BehaviorSubject<Boolean>(true);
      arr3 = 0;
    } else { arr3 = 1; }

    if (this.compareForm.value.OFFICE_NAME == '') {
      this.isReq_OFFICE_NAME.next(true);
      this._swal('กรุณาระบุข้อมูล "สถานที่เปรียบเทียบ"');
      this.collapse4 = new BehaviorSubject<Boolean>(true);
    } else {
      this.isReq_OFFICE_NAME.next(false);
    }

    if (this.compareForm.value.SET_COMPARE_TIME == '') {
      this.isReq_SET_COMPARE_TIME = true;
      this._swal('กรุณาระบุข้อมูล "เวลาเปรียบเทียบ"');
      this.collapse4 = new BehaviorSubject<Boolean>(true);
    } else {
      this.isReq_SET_COMPARE_TIME = false;
    }

    if (this.compareForm.value.SET_COMPARE_DATE == null) {
      this.isReq_SET_COMPARE_DATE = true;
      this._swal('กรุณาระบุข้อมูล "วันที่กำหนดชำระค่าปรับ"');
      this.collapse4 = new BehaviorSubject<Boolean>(true);
    } else {
      this.isReq_SET_COMPARE_DATE = false;
    }

    if (this.compareForm.get('COMPARE_NO').value == '') {
      this.isReq_COMPARE_NO = true;
      this._swal('กรุณาระบุข้อมูล "คดีเปรียบเทียบที่"');
      this.collapse4 = new BehaviorSubject<Boolean>(true);
    } else {
      this.isReq_COMPARE_NO = false;
    }

    this.AboutPayFine.value.map(m => {
      if (m.PAYMENT_FINE_DUE_DATE == null || m.PAYMENT_FINE_DUE_DATE == '') {
        swal({
          type: 'warning',
          html: 'กรุณาระบุข้อมูล "วันที่กำหนดชำระค่าปรับ" ของ <br /> "' + m.NAME + '"',
          confirmButtonText: 'ตกลง',
          buttonsStyling: true,
        })
        this.collapse3 = new BehaviorSubject<Boolean>(true);
        arr4 = 0
      } else { arr4 = 1 }
    });

    this.AboutPayFine.value.map(m => {
      if (m.IS_REQUEST == 1) {
        if (m.IS_INSURANCE == 0 && m.IS_GAURANTEE == 0) {
          this.isReq_IS_REQUEST = true;
          swal({
            type: 'warning',
            html: 'กรุณาระบุข้อมูล "ปล่อยตัว" ของ <br /> "' + m.NAME + '"',
            confirmButtonText: 'ตกลง',
            buttonsStyling: true,
          })
          this.collapse3 = new BehaviorSubject<Boolean>(true);
          arr1 = 0
        }
        else { arr1 = 1; this.isReq_IS_REQUEST = false; }
      } else { arr1 = 1; this.isReq_IS_REQUEST = false; }
    });

    this.AboutPayFine.value.map(m => {
      if (m.IS_REQUEST == 0 && m.IS_PAYMENT == 0) {
        swal({
          type: 'warning',
          html: 'กรุณาระบุข้อมูล "ชำระค่าปรับ"',
          confirmButtonText: 'ตกลง',
          buttonsStyling: true,
        });
        this.collapse4 = new BehaviorSubject<Boolean>(true);
        arr2 = 0
      } else { arr2 = 1; }
    });

    if (this.compareForm.get('COMPARE_NO').value !== ''
      && this.compareForm.value.SET_COMPARE_TIME !== ''
      && this.compareForm.value.SET_COMPARE_DATE !== null
      && this.CompareStaff.value[0].IS_ACTIVE !== 0
      && arr1 == 1 && arr2 == 1 && arr3 == 1 && arr4 == 1
      && this.compareForm.value.OFFICE_NAME !== '') {
      var COMPARE_DATE = this.getDatepiker(this.compareForm.get("SET_COMPARE_DATE").value, this.compareForm.get("SET_COMPARE_TIME").value);
      var CREATE_DATE = this.getDatepiker(this.toDatePickerFormat(new Date()), this.getTimeNow(new Date()));

      const params = {
        COMPARE_ID: "",
        LAWSUIT_ID: this.LAWSUIT_ID,
        TREASURY_RATE: this._IsRequestTRE,
        BRIBE_RATE: this._IsRequestBribe,
        REWARD_RATE: this._IsRequestReward,
        OFFICE_ID: this.compareForm.get("OFFICE_ID").value,
        OFFICE_CODE: this.compareForm.get("OFFICE_CODE").value,
        OFFICE_NAME: this.compareForm.get("OFFICE_SHORT_NAME").value,
        COMPARE_NO: this.compareForm.get('COMPARE_NO').value,
        COMPARE_NO_YEAR: this.compareForm.get("COMPARE_NO_YEAR").value,
        COMPARE_DATE: COMPARE_DATE,
        IS_OUTSIDE: this.compareForm.get("IS_OUTSIDE").value,
        IS_ACTIVE: 1,
        CREATE_DATE: CREATE_DATE,
        CREATE_USER_ACCOUNT_ID: this.USER_ACCOUNT_ID,
        UPDATE_DATE: "",
        UPDATE_USER_ACCOUNT_ID: "",
        CompareMapping: await this.set_CompareMapping(this.AboutPayFine.value),

      }

      console.log("params : ", params)

      const vertify = {
        "COMPARE_NO": this.compareForm.get("COMPARE_NO").value,
        "COMPARE_NO_YEAR": this.compareForm.get("COMPARE_NO_YEAR").value.slice(0, 4),
        "IS_OUTSIDE": this.compareForm.get("IS_OUTSIDE").value,
        "OFFICE_CODE": this._OFFICE_CODE
      }
      await this.fineService.CompareVerifyCompareNo("CompareVerifyCompareNo", vertify).then(res => {
        console.log("CompareVerifyCompareNo : ", res);
        if (res.length == 0) {
          this.fineService.CompareinsAll("CompareinsAll", params).then(success => {
            console.log(success);
            if (success.IsSuccess == "True") {

              this.fileList.map(async doc => {
                if (doc.IsNewItem) {
                  const formData = new FormData();
                  formData.append('FILE', doc.FILE);
                  formData.append('DOCUMENT_NAME', doc.DOCUMENT_NAME);
                  formData.append('DOCUMENT_OLD_NAME', doc.DOCUMENT_OLD_NAME);
                  formData.append('DOCUMENT_TYPE', '6');
                  formData.append('FOLDER', doc.FOLDER);
                  formData.append('REFERENCE_CODE', success.COMPARE_ID);

                  let result = await this.fineService.DocumentinsAll(formData);

                  if (result.IsSuccess == "True") {
                    console.log("insert file status : ", success);

                  } else {
                    swal({
                      type: 'error',
                      text: 'ไม่สามารถบันทึกเอกสารภายในได้',
                      confirmButtonText: 'ตกลง',
                      buttonsStyling: true,
                    })
                  }
                }
              });

              swal({
                type: 'success',
                text: 'บันทึกข้อมูลสำเร็จ',
                confirmButtonText: 'ตกลง',
                buttonsStyling: true,
              }).then(list => {
                this._router.navigate([`/fine/manage/R/` + success.COMPARE_ID + `/` + this.INDICTMENT_DETAIL_ID + `/` + this.ARREST_ID]).then(e => location.reload());
              });

            } else {
              swal({
                type: 'error',
                text: 'ไม่สามารถบันทึกข้อมูลได้',
                confirmButtonText: 'ตกลง',
                buttonsStyling: true,
              })
            }
          });
        } else {
          this._swal('เลขที่คดีเปรียบเทียบซ้ำ "กรุณาระบุใหม่"');
        }
      });
    }
  }

  /////////////////////////////////////////////////////////////////////////// set_CompareMapping //////////////////////////////////////////////////////////////////////////////////////////
  RECEIPT_CODE: any = '';
  async CAL_RECEIPT_CODE() {
    let paramiter = { RUNNING_OFFICE_CODE: this.office_code, RUNNING_TABLE: "OPS_COMPARE_DETAIL" };

    let res = await this.fineService.TransactionRunninggetByCon("TransactionRunninggetByCon", paramiter);
    if (res.length == 0) {
      let date = new Date();
      let year = (date.getFullYear() + 543).toString();
      let para = {
        RUNNING_ID: '',
        RUNNING_OFFICE_ID: this.office_id,
        RUNNING_NO: 1,
        RUNNING_TABLE: 'OPS_COMPARE_DETAIL',
        RUNNING_PREFIX: 'BL',
        RUNNING_OFFICE_CODE: this.office_code,
        RUNNING_YEAR: year.slice(2, 4),
        RUNNING_MONTH: date.getMonth()
      }
      let re = await this.fineService.TransactionRunninginsAll("TransactionRunninginsAll", para);
      if (re.IsSuccess == "True") {
        let paramiter = { RUNNING_OFFICE_CODE: this.office_code, RUNNING_TABLE: "OPS_COMPARE_DETAIL" };
        let res = await this.fineService.TransactionRunninggetByCon("TransactionRunninggetByCon", paramiter);
        if (res[0].RUNNING_NO.toString().length == 1) {
          this.RECEIPT_CODE = res[0].RUNNING_YEAR + '0000' + res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 2) {
          this.RECEIPT_CODE = res[0].RUNNING_YEAR + '000' + res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 3) {
          this.RECEIPT_CODE = res[0].RUNNING_YEAR + '00' + res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 4) {
          this.RECEIPT_CODE = res[0].RUNNING_YEAR + '0' + res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 5) {
          this.RECEIPT_CODE = res[0].RUNNING_YEAR + res[0].RUNNING_NO.toString();
        }
      }
    } else {
      let RUNNING_ID = { RUNNING_ID: res[0].RUNNING_ID };
      let re = await this.fineService.TransactionRunningupdByCon("TransactionRunningupdByCon", RUNNING_ID);
      if (re.IsSuccess == "True") {
        let paramiter = { RUNNING_OFFICE_CODE: this.office_code, RUNNING_TABLE: "OPS_COMPARE_DETAIL" };
        let res = await this.fineService.TransactionRunninggetByCon("TransactionRunninggetByCon", paramiter);
        if (res[0].RUNNING_NO.toString().length == 1) {
          this.RECEIPT_CODE = res[0].RUNNING_YEAR + '0000' + res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 2) {
          this.RECEIPT_CODE = res[0].RUNNING_YEAR + '000' + res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 3) {
          this.RECEIPT_CODE = res[0].RUNNING_YEAR + '00' + res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 4) {
          this.RECEIPT_CODE = res[0].RUNNING_YEAR + '0' + res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 5) {
          this.RECEIPT_CODE = res[0].RUNNING_YEAR + res[0].RUNNING_NO.toString();
        }
      }
    }
  }

  async set_CompareMapping(value) {
    var set = [];
    var IS_EVER_WRONG;
    var PAYMENT_FINE_DUE_DATE;
    var PAYMENT_VAT_DUE_DATE;
    var PAYMENT_DATE;
    var APPROVE_DATE;
    var COMMAND_DATE;
    console.log("value : ", value)

    for (var i = 0; i < value.length; i++) {

      if (value[i].MISTREAT == 0) { IS_EVER_WRONG = 0; } else { IS_EVER_WRONG = 1; };
      if (value[i].PAYMENT_FINE_DUE_DATE == "") { PAYMENT_FINE_DUE_DATE = "" } else { PAYMENT_FINE_DUE_DATE = this.getDatepiker(value[i].PAYMENT_FINE_DUE_DATE, value[i].PAYMENT_FINE_DUE_DATE_TIME) };
      if (value[i].PAYMENT_VAT_DUE_DATE == "") { PAYMENT_VAT_DUE_DATE = "" } else { PAYMENT_VAT_DUE_DATE = this.getDatepiker(value[i].PAYMENT_VAT_DUE_DATE, value[i].PAYMENT_VAT_DUE_DATE_TIME) }
      if (value[i].PAYMENT_DATE == "") { PAYMENT_DATE = "" } else { PAYMENT_DATE = this.getDatepiker(value[i].PAYMENT_DATE, value[i].PAYMENT_TIME) }
      if (value[i].APPROVE_DATE == "") { APPROVE_DATE = "" } else { APPROVE_DATE = this.getDatepiker(value[i].APPROVE_DATE, value[i].APPROVE_TIME) }
      if (value[i].COMMAND_DATE == "") { COMMAND_DATE = "" } else { COMMAND_DATE = this.getDatepiker(value[i].COMMAND_DATE, value[i].COMMAND_TIME) }

      var RECEIPT_CODE;
      if (value[i].RECEIPT_TYPE == 1) {
        await this.CAL_RECEIPT_CODE();
        RECEIPT_CODE = this.RECEIPT_CODE;
      } else {
        RECEIPT_CODE = value[i].RECEIPT_NO;
      }

      set.push({
        COMPARE_MAPPING_ID: "",
        COMPARE_ID: "",
        INDICTMENT_DETAIL_ID: value[i].INDICTMENT_DETAIL_ID,
        PAST_LAWSUIT_ID: "",
        IS_EVER_WRONG: "",
        IS_ACTIVE: 1,
        CompareDetail: [{
          COMPARE_DETAIL_ID: "",
          COMPARE_MAPPING_ID: "",
          RECEIPT_OFFICE_ID: value[i].RECEIPT_OFFICE_ID,
          APPROVE_OFFICE_ID: value[i].APPROVE_OFFICE_ID,
          MISTREAT_NO: value[i].MISTREAT,
          OLD_PAYMENT_FINE: "",
          PAYMENT_FINE: this.all_PAYMENT_FINE()[i].total,
          DIFFERENCE_PAYMENT_FINE: "",
          TREASURY_MONEY: this.all_TREASURY_MONEY()[i].total,
          BRIBE_MONEY: this.all_BRIBE_MONEY()[i].total,
          REWARD_MONEY: this.all_REWARD_MONEY()[i].total,
          PAYMENT_FINE_DUE_DATE: PAYMENT_FINE_DUE_DATE,
          PAYMENT_VAT_DUE_DATE: PAYMENT_VAT_DUE_DATE,
          INSURANCE: value[i].INSURANCE,
          GAURANTEE: value[i].GAURANTEE,
          PAYMENT_DATE: PAYMENT_DATE,
          RECEIPT_TYPE: value[i].RECEIPT_TYPE,
          RECEIPT_BOOK_NO: parseInt(value[i].RECEIPT_BOOK_NO),
          RECEIPT_NO: parseInt(RECEIPT_CODE),
          RECEIPT_OFFICE_CODE: value[i].PAYMENT_OFFICE_CODE,
          RECEIPT_OFFICE_NAME: value[i].PAYMENT_OFFICE_NAME,
          APPROVE_OFFICE_CODE: value[i].APPROVE_OFFICE_CODE,
          APPROVE_OFFICE_NAME: value[i].APPROVE_OFFICE_NAME,
          APPROVE_DATE: APPROVE_DATE,
          APPROVE_TYPE: value[i].APPROVE_TYPE,
          COMMAND_NO: value[i].COMMAND_NO,
          COMMAND_DATE: COMMAND_DATE,
          REMARK_NOT_AGREE: value[i].REMARK_NOT_AGREE,
          REMARK_NOT_APPROVE: value[i].REMARK_NOT_APPROVE,
          FACT: value[i].FACT,
          COMPARE_REASON: value[i].COMPARE_REASON,
          ADJUST_REASON: "",
          COMPARE_TYPE: value[i].COMPARE_TYPE,
          IS_REQUEST: value[i].IS_REQUEST,
          IS_TEMP_RELEASE: value[i].IS_TEMP_RELEASE,
          IS_INSURANCE: value[i].IS_INSURANCE,
          IS_GAURANTEE: value[i].IS_GAURANTEE,
          IS_PAYMENT: value[i].IS_PAYMENT,
          IS_REVENUE: value[i].IS_REVENUE,
          IS_AGREE: value[i].IS_AGREE,
          IS_APPROVE: value[i].IS_APPROVE,
          IS_AUTHORITY: value[i].IS_AUTHORITY,
          DID: "",
          IS_ACTIVE: 1,
          CompareStaff: this.set_CompareStaff(value[i].CompareStaffDetail, "", ""),
          CompareDetailPayment: this.set_CompareDetailPayment(value[i]),
          // CompareDetailPayment: [],
          CompareDetailFine: this.set_CompareDetailFine(value[i]),
          ComparePayment: this.set_ComparePayment(value[i]),
          // ComparePayment : [],
        }]

        ,
        CompareArrestIndictmentDetail: [{
          COMPANY_REGISTRATION_NO: value[i].COMPANY_REGISTRATION_NO || '',
          ENTITY_TYPE: value[i].ENTITY_TYPE || '',
          EXCISE_REGISTRATION_NO: value[i].EXCISE_REGISTRATION_NO || '',
          FIRST_NAME: value[i].FIRST_NAME || '',
          ID_CARD: value[i].ID_CARD || '',
          INDICTMENT_DETAIL_ID: value[i].INDICTMENT_DETAIL_ID || '',
          INDICTMENT_ID: value[i].INDICTMENT_ID || '',
          LAST_NAME: value[i].LAST_NAME || '',
          LAWBREAKER_ID: value[i].LAWBREAKER_ID || '',
          MIDDLE_NAME: value[i].MIDDLE_NAME || '',
          OTHER_NAME: value[i].OTHER_NAME || '',
          PASSPORT_NO: value[i].PASSPORT_NO || '',
          PERSON_ID: value[i].PERSON_ID || '',
          PERSON_TYPE: value[i].PERSON_TYPE || '',
          TITLE_NAME_EN: value[i].TITLE_NAME_EN || '',
          TITLE_NAME_TH: value[i].TITLE_NAME_TH || '',
          TITLE_SHORT_NAME_EN: value[i].TITLE_SHORT_NAME_EN || '',
          TITLE_SHORT_NAME_TH: value[i].TITLE_SHORT_NAME_TH || '',
        }],
      });
    }
    return set
  }

  public toDateTZ(date: any) { return `${moment(date).format('YYYY-MM-DD HH:mm:ss.ms')}`; }

  /////////////////////////////////////////////////////////////////////////// set_CompareArrestIndictmentDetail //////////////////////////////////////////////////////////////////////////////////////////
  set_CompareArrestIndictmentDetail(list) {
    var set = [];
    for (var i = 0; i < list.length; i++) {
      set.push({
        COMPANY_REGISTRATION_NO: list[i].COMPANY_REGISTRATION_NO,
        ENTITY_TYPE: list[i].ENTITY_TYPE,
        EXCISE_REGISTRATION_NO: list[i].EXCISE_REGISTRATION_NO,
        FIRST_NAME: list[i].FIRST_NAME,
        ID_CARD: list[i].ID_CARD,
        INDICTMENT_DETAIL_ID: list[i].INDICTMENT_DETAIL_ID,
        INDICTMENT_ID: list[i].INDICTMENT_ID,
        LAST_NAME: list[i].LAST_NAME,
        LAWBREAKER_ID: list[i].LAWBREAKER_ID,
        MIDDLE_NAME: list[i].MIDDLE_NAME,
        OTHER_NAME: list[i].OTHER_NAME,
        PASSPORT_NO: list[i].PASSPORT_NO,
        PERSON_ID: list[i].PERSON_ID,
        PERSON_TYPE: list[i].PERSON_TYPE,
        TITLE_NAME_EN: list[i].TITLE_NAME_EN,
        TITLE_NAME_TH: list[i].TITLE_NAME_TH,
        TITLE_SHORT_NAME_EN: list[i].TITLE_SHORT_NAME_EN,
        TITLE_SHORT_NAME_TH: list[i].TITLE_SHORT_NAME_TH,
      })
    }
    return set
  }

  /////////////////////////////////////////////////////////////////////////// set_CompareDetailPayment //////////////////////////////////////////////////////////////////////////////////////////
  set_CompareDetailPayment(list) {
    var set = [];
    if (list.IS_PAYMENT == 0) {
      // set.push({
      //   PAYMENT_ID: "",
      //   COMPARE_DETAIL_ID: "",
      //   PAYMENT_TYPE: "",
      //   PAYMENT_FINE: "",
      //   REFFERENCE_NO: "",
      //   IS_ACTIVE: 0,
      // });
      return set
    } else {
      var payment = list.payment;
      for (var i = 0; i < payment.length; i++) {
        set.push({
          PAYMENT_ID: "",
          COMPARE_DETAIL_ID: "",
          PAYMENT_TYPE: payment[i].PAYMENT_TYPE,
          PAYMENT_FINE: payment[i].PAYMENT_FINE,
          REFFERENCE_NO: payment[i].REFFERENCE_NO,
          IS_ACTIVE: 1,
        });
      }
      return set
    }
  }

  /////////////////////////////////////////////////////////////////////////// set_CompareDetailFine //////////////////////////////////////////////////////////////////////////////////////////
  set_CompareDetailFine(list) {
    var set = [];
    var product = list.product;
    for (var i = 0; i < product.length; i++) {
      set.push({
        FINE_ID: "",
        COMPARE_DETAIL_ID: "",
        PRODUCT_ID: product[i].PRODUCT_ID,
        FINE_RATE: product[i].FINE_RATE,
        VAT: product[i].VAT,
        FINE: product[i].NET_FINE,
        NET_FINE: product[i].NET_FINE,
        OLD_PAYMENT_FINE: "",
        PAYMENT_FINE: product[i].PAYMENT_FINE,
        DIFFERENCE_PAYMENT_FINE: "",
        TREASURY_MONEY: product[i].TREASURY_MONEY,
        BRIBE_MONEY: product[i].BRIBE_MONEY,
        REWARD_MONEY: product[i].REWARD_MONEY,
        IS_ACTIVE: 1
      })
    }
    return set
  }

  /////////////////////////////////////////////////////////////////////////// set_ComparePayment //////////////////////////////////////////////////////////////////////////////////////////
  set_ComparePayment(list) {
    var set = [];
    var PAYMENT_DATE;
    if (list.PAYMENT_DATE == "") { PAYMENT_DATE = "" } else { PAYMENT_DATE = this.getDatepiker(list.PAYMENT_DATE, list.PAYMENT_TIME) }
    if (list.IS_PAYMENT == 0) {
      return set
    } else {
      if (this.NOTICE_ID == 0) {
        var payment = list.payment;
        for (var i = 0; i < payment.length; i++) {
          set.push({
            PAYMENT_ID: "",
            LAWSUIT_DETAIL_ID: "",
            COMPARE_DETAIL_ID: "",
            FINE_TYPE: 1,
            FINE: payment[i].PAYMENT_FINE,
            PAYMENT_PERIOD_NO: "",
            PAYMENT_DATE: PAYMENT_DATE,
            IS_REQUEST_REWARD: 0,
            IS_ACTIVE: 1,
            PAYMENT_CHANNEL: payment[i].PAYMENT_TYPE,
            PAYMENT_BANK: payment[i].PAYMENT_CODE,
            PAYMENT_REF_NO: payment[i].REFFERENCE_NO,
            IS_REVENUE: 0,
            ComparePaymentDetail: [
              // {
              //   PAYMENT_DETAIL_ID: 1,
              //   PAYMENT_ID: 1,
              //   NOTICE_ID: 0,
              //   IS_REQUEST_BRIBE: 0,
              //   IS_ACTIVE: 1
              // }
            ]
          });
        }
        return set
      } else {
        var payment = list.payment;
        for (var i = 0; i < payment.length; i++) {
          set.push({
            PAYMENT_ID: "",
            LAWSUIT_DETAIL_ID: "",
            COMPARE_DETAIL_ID: "",
            FINE_TYPE: 1,
            FINE: payment[i].PAYMENT_FINE,
            PAYMENT_PERIOD_NO: "",
            PAYMENT_DATE: PAYMENT_DATE,
            IS_REQUEST_REWARD: 0,
            IS_ACTIVE: 1,
            PAYMENT_CHANNEL: payment[i].PAYMENT_TYPE,
            PAYMENT_BANK: payment[i].PAYMENT_CODE,
            PAYMENT_REF_NO: payment[i].REFFERENCE_NO,
            IS_REVENUE: 0,
            ComparePaymentDetail: [
              {
                PAYMENT_DETAIL_ID: "",
                PAYMENT_ID: "",
                NOTICE_ID: this.NOTICE_ID,
                IS_REQUEST_BRIBE: 0,
                IS_ACTIVE: 1
              }
            ]
          });
        }
        return set
      }
    }


  }

  /////////////////////////////////////////////////////////////////////////// set_CompareStaff //////////////////////////////////////////////////////////////////////////////////////////
  set_CompareStaff(compareStaff, COMPARE_ID, COMPARE_DETAIL_ID) {
    var set = [];
    var staff = compareStaff;

    for (var i = 0; i < staff.length; i++) {
      if (staff[i].IS_ACTIVE == 1) {
        set.push({
          STAFF_ID: "",
          COMPARE_ID: COMPARE_ID,
          COMPARE_DETAIL_ID: COMPARE_DETAIL_ID,
          STAFF_REF_ID: staff[i].STAFF_ID,
          TITLE_ID: staff[i].TITLE_ID,
          STAFF_CODE: staff[i].STAFF_CODE,
          ID_CARD: staff[i].ID_CARD,
          STAFF_TYPE: staff[i].STAFF_TYPE,
          TITLE_NAME_TH: staff[i].TITLE_NAME_TH,
          TITLE_NAME_EN: staff[i].TITLE_NAME_EN,
          TITLE_SHORT_NAME_TH: staff[i].TITLE_SHORT_NAME_TH,
          TITLE_SHORT_NAME_EN: staff[i].TITLE_SHORT_NAME_EN,
          FIRST_NAME: staff[i].FIRST_NAME,
          LAST_NAME: staff[i].LAST_NAME,
          AGE: staff[i].AGE,
          OPERATION_POS_CODE: staff[i].OPERATION_POS_CODE,
          OPREATION_POS_NAME: staff[i].OPREATION_POS_NAME,
          OPREATION_POS_LEVEL: staff[i].OPREATION_POS_LEVEL,
          OPERATION_POS_LEVEL_NAME: staff[i].OPERATION_POS_LEVEL_NAME,
          OPERATION_DEPT_CODE: staff[i].OPERATION_DEPT_CODE,
          OPERATION_DEPT_NAME: staff[i].OPERATION_DEPT_NAME,
          OPERATION_DEPT_LEVEL: staff[i].OPERATION_DEPT_LEVEL,
          OPERATION_UNDER_DEPT_CODE: staff[i].OPERATION_UNDER_DEPT_CODE,
          OPERATION_UNDER_DEPT_NAME: staff[i].OPERATION_UNDER_DEPT_NAME,
          OPERATION_UNDER_DEPT_LEVEL: staff[i].OPERATION_UNDER_DEPT_LEVEL,
          OPERATION_WORK_DEPT_CODE: staff[i].OPERATION_WORK_DEPT_CODE,
          OPERATION_WORK_DEPT_NAME: staff[i].OPERATION_WORK_DEPT_NAME,
          OPERATION_WORK_DEPT_LEVEL: staff[i].OPERATION_WORK_DEPT_LEVEL,
          OPERATION_OFFICE_CODE: staff[i].OPERATION_OFFICE_CODE,
          OPERATION_OFFICE_NAME: staff[i].OPERATION_OFFICE_NAME,
          OPERATION_OFFICE_SHORT_NAME: staff[i].OPERATION_OFFICE_SHORT_NAME,
          MANAGEMENT_POS_CODE: staff[i].MANAGEMENT_POS_CODE,
          MANAGEMENT_POS_NAME: staff[i].MANAGEMENT_POS_NAME,
          MANAGEMENT_POS_LEVEL: staff[i].MANAGEMENT_POS_LEVEL,
          MANAGEMENT_POS_LEVEL_NAME: staff[i].MANAGEMENT_POS_LEVEL_NAME,
          MANAGEMENT_DEPT_CODE: staff[i].MANAGEMENT_DEPT_CODE,
          MANAGEMENT_DEPT_NAME: staff[i].MANAGEMENT_DEPT_NAME,
          MANAGEMENT_DEPT_LEVEL: staff[i].MANAGEMENT_DEPT_LEVEL,
          MANAGEMENT_UNDER_DEPT_CODE: staff[i].MANAGEMENT_UNDER_DEPT_CODE,
          MANAGEMENT_UNDER_DEPT_NAME: staff[i].MANAGEMENT_UNDER_DEPT_NAME,
          MANAGEMENT_UNDER_DEPT_LEVEL: staff[i].MANAGEMENT_UNDER_DEPT_LEVEL,
          MANAGEMENT_WORK_DEPT_CODE: staff[i].MANAGEMENT_WORK_DEPT_CODE,
          MANAGEMENT_WORK_DEPT_NAME: staff[i].MANAGEMENT_WORK_DEPT_NAME,
          MANAGEMENT_WORK_DEPT_LEVEL: staff[i].MANAGEMENT_WORK_DEPT_LEVEL,
          MANAGEMENT_OFFICE_CODE: staff[i].MANAGEMENT_OFFICE_CODE,
          MANAGEMENT_OFFICE_NAME: staff[i].MANAGEMENT_OFFICE_NAME,
          MANAGEMENT_OFFICE_SHORT_NAME: staff[i].MANAGEMENT_OFFICE_SHORT_NAME,
          REPRESENTATION_POS_CODE: staff[i].REPRESENTATION_POS_CODE,
          REPRESENTATION_POS_NAME: staff[i].REPRESENTATION_POS_NAME,
          REPRESENTATION_POS_LEVEL: staff[i].REPRESENTATION_POS_LEVEL,
          REPRESENTATION_POS_LEVEL_NAME: staff[i].REPRESENTATION_POS_LEVEL_NAME,
          REPRESENTATION_DEPT_CODE: staff[i].REPRESENTATION_DEPT_CODE,
          REPRESENTATION_DEPT_NAME: staff[i].REPRESENTATION_DEPT_NAME,
          REPRESENTATION_DEPT_LEVEL: staff[i].REPRESENTATION_DEPT_LEVEL,
          REPRESENTATION_UNDER_DEPT_CODE: staff[i].REPRESENTATION_UNDER_DEPT_CODE,
          REPRESENTATION_UNDER_DEPT_NAME: staff[i].REPRESENTATION_UNDER_DEPT_NAME,
          REPRESENTATION_UNDER_DEPT_LEVEL: staff[i].REPRESENTATION_UNDER_DEPT_LEVEL,
          REPRESENT_WORK_DEPT_CODE: staff[i].REPRESENT_WORK_DEPT_CODE,
          REPRESENT_WORK_DEPT_NAME: staff[i].REPRESENT_WORK_DEPT_NAME,
          REPRESENT_WORK_DEPT_LEVEL: staff[i].REPRESENT_WORK_DEPT_LEVEL,
          REPRESENT_OFFICE_CODE: staff[i].REPRESENT_OFFICE_CODE,
          REPRESENT_OFFICE_NAME: staff[i].REPRESENT_OFFICE_NAME,
          REPRESENT_OFFICE_SHORT_NAME: staff[i].REPRESENT_OFFICE_SHORT_NAME,
          STATUS: staff[i].STATUS,
          REMARK: staff[i].REMARK,
          CONTRIBUTOR_ID: staff[i].CONTRIBUTOR_ID,
          IS_ACTIVE: staff[i].IS_ACTIVE,
        })
      }
    }
    return set
  }

  /////////////////////////////////////////////////////////////////////////// clickDelete //////////////////////////////////////////////////////////////////////////////////////////
  clickDelete() {
    // console.log('clickDelete');
    swal({
      type: 'warning',
      text: "ยืนยันการทำรายการหรือไม่" + ' ?',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ไม่ใช่',
      buttonsStyling: true,

    }).then((result) => {
      if (result.value) {
        let isSuccess: boolean = true;
        if (isSuccess) {

          const params = {
            COMPARE_ID: this.COMPARE_ID
          }

          this.fineService.CompareupdDelete("CompareupdDelete", params).then(success => {

            console.log("status : ", success);

          });

          swal({
            type: 'success',
            text: "ลบข้อมูลสำเร็จ",
            confirmButtonText: 'ตกลง',
            reverseButtons: false,
          });

          this.router.navigate([`/fine/list/`]);
        }
      }
    });
  }

  setDefaultOutside(o: any): void {
    if (this.mode == 'C') {
      if (o['LAWSUIT_IS_OUTSIDE'] == 1 || o['PROVE_IS_OUTSIDE'] == 1)
        this.compareForm.patchValue({
          IS_OUTSIDE: 1
        });
    }
  }

  /////////////////////////////////////////////////////////////////////////// iS_OUTSIDE //////////////////////////////////////////////////////////////////////////////////////////
  iS_OUTSIDE(e) {
    // console.log(e.target.checked)
    this.setYear();

    if (e.target.checked == true) {
      this.compareForm.patchValue({
        IS_OUTSIDE: 1
      });
    } else {
      this.compareForm.patchValue({
        IS_OUTSIDE: 0
      });
    }

    let NO = this.compareForm.get("COMPARE_NO_YEAR").value;
    this.fineService.CompareRunningCompareNo("CompareRunningCompareNo", {
      OFFICE_CODE: this.office_code,
      YEAR: parseInt(NO.slice(0, 4)) + 543,
      IS_OUTSIDE: this.compareForm.get("IS_OUTSIDE").value
    }).then(res => {
      this.compareForm.get("COMPARE_NO").setValue(res.RUNNING_NO);
    });
  }

  /////////////////////////////////////////////////////////////////////////// e_IsRequestBribe //////////////////////////////////////////////////////////////////////////////////////////
  e_IsRequestBribe(e) {
    this._CaseBribe = e.target.checked;
    if (this._CaseBribe == true && this._CaseReward == false) {
      this._IsRequestBribe = 0; this._IsRequestReward = 20; this._IsRequestTRE = 80;

      this.compareForm.patchValue({
        BRIBE_RATE: 0,
        REWARD_RATE: 20,
        TREASURY_RATE: 80
      });

      for (var i = 0; i < this.AboutPayFine.getRawValue().length; i++) {
        for (var j = 0; j < this.AboutPayFine.at(i).get("product").value.length; j++) {
          const product = this.AboutPayFine.at(i).get("product") as FormArray;
          const PAYMENT_FINE = product.at(j).get("PAYMENT_FINE");
          const BRIBE_MONEY = product.at(j).get("BRIBE_MONEY");
          const REWARD_MONEY = product.at(j).get("REWARD_MONEY");
          const TREASURY_MONEY = product.at(j).get("TREASURY_MONEY");

          TREASURY_MONEY.setValue(
            this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value))
          )
          REWARD_MONEY.setValue(
            this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value))
          )
          BRIBE_MONEY.setValue(
            0.00
          )

          const TREASURY_MONEY_PIPE = product.at(j).get("TREASURY_MONEY_PIPE");
          const BRIBE_MONEY_PIPE = product.at(j).get("BRIBE_MONEY_PIPE");
          const REWARD_MONEY_PIPE = product.at(j).get("REWARD_MONEY_PIPE");

          let T = this.convert_Calculator(this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value)));
          let R = this.convert_Calculator(this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value)));
          let B = this.convert_Calculator(0.00);

          TREASURY_MONEY_PIPE.setValue(this.formatMoney(T.replace(/\,/g, "")), { emitEvent: false });
          REWARD_MONEY_PIPE.setValue(this.formatMoney(R.replace(/\,/g, "")), { emitEvent: false });
          BRIBE_MONEY_PIPE.setValue(this.formatMoney(B.replace(/\,/g, "")), { emitEvent: false });
        }
      }
    }
    else if (this._CaseBribe == false && this._CaseReward == true) {
      this._IsRequestBribe = 20; this._IsRequestReward = 0; this._IsRequestTRE = 80;

      this.compareForm.patchValue({
        BRIBE_RATE: 20,
        REWARD_RATE: 0,
        TREASURY_RATE: 80
      });

      for (var i = 0; i < this.AboutPayFine.getRawValue().length; i++) {
        for (var j = 0; j < this.AboutPayFine.at(i).get("product").value.length; j++) {
          const product = this.AboutPayFine.at(i).get("product") as FormArray;
          const PAYMENT_FINE = product.at(j).get("PAYMENT_FINE");
          const BRIBE_MONEY = product.at(j).get("BRIBE_MONEY");
          const REWARD_MONEY = product.at(j).get("REWARD_MONEY");
          const TREASURY_MONEY = product.at(j).get("TREASURY_MONEY");
          TREASURY_MONEY.setValue(
            this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value))
          )
          REWARD_MONEY.setValue(
            0.00
          )
          BRIBE_MONEY.setValue(
            this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value))
          )

          const TREASURY_MONEY_PIPE = product.at(j).get("TREASURY_MONEY_PIPE");
          const BRIBE_MONEY_PIPE = product.at(j).get("BRIBE_MONEY_PIPE");
          const REWARD_MONEY_PIPE = product.at(j).get("REWARD_MONEY_PIPE");

          let T = this.convert_Calculator(this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value)));
          let R = this.convert_Calculator(0.00);
          let B = this.convert_Calculator(this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value)));

          TREASURY_MONEY_PIPE.setValue(this.formatMoney(T.replace(/\,/g, "")), { emitEvent: false });
          REWARD_MONEY_PIPE.setValue(this.formatMoney(R.replace(/\,/g, "")), { emitEvent: false });
          BRIBE_MONEY_PIPE.setValue(this.formatMoney(B.replace(/\,/g, "")), { emitEvent: false });
        }
      }
    }

    else if (this._CaseBribe == true && this._CaseReward == true) {
      this._IsRequestBribe = 0; this._IsRequestReward = 0; this._IsRequestTRE = 100;

      this.compareForm.patchValue({
        BRIBE_RATE: 0,
        REWARD_RATE: 0,
        TREASURY_RATE: 100
      });

      for (var i = 0; i < this.AboutPayFine.getRawValue().length; i++) {
        for (var j = 0; j < this.AboutPayFine.at(i).get("product").value.length; j++) {
          const product = this.AboutPayFine.at(i).get("product") as FormArray;
          const PAYMENT_FINE = product.at(j).get("PAYMENT_FINE");
          const BRIBE_MONEY = product.at(j).get("BRIBE_MONEY");
          const REWARD_MONEY = product.at(j).get("REWARD_MONEY");
          const TREASURY_MONEY = product.at(j).get("TREASURY_MONEY");
          TREASURY_MONEY.setValue(
            this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value))
          )
          REWARD_MONEY.setValue(
            0.00
          )
          BRIBE_MONEY.setValue(
            0.00
          )

          const TREASURY_MONEY_PIPE = product.at(j).get("TREASURY_MONEY_PIPE");
          const BRIBE_MONEY_PIPE = product.at(j).get("BRIBE_MONEY_PIPE");
          const REWARD_MONEY_PIPE = product.at(j).get("REWARD_MONEY_PIPE");

          let T = this.convert_Calculator(this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value)));
          let R = this.convert_Calculator(0.00);
          let B = this.convert_Calculator(0.00);

          TREASURY_MONEY_PIPE.setValue(this.formatMoney(T.replace(/\,/g, "")), { emitEvent: false });
          REWARD_MONEY_PIPE.setValue(this.formatMoney(R.replace(/\,/g, "")), { emitEvent: false });
          BRIBE_MONEY_PIPE.setValue(this.formatMoney(B.replace(/\,/g, "")), { emitEvent: false });
        }
      }
    }

    else if (this._CaseBribe == false && this._CaseReward == false) {
      this._IsRequestBribe = 20; this._IsRequestReward = 20; this._IsRequestTRE = 60;
      this.compareForm.patchValue({
        BRIBE_RATE: 20,
        REWARD_RATE: 20,
        TREASURY_RATE: 60
      });
      for (var i = 0; i < this.AboutPayFine.getRawValue().length; i++) {
        for (var j = 0; j < this.AboutPayFine.at(i).get("product").value.length; j++) {
          const product = this.AboutPayFine.at(i).get("product") as FormArray;
          const PAYMENT_FINE = product.at(j).get("PAYMENT_FINE");
          const BRIBE_MONEY = product.at(j).get("BRIBE_MONEY");
          const REWARD_MONEY = product.at(j).get("REWARD_MONEY");
          const TREASURY_MONEY = product.at(j).get("TREASURY_MONEY");

          BRIBE_MONEY.setValue(
            this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value))
          )
          REWARD_MONEY.setValue(
            this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value))
          )
          TREASURY_MONEY.setValue(
            this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value))
          )
          const TREASURY_MONEY_PIPE = product.at(j).get("TREASURY_MONEY_PIPE");
          const BRIBE_MONEY_PIPE = product.at(j).get("BRIBE_MONEY_PIPE");
          const REWARD_MONEY_PIPE = product.at(j).get("REWARD_MONEY_PIPE");

          let B = this.convert_Calculator(this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value)));
          let R = this.convert_Calculator(this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value)));
          let T = this.convert_Calculator(this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)));

          TREASURY_MONEY_PIPE.setValue(this.formatMoney(T.replace(/\,/g, "")), { emitEvent: false });
          REWARD_MONEY_PIPE.setValue(this.formatMoney(R.replace(/\,/g, "")), { emitEvent: false });
          BRIBE_MONEY_PIPE.setValue(this.formatMoney(B.replace(/\,/g, "")), { emitEvent: false });
        }
      }
    }

  }

  /////////////////////////////////////////////////////////////////////////// e_IsRequestReward //////////////////////////////////////////////////////////////////////////////////////////
  e_IsRequestReward(e) {
    this._CaseReward = e.target.checked;

    if (this.NOTICE_ID == 0) {

      if (this._CaseReward == true) {
        this._IsRequestBribe = 0; this._IsRequestReward = 0; this._IsRequestTRE = 100;

        this.compareForm.patchValue({
          BRIBE_RATE: 0,
          REWARD_RATE: 0,
          TREASURY_RATE: 100
        });

        for (var i = 0; i < this.AboutPayFine.getRawValue().length; i++) {
          for (var j = 0; j < this.AboutPayFine.at(i).get("product").value.length; j++) {
            const product = this.AboutPayFine.at(i).get("product") as FormArray;
            const PAYMENT_FINE = product.at(j).get("PAYMENT_FINE");
            const BRIBE_MONEY = product.at(j).get("BRIBE_MONEY");
            const REWARD_MONEY = product.at(j).get("REWARD_MONEY");
            const TREASURY_MONEY = product.at(j).get("TREASURY_MONEY");
            TREASURY_MONEY.setValue(
              this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value))
            )
            REWARD_MONEY.setValue(
              0.00
            )
            BRIBE_MONEY.setValue(
              0.00
            )

            const TREASURY_MONEY_PIPE = product.at(j).get("TREASURY_MONEY_PIPE");
            const BRIBE_MONEY_PIPE = product.at(j).get("BRIBE_MONEY_PIPE");
            const REWARD_MONEY_PIPE = product.at(j).get("REWARD_MONEY_PIPE");

            let T = this.convert_Calculator(this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value)));
            let R = this.convert_Calculator(0.00);
            let B = this.convert_Calculator(0.00);

            TREASURY_MONEY_PIPE.setValue(this.formatMoney(T.replace(/\,/g, "")), { emitEvent: false });
            REWARD_MONEY_PIPE.setValue(this.formatMoney(R.replace(/\,/g, "")), { emitEvent: false });
            BRIBE_MONEY_PIPE.setValue(this.formatMoney(B.replace(/\,/g, "")), { emitEvent: false });
          }
        }
      }

      else if (this._CaseReward == false) {
        this._IsRequestBribe = 0; this._IsRequestReward = 20; this._IsRequestTRE = 80;
        this.compareForm.patchValue({
          BRIBE_RATE: 0,
          REWARD_RATE: 20,
          TREASURY_RATE: 80
        });
        for (var i = 0; i < this.AboutPayFine.getRawValue().length; i++) {
          for (var j = 0; j < this.AboutPayFine.at(i).get("product").value.length; j++) {
            const product = this.AboutPayFine.at(i).get("product") as FormArray;
            const PAYMENT_FINE = product.at(j).get("PAYMENT_FINE");
            const BRIBE_MONEY = product.at(j).get("BRIBE_MONEY");
            const REWARD_MONEY = product.at(j).get("REWARD_MONEY");
            const TREASURY_MONEY = product.at(j).get("TREASURY_MONEY");

            TREASURY_MONEY.setValue(
              this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value))
            )
            REWARD_MONEY.setValue(
              this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value))
            )
            BRIBE_MONEY.setValue(
              0.00
            )

            const TREASURY_MONEY_PIPE = product.at(j).get("TREASURY_MONEY_PIPE");
            const BRIBE_MONEY_PIPE = product.at(j).get("BRIBE_MONEY_PIPE");
            const REWARD_MONEY_PIPE = product.at(j).get("REWARD_MONEY_PIPE");

            let T = this.convert_Calculator(this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value)));
            let R = this.convert_Calculator(this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value)));
            let B = this.convert_Calculator(0.00);

            TREASURY_MONEY_PIPE.setValue(this.formatMoney(T.replace(/\,/g, "")), { emitEvent: false });
            REWARD_MONEY_PIPE.setValue(this.formatMoney(R.replace(/\,/g, "")), { emitEvent: false });
            BRIBE_MONEY_PIPE.setValue(this.formatMoney(B.replace(/\,/g, "")), { emitEvent: false });
          }
        }
      }
    } else {
      if (this._CaseBribe == true && this._CaseReward == false) {
        this._IsRequestBribe = 0; this._IsRequestReward = 20; this._IsRequestTRE = 80;

        this.compareForm.patchValue({
          BRIBE_RATE: 0,
          REWARD_RATE: 20,
          TREASURY_RATE: 80
        });

        for (var i = 0; i < this.AboutPayFine.getRawValue().length; i++) {
          for (var j = 0; j < this.AboutPayFine.at(i).get("product").value.length; j++) {
            const product = this.AboutPayFine.at(i).get("product") as FormArray;
            const PAYMENT_FINE = product.at(j).get("PAYMENT_FINE");
            const BRIBE_MONEY = product.at(j).get("BRIBE_MONEY");
            const REWARD_MONEY = product.at(j).get("REWARD_MONEY");
            const TREASURY_MONEY = product.at(j).get("TREASURY_MONEY");
            TREASURY_MONEY.setValue(
              this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value))
            )
            REWARD_MONEY.setValue(
              this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value))
            )
            BRIBE_MONEY.setValue(
              0.00
            )

            const TREASURY_MONEY_PIPE = product.at(j).get("TREASURY_MONEY_PIPE");
            const BRIBE_MONEY_PIPE = product.at(j).get("BRIBE_MONEY_PIPE");
            const REWARD_MONEY_PIPE = product.at(j).get("REWARD_MONEY_PIPE");

            let T = this.convert_Calculator(this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value)));
            let R = this.convert_Calculator(this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value)));
            let B = this.convert_Calculator(0.00);

            TREASURY_MONEY_PIPE.setValue(this.formatMoney(T.replace(/\,/g, "")), { emitEvent: false });
            REWARD_MONEY_PIPE.setValue(this.formatMoney(R.replace(/\,/g, "")), { emitEvent: false });
            BRIBE_MONEY_PIPE.setValue(this.formatMoney(B.replace(/\,/g, "")), { emitEvent: false });
          }
        }
      }

      else if (this._CaseBribe == false && this._CaseReward == true) {
        this._IsRequestBribe = 20; this._IsRequestReward = 0; this._IsRequestTRE = 80;

        this.compareForm.patchValue({
          BRIBE_RATE: 20,
          REWARD_RATE: 0,
          TREASURY_RATE: 80
        });

        for (var i = 0; i < this.AboutPayFine.getRawValue().length; i++) {
          for (var j = 0; j < this.AboutPayFine.at(i).get("product").value.length; j++) {
            const product = this.AboutPayFine.at(i).get("product") as FormArray;
            const PAYMENT_FINE = product.at(j).get("PAYMENT_FINE");
            const BRIBE_MONEY = product.at(j).get("BRIBE_MONEY");
            const REWARD_MONEY = product.at(j).get("REWARD_MONEY");
            const TREASURY_MONEY = product.at(j).get("TREASURY_MONEY");
            TREASURY_MONEY.setValue(
              this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value))
            )
            REWARD_MONEY.setValue(
              0.00
            )
            BRIBE_MONEY.setValue(
              this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value))
            )

            const TREASURY_MONEY_PIPE = product.at(j).get("TREASURY_MONEY_PIPE");
            const BRIBE_MONEY_PIPE = product.at(j).get("BRIBE_MONEY_PIPE");
            const REWARD_MONEY_PIPE = product.at(j).get("REWARD_MONEY_PIPE");

            let T = this.convert_Calculator(this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value)));
            let R = this.convert_Calculator(0.00);
            let B = this.convert_Calculator(this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value)));

            TREASURY_MONEY_PIPE.setValue(this.formatMoney(T.replace(/\,/g, "")), { emitEvent: false });
            REWARD_MONEY_PIPE.setValue(this.formatMoney(R.replace(/\,/g, "")), { emitEvent: false });
            BRIBE_MONEY_PIPE.setValue(this.formatMoney(B.replace(/\,/g, "")), { emitEvent: false });
          }
        }
      }

      else if (this._CaseBribe == true && this._CaseReward == true) {
        this._IsRequestBribe = 0; this._IsRequestReward = 0; this._IsRequestTRE = 100;

        this.compareForm.patchValue({
          BRIBE_RATE: 0,
          REWARD_RATE: 0,
          TREASURY_RATE: 100
        });

        for (var i = 0; i < this.AboutPayFine.getRawValue().length; i++) {
          for (var j = 0; j < this.AboutPayFine.at(i).get("product").value.length; j++) {
            const product = this.AboutPayFine.at(i).get("product") as FormArray;
            const PAYMENT_FINE = product.at(j).get("PAYMENT_FINE");
            const BRIBE_MONEY = product.at(j).get("BRIBE_MONEY");
            const REWARD_MONEY = product.at(j).get("REWARD_MONEY");
            const TREASURY_MONEY = product.at(j).get("TREASURY_MONEY");
            TREASURY_MONEY.setValue(
              this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value))
            )
            REWARD_MONEY.setValue(
              0.00
            )
            BRIBE_MONEY.setValue(
              0.00
            )
            const TREASURY_MONEY_PIPE = product.at(j).get("TREASURY_MONEY_PIPE");
            const BRIBE_MONEY_PIPE = product.at(j).get("BRIBE_MONEY_PIPE");
            const REWARD_MONEY_PIPE = product.at(j).get("REWARD_MONEY_PIPE");

            let T = this.convert_Calculator(this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value)));
            let R = this.convert_Calculator(0.00);
            let B = this.convert_Calculator(0.00);

            TREASURY_MONEY_PIPE.setValue(this.formatMoney(T.replace(/\,/g, "")), { emitEvent: false });
            REWARD_MONEY_PIPE.setValue(this.formatMoney(R.replace(/\,/g, "")), { emitEvent: false });
            BRIBE_MONEY_PIPE.setValue(this.formatMoney(B.replace(/\,/g, "")), { emitEvent: false });
          }
        }
      }

      else if (this._CaseBribe == false && this._CaseReward == false) {
        this._IsRequestBribe = 20; this._IsRequestReward = 20; this._IsRequestTRE = 60;
        this.compareForm.patchValue({
          BRIBE_RATE: 20,
          REWARD_RATE: 20,
          TREASURY_RATE: 60
        });
        for (var i = 0; i < this.AboutPayFine.getRawValue().length; i++) {
          for (var j = 0; j < this.AboutPayFine.at(i).get("product").value.length; j++) {
            const product = this.AboutPayFine.at(i).get("product") as FormArray;
            const PAYMENT_FINE = product.at(j).get("PAYMENT_FINE");
            const BRIBE_MONEY = product.at(j).get("BRIBE_MONEY");
            const REWARD_MONEY = product.at(j).get("REWARD_MONEY");
            const TREASURY_MONEY = product.at(j).get("TREASURY_MONEY");

            BRIBE_MONEY.setValue(
              this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value))
            )
            REWARD_MONEY.setValue(
              this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value))
            )
            TREASURY_MONEY.setValue(
              this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value))
            )
            const TREASURY_MONEY_PIPE = product.at(j).get("TREASURY_MONEY_PIPE");
            const BRIBE_MONEY_PIPE = product.at(j).get("BRIBE_MONEY_PIPE");
            const REWARD_MONEY_PIPE = product.at(j).get("REWARD_MONEY_PIPE");

            let B = this.convert_Calculator(this.convert_BRIBE_MONEY(parseFloat(PAYMENT_FINE.value)));
            let R = this.convert_Calculator(this.convert_REWARD_MONEY(parseFloat(PAYMENT_FINE.value)));
            let T = this.convert_Calculator(this.convert_TREASURY_MONEY(parseFloat(PAYMENT_FINE.value)));

            TREASURY_MONEY_PIPE.setValue(this.formatMoney(T.replace(/\,/g, "")), { emitEvent: false });
            REWARD_MONEY_PIPE.setValue(this.formatMoney(R.replace(/\,/g, "")), { emitEvent: false });
            BRIBE_MONEY_PIPE.setValue(this.formatMoney(B.replace(/\,/g, "")), { emitEvent: false });
          }
        }
      }
    }



  }

  /////////////////////////////////////////////////////////////////////////// mat //////////////////////////////////////////////////////////////////////////////////////////
  cal_FINE(): number {
    var total = 0;
    let control = <FormArray>this.compareForm.controls.aboutPayFine;

    for (var i = 0; i < control.value.length; i++) {
      for (var j = 0; j < control.value[i].product.length; j++) {
        let o = control.value[i].product[j];
        total += parseFloat(o.NET_FINE);
      }
    }
    return parseFloat(total.toFixed(2));
  }

  cal_NET_FINE(): number {
    var total = 0;
    let control = <FormArray>this.compareForm.controls.aboutPayFine;

    for (var i = 0; i < control.value.length; i++) {
      for (var j = 0; j < control.value[i].product.length; j++) {
        let o = control.value[i].product[j];
        total += parseFloat(o.FINE_RATE) * parseFloat(o.VAT);
      }
    }
    return parseFloat(total.toFixed(2));
  }

  all_NET_FINE() {
    var sum = [];
    var total = [];
    let control = this.compareForm.get("aboutPayFine").value;

    control.map(m => {
      sum.push({
        product: m.product
      })
    })

    for (var i = 0; i < sum.length; i++) {
      var num = 0;
      for (var j = 0; j < sum[i].product.length; j++) {
        let o = sum[i].product[j];
        num += parseFloat(o.FINE_RATE) * parseFloat(o.VAT);
      }
      total.push({
        total: parseFloat(num.toFixed(2))
      })
    }
    return total
  }

  all_NET() {
    var sum = [];
    var total = [];
    let control = this.compareForm.get("aboutPayFine").value;

    control.map(m => {
      sum.push({
        product: m.product
      })
    })

    for (var i = 0; i < sum.length; i++) {
      var num: number = 0;
      for (var j = 0; j < sum[i].product.length; j++) {
        let o = sum[i].product[j];
        num += parseFloat(o.NET_FINE);
      }

      total.push({
        total: parseFloat(num.toFixed(2))
      })
    }
    return total
  }

  all_PAYMENT_FINE() {
    var sum = [];
    var total = [];
    let control = this.compareForm.get("aboutPayFine").value;

    control.map(m => {
      sum.push({
        product: m.product
      })
    })

    for (var i = 0; i < sum.length; i++) {
      var num: number = 0;
      for (var j = 0; j < sum[i].product.length; j++) {
        let o = sum[i].product[j]
        num += parseFloat(o.PAYMENT_FINE);
      }
      total.push({
        total: parseFloat(num.toFixed(2))
      })
    }
    return total;
  }

  all_BRIBE_MONEY() {
    var sum = [];
    var total = [];
    let control = this.compareForm.get("aboutPayFine").value;

    control.map(m => {
      sum.push({
        product: m.product
      })
    })

    for (var i = 0; i < sum.length; i++) {
      var num = 0;
      for (var j = 0; j < sum[i].product.length; j++) {
        let o = sum[i].product[j];
        num += parseFloat(o.BRIBE_MONEY);
      }
      total.push({
        total: parseFloat(num.toFixed(2))
      })
    }
    return total;
  }

  all_REWARD_MONEY() {
    var sum = [];
    var total = [];
    let control = this.compareForm.get("aboutPayFine").value;

    control.map(m => {
      sum.push({
        product: m.product
      })
    })

    for (var i = 0; i < sum.length; i++) {
      var num = 0;
      for (var j = 0; j < sum[i].product.length; j++) {
        let o = sum[i].product[j];
        num += parseFloat(o.REWARD_MONEY);
      }
      total.push({
        total: parseFloat(num.toFixed(2))
      })
    }
    return total;
  }

  all_TREASURY_MONEY() {
    var sum = [];
    var total = [];
    let control = this.compareForm.get("aboutPayFine").value;

    control.map(m => {
      sum.push({
        product: m.product
      })
    })

    for (var i = 0; i < sum.length; i++) {
      var num = 0;
      for (var j = 0; j < sum[i].product.length; j++) {
        let o = sum[i].product[j];
        num += parseFloat(o.TREASURY_MONEY);
      }
      total.push({
        total: parseFloat(num.toFixed(2))
      })
    }
    return total;
  }

  cal_PAYMENT_FINE(): number {
    var total = 0;
    let control = <FormArray>this.compareForm.controls.aboutPayFine;

    for (var i = 0; i < control.value.length; i++) {
      for (var j = 0; j < control.value[i].product.length; j++) {
        let o = control.value[i].product[j];
        total += parseFloat(o.PAYMENT_FINE);
      }
    }
    return parseFloat(total.toFixed(2));
  }

  cal_BRIBE_MONEY(): number {
    var total = 0;
    let control = <FormArray>this.compareForm.controls.aboutPayFine;

    for (var i = 0; i < control.value.length; i++) {
      for (var j = 0; j < control.value[i].product.length; j++) {
        let o = control.value[i].product[j];
        total += parseFloat(o.BRIBE_MONEY);
      }
    }
    return parseFloat(total.toFixed(2));
  }

  cal_REWARD_MONEY(): number {
    var total = 0;
    let control = <FormArray>this.compareForm.controls.aboutPayFine;

    for (var i = 0; i < control.value.length; i++) {
      for (var j = 0; j < control.value[i].product.length; j++) {
        let o = control.value[i].product[j];
        total += parseFloat(o.REWARD_MONEY);
      }
    }
    return parseFloat(total.toFixed(2));
  }

  cal_TREASURY_MONEY(): number {
    var total = 0;
    let control = <FormArray>this.compareForm.controls.aboutPayFine;

    for (var i = 0; i < control.value.length; i++) {
      for (var j = 0; j < control.value[i].product.length; j++) {
        let o = control.value[i].product[j];
        total += parseFloat(o.TREASURY_MONEY);
      }
    }
    return parseFloat(total.toFixed(2));
  }
  ///////////////////////////////////////////////////////////////////////// format //////////////////////////////////////////////////////////////////////////////////////////
  transformTotal(e, i, j) {

    const value = `${e.PAYMENT_FINE_PIPE}`.replace(/\,/g, "");
    const product_pipe = this.AboutPayFine.at(i).get("product") as FormArray;
    const PAYMENT_FINE_PIPE = product_pipe.at(j).get("PAYMENT_FINE_PIPE");
    const product = this.AboutPayFine.at(i).get("product") as FormArray;
    const PAYMENT_FINE = product.at(j).get("PAYMENT_FINE");

    const TREASURY_MONEY_PIPE = product_pipe.at(j).get("TREASURY_MONEY_PIPE");
    const BRIBE_MONEY_PIPE = product_pipe.at(j).get("BRIBE_MONEY_PIPE");
    const REWARD_MONEY_PIPE = product_pipe.at(j).get("REWARD_MONEY_PIPE");

    const BRIBE_MONEY = product.at(j).get("BRIBE_MONEY");
    const REWARD_MONEY = product.at(j).get("REWARD_MONEY");
    const TREASURY_MONEY = product.at(j).get("TREASURY_MONEY");

    PAYMENT_FINE_PIPE.setValue(this.formatMoney(value.replace(/\,/g, "")), { emitEvent: false });


    PAYMENT_FINE.setValue(this.convert_money(parseFloat(value)));
    BRIBE_MONEY.setValue(this.convert_BRIBE_MONEY(parseFloat(value)));
    REWARD_MONEY.setValue(this.convert_REWARD_MONEY(parseFloat(value)));
    TREASURY_MONEY.setValue(this.convert_TREASURY_MONEY(parseFloat(value)));

    let T = this.convert_Calculator(this.convert_TREASURY_MONEY(parseFloat(value)));
    let B = this.convert_Calculator(this.convert_BRIBE_MONEY(parseFloat(value)));
    let R = this.convert_Calculator(this.convert_REWARD_MONEY(parseFloat(value)));

    TREASURY_MONEY_PIPE.setValue(this.formatMoney(T.replace(/\,/g, "")), { emitEvent: false });
    BRIBE_MONEY_PIPE.setValue(this.formatMoney(B.replace(/\,/g, "")), { emitEvent: false });
    REWARD_MONEY_PIPE.setValue(this.formatMoney(R.replace(/\,/g, "")), { emitEvent: false });

    var set_PAYMENT_FINE = 0;
    var set_BRIBE_MONEY = 0;
    var set_REWARD_MONEY = 0;
    var set_TREASURY_MONEY = 0;

    // console.log("/////////////////////////////////////////////////////////////////////////////");
    for (var a = 0; a < product.value.length; a++) {
      set_PAYMENT_FINE += product.at(a).get("PAYMENT_FINE").value;
      set_BRIBE_MONEY += product.at(a).get("BRIBE_MONEY").value;
      set_REWARD_MONEY += product.at(a).get("REWARD_MONEY").value;
      set_TREASURY_MONEY += product.at(a).get("TREASURY_MONEY").value;
    }

    this.AboutPayFine.at(i).get("PAYMENT_FINE").setValue(parseFloat(set_PAYMENT_FINE.toFixed(2)));
    this.AboutPayFine.at(i).get("BRIBE_MONEY").setValue(parseFloat(set_BRIBE_MONEY.toFixed(2)));
    this.AboutPayFine.at(i).get("REWARD_MONEY").setValue(parseFloat(set_REWARD_MONEY.toFixed(2)));
    this.AboutPayFine.at(i).get("TREASURY_MONEY").setValue(parseFloat(set_TREASURY_MONEY.toFixed(2)));

    if (this._IsRequestBribe == 0) {
      this.e_IsRequestBribe({ target: { checked: false } });
      this.e_IsRequestReward({ target: { checked: false } });
    } else if (this._IsRequestReward == 0) {
      this.e_IsRequestBribe({ target: { checked: false } });
      this.e_IsRequestReward({ target: { checked: false } });
    } else {
    }
  }

  transformTotal_T(e, i, j) {
    const value = `${e.TREASURY_MONEY_PIPE}`.replace(/\,/g, "");
    const product = this.AboutPayFine.at(i).get("product") as FormArray;
    const TREASURY_MONEY_PIPE = product.at(j).get("TREASURY_MONEY_PIPE");
    const TREASURY_MONEY = product.at(j).get("TREASURY_MONEY");
    TREASURY_MONEY_PIPE.setValue(this.formatMoney(value.replace(/\,/g, "")), { emitEvent: false });
    TREASURY_MONEY.setValue(parseFloat(value));
  }

  transformTotal_R(e, i, j) {
    const value = `${e.REWARD_MONEY_PIPE}`.replace(/\,/g, "");
    const product = this.AboutPayFine.at(i).get("product") as FormArray;
    const REWARD_MONEY_PIPE = product.at(j).get("REWARD_MONEY_PIPE");
    const REWARD_MONEY = product.at(j).get("REWARD_MONEY");
    REWARD_MONEY_PIPE.setValue(this.formatMoney(value.replace(/\,/g, "")), { emitEvent: false });
    REWARD_MONEY.setValue(parseFloat(value));
  }

  transformTotal_B(e, i, j) {
    const value = `${e.BRIBE_MONEY_PIPE}`.replace(/\,/g, "");
    const product = this.AboutPayFine.at(i).get("product") as FormArray;
    const BRIBE_MONEY_PIPE = product.at(j).get("BRIBE_MONEY_PIPE");
    const BRIBE_MONEY = product.at(j).get("BRIBE_MONEY");
    BRIBE_MONEY_PIPE.setValue(this.formatMoney(value.replace(/\,/g, "")), { emitEvent: false });
    BRIBE_MONEY.setValue(parseFloat(value));
  }

  formatMoney(value) {
    const temp = `${value}`.replace(/\,/g, "");
    return this.currencyPipe.transform(temp).replace("$", "");
  }

  convert_Calculator(m) {
    const temp = `${m}`.replace(/\,/g, "");
    return this.currencyPipe.transform(temp).replace("$", "");
  }

  convert_money(m): number {
    var money = m;
    var BRIBE_MONEY = money * 0.2;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money * 0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money * 0.6;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY + REWARD_MONEY) + TREASURY_MONEY;
    var total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
    var cal = 0;

    if (total > money) {
      cal = total - money;
      var a1 = total_BRIBE_MONEY - cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return money;
    } else if (total < money) {
      cal = money - total;
      var a1 = total_REWARD_MONEY + cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return money;
    } else {
      return money;
    }
  }

  convert_BRIBE_MONEY(m): number {
    var money = m;
    var BRIBE_MONEY = money * 0.2;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money * 0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money * 0.6;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY + REWARD_MONEY) + TREASURY_MONEY;
    var total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
    var cal = 0;

    if (total > money) {
      cal = total - money;
      var a1 = total_BRIBE_MONEY - cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_BRIBE_MONEY;
    } else if (total < money) {
      cal = money - total;
      var a1 = total_REWARD_MONEY + cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_BRIBE_MONEY;
    } else {
      return total_BRIBE_MONEY;
    }
  }

  convert_REWARD_MONEY(m): number {
    var money = m;
    var BRIBE_MONEY = money * 0.2;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money * 0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money * 0.6;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY + REWARD_MONEY) + TREASURY_MONEY;
    var total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
    var cal = 0;

    if (total > money) {
      cal = total - money;
      var a1 = total_BRIBE_MONEY - cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_REWARD_MONEY;
    } else if (total < money) {
      cal = money - total;
      var a1 = total_REWARD_MONEY + cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_REWARD_MONEY;
    } else {
      return total_REWARD_MONEY;
    }
  }

  convert_TREASURY_MONEY(m): number {
    var money = m;
    var BRIBE_MONEY = money * 0.2;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money * 0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money * 0.6;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY + REWARD_MONEY) + TREASURY_MONEY;
    var total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
    var cal = 0;

    if (total > money) {
      cal = total - money;
      var a1 = total_BRIBE_MONEY - cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_TREASURY_MONEY;
    } else if (total < money) {
      cal = money - total;
      var a1 = total_REWARD_MONEY + cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_TREASURY_MONEY;
    } else {
      return total_TREASURY_MONEY;
    }
  }

  convert_money_not(m): number {
    var money = m;
    var BRIBE_MONEY = money * 0;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money * 0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money * 0.8;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY + REWARD_MONEY) + TREASURY_MONEY;
    var total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
    var cal = 0;

    if (total > money) {
      cal = total - money;
      var a1 = total_BRIBE_MONEY - cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return money;
    } else if (total < money) {
      cal = money - total;
      var a1 = total_REWARD_MONEY + cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return money;
    } else {
      return money;
    }
  }

  convert_BRIBE_MONEY_not(m): number {
    var money = m;
    var BRIBE_MONEY = money * 0;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money * 0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money * 0.8;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY + REWARD_MONEY) + TREASURY_MONEY;
    var total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
    var cal = 0;

    if (total > money) {
      cal = total - money;
      var a1 = total_BRIBE_MONEY - cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_BRIBE_MONEY;
    } else if (total < money) {
      cal = money - total;
      var a1 = total_REWARD_MONEY + cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_BRIBE_MONEY;
    } else {
      return total_BRIBE_MONEY;
    }
  }

  convert_REWARD_MONEY_not(m): number {
    var money = m;
    var BRIBE_MONEY = money * 0;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money * 0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money * 0.8;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY + REWARD_MONEY) + TREASURY_MONEY;
    var total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
    var cal = 0;

    if (total > money) {
      cal = total - money;
      var a1 = total_BRIBE_MONEY - cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_REWARD_MONEY;
    } else if (total < money) {
      cal = money - total;
      var a1 = total_REWARD_MONEY + cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_REWARD_MONEY;
    } else {
      return total_REWARD_MONEY;
    }
  }

  convert_TREASURY_MONEY_not(m): number {
    var money = m;
    var BRIBE_MONEY = money * 0;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money * 0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money * 0.8;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY + REWARD_MONEY) + TREASURY_MONEY;
    var total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
    var cal = 0;

    if (total > money) {
      cal = total - money;
      var a1 = total_BRIBE_MONEY - cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_TREASURY_MONEY;
    } else if (total < money) {
      cal = money - total;
      var a1 = total_REWARD_MONEY + cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_TREASURY_MONEY;
    } else {
      return total_TREASURY_MONEY;
    }
  }

  ///////////////////////////////////////////////////////////////////////// toggleCollapse //////////////////////////////////////////////////////////////////////////////////////////
  collapse1 = new BehaviorSubject<Boolean>(true);
  collapse2 = new BehaviorSubject<Boolean>(false);
  collapse3 = new BehaviorSubject<Boolean>(false);
  collapse4 = new BehaviorSubject<Boolean>(false);
  collapse5 = new BehaviorSubject<Boolean>(false);
  collapse6 = new BehaviorSubject<Boolean>(false);
  collapse7 = new BehaviorSubject<Boolean>(false);
  toggleCollapse(event: BehaviorSubject<Boolean>): void { if (event.getValue()) { event.next(false); } else { event.next(true); } }


  ///////////////////////////////////////////////////////////////////////// myDatePicker //////////////////////////////////////////////////////////////////////////////////////////
  myDatePickerSetFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerNotSetFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: false,
    height: '30px'
  };

  getDisCurrDateMyDatePicker() {
    let currentdate = new Date();
    const disCurrDate = {
      begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
      end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
    }
    return disCurrDate;
  }

  ///////////////////////////////////////////////////////////////////////// set cal //////////////////////////////////////////////////////////////////////////////////////////
  public setDecimal(value: any, index: number, field: any) {
    let element = this.compareForm as FormGroup;
    if (value)
      element.controls[`${field}`]
        .setValue(parseFloat(this.removeComma(value))
          .toFixed(2))
  }

  public removeComma(value) {/* Remove comma , */
    var str = String(value);
    str = str.replace(/,/g, '');
    if (String(str) == 'NaN')
      return '0';
    else
      return str;
  }

  public DotNumericOnly(event): boolean {
    let patt = /^([0-9,.])$/;
    let result = patt.test(event.key);
    return result;
  }

  ///////////////////////////////////////////////////////////////////////// set time //////////////////////////////////////////////////////////////////////////////////////////
  public setFormatTimeControl(event: any, formControl: string, formGroup: FormGroup) {
    let str = event.target.value;
    let str_unSub = event.target.value;
    let substr: any[] = []
    let mm: string = '';
    let ss: string = '';
    substr = str.split(':');
    mm = substr[0] == undefined ? '' : substr[0].slice(0, 2);
    ss = substr[1] == undefined ? '' : substr[1].slice(0, 2);
    const K = event.keyCode;

    if (!/([0-9])$/.test(event.target.value))
      formGroup.controls[formControl].setValue(str_unSub.slice(0, str_unSub.length - 1));

    switch (true) {
      // NumPad 96-105
      case K >= 96 && K <= 105:
        if (str.length == 2)
          formGroup.controls[formControl].setValue(`${mm}:${ss}`);
        else if (str.length == 3)
          formGroup.controls[formControl].setValue(`${mm}:${str_unSub.substring(2)}`);
        break;
      // KeyPad 96-105
      case (K >= 48 && K <= 57):
        if (str.length == 2)
          formGroup.controls[formControl].setValue(`${mm}:${ss}`);
        else if (str.length == 3)
          formGroup.controls[formControl].setValue(`${mm}:${str_unSub.substring(2)}`);
        break;
      // backspace 8
      case K == 8:
        break;
      //delete 46
      case K == 46:
        break;
      default:
        break;
    }
  }

  require(e) {
    switch (e) {
      case 'isReq_COMPARE_NO': this.isReq_COMPARE_NO = false; break;
    }
  }

  ///////////////////////////////////////////////////////////////////////// document //////////////////////////////////////////////////////////////////////////////////////////
  fileList: Document[] = []
  BACKUP_fileList: Document[] = []
  DelDoc: any[] = [];
  owlOption = {
    items: 5,
    nav: true,
    dots: false,
    slideBy: 5,
    margin: 10,
    responsiveClass: true
  }
  modal: any;
  openModal(e) {
    this.modal = this.ngbModal.open(e, { size: 'lg', centered: true });
  }

  deleteItem(i: number) {
    const doc = this.fileList[i];
    Swal({
      title: '',
      text: 'ยืนยันการลบรายการหรือไม่',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        if (!doc.DOCUMENT_ID) {
          this.fileList.splice(i, 1);
          return;
        }
        this.DelDoc.push([doc.DOCUMENT_ID].reduce((acc, curr) => { return { DOCUMENT_ID: curr } }, {}));
        this.fileList.splice(i, 1);
      }
    })
  }

  DownloadItem(item) {
    this.preloader.setShowPreloader(true);
    this.fineService.downloadFile(item.DOCUMENT_ID)
      .subscribe(
        (data) => this.handleDownload(data, item));
  }

  handleDownload(data: any, item: any) {
    this.preloader.setShowPreloader(false);
    var blob = URL.createObjectURL(new Blob([data], { type: '*/*' }));
    saveAs(blob, item.DOCUMENT_NAME);
  }

  Output(event: Document) {
    this.fileList = [...this.fileList, event]
    console.log("fileList : ", this.fileList)
  }

  isRevenueCheck(c: any): void {
    let d: any[] = c['CompareMapping'].reduce((a, c) => [...a, ...c['CompareDetail']], []);
    const isRevenue: boolean = d.some(s => s['IS_REVENUE'] == 1);
    if (isRevenue) {
      this.editButton = false;
      this.deleteButton = false;
    }
  }

  validateFirstZelo(event: any, formControl: string, formGroup: FormGroup) {
    if (/^0/.test(event.value))
      formGroup.controls[formControl].setValue(event.value.replace(/^0/, ""));
  }

}
