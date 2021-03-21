import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy, TemplateRef } from '@angular/core';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReductionModelListComponent } from './reduction-model-list/reduction-model-list.component';
import { PrintDocModalComponent } from '../print-doc-modal/print-doc-modal.component'
import Swal from 'sweetalert2';
import { FormGroup, FormControl, NgForm, FormArray, FormBuilder, FormControlName, Form , ValidatorFn, Validators } from '@angular/forms';
import { variable} from '../reduction';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReductionService } from '../reduction.service';
import { createPipeInstance } from '@angular/core/src/view/provider';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { toLocalShort, setZero } from 'app/config/dateFormat';
import { CurrencyPipe } from '@angular/common';
import { Document } from '../reduction_document';
import swal from 'sweetalert2';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { saveAs } from 'file-saver';
import { take } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { from, } from 'rxjs';
import * as moment from 'moment-timezone';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of, generate } from 'rxjs';
import { ILG60_O_08_00_02_01 } from '../ILG60_O_08_00_02_01/ILG60_O_08_00_02_01';
import { ILG60_O_08_00_02_02 } from '../ILG60_O_08_00_02_02/ILG60_O_08_00_02_02';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements  OnInit, OnDestroy {
  
  form_Collapse1 : FormGroup;
  form_Collapse2 : FormGroup;
  mode : any;
  COMPARE_ID : any = '';
  COMPARE_DETAIL_ID : any = '';
  INDICTMENT_DETAIL_ID : any = '';
  ARREST_ID: any = '';
  BANKING: any = '';
  NOTICE_ID: any = '';
  office_code : any;
  office_id : any;
  ///////////button///////////
  createButton : boolean = false;
  printButton: boolean = false;
  editButton: boolean = false;
  deleteButton: boolean = false;
  saveButton: boolean = false;
  cancelButton: boolean = false;
  showEditField  = false;
  _IsRequestBribe = 20;
  _CaseBribe = false;
  _IsRequestReward = 20;
  _CaseReward = false;
  _IsRequestTRE = 60;
  constructor
    (
      private router: Router,
      private activeRoute: ActivatedRoute,
      private navService: NavigationService,
      private ngbModal: NgbModal,
      private fb: FormBuilder,
      private reductionService : ReductionService,
      private currencyPipe : CurrencyPipe,
      private preloader: PreloaderService,
    ) { }

  ngOnInit() {
    localStorage.setItem('programcode', 'ILG60-09-00');
    this.office_code = localStorage.getItem('officeCode');
    let params = {
      OFFICE_ID: "",
      TEXT_SEARCH: localStorage.getItem('officeShortName')
    }

    this.reductionService.MasOfficegetByCon("MasOfficegetByCon",params).then(res=>{
      this.office_id = res.RESPONSE_DATA[0].OFFICE_ID;
    });

    const param = {
      "systemId":"WSS",
      "userName":"wss001",
      "password":"123456",
      "ipAddress":"10.1.1.1",
      "requestData":{
      }
     }
    this.reductionService.InquiryBank("InquiryBank",param).then(list=>{
      this.BANKING = list.ResponseData;
    }).catch(e=>{console.log("ไม่พบข้อมูลธนาคาร");});
    
    this.setForm();
  }

  async setForm(){
    this.activeRoute.params.subscribe(async p => {
      this.COMPARE_ID = p.code;
      this.INDICTMENT_DETAIL_ID = p.code2;
      this.ARREST_ID = p.code3;
      this.mode = p.mode;
      if (this.mode == 'C'){
        this.createButton  = false;
        this.printButton = false;
        this.editButton = false;
        this.deleteButton = false;
        this.saveButton = true;
        this.cancelButton = true;
      }else if (this.mode == 'R'){
        this.createButton  = false;
        this.printButton = true;
        this.editButton = false;
        this.deleteButton = true;
        this.saveButton = false;
        this.cancelButton = false;
        this.showEditField = true;
        this.collapse3 = new BehaviorSubject<Boolean>(true);
      }

      await this.setForm_Collapse1();
      await this.loadData_Collapse1();
      await this.loadData1();
    });
  }

  setForm_Collapse1(){
    this.form_Collapse1 = this.fb.group({
      ARREST_CODE: new FormControl(""),
      ARREST_LAWSUIT_TIME: new FormControl(""),
      OCCURRENCE_DATE: new FormControl(""),
      OCCURRENCE_TIME: new FormControl(""),
      SUB_DISTRICT_NAME: new FormControl(""),
      ARREST_STAFF: new FormControl(""),
      ACCUSER_MANAGEMENT_POS_NAME: new FormControl(""),
      ACCUSER_OPERATION_OFFICE_SHORT_NAME: new FormControl(""),
      SUBSECTION_NAME: new FormControl(""),
      SECTION_NAME: new FormControl(""),
      GUILTBASE_NAME: new FormControl(""),
      PENALTY_DESC: new FormControl(""),
      ARREST_LAWSUIT_NO: new FormControl(""),
      ARREST_LAWSUIT_NO_YEAR: new FormControl(""),
      ARREST_LAWSUIT_DATE: new FormControl(""),
      PROVE_NO: new FormControl(""),
      PROVE_NO_YEAR: new FormControl(""),
      RECEIVE_DOC_DATE: new FormControl(""),
      RECEIVE_DOC_TIME: new FormControl(""),
      COMPARE_NO: new FormControl(""),
      COMPARE_NO_YEAR: new FormControl(""),
      COMPARE_DATE: new FormControl(""),
      COMPARE_TIME: new FormControl(""),
      COMPARE_NAME: new FormControl(""),
      COMPARE_MANAGEMENT_POS_NAME: new FormControl(""),
      COMPARE_MANAGEMENT_SHORT_NAME: new FormControl(""),
    });

    this.form_Collapse2 = this.fb.group({
      AdjustCompareMapping : this.fb.array([]),
      AdjustCompareDetail : this.fb.array([]),
      AdjustCompareDetailPayment : this.fb.array([]),
      AdjustCompareDetailFine : this.fb.array([]),
      AdjustComparePayment : this.fb.array([]),
      AdjustComparePaymentDetail : this.fb.array([]),
      AdjustCompareArrestIndictmentDetail : this.fb.array([]),
      AdjustCompareStaff : this.fb.array([]),
      SetDetail : this.fb.array([]),
    });
  }

    get AdjustCompareMapping(): FormArray {return this.form_Collapse2.get('AdjustCompareMapping') as FormArray;}
    get AdjustCompareDetail(): FormArray {return this.form_Collapse2.get('AdjustCompareDetail') as FormArray;}
    get AdjustCompareDetailPayment(): FormArray {return this.form_Collapse2.get('AdjustCompareDetailPayment') as FormArray;}
    get AdjustCompareDetailFine(): FormArray {return this.form_Collapse2.get('AdjustCompareDetailFine') as FormArray;}
    get AdjustComparePayment(): FormArray {return this.form_Collapse2.get('AdjustComparePayment') as FormArray;}
    get AdjustComparePaymentDetail(): FormArray {return this.form_Collapse2.get('AdjustComparePaymentDetail') as FormArray;}
    get AdjustCompareArrestIndictmentDetail(): FormArray {return this.form_Collapse2.get('AdjustCompareArrestIndictmentDetail') as FormArray;}
    get AdjustCompareStaff(): FormArray {return this.form_Collapse2.get('AdjustCompareStaff') as FormArray;}
    get SetDetail(): FormArray {return this.form_Collapse2.get('SetDetail') as FormArray;}

    ///////////////////////////////////////////////////////////////////////// convert data //////////////////////////////////////////////////////////////////////////////////////////
    convertDate(date){var fomat = "";if (date == null){return fomat}else{return this.toDatePickerFormat(new Date(date));}}

    convertTime(time){var fomat = "";if (time == null){return fomat}else{return time.slice(10, 16).replace(/\s+/g,'');}}
  
    convertNo(No){var fomat = "";if (No == 0){return fomat}else{return No}}
  
    convertYear(Year){var fomat = "";if (Year == null){return fomat}else{return parseInt(Year.slice(0, 4))+543;}}
    
    toDatePickerFormat(d: any) {
      return { date: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }, formatted: toLocalShort(d.toString()).replace(/ /g, ' ') };
    }
  
  ///////////////////////////////////////////////////////////////////////// loadData_Collapse1 //////////////////////////////////////////////////////////////////////////////////////////
    
  async loadData_Collapse1(){
    let params = { INDICTMENT_ID : this.INDICTMENT_DETAIL_ID }
    let res = await this.reductionService.AdjustCompareArrestgetByIndictmentID("AdjustCompareArrestgetByIndictmentID",params);
    const arrest_id = { "ARREST_ID": res[0].ARREST_ID };
    let NOTICE = await this.reductionService.CompareNoticegetByArrestID("CompareNoticegetByArrestID", arrest_id);
    if (NOTICE.length == 0) { this.NOTICE_ID = 0; } else { this.NOTICE_ID = NOTICE[0].NOTICE_ID; };
    res.map(m=>{
        this.form_Collapse1.setValue({
          ARREST_CODE: m.ARREST_CODE,
          OCCURRENCE_DATE : this.convertDate(m.OCCURRENCE_DATE),
          OCCURRENCE_TIME : this.convertTime(m.OCCURRENCE_DATE),
          SUB_DISTRICT_NAME: m.LOACTION_NAME,
          ARREST_STAFF: m.ACCUSER_NAME,
          ACCUSER_MANAGEMENT_POS_NAME: m.ACCUSER_OPREATION_POS_NAME,
          ACCUSER_OPERATION_OFFICE_SHORT_NAME: m.ACCUSER_OPERATION_OFFICE_NAME,
          SUBSECTION_NAME: m.SUBSECTION_NAME,
          SECTION_NAME: m.SECTION_NAME.substring(6),
          GUILTBASE_NAME: m.GUILTBASE_NAME,
          PENALTY_DESC: m.PENALTY_DESC,
          ARREST_LAWSUIT_NO: this.convertNo(m.LAWSUIT_NO),
          ARREST_LAWSUIT_NO_YEAR: this.convertYear(m.LAWSUIT_NO_YEAR),
          ARREST_LAWSUIT_DATE: this.convertDate(m.LAWSUIT_DATE),
          ARREST_LAWSUIT_TIME: this.convertTime(m.LAWSUIT_DATE),
          PROVE_NO : this.convertNo(m.PROVE_NO),
          PROVE_NO_YEAR : this.convertYear(m.PROVE_NO_YEAR),
          RECEIVE_DOC_DATE : this.convertDate(m.RECEIVE_DOC_DATE),
          RECEIVE_DOC_TIME : this.convertTime(m.RECEIVE_DOC_DATE),
          COMPARE_NO: this.convertNo(m.COMPARE_NO),
          COMPARE_NO_YEAR: this.convertYear(m.COMPARE_NO_YEAR),
          COMPARE_DATE: this.convertDate(m.COMPARE_DATE),
          COMPARE_TIME: this.convertTime(m.COMPARE_DATE),
          COMPARE_NAME: m.COMPARE_STAFF,
          COMPARE_MANAGEMENT_POS_NAME: m.OPREATION_POS_NAME,
          COMPARE_MANAGEMENT_SHORT_NAME: m.ACCUSER_OPERATION_OFFICE_NAME
        });
    });
  }
  
  async loadData1(){
    let params = { COMPARE_ID : this.COMPARE_ID };
    let res = await this.reductionService.ComparegetByCon("ComparegetByCon",params);
    let list = [];
    list.push(res);

    if(this.mode == 'C'){
      list.map(m=>{
        m.CompareMapping.map(Mapping=>{
          this.AdjustCompareMapping.push(this.fb.group({
            COMPARE_MAPPING_ID: new FormControl(Mapping.COMPARE_MAPPING_ID),
            COMPARE_ID: new FormControl(Mapping.COMPARE_ID),
            INDICTMENT_DETAIL_ID: new FormControl(Mapping.INDICTMENT_DETAIL_ID),
            PAST_LAWSUIT_ID: new FormControl(Mapping.PAST_LAWSUIT_ID),
            IS_EVER_WRONG: new FormControl(Mapping.IS_EVER_WRONG),
            IS_ACTIVE: new FormControl(Mapping.IS_ACTIVE),
            AdjustCompareDetail : this.fb.array([]),
            AdjustCompareArrestIndictmentDetail : this.fb.array([]),
          }));

          Mapping.CompareDetail.map(Detail=>{
            if (Detail.RECEIPT_NO == '' || Detail.RECEIPT_NO == null || Detail.RECEIPT_NO == 0 || Detail.RECEIPT_NO == '0'){ Detail.RECEIPT_NO = ""}else{ Detail.RECEIPT_NO = Detail.RECEIPT_NO.toString();};
            if (Detail.RECEIPT_BOOK_NO == '' || Detail.RECEIPT_BOOK_NO == null || Detail.RECEIPT_BOOK_NO == 0 || Detail.RECEIPT_BOOK_NO == '0'){ Detail.RECEIPT_BOOK_NO = ""}else{ Detail.RECEIPT_BOOK_NO = Detail.RECEIPT_BOOK_NO.toString();};
            if (Detail.TREASURY_MONEY == '' || Detail.TREASURY_MONEY == null){Detail.TREASURY_MONEY == 0};
            if (Detail.BRIBE_MONEY == '' || Detail.BRIBE_MONEY == null){Detail.BRIBE_MONEY == 0};
            if (Detail.REWARD_MONEY == '' || Detail.REWARD_MONEY == null){Detail.REWARD_MONEY == 0};

            if(Detail.COMPARE_TYPE == 1){
            this.AdjustCompareDetail.push(this.fb.group({
              COMPARE_DETAIL_ID: new FormControl(Detail.COMPARE_DETAIL_ID),
              COMPARE_MAPPING_ID: new FormControl(Detail.COMPARE_MAPPING_ID),
              RECEIPT_OFFICE_ID: new FormControl(Detail.RECEIPT_OFFICE_ID),
              APPROVE_OFFICE_ID: new FormControl(Detail.APPROVE_OFFICE_ID),
              MISTREAT_NO: new FormControl(Detail.MISTREAT_NO),
              OLD_PAYMENT_FINE: new FormControl(Detail.OLD_PAYMENT_FINE),
              PAYMENT_FINE: new FormControl(Detail.PAYMENT_FINE),
              DIFFERENCE_PAYMENT_FINE: new FormControl(Detail.DIFFERENCE_PAYMENT_FINE),
              TREASURY_MONEY: new FormControl(Detail.TREASURY_MONEY),
              BRIBE_MONEY: new FormControl(Detail.BRIBE_MONEY),
              REWARD_MONEY: new FormControl(Detail.REWARD_MONEY),
              PAYMENT_FINE_DUE_DATE: new FormControl(Detail.PAYMENT_FINE_DUE_DATE),
              PAYMENT_VAT_DUE_DATE: new FormControl(Detail.PAYMENT_VAT_DUE_DATE),
              INSURANCE: new FormControl(Detail.INSURANCE),
              GAURANTEE: new FormControl(Detail.GAURANTEE),
              PAYMENT_DATE: new FormControl(Detail.PAYMENT_DATE),
              RECEIPT_TYPE: new FormControl(Detail.RECEIPT_TYPE),
              RECEIPT_BOOK_NO: new FormControl(this.conVNUMFIVE(Detail.RECEIPT_BOOK_NO.toString())),
              RECEIPT_NO: new FormControl(this.conVNUMTWO(Detail.RECEIPT_NO.toString())),
              RECEIPT_OFFICE_CODE: new FormControl(Detail.RECEIPT_OFFICE_CODE),
              RECEIPT_OFFICE_NAME: new FormControl(Detail.RECEIPT_OFFICE_NAME),
              APPROVE_OFFICE_CODE: new FormControl(Detail.APPROVE_OFFICE_CODE),
              APPROVE_OFFICE_NAME: new FormControl(Detail.APPROVE_OFFICE_NAME),
              APPROVE_DATE: new FormControl(Detail.APPROVE_DATE),
              APPROVE_TYPE: new FormControl(Detail.APPROVE_TYPE),
              COMMAND_NO: new FormControl(Detail.COMMAND_NO),
              COMMAND_DATE: new FormControl(Detail.COMMAND_DATE),
              REMARK_NOT_AGREE: new FormControl(Detail.REMARK_NOT_AGREE),
              REMARK_NOT_APPROVE: new FormControl(Detail.REMARK_NOT_APPROVE),
              FACT: new FormControl(Detail.FACT),
              COMPARE_REASON: new FormControl(Detail.COMPARE_REASON),
              ADJUST_REASON: new FormControl(Detail.ADJUST_REASON),
              COMPARE_TYPE: new FormControl(Detail.COMPARE_TYPE),
              IS_REQUEST: new FormControl(Detail.IS_REQUEST),
              IS_TEMP_RELEASE: new FormControl(Detail.IS_TEMP_RELEASE),
              IS_INSURANCE: new FormControl(Detail.IS_INSURANCE),
              IS_GAURANTEE: new FormControl(Detail.IS_GAURANTEE),
              IS_PAYMENT: new FormControl(Detail.IS_PAYMENT),
              IS_REVENUE: new FormControl(Detail.IS_REVENUE),
              IS_AGREE: new FormControl(Detail.IS_AGREE),
              IS_APPROVE: new FormControl(Detail.IS_APPROVE),
              IS_AUTHORITY: new FormControl(Detail.IS_AUTHORITY),
              IS_ACTIVE: new FormControl(Detail.IS_ACTIVE),
              AdjustCompareDetailPayment: this.fb.array([]),
              AdjustCompareDetailFine: this.fb.array([]),
              AdjustComparePayment: this.fb.array([]),
            }));

            Detail.CompareDetailPayment.map(DetailPayment=>{
              this.AdjustCompareDetailPayment.push(this.fb.group({
                PAYMENT_ID: new FormControl(DetailPayment.PAYMENT_ID),
                COMPARE_DETAIL_ID: new FormControl(DetailPayment.COMPARE_DETAIL_ID),
                PAYMENT_TYPE: new FormControl(DetailPayment.PAYMENT_TYPE),
                PAYMENT_FINE: new FormControl(DetailPayment.PAYMENT_FINE),
                REFFERENCE_NO: new FormControl(DetailPayment.REFFERENCE_NO),
                IS_ACTIVE: new FormControl(DetailPayment.IS_ACTIVE),
              }));
            });

            Detail.CompareDetailFine.map(DetailDetailFine=>{
              // console.log("AdjustCompareDetailFine",DetailDetailFine)
              this.AdjustCompareDetailFine.push(this.fb.group({
                FINE_ID: new FormControl(DetailDetailFine.FINE_ID),
                COMPARE_DETAIL_ID: new FormControl(DetailDetailFine.COMPARE_DETAIL_ID),
                PRODUCT_ID: new FormControl(DetailDetailFine.PRODUCT_ID),
                FINE_RATE: new FormControl(DetailDetailFine.FINE_RATE),
                VAT: new FormControl(DetailDetailFine.VAT),
                FINE: new FormControl(DetailDetailFine.FINE),
                NET_FINE: new FormControl(DetailDetailFine.NET_FINE),
                OLD_PAYMENT_FINE: new FormControl(DetailDetailFine.OLD_PAYMENT_FINE),
                PAYMENT_FINE: new FormControl(DetailDetailFine.PAYMENT_FINE),
                DIFFERENCE_PAYMENT_FINE: new FormControl(DetailDetailFine.DIFFERENCE_PAYMENT_FINE),
                TREASURY_MONEY: new FormControl(DetailDetailFine.TREASURY_MONEY),
                BRIBE_MONEY: new FormControl(DetailDetailFine.BRIBE_MONEY),
                REWARD_MONEY: new FormControl(DetailDetailFine.REWARD_MONEY),
                IS_ACTIVE: new FormControl(DetailDetailFine.IS_ACTIVE),
                PRODUCT_GROUP_NAME: new FormControl(DetailDetailFine.PRODUCT_GROUP_NAME),
                PRODUCT_CATEGORY_NAME: new FormControl(DetailDetailFine.PRODUCT_CATEGORY_NAME),
                PRODUCT_TYPE_NAME: new FormControl(DetailDetailFine.PRODUCT_TYPE_NAME),
                PRODUCT_SUBTYPE_NAME: new FormControl(DetailDetailFine.PRODUCT_SUBTYPE_NAME),
                PRODUCT_SUBSETTYPE_NAME: new FormControl(DetailDetailFine.PRODUCT_SUBSETTYPE_NAME),
                PRODUCT_BRAND_NAME_TH: new FormControl(DetailDetailFine.PRODUCT_BRAND_NAME_TH),
                PRODUCT_BRAND_NAME_EN: new FormControl(DetailDetailFine.PRODUCT_BRAND_NAME_EN),
                PRODUCT_SUBBRAND_NAME_TH: new FormControl(DetailDetailFine.PRODUCT_SUBBRAND_NAME_TH),
                PRODUCT_SUBBRAND_NAME_EN: new FormControl(DetailDetailFine.PRODUCT_SUBBRAND_NAME_EN),
                PRODUCT_MODEL_NAME_TH: new FormControl(DetailDetailFine.PRODUCT_MODEL_NAME_TH),
                PRODUCT_MODEL_NAME_EN: new FormControl(DetailDetailFine.PRODUCT_MODEL_NAME_EN),
                SIZES: new FormControl(DetailDetailFine.SIZES),
                SIZES_UNIT: new FormControl(DetailDetailFine.SIZES_UNIT),
                QUANTITY: new FormControl(DetailDetailFine.QUANTITY),
                QUANTITY_UNIT: new FormControl(DetailDetailFine.QUANTITY_UNIT),
                VOLUMN: new FormControl(DetailDetailFine.VOLUMN),
                VOLUMN_UNIT: new FormControl(DetailDetailFine.VOLUMN_UNIT),
              }));
            });

            Detail.ComparePayment.map(Payment=>{
              this.AdjustComparePayment.push(this.fb.group({
                PAYMENT_ID: new FormControl(Payment.PAYMENT_ID),
                LAWSUIT_DETAIL_ID: new FormControl(Payment.LAWSUIT_DETAIL_ID),
                COMPARE_DETAIL_ID: new FormControl(Payment.COMPARE_DETAIL_ID),
                FINE_TYPE: new FormControl(Payment.FINE_TYPE),
                FINE: new FormControl(Payment.FINE),
                PAYMENT_PERIOD_NO: new FormControl(Payment.PAYMENT_PERIOD_NO),
                PAYMENT_DATE: new FormControl(Payment.PAYMENT_DATE),
                IS_REQUEST_REWARD: new FormControl(Payment.IS_REQUEST_REWARD),
                IS_ACTIVE: new FormControl(Payment.IS_ACTIVE),
                AdjustComparePaymentDetail: this.fb.array([]),
              }));

              Payment.ComparePaymentDetail.map(PaymentDetail=>{
                this.AdjustComparePaymentDetail.push(this.fb.group({
                  PAYMENT_DETAIL_ID: new FormControl(PaymentDetail.PAYMENT_DETAIL_ID),
                  PAYMENT_ID: new FormControl(PaymentDetail.PAYMENT_ID),
                  NOTICE_ID: new FormControl(PaymentDetail.NOTICE_ID),
                  IS_REQUEST_BRIBE: new FormControl(PaymentDetail.IS_REQUEST_BRIBE),
                  IS_ACTIVE: new FormControl(PaymentDetail.IS_ACTIVE),
                }));
              });
            });

            Detail.CompareStaff.map(Staff=>{
              this.AdjustCompareStaff.push(this.fb.group({
                STAFF_ID: new FormControl(Staff.STAFF_ID),
                COMPARE_ID: new FormControl(Staff.COMPARE_ID),
                COMPARE_DETAIL_ID: new FormControl(Staff.COMPARE_DETAIL_ID),
                STAFF_REF_ID: new FormControl(Staff.STAFF_REF_ID),
                TITLE_ID: new FormControl(Staff.TITLE_ID),
                STAFF_CODE: new FormControl(Staff.STAFF_CODE),
                ID_CARD: new FormControl(Staff.ID_CARD),
                STAFF_TYPE: new FormControl(Staff.STAFF_TYPE),
                TITLE_NAME_TH: new FormControl(Staff.TITLE_NAME_TH),
                TITLE_NAME_EN: new FormControl(Staff.TITLE_NAME_EN),
                TITLE_SHORT_NAME_TH: new FormControl(Staff.TITLE_SHORT_NAME_TH),
                TITLE_SHORT_NAME_EN: new FormControl(Staff.TITLE_SHORT_NAME_EN),
                FIRST_NAME: new FormControl(Staff.FIRST_NAME),
                LAST_NAME: new FormControl(Staff.LAST_NAME),
                AGE: new FormControl(Staff.AGE),
                OPERATION_POS_CODE: new FormControl(Staff.OPERATION_POS_CODE),
                OPREATION_POS_NAME: new FormControl(Staff.OPREATION_POS_NAME),
                OPREATION_POS_LEVEL: new FormControl(Staff.OPREATION_POS_LEVEL),
                OPERATION_POS_LEVEL_NAME: new FormControl(Staff.OPERATION_POS_LEVEL_NAME),
                OPERATION_DEPT_CODE: new FormControl(Staff.OPERATION_DEPT_CODE),
                OPERATION_DEPT_NAME: new FormControl(Staff.OPERATION_DEPT_NAME),
                OPERATION_DEPT_LEVEL: new FormControl(Staff.OPERATION_DEPT_LEVEL),
                OPERATION_UNDER_DEPT_CODE: new FormControl(Staff.OPERATION_UNDER_DEPT_CODE),
                OPERATION_UNDER_DEPT_NAME: new FormControl(Staff.OPERATION_UNDER_DEPT_NAME),
                OPERATION_UNDER_DEPT_LEVEL: new FormControl(Staff.OPERATION_UNDER_DEPT_LEVEL),
                OPERATION_WORK_DEPT_CODE: new FormControl(Staff.OPERATION_WORK_DEPT_CODE),
                OPERATION_WORK_DEPT_NAME: new FormControl(Staff.OPERATION_WORK_DEPT_NAME),
                OPERATION_WORK_DEPT_LEVEL: new FormControl(Staff.OPERATION_WORK_DEPT_LEVEL),
                OPERATION_OFFICE_CODE: new FormControl(Staff.OPERATION_OFFICE_CODE),
                OPERATION_OFFICE_NAME: new FormControl(Staff.OPERATION_OFFICE_NAME),
                OPERATION_OFFICE_SHORT_NAME: new FormControl(Staff.OPERATION_OFFICE_SHORT_NAME),
                MANAGEMENT_POS_CODE: new FormControl(Staff.MANAGEMENT_POS_CODE),
                MANAGEMENT_POS_NAME: new FormControl(Staff.MANAGEMENT_POS_NAME),
                MANAGEMENT_POS_LEVEL: new FormControl(Staff.MANAGEMENT_POS_LEVEL),
                MANAGEMENT_POS_LEVEL_NAME: new FormControl(Staff.MANAGEMENT_POS_LEVEL_NAME),
                MANAGEMENT_DEPT_CODE: new FormControl(Staff.MANAGEMENT_DEPT_CODE),
                MANAGEMENT_DEPT_NAME: new FormControl(Staff.MANAGEMENT_DEPT_NAME),
                MANAGEMENT_DEPT_LEVEL: new FormControl(Staff.MANAGEMENT_DEPT_LEVEL),
                MANAGEMENT_UNDER_DEPT_CODE: new FormControl(Staff.MANAGEMENT_UNDER_DEPT_CODE),
                MANAGEMENT_UNDER_DEPT_NAME: new FormControl(Staff.MANAGEMENT_UNDER_DEPT_NAME),
                MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(Staff.MANAGEMENT_UNDER_DEPT_LEVEL),
                MANAGEMENT_WORK_DEPT_CODE: new FormControl(Staff.MANAGEMENT_WORK_DEPT_CODE),
                MANAGEMENT_WORK_DEPT_NAME: new FormControl(Staff.MANAGEMENT_WORK_DEPT_NAME),
                MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(Staff.MANAGEMENT_WORK_DEPT_LEVEL),
                MANAGEMENT_OFFICE_CODE: new FormControl(Staff.MANAGEMENT_OFFICE_CODE),
                MANAGEMENT_OFFICE_NAME: new FormControl(Staff.MANAGEMENT_OFFICE_NAME),
                MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(Staff.MANAGEMENT_OFFICE_SHORT_NAME),
                REPRESENTATION_POS_CODE: new FormControl(Staff.REPRESENTATION_POS_CODE),
                REPRESENTATION_POS_NAME: new FormControl(Staff.REPRESENTATION_POS_NAME),
                REPRESENTATION_POS_LEVEL: new FormControl(Staff.REPRESENTATION_POS_LEVEL),
                REPRESENTATION_POS_LEVEL_NAME: new FormControl(Staff.REPRESENTATION_POS_LEVEL_NAME),
                REPRESENTATION_DEPT_CODE: new FormControl(Staff.REPRESENTATION_DEPT_CODE),
                REPRESENTATION_DEPT_NAME: new FormControl(Staff.REPRESENTATION_DEPT_NAME),
                REPRESENTATION_DEPT_LEVEL: new FormControl(Staff.REPRESENTATION_DEPT_LEVEL),
                REPRESENTATION_UNDER_DEPT_CODE: new FormControl(Staff.REPRESENTATION_UNDER_DEPT_CODE),
                REPRESENTATION_UNDER_DEPT_NAME: new FormControl(Staff.REPRESENTATION_UNDER_DEPT_NAME),
                REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(Staff.REPRESENTATION_UNDER_DEPT_LEVEL),
                REPRESENT_WORK_DEPT_CODE: new FormControl(Staff.REPRESENT_WORK_DEPT_CODE),
                REPRESENT_WORK_DEPT_NAME: new FormControl(Staff.REPRESENT_WORK_DEPT_NAME),
                REPRESENT_WORK_DEPT_LEVEL: new FormControl(Staff.REPRESENT_WORK_DEPT_LEVEL),
                REPRESENT_OFFICE_CODE: new FormControl(Staff.REPRESENT_OFFICE_CODE),
                REPRESENT_OFFICE_NAME: new FormControl(Staff.REPRESENT_OFFICE_NAME),
                REPRESENT_OFFICE_SHORT_NAME: new FormControl(Staff.REPRESENT_OFFICE_SHORT_NAME),
                STATUS: new FormControl(Staff.STATUS),
                REMARK: new FormControl(Staff.REMARK),
                CONTRIBUTOR_ID: new FormControl(Staff.CONTRIBUTOR_ID),
                IS_ACTIVE: new FormControl(Staff.IS_ACTIVE)
              }));
            });
            }
          });

          Mapping.CompareArrestIndictmentDetail.map(Arrest=>{
            this.AdjustCompareArrestIndictmentDetail.push(this.fb.group({
              INDICTMENT_DETAIL_ID: new FormControl(Arrest.INDICTMENT_DETAIL_ID),
              INDICTMENT_ID: new FormControl(Arrest.INDICTMENT_ID),
              LAWBREAKER_ID: new FormControl(Arrest.LAWBREAKER_ID),
              PERSON_ID: new FormControl(Arrest.PERSON_ID),
              COMPANY_REGISTRATION_NO: new FormControl(Arrest.COMPANY_REGISTRATION_NO),
              EXCISE_REGISTRATION_NO: new FormControl(Arrest.EXCISE_REGISTRATION_NO),
              ID_CARD: new FormControl(Arrest.ID_CARD),
              PASSPORT_NO: new FormControl(Arrest.PASSPORT_NO),
              PERSON_TYPE: new FormControl(Arrest.PERSON_TYPE),
              ENTITY_TYPE: new FormControl(Arrest.ENTITY_TYPE),
              TITLE_NAME_TH: new FormControl(Arrest.TITLE_NAME_TH),
              TITLE_NAME_EN: new FormControl(Arrest.TITLE_NAME_EN),
              TITLE_SHORT_NAME_TH: new FormControl(Arrest.TITLE_SHORT_NAME_TH),
              TITLE_SHORT_NAME_EN: new FormControl(Arrest.TITLE_SHORT_NAME_EN),
              FIRST_NAME: new FormControl(Arrest.FIRST_NAME),
              MIDDLE_NAME: new FormControl(Arrest.MIDDLE_NAME),
              LAST_NAME: new FormControl(Arrest.LAST_NAME),
              OTHER_NAME: new FormControl(Arrest.OTHER_NAME),
            }));
          });

        });

      });
      this.loadData_Collapse2();
    }else{
      list.map(m=>{
        m.CompareMapping.map(Mapping=>{
          this.AdjustCompareMapping.push(this.fb.group({
            COMPARE_MAPPING_ID: new FormControl(Mapping.COMPARE_MAPPING_ID),
            COMPARE_ID: new FormControl(Mapping.COMPARE_ID),
            INDICTMENT_DETAIL_ID: new FormControl(Mapping.INDICTMENT_DETAIL_ID),
            PAST_LAWSUIT_ID: new FormControl(Mapping.PAST_LAWSUIT_ID),
            IS_EVER_WRONG: new FormControl(Mapping.IS_EVER_WRONG),
            IS_ACTIVE: new FormControl(Mapping.IS_ACTIVE),
            AdjustCompareDetail : this.fb.array([]),
            AdjustCompareArrestIndictmentDetail : this.fb.array([]),
          }));
          Mapping.CompareDetail.map(Detail=>{
          if (Detail.RECEIPT_NO == '' || Detail.RECEIPT_NO == null || Detail.RECEIPT_NO == 0 || Detail.RECEIPT_NO == '0'){ Detail.RECEIPT_NO = ""}else{ Detail.RECEIPT_NO = Detail.RECEIPT_NO.toString();};
          if (Detail.RECEIPT_BOOK_NO == '' || Detail.RECEIPT_BOOK_NO == null || Detail.RECEIPT_BOOK_NO == 0 || Detail.RECEIPT_BOOK_NO == '0'){ Detail.RECEIPT_BOOK_NO = ""}else{ Detail.RECEIPT_BOOK_NO = Detail.RECEIPT_BOOK_NO.toString();};
          if (Detail.TREASURY_MONEY == '' || Detail.TREASURY_MONEY == null){Detail.TREASURY_MONEY == 0};
          if (Detail.BRIBE_MONEY == '' || Detail.BRIBE_MONEY == null){Detail.BRIBE_MONEY == 0};
          if (Detail.REWARD_MONEY == '' || Detail.REWARD_MONEY == null){Detail.REWARD_MONEY == 0};
          if(Detail.COMPARE_TYPE == "" || Detail.COMPARE_TYPE == 2){
            this.AdjustCompareDetail.push(this.fb.group({
              COMPARE_DETAIL_ID: new FormControl(Detail.COMPARE_DETAIL_ID),
              COMPARE_MAPPING_ID: new FormControl(Detail.COMPARE_MAPPING_ID),
              RECEIPT_OFFICE_ID: new FormControl(Detail.RECEIPT_OFFICE_ID),
              APPROVE_OFFICE_ID: new FormControl(Detail.APPROVE_OFFICE_ID),
              MISTREAT_NO: new FormControl(Detail.MISTREAT_NO),
              OLD_PAYMENT_FINE: new FormControl(Detail.OLD_PAYMENT_FINE),
              PAYMENT_FINE: new FormControl(Detail.PAYMENT_FINE),
              DIFFERENCE_PAYMENT_FINE: new FormControl(Detail.DIFFERENCE_PAYMENT_FINE),
              TREASURY_MONEY: new FormControl(Detail.TREASURY_MONEY),
              BRIBE_MONEY: new FormControl(Detail.BRIBE_MONEY),
              REWARD_MONEY: new FormControl(Detail.REWARD_MONEY),
              PAYMENT_FINE_DUE_DATE: new FormControl(Detail.PAYMENT_FINE_DUE_DATE),
              PAYMENT_VAT_DUE_DATE: new FormControl(Detail.PAYMENT_VAT_DUE_DATE),
              INSURANCE: new FormControl(Detail.INSURANCE),
              GAURANTEE: new FormControl(Detail.GAURANTEE),
              PAYMENT_DATE: new FormControl(Detail.PAYMENT_DATE),
              RECEIPT_TYPE: new FormControl(Detail.RECEIPT_TYPE),
              RECEIPT_BOOK_NO: new FormControl(this.conVNUMFIVE(Detail.RECEIPT_BOOK_NO.toString())),
              RECEIPT_NO: new FormControl(this.conVNUMTWO(Detail.RECEIPT_NO.toString())),
              RECEIPT_OFFICE_CODE: new FormControl(Detail.RECEIPT_OFFICE_CODE),
              RECEIPT_OFFICE_NAME: new FormControl(Detail.RECEIPT_OFFICE_NAME),
              APPROVE_OFFICE_CODE: new FormControl(Detail.APPROVE_OFFICE_CODE),
              APPROVE_OFFICE_NAME: new FormControl(Detail.APPROVE_OFFICE_NAME),
              APPROVE_DATE: new FormControl(Detail.APPROVE_DATE),
              APPROVE_TYPE: new FormControl(Detail.APPROVE_TYPE),
              COMMAND_NO: new FormControl(Detail.COMMAND_NO),
              COMMAND_DATE: new FormControl(Detail.COMMAND_DATE),
              REMARK_NOT_AGREE: new FormControl(Detail.REMARK_NOT_AGREE),
              REMARK_NOT_APPROVE: new FormControl(Detail.REMARK_NOT_APPROVE),
              FACT: new FormControl(Detail.FACT),
              COMPARE_REASON: new FormControl(Detail.COMPARE_REASON),
              ADJUST_REASON: new FormControl(Detail.ADJUST_REASON),
              COMPARE_TYPE: new FormControl(Detail.COMPARE_TYPE),
              IS_REQUEST: new FormControl(Detail.IS_REQUEST),
              IS_TEMP_RELEASE: new FormControl(Detail.IS_TEMP_RELEASE),
              IS_INSURANCE: new FormControl(Detail.IS_INSURANCE),
              IS_GAURANTEE: new FormControl(Detail.IS_GAURANTEE),
              IS_PAYMENT: new FormControl(Detail.IS_PAYMENT),
              IS_REVENUE: new FormControl(Detail.IS_REVENUE),
              IS_AGREE: new FormControl(Detail.IS_AGREE),
              IS_APPROVE: new FormControl(Detail.IS_APPROVE),
              IS_AUTHORITY: new FormControl(Detail.IS_AUTHORITY),
              IS_ACTIVE: new FormControl(Detail.IS_ACTIVE),
              AdjustCompareDetailPayment: this.fb.array([]),
              AdjustCompareDetailFine: this.fb.array([]),
              AdjustComparePayment: this.fb.array([]),
            }));
            Detail.CompareDetailPayment.map(DetailPayment=>{
              this.AdjustCompareDetailPayment.push(this.fb.group({
                PAYMENT_ID: new FormControl(DetailPayment.PAYMENT_ID),
                COMPARE_DETAIL_ID: new FormControl(DetailPayment.COMPARE_DETAIL_ID),
                PAYMENT_TYPE: new FormControl(DetailPayment.PAYMENT_TYPE),
                PAYMENT_FINE: new FormControl(DetailPayment.PAYMENT_FINE),
                REFFERENCE_NO: new FormControl(DetailPayment.REFFERENCE_NO),
                IS_ACTIVE: new FormControl(DetailPayment.IS_ACTIVE),
              }));
            });
            Detail.CompareDetailFine.map(DetailDetailFine=>{
              this.AdjustCompareDetailFine.push(this.fb.group({
                FINE_ID: new FormControl(DetailDetailFine.FINE_ID),
                COMPARE_DETAIL_ID: new FormControl(DetailDetailFine.COMPARE_DETAIL_ID),
                PRODUCT_ID: new FormControl(DetailDetailFine.PRODUCT_ID),
                FINE_RATE: new FormControl(DetailDetailFine.FINE_RATE),
                VAT: new FormControl(DetailDetailFine.VAT),
                FINE: new FormControl(DetailDetailFine.FINE),
                NET_FINE: new FormControl(DetailDetailFine.NET_FINE),
                OLD_PAYMENT_FINE: new FormControl(DetailDetailFine.OLD_PAYMENT_FINE),
                PAYMENT_FINE: new FormControl(DetailDetailFine.PAYMENT_FINE),
                DIFFERENCE_PAYMENT_FINE: new FormControl(DetailDetailFine.DIFFERENCE_PAYMENT_FINE),
                TREASURY_MONEY: new FormControl(DetailDetailFine.TREASURY_MONEY),
                BRIBE_MONEY: new FormControl(DetailDetailFine.BRIBE_MONEY),
                REWARD_MONEY: new FormControl(DetailDetailFine.REWARD_MONEY),
                IS_ACTIVE: new FormControl(DetailDetailFine.IS_ACTIVE),
                PRODUCT_GROUP_NAME: new FormControl(DetailDetailFine.PRODUCT_GROUP_NAME),
                PRODUCT_CATEGORY_NAME: new FormControl(DetailDetailFine.PRODUCT_CATEGORY_NAME),
                PRODUCT_TYPE_NAME: new FormControl(DetailDetailFine.PRODUCT_TYPE_NAME),
                PRODUCT_SUBTYPE_NAME: new FormControl(DetailDetailFine.PRODUCT_SUBTYPE_NAME),
                PRODUCT_SUBSETTYPE_NAME: new FormControl(DetailDetailFine.PRODUCT_SUBSETTYPE_NAME),
                PRODUCT_BRAND_NAME_TH: new FormControl(DetailDetailFine.PRODUCT_BRAND_NAME_TH),
                PRODUCT_BRAND_NAME_EN: new FormControl(DetailDetailFine.PRODUCT_BRAND_NAME_EN),
                PRODUCT_SUBBRAND_NAME_TH: new FormControl(DetailDetailFine.PRODUCT_SUBBRAND_NAME_TH),
                PRODUCT_SUBBRAND_NAME_EN: new FormControl(DetailDetailFine.PRODUCT_SUBBRAND_NAME_EN),
                PRODUCT_MODEL_NAME_TH: new FormControl(DetailDetailFine.PRODUCT_MODEL_NAME_TH),
                PRODUCT_MODEL_NAME_EN: new FormControl(DetailDetailFine.PRODUCT_MODEL_NAME_EN),
                SIZES: new FormControl(DetailDetailFine.SIZES),
                SIZES_UNIT: new FormControl(DetailDetailFine.SIZES_UNIT),
                QUANTITY: new FormControl(DetailDetailFine.QUANTITY),
                QUANTITY_UNIT: new FormControl(DetailDetailFine.QUANTITY_UNIT),
                VOLUMN: new FormControl(DetailDetailFine.VOLUMN),
                VOLUMN_UNIT: new FormControl(DetailDetailFine.VOLUMN_UNIT),
              }));
            });
            Detail.ComparePayment.map(Payment=>{
              this.AdjustComparePayment.push(this.fb.group({
                PAYMENT_ID: new FormControl(Payment.PAYMENT_ID),
                LAWSUIT_DETAIL_ID: new FormControl(Payment.LAWSUIT_DETAIL_ID),
                COMPARE_DETAIL_ID: new FormControl(Payment.COMPARE_DETAIL_ID),
                FINE_TYPE: new FormControl(Payment.FINE_TYPE),
                FINE: new FormControl(Payment.FINE),
                PAYMENT_PERIOD_NO: new FormControl(Payment.PAYMENT_PERIOD_NO),
                PAYMENT_DATE: new FormControl(Payment.PAYMENT_DATE),
                IS_REQUEST_REWARD: new FormControl(Payment.IS_REQUEST_REWARD),
                IS_ACTIVE: new FormControl(Payment.IS_ACTIVE),
                AdjustComparePaymentDetail: this.fb.array([]),
              }));
              Payment.ComparePaymentDetail.map(PaymentDetail=>{
                this.AdjustComparePaymentDetail.push(this.fb.group({
                  PAYMENT_DETAIL_ID: new FormControl(PaymentDetail.PAYMENT_DETAIL_ID),
                  PAYMENT_ID: new FormControl(PaymentDetail.PAYMENT_ID),
                  NOTICE_ID: new FormControl(PaymentDetail.NOTICE_ID),
                  IS_REQUEST_BRIBE: new FormControl(PaymentDetail.IS_REQUEST_BRIBE),
                  IS_ACTIVE: new FormControl(PaymentDetail.IS_ACTIVE),
                }));
              });
            });
            Detail.CompareStaff.map(Staff=>{
              this.AdjustCompareStaff.push(this.fb.group({
                STAFF_ID: new FormControl(Staff.STAFF_ID),
                COMPARE_ID: new FormControl(Staff.COMPARE_ID),
                COMPARE_DETAIL_ID: new FormControl(Staff.COMPARE_DETAIL_ID),
                STAFF_REF_ID: new FormControl(Staff.STAFF_REF_ID),
                TITLE_ID: new FormControl(Staff.TITLE_ID),
                STAFF_CODE: new FormControl(Staff.STAFF_CODE),
                ID_CARD: new FormControl(Staff.ID_CARD),
                STAFF_TYPE: new FormControl(Staff.STAFF_TYPE),
                TITLE_NAME_TH: new FormControl(Staff.TITLE_NAME_TH),
                TITLE_NAME_EN: new FormControl(Staff.TITLE_NAME_EN),
                TITLE_SHORT_NAME_TH: new FormControl(Staff.TITLE_SHORT_NAME_TH),
                TITLE_SHORT_NAME_EN: new FormControl(Staff.TITLE_SHORT_NAME_EN),
                FIRST_NAME: new FormControl(Staff.FIRST_NAME),
                LAST_NAME: new FormControl(Staff.LAST_NAME),
                AGE: new FormControl(Staff.AGE),
                OPERATION_POS_CODE: new FormControl(Staff.OPERATION_POS_CODE),
                OPREATION_POS_NAME: new FormControl(Staff.OPREATION_POS_NAME),
                OPREATION_POS_LEVEL: new FormControl(Staff.OPREATION_POS_LEVEL),
                OPERATION_POS_LEVEL_NAME: new FormControl(Staff.OPERATION_POS_LEVEL_NAME),
                OPERATION_DEPT_CODE: new FormControl(Staff.OPERATION_DEPT_CODE),
                OPERATION_DEPT_NAME: new FormControl(Staff.OPERATION_DEPT_NAME),
                OPERATION_DEPT_LEVEL: new FormControl(Staff.OPERATION_DEPT_LEVEL),
                OPERATION_UNDER_DEPT_CODE: new FormControl(Staff.OPERATION_UNDER_DEPT_CODE),
                OPERATION_UNDER_DEPT_NAME: new FormControl(Staff.OPERATION_UNDER_DEPT_NAME),
                OPERATION_UNDER_DEPT_LEVEL: new FormControl(Staff.OPERATION_UNDER_DEPT_LEVEL),
                OPERATION_WORK_DEPT_CODE: new FormControl(Staff.OPERATION_WORK_DEPT_CODE),
                OPERATION_WORK_DEPT_NAME: new FormControl(Staff.OPERATION_WORK_DEPT_NAME),
                OPERATION_WORK_DEPT_LEVEL: new FormControl(Staff.OPERATION_WORK_DEPT_LEVEL),
                OPERATION_OFFICE_CODE: new FormControl(Staff.OPERATION_OFFICE_CODE),
                OPERATION_OFFICE_NAME: new FormControl(Staff.OPERATION_OFFICE_NAME),
                OPERATION_OFFICE_SHORT_NAME: new FormControl(Staff.OPERATION_OFFICE_SHORT_NAME),
                MANAGEMENT_POS_CODE: new FormControl(Staff.MANAGEMENT_POS_CODE),
                MANAGEMENT_POS_NAME: new FormControl(Staff.MANAGEMENT_POS_NAME),
                MANAGEMENT_POS_LEVEL: new FormControl(Staff.MANAGEMENT_POS_LEVEL),
                MANAGEMENT_POS_LEVEL_NAME: new FormControl(Staff.MANAGEMENT_POS_LEVEL_NAME),
                MANAGEMENT_DEPT_CODE: new FormControl(Staff.MANAGEMENT_DEPT_CODE),
                MANAGEMENT_DEPT_NAME: new FormControl(Staff.MANAGEMENT_DEPT_NAME),
                MANAGEMENT_DEPT_LEVEL: new FormControl(Staff.MANAGEMENT_DEPT_LEVEL),
                MANAGEMENT_UNDER_DEPT_CODE: new FormControl(Staff.MANAGEMENT_UNDER_DEPT_CODE),
                MANAGEMENT_UNDER_DEPT_NAME: new FormControl(Staff.MANAGEMENT_UNDER_DEPT_NAME),
                MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(Staff.MANAGEMENT_UNDER_DEPT_LEVEL),
                MANAGEMENT_WORK_DEPT_CODE: new FormControl(Staff.MANAGEMENT_WORK_DEPT_CODE),
                MANAGEMENT_WORK_DEPT_NAME: new FormControl(Staff.MANAGEMENT_WORK_DEPT_NAME),
                MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(Staff.MANAGEMENT_WORK_DEPT_LEVEL),
                MANAGEMENT_OFFICE_CODE: new FormControl(Staff.MANAGEMENT_OFFICE_CODE),
                MANAGEMENT_OFFICE_NAME: new FormControl(Staff.MANAGEMENT_OFFICE_NAME),
                MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(Staff.MANAGEMENT_OFFICE_SHORT_NAME),
                REPRESENTATION_POS_CODE: new FormControl(Staff.REPRESENTATION_POS_CODE),
                REPRESENTATION_POS_NAME: new FormControl(Staff.REPRESENTATION_POS_NAME),
                REPRESENTATION_POS_LEVEL: new FormControl(Staff.REPRESENTATION_POS_LEVEL),
                REPRESENTATION_POS_LEVEL_NAME: new FormControl(Staff.REPRESENTATION_POS_LEVEL_NAME),
                REPRESENTATION_DEPT_CODE: new FormControl(Staff.REPRESENTATION_DEPT_CODE),
                REPRESENTATION_DEPT_NAME: new FormControl(Staff.REPRESENTATION_DEPT_NAME),
                REPRESENTATION_DEPT_LEVEL: new FormControl(Staff.REPRESENTATION_DEPT_LEVEL),
                REPRESENTATION_UNDER_DEPT_CODE: new FormControl(Staff.REPRESENTATION_UNDER_DEPT_CODE),
                REPRESENTATION_UNDER_DEPT_NAME: new FormControl(Staff.REPRESENTATION_UNDER_DEPT_NAME),
                REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(Staff.REPRESENTATION_UNDER_DEPT_LEVEL),
                REPRESENT_WORK_DEPT_CODE: new FormControl(Staff.REPRESENT_WORK_DEPT_CODE),
                REPRESENT_WORK_DEPT_NAME: new FormControl(Staff.REPRESENT_WORK_DEPT_NAME),
                REPRESENT_WORK_DEPT_LEVEL: new FormControl(Staff.REPRESENT_WORK_DEPT_LEVEL),
                REPRESENT_OFFICE_CODE: new FormControl(Staff.REPRESENT_OFFICE_CODE),
                REPRESENT_OFFICE_NAME: new FormControl(Staff.REPRESENT_OFFICE_NAME),
                REPRESENT_OFFICE_SHORT_NAME: new FormControl(Staff.REPRESENT_OFFICE_SHORT_NAME),
                STATUS: new FormControl(Staff.STATUS),
                REMARK: new FormControl(Staff.REMARK),
                CONTRIBUTOR_ID: new FormControl(Staff.CONTRIBUTOR_ID),
                IS_ACTIVE: new FormControl(Staff.IS_ACTIVE)
              }));
            });
          }
          });
          Mapping.CompareArrestIndictmentDetail.map(Arrest=>{
            this.AdjustCompareArrestIndictmentDetail.push(this.fb.group({
              INDICTMENT_DETAIL_ID: new FormControl(Arrest.INDICTMENT_DETAIL_ID),
              INDICTMENT_ID: new FormControl(Arrest.INDICTMENT_ID),
              LAWBREAKER_ID: new FormControl(Arrest.LAWBREAKER_ID),
              PERSON_ID: new FormControl(Arrest.PERSON_ID),
              COMPANY_REGISTRATION_NO: new FormControl(Arrest.COMPANY_REGISTRATION_NO),
              EXCISE_REGISTRATION_NO: new FormControl(Arrest.EXCISE_REGISTRATION_NO),
              ID_CARD: new FormControl(Arrest.ID_CARD),
              PASSPORT_NO: new FormControl(Arrest.PASSPORT_NO),
              PERSON_TYPE: new FormControl(Arrest.PERSON_TYPE),
              ENTITY_TYPE: new FormControl(Arrest.ENTITY_TYPE),
              TITLE_NAME_TH: new FormControl(Arrest.TITLE_NAME_TH),
              TITLE_NAME_EN: new FormControl(Arrest.TITLE_NAME_EN),
              TITLE_SHORT_NAME_TH: new FormControl(Arrest.TITLE_SHORT_NAME_TH),
              TITLE_SHORT_NAME_EN: new FormControl(Arrest.TITLE_SHORT_NAME_EN),
              FIRST_NAME: new FormControl(Arrest.FIRST_NAME),
              MIDDLE_NAME: new FormControl(Arrest.MIDDLE_NAME),
              LAST_NAME: new FormControl(Arrest.LAST_NAME),
              OTHER_NAME: new FormControl(Arrest.OTHER_NAME),
            }));
          });

        });

      });
      this.loadData_Collapse3();
    }
  }

  ///////////////////////////////////////////////////////////////////////// MODE C //////////////////////////////////////////////////////////////////////////////////////////
  loadData_Collapse2(){
    let params = { COMPARE_ID : this.COMPARE_ID }
    this.reductionService.ComparegetByCon("ComparegetByCon",params).then(res=>{
      let list = [];
      list.push(res);
      list.map(m=>{

        this._IsRequestBribe = m.BRIBE_RATE;
        this._IsRequestReward = m.REWARD_RATE;
        this._IsRequestTRE = m.TREASURY_RATE;

        var name = '';
        for (var i=0;i<m.CompareMapping.length;i++){
          var s = m.CompareMapping[i].CompareArrestIndictmentDetail[0];
          if (s.PERSON_TYPE == 0){
            name = `${s.TITLE_SHORT_NAME_TH || ''}${s.FIRST_NAME || ''} ${s.LAST_NAME || ''}`;
          }else if (s.PERSON_TYPE == 1){
              name = `${s.TITLE_SHORT_NAME_EN || ''}${s.FIRST_NAME || ''} ${s.LAST_NAME || ''}`;
          }else{
              name = `${s.TITLE_SHORT_NAME_TH || ''}${s.COMPANY_NAME || ''}`;
          }
          this.set_mapping1(name,m.CompareMapping[i])
        }
      });
    });
  }

  set_mapping1(name,Mapping){
      Mapping.CompareDetail.map(d=>{
        if (d.RECEIPT_NO == '' || d.RECEIPT_NO == null || d.RECEIPT_NO == 0 || d.RECEIPT_NO == '0'){ d.RECEIPT_NO = ""}else{ d.RECEIPT_NO = d.RECEIPT_NO.toString();};
        if (d.RECEIPT_BOOK_NO == '' || d.RECEIPT_BOOK_NO == null || d.RECEIPT_BOOK_NO == 0 || d.RECEIPT_BOOK_NO == '0'){ d.RECEIPT_BOOK_NO = ""}else{ d.RECEIPT_BOOK_NO = d.RECEIPT_BOOK_NO.toString();};
        if (d.TREASURY_MONEY == '' || d.TREASURY_MONEY == null){d.TREASURY_MONEY == 0};
        if (d.BRIBE_MONEY == '' || d.BRIBE_MONEY == null){d.BRIBE_MONEY == 0};
        if (d.REWARD_MONEY == '' || d.REWARD_MONEY == null){d.REWARD_MONEY == 0};
        
        if(d.COMPARE_TYPE == 1){
        if(d.RECEIPT_TYPE == 1 || d.RECEIPT_TYPE == "1"){
          this.SetDetail.push(this.fb.group({
            NAME : new FormControl(name),
            RECEIPT : new FormControl(`${this.conVNUMTWO(d.RECEIPT_NO.toString())}`),
            NEW_PAYMENT_FINE : new FormControl(''),
            PIPE_PAYMENT_FINE : new FormControl(0),
            STATUS : new FormControl(''),
            IS_UP : new FormControl(0),
            NEW_RECEIPT_BOOK_NO : new FormControl(''),
            NEW_RECEIPT_NO : new FormControl(''),
            NEW_RECEIPT : new FormControl(''),
            IS_DOWN : new FormControl(0),
            REASON : new FormControl(''),
            PAYMENT_DETAIL : this.fb.array([]),
            setStaff : this.fb.array([]),

            COMPARE_DETAIL_ID: new FormControl(d.COMPARE_DETAIL_ID),
            COMPARE_MAPPING_ID: new FormControl(d.COMPARE_MAPPING_ID),
            RECEIPT_OFFICE_ID: new FormControl(d.RECEIPT_OFFICE_ID),
            APPROVE_OFFICE_ID: new FormControl(d.APPROVE_OFFICE_ID),
            MISTREAT_NO: new FormControl(d.MISTREAT_NO),
            OLD_PAYMENT_FINE: new FormControl(d.OLD_PAYMENT_FINE),
            PAYMENT_FINE: new FormControl(d.PAYMENT_FINE),
            DIFFERENCE_PAYMENT_FINE: new FormControl(d.DIFFERENCE_PAYMENT_FINE),
            TREASURY_MONEY: new FormControl(d.TREASURY_MONEY),
            BRIBE_MONEY: new FormControl(d.BRIBE_MONEY),
            REWARD_MONEY: new FormControl(d.REWARD_MONEY),
            PAYMENT_FINE_DUE_DATE: new FormControl(d.PAYMENT_FINE_DUE_DATE),
            PAYMENT_VAT_DUE_DATE: new FormControl(d.PAYMENT_VAT_DUE_DATE),
            INSURANCE: new FormControl(d.INSURANCE),
            GAURANTEE: new FormControl(d.GAURANTEE),
            PAYMENT_DATE: new FormControl(d.PAYMENT_DATE),
            RECEIPT_TYPE: new FormControl(d.RECEIPT_TYPE),
            RECEIPT_BOOK_NO: new FormControl(this.conVNUMFIVE(d.RECEIPT_BOOK_NO.toString())),
            RECEIPT_NO: new FormControl(this.conVNUMTWO(d.RECEIPT_NO.toString())),
            RECEIPT_OFFICE_CODE: new FormControl(d.RECEIPT_OFFICE_CODE),
            RECEIPT_OFFICE_NAME: new FormControl(d.RECEIPT_OFFICE_NAME),
            APPROVE_OFFICE_CODE: new FormControl(d.APPROVE_OFFICE_CODE),
            APPROVE_OFFICE_NAME: new FormControl(d.APPROVE_OFFICE_NAME),
            APPROVE_DATE: new FormControl(d.APPROVE_DATE),
            APPROVE_TYPE: new FormControl(d.APPROVE_TYPE),
            COMMAND_NO: new FormControl(d.COMMAND_NO),
            COMMAND_DATE: new FormControl(d.COMMAND_DATE),
            REMARK_NOT_AGREE: new FormControl(d.REMARK_NOT_AGREE),
            REMARK_NOT_APPROVE: new FormControl(d.REMARK_NOT_APPROVE),
            FACT: new FormControl(d.FACT),
            COMPARE_REASON: new FormControl(d.COMPARE_REASON),
            ADJUST_REASON: new FormControl(d.ADJUST_REASON),
            COMPARE_TYPE: new FormControl(d.COMPARE_TYPE),
            IS_REQUEST: new FormControl(d.IS_REQUEST),
            IS_TEMP_RELEASE: new FormControl(d.IS_TEMP_RELEASE),
            IS_INSURANCE: new FormControl(d.IS_INSURANCE),
            IS_GAURANTEE: new FormControl(d.IS_GAURANTEE),
            IS_PAYMENT: new FormControl(d.IS_PAYMENT),
            IS_REVENUE: new FormControl(d.IS_REVENUE),
            IS_AGREE: new FormControl(d.IS_AGREE),
            IS_APPROVE: new FormControl(d.IS_APPROVE),
            IS_AUTHORITY: new FormControl(d.IS_AUTHORITY),
            IS_ACTIVE: new FormControl(d.IS_ACTIVE),
          }));
        }else{
          this.SetDetail.push(this.fb.group({
            NAME : new FormControl(name),
            RECEIPT : new FormControl(`${this.conVNUMFIVE(d.RECEIPT_BOOK_NO.toString())}/${this.conVNUMTWO(d.RECEIPT_NO.toString())}`),
            NEW_PAYMENT_FINE : new FormControl(''),
            PIPE_PAYMENT_FINE : new FormControl(0),
            STATUS : new FormControl(''),
            IS_UP : new FormControl(0),
            NEW_RECEIPT_BOOK_NO : new FormControl(''),
            NEW_RECEIPT_NO : new FormControl(''),
            NEW_RECEIPT : new FormControl(''),
            IS_DOWN : new FormControl(0),
            REASON : new FormControl(''),
            PAYMENT_DETAIL : this.fb.array([]),
            setStaff : this.fb.array([]),
  
            COMPARE_DETAIL_ID: new FormControl(d.COMPARE_DETAIL_ID),
            COMPARE_MAPPING_ID: new FormControl(d.COMPARE_MAPPING_ID),
            RECEIPT_OFFICE_ID: new FormControl(d.RECEIPT_OFFICE_ID),
            APPROVE_OFFICE_ID: new FormControl(d.APPROVE_OFFICE_ID),
            MISTREAT_NO: new FormControl(d.MISTREAT_NO),
            OLD_PAYMENT_FINE: new FormControl(d.OLD_PAYMENT_FINE),
            PAYMENT_FINE: new FormControl(d.PAYMENT_FINE),
            DIFFERENCE_PAYMENT_FINE: new FormControl(d.DIFFERENCE_PAYMENT_FINE),
            TREASURY_MONEY: new FormControl(d.TREASURY_MONEY),
            BRIBE_MONEY: new FormControl(d.BRIBE_MONEY),
            REWARD_MONEY: new FormControl(d.REWARD_MONEY),
            PAYMENT_FINE_DUE_DATE: new FormControl(d.PAYMENT_FINE_DUE_DATE),
            PAYMENT_VAT_DUE_DATE: new FormControl(d.PAYMENT_VAT_DUE_DATE),
            INSURANCE: new FormControl(d.INSURANCE),
            GAURANTEE: new FormControl(d.GAURANTEE),
            PAYMENT_DATE: new FormControl(d.PAYMENT_DATE),
            RECEIPT_TYPE: new FormControl(d.RECEIPT_TYPE),
            RECEIPT_BOOK_NO: new FormControl(this.conVNUMFIVE(d.RECEIPT_BOOK_NO.toString())),
            RECEIPT_NO: new FormControl(this.conVNUMTWO(d.RECEIPT_NO.toString())),
            RECEIPT_OFFICE_CODE: new FormControl(d.RECEIPT_OFFICE_CODE),
            RECEIPT_OFFICE_NAME: new FormControl(d.RECEIPT_OFFICE_NAME),
            APPROVE_OFFICE_CODE: new FormControl(d.APPROVE_OFFICE_CODE),
            APPROVE_OFFICE_NAME: new FormControl(d.APPROVE_OFFICE_NAME),
            APPROVE_DATE: new FormControl(d.APPROVE_DATE),
            APPROVE_TYPE: new FormControl(d.APPROVE_TYPE),
            COMMAND_NO: new FormControl(d.COMMAND_NO),
            COMMAND_DATE: new FormControl(d.COMMAND_DATE),
            REMARK_NOT_AGREE: new FormControl(d.REMARK_NOT_AGREE),
            REMARK_NOT_APPROVE: new FormControl(d.REMARK_NOT_APPROVE),
            FACT: new FormControl(d.FACT),
            COMPARE_REASON: new FormControl(d.COMPARE_REASON),
            ADJUST_REASON: new FormControl(d.ADJUST_REASON),
            COMPARE_TYPE: new FormControl(d.COMPARE_TYPE),
            IS_REQUEST: new FormControl(d.IS_REQUEST),
            IS_TEMP_RELEASE: new FormControl(d.IS_TEMP_RELEASE),
            IS_INSURANCE: new FormControl(d.IS_INSURANCE),
            IS_GAURANTEE: new FormControl(d.IS_GAURANTEE),
            IS_PAYMENT: new FormControl(d.IS_PAYMENT),
            IS_REVENUE: new FormControl(d.IS_REVENUE),
            IS_AGREE: new FormControl(d.IS_AGREE),
            IS_APPROVE: new FormControl(d.IS_APPROVE),
            IS_AUTHORITY: new FormControl(d.IS_AUTHORITY),
            IS_ACTIVE: new FormControl(d.IS_ACTIVE),
          }));
          }
        }
      });
  }
  
  ///////////////////////////////////////////////////////////////////////// MODE R //////////////////////////////////////////////////////////////////////////////////////////
  loadData_Collapse3(){
    let params = { COMPARE_ID : this.COMPARE_ID }
    this.reductionService.ComparegetByCon("ComparegetByCon",params).then(res=>{
      let list = [];
      list.push(res);
      list.map(m=>{

        var name = '';
        for (var i=0;i<m.CompareMapping.length;i++){
          var s = m.CompareMapping[i].CompareArrestIndictmentDetail[0];
          if (s.PERSON_TYPE == 0){
            name = `${s.TITLE_SHORT_NAME_TH || ''}${s.FIRST_NAME || ''} ${s.LAST_NAME || ''}`;
          }else if (s.PERSON_TYPE == 1){
              name = `${s.TITLE_SHORT_NAME_EN || ''}${s.FIRST_NAME || ''} ${s.LAST_NAME || ''}`;
          }else{
              name = `${s.TITLE_SHORT_NAME_TH || ''}${s.COMPANY_NAME || ''}`;
          }
          this.set_mapping2(name,m.CompareMapping[i])
        }
      });
    });
  }

  set_mapping2(name,Mapping){
    Mapping.CompareDetail.map(d=>{
      if(d.BRIBE_MONEY == 0 || d.BRIBE_MONEY == null){this._IsRequestBribe == 0}else{this._IsRequestBribe == 20};
      if(d.REWARD_MONEY == 0 || d.REWARD_MONEY == null){this._IsRequestBribe == 0}else{this._IsRequestBribe == 20};

      let TREASURY_MONEYI = d.PAYMENT_FINE * 0.6;
      let TREASURY_MONEYII = d.PAYMENT_FINE * 0.8;
      let _TREASURY_MONEYI = parseFloat(TREASURY_MONEYI.toFixed(2));
      let _TREASURY_MONEYII = parseFloat(TREASURY_MONEYII.toFixed(2));

      if(d.TREASURY_MONEY == _TREASURY_MONEYI){this._IsRequestBribe == 60}
      else if(d.TREASURY_MONEY == _TREASURY_MONEYII){this._IsRequestBribe == 80}
      else if(d.TREASURY_MONEY == d.PAYMENT_FINE){this._IsRequestBribe == 100}

      if(d.PAYMENT_FINE)
      if(d.COMPARE_TYPE == ""){
      if (d.RECEIPT_NO == '' || d.RECEIPT_NO == null || d.RECEIPT_NO == 0 || d.RECEIPT_NO == '0'){ d.RECEIPT_NO = ""}else{ d.RECEIPT_NO = d.RECEIPT_NO.toString();};
      if (d.RECEIPT_BOOK_NO == '' || d.RECEIPT_BOOK_NO == null || d.RECEIPT_BOOK_NO == 0 || d.RECEIPT_BOOK_NO == '0'){ d.RECEIPT_BOOK_NO = ""}else{ d.RECEIPT_BOOK_NO = d.RECEIPT_BOOK_NO.toString();};
      if (d.TREASURY_MONEY == '' || d.TREASURY_MONEY == null){d.TREASURY_MONEY == 0};
      if (d.BRIBE_MONEY == '' || d.BRIBE_MONEY == null){d.BRIBE_MONEY == 0};
      if (d.REWARD_MONEY == '' || d.REWARD_MONEY == null){d.REWARD_MONEY == 0};
      if(d.RECEIPT_TYPE == 0){
        this.SetDetail.push(this.fb.group({
          NAME : new FormControl(name),
          RECEIPT : new FormControl(`${this.conVNUMFIVE(d.RECEIPT_BOOK_NO.toString())}/${this.conVNUMTWO(d.RECEIPT_NO.toString())}`),
          RECEIPT_BOOK_NO : new FormControl(this.conVNUMFIVE(d.RECEIPT_BOOK_NO.toString())),
          RECEIPT_NO : new FormControl(this.conVNUMTWO(d.RECEIPT_NO.toString())),
          RECEIPT_TYPE : new FormControl(d.RECEIPT_TYPE),
          PAYMENT_FINE : new FormControl(d.OLD_PAYMENT_FINE),
          NEW_PAYMENT_FINE : new FormControl(d.PAYMENT_FINE),
          PIPE_PAYMENT_FINE : new FormControl(d.PAYMENT_FINE),
          OLD_PAYMENT_FINE : new FormControl(d.PAYMENT_FINE),
          DIFFERENCE_PAYMENT_FINE : new FormControl(d.DIFFERENCE_PAYMENT_FINE),
          STATUS : new FormControl(2),
          BRIBE_MONEY : new FormControl(d.BRIBE_MONEY),
          REWARD_MONEY : new FormControl(d.REWARD_MONEY),
          TREASURY_MONEY : new FormControl(d.TREASURY_MONEY),
          IS_UP : new FormControl(0),
          NEW_RECEIPT_BOOK_NO : new FormControl(''),
          NEW_RECEIPT_NO : new FormControl(''),
          NEW_RECEIPT : new FormControl(''),
          IS_DOWN : new FormControl(1),
          REASON : new FormControl(d.ADJUST_REASON),
          PAYMENT_DETAIL : this.fb.array([]),
          setStaff : this.fb.array([]),
          COMPARE_DETAIL_ID : new FormControl(d.COMPARE_DETAIL_ID),
        }));
      }else{
        this.SetDetail.push(this.fb.group({
          NAME : new FormControl(name),
          RECEIPT : new FormControl(`${this.conVNUMTWO(d.RECEIPT_NO.toString())}`),
          RECEIPT_BOOK_NO : new FormControl(''),
          RECEIPT_NO : new FormControl(this.conVNUMTWO(d.RECEIPT_NO.toString())),
          RECEIPT_TYPE : new FormControl(d.RECEIPT_TYPE),
          PAYMENT_FINE : new FormControl(d.OLD_PAYMENT_FINE),
          NEW_PAYMENT_FINE : new FormControl(d.PAYMENT_FINE),
          PIPE_PAYMENT_FINE : new FormControl(d.PAYMENT_FINE),
          OLD_PAYMENT_FINE : new FormControl(d.PAYMENT_FINE),
          DIFFERENCE_PAYMENT_FINE : new FormControl(d.DIFFERENCE_PAYMENT_FINE),
          STATUS : new FormControl(2),
          BRIBE_MONEY : new FormControl(d.BRIBE_MONEY),
          REWARD_MONEY : new FormControl(d.REWARD_MONEY),
          TREASURY_MONEY : new FormControl(d.TREASURY_MONEY),
          IS_UP : new FormControl(0),
          NEW_RECEIPT_BOOK_NO : new FormControl(''),
          NEW_RECEIPT_NO : new FormControl(''),
          NEW_RECEIPT : new FormControl(''),
          IS_DOWN : new FormControl(1),
          REASON : new FormControl(d.ADJUST_REASON),
          PAYMENT_DETAIL : this.fb.array([]),
          setStaff : this.fb.array([]),
          COMPARE_DETAIL_ID : new FormControl(d.COMPARE_DETAIL_ID),
        }));
      }
      
      }else if(d.COMPARE_TYPE == 2){
        let staff = [];
        for (var s =0 ;s<d.CompareStaff.length;s++){
          if(d.CompareStaff[s].CONTRIBUTOR_ID == 86){
            staff.push(d.CompareStaff[s])
          }
        }
        if(d.RECEIPT_TYPE == 0){
          this.SetDetail.push(this.fb.group({
            NAME : new FormControl(name),
            RECEIPT : new FormControl(""),
            RECEIPT_BOOK_NO : new FormControl(""),
            RECEIPT_NO : new FormControl(""),
            PAYMENT_FINE : new FormControl(d.OLD_PAYMENT_FINE),
            NEW_PAYMENT_FINE : new FormControl(d.PAYMENT_FINE),
            PIPE_PAYMENT_FINE : new FormControl(d.PAYMENT_FINE),
            OLD_PAYMENT_FINE : new FormControl(d.PAYMENT_FINE),
            DIFFERENCE_PAYMENT_FINE : new FormControl(d.DIFFERENCE_PAYMENT_FINE),
            STATUS : new FormControl(3),
            BRIBE_MONEY : new FormControl(d.BRIBE_MONEY),
            REWARD_MONEY : new FormControl(d.REWARD_MONEY),
            TREASURY_MONEY : new FormControl(d.TREASURY_MONEY),
            IS_UP : new FormControl(1),
            NEW_RECEIPT_BOOK_NO : new FormControl(d.RECEIPT_BOOK_NO),
            NEW_RECEIPT_NO : new FormControl(d.RECEIPT_NO),
            NEW_RECEIPT : new FormControl(`${d.RECEIPT_BOOK_NO || ''}/${d.RECEIPT_NO || ''}`),
            RECEIPT_TYPE : new FormControl(d.RECEIPT_TYPE),
            IS_DOWN : new FormControl(0),
            REASON : new FormControl(d.ADJUST_REASON),
            PAYMENT_DETAIL : this.fb.array(this.PAYMENT_DETAIL(d.ComparePayment)),
            setStaff : this.fb.array([this.set_CONTRIBUTOR_ID86(staff[0])]),
            COMPARE_DETAIL_ID : new FormControl(d.COMPARE_DETAIL_ID),
          }));
        }else{
          this.SetDetail.push(this.fb.group({
            NAME : new FormControl(name),
            RECEIPT : new FormControl(""),
            RECEIPT_BOOK_NO : new FormControl(""),
            RECEIPT_NO : new FormControl(""),
            PAYMENT_FINE : new FormControl(d.OLD_PAYMENT_FINE),
            NEW_PAYMENT_FINE : new FormControl(d.PAYMENT_FINE),
            PIPE_PAYMENT_FINE : new FormControl(d.PAYMENT_FINE),
            OLD_PAYMENT_FINE : new FormControl(d.PAYMENT_FINE),
            DIFFERENCE_PAYMENT_FINE : new FormControl(d.DIFFERENCE_PAYMENT_FINE),
            STATUS : new FormControl(3),
            BRIBE_MONEY : new FormControl(d.BRIBE_MONEY),
            REWARD_MONEY : new FormControl(d.REWARD_MONEY),
            TREASURY_MONEY : new FormControl(d.TREASURY_MONEY),
            IS_UP : new FormControl(1),
            NEW_RECEIPT_BOOK_NO : new FormControl(d.RECEIPT_BOOK_NO),
            NEW_RECEIPT_NO : new FormControl(d.RECEIPT_NO),
            NEW_RECEIPT : new FormControl(`${d.RECEIPT_NO || ''}`),
            RECEIPT_TYPE : new FormControl(d.RECEIPT_TYPE),
            IS_DOWN : new FormControl(0),
            REASON : new FormControl(d.ADJUST_REASON),
            PAYMENT_DETAIL : this.fb.array(this.PAYMENT_DETAIL(d.ComparePayment)),
            setStaff : this.fb.array([this.set_CONTRIBUTOR_ID86(staff[0])]),
            COMPARE_DETAIL_ID : new FormControl(d.COMPARE_DETAIL_ID),
          }));
        }
        }
    });
  }

  conVNUMFIVE(e){
    let para;
    if (e == ''){return para = ''}
    else if (e.length == 5){ return para = `${e}`}
    else if (e.length == 4){ return para = `${"0"}${e}`}
    else if (e.length == 3){ return para = `${"00"}${e}`}
    else if (e.length == 2){ return para = `${"000"}${e}`}
    else if (e.length == 1){ return para = `${"0000"}${e}`}
    else if (e.length == 0){ return para = `${"00001"}`}
    else {return para = `${e}`}
  }

  conVNUMTWO(e){
    let para;
    if (e == ''){return para = ''}
    else if (e.length == 2){return para = `${e}`}
    else if (e.length == 1){return para = `${"0"}${e}`}
    else if (e.length == 0){return para = `${"01"}`}
    else {return para = `${e}`}
  }

  private PAYMENT_DETAIL(value) { 
    const CompareFormControl = [];
    var BANK_NAME = '';
    for(var i=0;i<value.length;i++){
      CompareFormControl.push({
        PAYMENT_TYPE : value[i].PAYMENT_CHANNEL,
        REFFERENCE_NO : value[i].PAYMENT_REF_NO,
        PAYMENT_FINE : value[i].FINE,
        PAYMENT_FINE_PIPE : value[i].FINE,
        PAYMENT_BANK : BANK_NAME,
        PAYMENT_CODE : value[i].PAYMENT_BANK,
      });
    }
    return CompareFormControl;
  }

  private set_CONTRIBUTOR_ID86(staff): FormGroup { 
    console.log(staff);
    var title;
    if (staff.TITLE_SHORT_NAME_TH == '' || staff.TITLE_SHORT_NAME_TH == null){
      title = staff.TITLE_NAME_TH;
    }else{ title = staff.TITLE_SHORT_NAME_TH }

    const CompareFormControl = {
        FULL_NAME: new FormControl(title+staff.TITLE_NAME_TH || ''+" "+staff.LAST_NAME || ''),
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
        CONTRIBUTOR_ID: new FormControl(86),
        IS_ACTIVE: new FormControl(1)
    }
    return this.fb.group(CompareFormControl);
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

  getTimeNow(d: any = new Date, isZero: any = null) {
    let h = d.getHours().toString();
    let m = d.getMinutes().toString();
    if ((+h) < 10) { h = '0' + h; }
    if ((+m) < 10) m = '0' + m;
    return h + ':' + m + '';
  }


  clickEdit(){
    this.showEditField = false;
    this.createButton  = false;
    this.printButton = false;
    this.editButton = false;
    this.deleteButton = false;
    this.saveButton = true;
    this.cancelButton = true;
    this.setForm_Collapse1();
    this.loadData1();
    this.loadData_Collapse1();
  }

  clickCancel(){
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
      this.router.navigate([`/reduction/list/`]);
    }
  })
  }

  async clickDelete(){
   await swal({
      type: 'warning',
      text: "ยืนยันการทำรายการหรือไม่" + ' ?',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: true,
      
    }).then(async (result) => {
      await this.SetDetail.getRawValue().map(async (m,i)=>{
          let param = { COMPARE_DETAIL_ID : m.COMPARE_DETAIL_ID};
          await this.reductionService.CompareDetailupdDelete("CompareDetailupdDelete",param);
          let s = i+=1;
          if(s == this.SetDetail.getRawValue().length){
            swal({
              type: 'success',
              text: "ลบข้อมูลสำเร็จ",
              confirmButtonText: 'ตกลง',
              reverseButtons: false,
            }).then(e=>{
              this.router.navigate([`${'/reduction/manage/C/'}${this.COMPARE_ID}/${this.INDICTMENT_DETAIL_ID}/${this.ARREST_ID}`]).then(e=>{
                location.reload();
              });
            });
          }
      });
    });
    
  }
  RECEIPT_CODE : any = '';
  async CAL_RECEIPT_CODE(){
    let paramiter = { RUNNING_OFFICE_CODE : this.office_code , RUNNING_TABLE:"OPS_COMPARE_DETAIL"};

    let res = await this.reductionService.TransactionRunninggetByCon("TransactionRunninggetByCon",paramiter);
    if(res.length == 0){
      let date = new Date();
      let year = (date.getFullYear()+543).toString();
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
      let re = await this.reductionService.TransactionRunninginsAll("TransactionRunninginsAll",para);
      if(re.IsSuccess == "True"){
        let paramiter = { RUNNING_OFFICE_CODE : this.office_code , RUNNING_TABLE:"OPS_COMPARE_DETAIL"};
        let res = await this.reductionService.TransactionRunninggetByCon("TransactionRunninggetByCon",paramiter);
        if(res[0].RUNNING_NO.toString().length == 1){
          this.RECEIPT_CODE = res[0].RUNNING_YEAR+'0000'+res[0].RUNNING_NO.toString();
        }else if(res[0].RUNNING_NO.toString().length == 2){
          this.RECEIPT_CODE = res[0].RUNNING_YEAR+'000'+res[0].RUNNING_NO.toString();
        }else if(res[0].RUNNING_NO.toString().length == 3){
          this.RECEIPT_CODE = res[0].RUNNING_YEAR+'00'+res[0].RUNNING_NO.toString();
        }else if(res[0].RUNNING_NO.toString().length == 4){
          this.RECEIPT_CODE = res[0].RUNNING_YEAR+'0'+res[0].RUNNING_NO.toString();
        }else if(res[0].RUNNING_NO.toString().length == 5){
          this.RECEIPT_CODE = res[0].RUNNING_YEAR+res[0].RUNNING_NO.toString();
        }
      }
    }else{
      let RUNNING_ID = { RUNNING_ID : res[0].RUNNING_ID };
      let re = await this.reductionService.TransactionRunningupdByCon("TransactionRunningupdByCon",RUNNING_ID);
      if(re.IsSuccess == "True"){
        let paramiter = { RUNNING_OFFICE_CODE : this.office_code , RUNNING_TABLE:"OPS_COMPARE_DETAIL"};
        let res = await this.reductionService.TransactionRunninggetByCon("TransactionRunninggetByCon",paramiter);
        if(res[0].RUNNING_NO.toString().length == 1){
          this.RECEIPT_CODE = res[0].RUNNING_YEAR+'0000'+res[0].RUNNING_NO.toString();
        }else if(res[0].RUNNING_NO.toString().length == 2){
          this.RECEIPT_CODE = res[0].RUNNING_YEAR+'000'+res[0].RUNNING_NO.toString();
        }else if(res[0].RUNNING_NO.toString().length == 3){
          this.RECEIPT_CODE = res[0].RUNNING_YEAR+'00'+res[0].RUNNING_NO.toString();
        }else if(res[0].RUNNING_NO.toString().length == 4){
          this.RECEIPT_CODE = res[0].RUNNING_YEAR+'0'+res[0].RUNNING_NO.toString();
        }else if(res[0].RUNNING_NO.toString().length == 5){
          this.RECEIPT_CODE = res[0].RUNNING_YEAR+res[0].RUNNING_NO.toString();
        }
      }    
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////clickSave////////////////////////////////////////////////////////////////////////////
  async clickSave(){
    await this.CAL_RECEIPT_CODE();

    var CREATE_DATE = this.getDatepiker(this.toDatePickerFormat(new Date()), this.getTimeNow(new Date()));

    this.SetDetail.getRawValue().map(m=>{
      var CompareDetail : any;
      let COMMAND_DATE;if(m.COMMAND_DATE == '' || m.COMMAND_DATE == null){ COMMAND_DATE = ''}else{ COMMAND_DATE = m.COMMAND_DATE+'.00'};
      let APPROVE_DATE;if(m.APPROVE_DATE == '' || m.APPROVE_DATE == null){ APPROVE_DATE = ''}else{ APPROVE_DATE = m.APPROVE_DATE+'.00'};
      let PAYMENT_FINE_DUE_DATE;if(m.PAYMENT_FINE_DUE_DATE == '' || m.PAYMENT_FINE_DUE_DATE == null){ PAYMENT_FINE_DUE_DATE = ''}else{ PAYMENT_FINE_DUE_DATE = m.PAYMENT_FINE_DUE_DATE+'.00'};
      let PAYMENT_VAT_DUE_DATE;if(m.PAYMENT_VAT_DUE_DATE == '' || m.PAYMENT_VAT_DUE_DATE == null){ PAYMENT_VAT_DUE_DATE = ''}else{ PAYMENT_VAT_DUE_DATE = m.PAYMENT_VAT_DUE_DATE+'.00'};
      
      if(m.IS_DOWN == 0 && m.IS_UP == 0){
        // console.log("nomal CompareDetail : ");
      }else if(m.IS_DOWN == 1){
        CompareDetail = {
          COMPARE_DETAIL_ID: "",
          COMPARE_MAPPING_ID: m.COMPARE_MAPPING_ID,
          RECEIPT_OFFICE_ID: m.RECEIPT_OFFICE_ID || '',
          APPROVE_OFFICE_ID: m.APPROVE_OFFICE_ID || '',
          MISTREAT_NO: m.MISTREAT_NO || '',
          OLD_PAYMENT_FINE: m.PAYMENT_FINE || '',
          PAYMENT_FINE: m.PIPE_PAYMENT_FINE,
          DIFFERENCE_PAYMENT_FINE: m.DIFFERENCE_PAYMENT_FINE || '',
          TREASURY_MONEY: m.TREASURY_MONEY,
          BRIBE_MONEY: m.BRIBE_MONEY,
          REWARD_MONEY: m.REWARD_MONEY,
          PAYMENT_FINE_DUE_DATE: PAYMENT_FINE_DUE_DATE,
          PAYMENT_VAT_DUE_DATE: PAYMENT_VAT_DUE_DATE,
          INSURANCE: m.INSURANCE || '',
          GAURANTEE: m.GAURANTEE || '',
          PAYMENT_DATE: CREATE_DATE,
          RECEIPT_TYPE: m.RECEIPT_TYPE || '',
          RECEIPT_BOOK_NO: m.RECEIPT_BOOK_NO || '',
          RECEIPT_NO: m.RECEIPT_NO || '',
          RECEIPT_OFFICE_CODE: m.PAYMENT_OFFICE_CODE || '',
          RECEIPT_OFFICE_NAME: m.PAYMENT_OFFICE_NAME || '',
          APPROVE_OFFICE_CODE: m.APPROVE_OFFICE_CODE || '',
          APPROVE_OFFICE_NAME: m.APPROVE_OFFICE_NAME || '',
          APPROVE_DATE: APPROVE_DATE,
          APPROVE_TYPE: m.APPROVE_TYPE || '',
          COMMAND_NO: m.COMMAND_NO || '',
          COMMAND_DATE: COMMAND_DATE,
          REMARK_NOT_AGREE: m.REMARK_NOT_AGREE || '',
          REMARK_NOT_APPROVE: m.REMARK_NOT_APPROVE || '',
          FACT: m.FACT || '',
          COMPARE_REASON: m.COMPARE_REASON || '',
          ADJUST_REASON: m.REASON || '',
          COMPARE_TYPE: 0,
          IS_REQUEST: m.IS_REQUEST || '',
          IS_TEMP_RELEASE: m.IS_TEMP_RELEASE || '',
          IS_INSURANCE: m.IS_INSURANCE || '',
          IS_GAURANTEE: m.IS_GAURANTEE || '',
          IS_PAYMENT: m.IS_PAYMENT || '',
          IS_REVENUE: m.IS_REVENUE || '',
          IS_AGREE: m.IS_AGREE || '',
          IS_APPROVE: m.IS_APPROVE || '',
          IS_AUTHORITY: m.IS_AUTHORITY || '',
          IS_ACTIVE : 1,
          DID: m.DID || '',
          CompareDetailPayment : [],
          CompareDetailFine : [],
          ComparePayment : [],
          CompareStaff : []
        }
      // console.log("down CompareDetail : ",CompareDetail)
      this.set_ins(m,CompareDetail);
      }else if(m.IS_UP == 1){
        if(m.RECEIPT_TYPE == 0){
          CompareDetail = {
            COMPARE_DETAIL_ID: "",
            COMPARE_MAPPING_ID: m.COMPARE_MAPPING_ID,
            RECEIPT_OFFICE_ID: m.RECEIPT_OFFICE_ID || '',
            APPROVE_OFFICE_ID: m.APPROVE_OFFICE_ID || '',
            MISTREAT_NO: m.MISTREAT_NO || '',
            OLD_PAYMENT_FINE: m.PAYMENT_FINE || '',
            PAYMENT_FINE: m.PIPE_PAYMENT_FINE,
            DIFFERENCE_PAYMENT_FINE: m.DIFFERENCE_PAYMENT_FINE || '',
            TREASURY_MONEY: m.TREASURY_MONEY,
            BRIBE_MONEY: m.BRIBE_MONEY,
            REWARD_MONEY: m.REWARD_MONEY,
            PAYMENT_FINE_DUE_DATE: PAYMENT_FINE_DUE_DATE,
            PAYMENT_VAT_DUE_DATE: PAYMENT_VAT_DUE_DATE,
            INSURANCE: m.INSURANCE || '',
            GAURANTEE: m.GAURANTEE || '',
            PAYMENT_DATE: CREATE_DATE,
            RECEIPT_TYPE: m.RECEIPT_TYPE || '',
            RECEIPT_BOOK_NO: m.NEW_RECEIPT_BOOK_NO || '',
            RECEIPT_NO: m.NEW_RECEIPT_NO || '',
            RECEIPT_OFFICE_CODE: m.PAYMENT_OFFICE_CODE || '',
            RECEIPT_OFFICE_NAME: m.PAYMENT_OFFICE_NAME || '',
            APPROVE_OFFICE_CODE: m.APPROVE_OFFICE_CODE || '',
            APPROVE_OFFICE_NAME: m.APPROVE_OFFICE_NAME || '',
            APPROVE_DATE: APPROVE_DATE,
            APPROVE_TYPE: m.APPROVE_TYPE || '',
            COMMAND_NO: m.COMMAND_NO || '',
            COMMAND_DATE: COMMAND_DATE,
            REMARK_NOT_AGREE: m.REMARK_NOT_AGREE || '',
            REMARK_NOT_APPROVE: m.REMARK_NOT_APPROVE || '',
            FACT: m.FACT || '',
            COMPARE_REASON: m.COMPARE_REASON || '',
            ADJUST_REASON: m.REASON || '',
            COMPARE_TYPE: 2,
            IS_REQUEST: m.IS_REQUEST || '',
            IS_TEMP_RELEASE: m.IS_TEMP_RELEASE || '',
            IS_INSURANCE: m.IS_INSURANCE || '',
            IS_GAURANTEE: m.IS_GAURANTEE || '',
            IS_PAYMENT: m.IS_PAYMENT || '',
            IS_REVENUE: m.IS_REVENUE || '',
            IS_AGREE: m.IS_AGREE || '',
            IS_APPROVE: m.IS_APPROVE || '',
            IS_AUTHORITY: m.IS_AUTHORITY || '',
            IS_ACTIVE : 1,
            DID: m.DID || '',
            CompareDetailPayment : this.set_CompareDetailPayment(m,this.AdjustCompareDetailPayment.getRawValue()),
            CompareDetailFine : this.set_CompareDetailFine(m,this.AdjustCompareDetailFine.getRawValue()),
            ComparePayment : this.set_ComparePayment(m,this.AdjustComparePayment.getRawValue()),
            CompareStaff : []
          }
        }else{
          CompareDetail = {
            COMPARE_DETAIL_ID: "",
            COMPARE_MAPPING_ID: m.COMPARE_MAPPING_ID,
            RECEIPT_OFFICE_ID: m.RECEIPT_OFFICE_ID || '',
            APPROVE_OFFICE_ID: m.APPROVE_OFFICE_ID || '',
            MISTREAT_NO: m.MISTREAT_NO || '',
            OLD_PAYMENT_FINE: m.PAYMENT_FINE || '',
            PAYMENT_FINE: m.PIPE_PAYMENT_FINE,
            DIFFERENCE_PAYMENT_FINE: m.DIFFERENCE_PAYMENT_FINE || '',
            TREASURY_MONEY: m.TREASURY_MONEY,
            BRIBE_MONEY: m.BRIBE_MONEY,
            REWARD_MONEY: m.REWARD_MONEY,
            PAYMENT_FINE_DUE_DATE: PAYMENT_FINE_DUE_DATE,
            PAYMENT_VAT_DUE_DATE: PAYMENT_VAT_DUE_DATE,
            INSURANCE: m.INSURANCE || '',
            GAURANTEE: m.GAURANTEE || '',
            PAYMENT_DATE: CREATE_DATE,
            RECEIPT_TYPE: m.RECEIPT_TYPE || '',
            RECEIPT_BOOK_NO: '',
            RECEIPT_NO: this.RECEIPT_CODE || '',
            RECEIPT_OFFICE_CODE: m.PAYMENT_OFFICE_CODE || '',
            RECEIPT_OFFICE_NAME: m.PAYMENT_OFFICE_NAME || '',
            APPROVE_OFFICE_CODE: m.APPROVE_OFFICE_CODE || '',
            APPROVE_OFFICE_NAME: m.APPROVE_OFFICE_NAME || '',
            APPROVE_DATE: APPROVE_DATE,
            APPROVE_TYPE: m.APPROVE_TYPE || '',
            COMMAND_NO: m.COMMAND_NO || '',
            COMMAND_DATE: COMMAND_DATE,
            REMARK_NOT_AGREE: m.REMARK_NOT_AGREE || '',
            REMARK_NOT_APPROVE: m.REMARK_NOT_APPROVE || '',
            FACT: m.FACT || '',
            COMPARE_REASON: m.COMPARE_REASON || '',
            ADJUST_REASON: m.REASON || '',
            COMPARE_TYPE: 2,
            IS_REQUEST: m.IS_REQUEST || '',
            IS_TEMP_RELEASE: m.IS_TEMP_RELEASE || '',
            IS_INSURANCE: m.IS_INSURANCE || '',
            IS_GAURANTEE: m.IS_GAURANTEE || '',
            IS_PAYMENT: m.IS_PAYMENT || '',
            IS_REVENUE: m.IS_REVENUE || '',
            IS_AGREE: m.IS_AGREE || '',
            IS_APPROVE: m.IS_APPROVE || '',
            IS_AUTHORITY: m.IS_AUTHORITY || '',
            IS_ACTIVE : 1,
            DID: m.DID || '',
            CompareDetailPayment : this.set_CompareDetailPayment(m,this.AdjustCompareDetailPayment.getRawValue()),
            CompareDetailFine : this.set_CompareDetailFine(m,this.AdjustCompareDetailFine.getRawValue()),
            ComparePayment : this.set_ComparePayment(m,this.AdjustComparePayment.getRawValue()),
            CompareStaff : []
          }
        }
        
      // console.log("up CompareDetail : ",CompareDetail)
      this.set_ins(m,CompareDetail);
      }
    })

  }

  set_CompareDetailPayment(list,value) {
    console.log(list.COMPARE_DETAIL_ID)
    var set = [];
      var payment = list.PAYMENT_DETAIL;
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

  set_CompareDetailFine(m,list) {
    var set = [];
    var product = list;
    for (var i = 0; i < product.length; i++) {
      if(m.COMPARE_DETAIL_ID == product[i].COMPARE_DETAIL_ID){
      set.push({
        FINE_ID: "",
        COMPARE_DETAIL_ID: "",
        PRODUCT_ID: list[i].PRODUCT_ID ,
        FINE_RATE: list[i].FINE_RATE ,
        VAT: list[i].VAT ,
        FINE: list[i].FINE ,
        NET_FINE: list[i].NET_FINE ,
        OLD_PAYMENT_FINE: list[i].OLD_PAYMENT_FINE ,
        PAYMENT_FINE: list[i].PAYMENT_FINE ,
        DIFFERENCE_PAYMENT_FINE: list[i].DIFFERENCE_PAYMENT_FINE ,
        TREASURY_MONEY: list[i].TREASURY_MONEY ,
        BRIBE_MONEY: list[i].BRIBE_MONEY ,
        REWARD_MONEY: list[i].REWARD_MONEY ,
        IS_ACTIVE: 1,
        PRODUCT_GROUP_NAME: list[i].PRODUCT_GROUP_NAME ,
        PRODUCT_CATEGORY_NAME: list[i].PRODUCT_CATEGORY_NAME ,
        PRODUCT_TYPE_NAME: list[i].PRODUCT_TYPE_NAME ,
        PRODUCT_SUBTYPE_NAME: list[i].PRODUCT_SUBTYPE_NAME ,
        PRODUCT_SUBSETTYPE_NAME: list[i].PRODUCT_SUBSETTYPE_NAME ,
        PRODUCT_BRAND_NAME_TH: list[i].PRODUCT_BRAND_NAME_TH ,
        PRODUCT_BRAND_NAME_EN: list[i].PRODUCT_BRAND_NAME_EN ,
        PRODUCT_SUBBRAND_NAME_TH: list[i].PRODUCT_SUBBRAND_NAME_TH ,
        PRODUCT_SUBBRAND_NAME_EN: list[i].PRODUCT_SUBBRAND_NAME_EN ,
        PRODUCT_MODEL_NAME_TH: list[i].PRODUCT_MODEL_NAME_TH ,
        PRODUCT_MODEL_NAME_EN: list[i].PRODUCT_MODEL_NAME_EN ,
        SIZES: list[i].SIZES ,
        SIZES_UNIT: list[i].SIZES_UNIT ,
        QUANTITY: list[i].QUANTITY ,
        QUANTITY_UNIT: list[i].QUANTITY_UNIT ,
        VOLUMN: list[i].VOLUMN ,
        VOLUMN_UNIT: list[i]. VOLUMN_UNIT,
        PRODUCT_DESC: list[i]. PRODUCT_DESC
      });}
    }
    return set
  }

  set_ComparePayment(m,list) {
    var set = [];
    var PAYMENT_DATE = this.getDatepiker(this.toDatePickerFormat(new Date()), this.getTimeNow(new Date()));
    
      if (this.NOTICE_ID == 0) {
        
      var s = m.PAYMENT_DETAIL;
      for (var i = 0; i < s.length; i++) {
        set.push({
          PAYMENT_ID: "",
          LAWSUIT_DETAIL_ID: "",
          COMPARE_DETAIL_ID: "",
          FINE_TYPE: 1,
          FINE: s[i].PAYMENT_FINE,
          PAYMENT_PERIOD_NO: 0,
          PAYMENT_DATE: PAYMENT_DATE,
          IS_REQUEST_REWARD: 0,
          IS_ACTIVE: 1,
          PAYMENT_CHANNEL: s[i].PAYMENT_TYPE,
          PAYMENT_BANK: s[i].PAYMENT_BANK,
          PAYMENT_REF_NO: s[i].REFFERENCE_NO,
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
        var s = m.PAYMENT_DETAIL;
        for (var i = 0; i < s.length; i++) {
          set.push({
            PAYMENT_ID: "",
            LAWSUIT_DETAIL_ID: "",
            COMPARE_DETAIL_ID: "",
            FINE_TYPE: 1,
            FINE: s[i].PAYMENT_FINE,
            PAYMENT_PERIOD_NO: 0,
            PAYMENT_DATE: PAYMENT_DATE,
            IS_REQUEST_REWARD: 0,
            IS_ACTIVE: 1,
            PAYMENT_CHANNEL: s[i].PAYMENT_TYPE,
            PAYMENT_BANK: s[i].PAYMENT_BANK,
            PAYMENT_REF_NO: s[i].REFFERENCE_NO,
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

  set_ins(m,list) {
    this.reductionService.CompareDetailinsAll("CompareDetailinsAll",list).then(res=>{
      console.log("CompareDetailinsAll : ",res);
      if(res.IsSuccess == "True"){
        let params =  this.set_CompareStaff(m.setStaff,this.COMPARE_ID,res.COMPARE_DETAIL_ID)
        this.reductionService.CompareDetailStaffinsAll("CompareDetailStaffinsAll",params).then(list=>{
          console.log("CompareDetailStaffinsAll : ",list);
          if(res.IsSuccess == "True"){
            swal({
              type: 'success',
              text: 'บันทึกข้อมูลสำเร็จ',
              confirmButtonText: 'ตกลง',
              buttonsStyling: true,
            }).then(list => {
              this.router.navigate([`/reduction/manage/${'R'}/${this.COMPARE_ID}/${this.INDICTMENT_DETAIL_ID}/${this.ARREST_ID}`]).then(e=>{
              location.reload();
              });
            });
          }else{
            swal({
              type: 'error',
              text: 'ไม่สามารถบันทึกเอกสารภายในได้',
              confirmButtonText: 'ตกลง',
              buttonsStyling: true,
            })
          }
        })
      }
    })
  }

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

  ///////////////////////////////////////////////////////////////////////// convert money //////////////////////////////////////////////////////////////////////////////////////////

  transformTotal(e,i) {

    this._IsRequestBribe = 20;
    this._IsRequestReward = 20; 
    this._IsRequestTRE = 60;
    this.e_IsRequestBribe({ target: { checked: false } });
    this.e_IsRequestReward({ target: { checked: false } });

    const a = `${e.NEW_PAYMENT_FINE}`.replace(/\,/g, "");
    const value = (parseFloat(a)).toFixed(2);
    var setValue = parseFloat(value);
    const PAYMENT_FINE = this.SetDetail.at(i).get('PAYMENT_FINE');
    const NEW_PAYMENT_FINE = this.SetDetail.at(i).get('NEW_PAYMENT_FINE');
    const OLD_PAYMENT_FINE = this.SetDetail.at(i).get('OLD_PAYMENT_FINE');
    const PIPE_PAYMENT_FINE = this.SetDetail.at(i).get('PIPE_PAYMENT_FINE');
    const DIFFERENCE_PAYMENT_FINE = this.SetDetail.at(i).get('DIFFERENCE_PAYMENT_FINE');
    const STATUS = this.SetDetail.at(i).get('STATUS');
    const BRIBE_MONEY = this.SetDetail.at(i).get("BRIBE_MONEY");
    const REWARD_MONEY = this.SetDetail.at(i).get("REWARD_MONEY");
    const TREASURY_MONEY = this.SetDetail.at(i).get("TREASURY_MONEY");

    NEW_PAYMENT_FINE.setValue(this.formatMoney(value.replace(/\,/g, "")),{emitEvent: false});

    PIPE_PAYMENT_FINE.setValue(setValue);

    if (PAYMENT_FINE.value === setValue){
      DIFFERENCE_PAYMENT_FINE.setValue(0);
      BRIBE_MONEY.setValue(this.convert_BRIBE_MONEY(0));
      REWARD_MONEY.setValue(this.convert_REWARD_MONEY(0));
      TREASURY_MONEY.setValue(this.convert_TREASURY_MONEY(0));
    }else if (PAYMENT_FINE.value >= setValue){
      DIFFERENCE_PAYMENT_FINE.setValue(PAYMENT_FINE.value - setValue);
      BRIBE_MONEY.setValue(this.convert_BRIBE_MONEY(PAYMENT_FINE.value - setValue));
      REWARD_MONEY.setValue(this.convert_REWARD_MONEY(PAYMENT_FINE.value - setValue));
      TREASURY_MONEY.setValue(this.convert_TREASURY_MONEY(PAYMENT_FINE.value - setValue));
    }else if (PAYMENT_FINE.value <= setValue){
      DIFFERENCE_PAYMENT_FINE.setValue(setValue - PAYMENT_FINE.value);
      BRIBE_MONEY.setValue(this.convert_BRIBE_MONEY(setValue - PAYMENT_FINE.value));
      REWARD_MONEY.setValue(this.convert_REWARD_MONEY(setValue - PAYMENT_FINE.value));
      TREASURY_MONEY.setValue(this.convert_TREASURY_MONEY(setValue - PAYMENT_FINE.value));
    }

    if (PAYMENT_FINE.value === setValue){
      STATUS.setValue(1)
    }else if (PAYMENT_FINE.value >= setValue){
      STATUS.setValue(2)
    }else if (PAYMENT_FINE.value <= setValue){
      STATUS.setValue(3)
    }

  }

  formatMoney(value) {
    // console.log("value",value)
    const temp = `${value}`.replace(/\,/g, "");
    return this.currencyPipe.transform(temp).replace("$", "");
  }

  /////////////////////////////////////////////////////////////////////////// e_IsRequestBribe //////////////////////////////////////////////////////////////////////////////////////////
  e_IsRequestBribe(e) {
    this._CaseBribe = e.target.checked;
    if (this._CaseBribe == true && this._CaseReward == false) {
      this._IsRequestBribe = 0; this._IsRequestReward = 20; this._IsRequestTRE = 80;

      for (var i = 0; i < this.SetDetail.getRawValue().length; i++) {
          const DIFFERENCE_PAYMENT_FINE = this.SetDetail.at(i).get("DIFFERENCE_PAYMENT_FINE");
          const BRIBE_MONEY = this.SetDetail.at(i).get("BRIBE_MONEY");
          const REWARD_MONEY = this.SetDetail.at(i).get("REWARD_MONEY");
          const TREASURY_MONEY = this.SetDetail.at(i).get("TREASURY_MONEY");

          TREASURY_MONEY.setValue(
            this.convert_TREASURY_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
          REWARD_MONEY.setValue(
            this.convert_REWARD_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
          BRIBE_MONEY.setValue(
            0.00
          )

      }
    }
    else if (this._CaseBribe == false && this._CaseReward == true) {
      this._IsRequestBribe = 20; this._IsRequestReward = 0; this._IsRequestTRE = 80;


      for (var i = 0; i < this.SetDetail.getRawValue().length; i++) {
        const DIFFERENCE_PAYMENT_FINE = this.SetDetail.at(i).get("DIFFERENCE_PAYMENT_FINE");
        const BRIBE_MONEY = this.SetDetail.at(i).get("BRIBE_MONEY");
        const REWARD_MONEY = this.SetDetail.at(i).get("REWARD_MONEY");
        const TREASURY_MONEY = this.SetDetail.at(i).get("TREASURY_MONEY");

          TREASURY_MONEY.setValue(
            this.convert_TREASURY_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
          REWARD_MONEY.setValue(
            0.00
          )
          BRIBE_MONEY.setValue(
            this.convert_BRIBE_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
          
      }
    }

    else if (this._CaseBribe == true && this._CaseReward == true) {
      this._IsRequestBribe = 0; this._IsRequestReward = 0; this._IsRequestTRE = 100;

      for (var i = 0; i < this.SetDetail.getRawValue().length; i++) {
        const DIFFERENCE_PAYMENT_FINE = this.SetDetail.at(i).get("DIFFERENCE_PAYMENT_FINE");
        const BRIBE_MONEY = this.SetDetail.at(i).get("BRIBE_MONEY");
        const REWARD_MONEY = this.SetDetail.at(i).get("REWARD_MONEY");
        const TREASURY_MONEY = this.SetDetail.at(i).get("TREASURY_MONEY");

          TREASURY_MONEY.setValue(
            this.convert_TREASURY_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
          REWARD_MONEY.setValue(
            0.00
          )
          BRIBE_MONEY.setValue(
            0.00
          )
      }
    }

    else if (this._CaseBribe == false && this._CaseReward == false) {
      this._IsRequestBribe = 20; this._IsRequestReward = 20; this._IsRequestTRE = 60;

      for (var i = 0; i < this.SetDetail.getRawValue().length; i++) {
          const DIFFERENCE_PAYMENT_FINE = this.SetDetail.at(i).get("DIFFERENCE_PAYMENT_FINE");
          const BRIBE_MONEY = this.SetDetail.at(i).get("BRIBE_MONEY");
          const REWARD_MONEY = this.SetDetail.at(i).get("REWARD_MONEY");
          const TREASURY_MONEY = this.SetDetail.at(i).get("TREASURY_MONEY");


          BRIBE_MONEY.setValue(
            this.convert_BRIBE_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
          REWARD_MONEY.setValue(
            this.convert_REWARD_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
          TREASURY_MONEY.setValue(
            this.convert_TREASURY_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
      }
    }

  }

  /////////////////////////////////////////////////////////////////////////// e_IsRequestReward //////////////////////////////////////////////////////////////////////////////////////////
  e_IsRequestReward(e) {
    this._CaseReward = e.target.checked;

    if(this.NOTICE_ID == 0){
  
      if (this._CaseReward == true) {
        this._IsRequestBribe = 0; this._IsRequestReward = 0; this._IsRequestTRE = 100;
  
        for (var i = 0; i < this.SetDetail.getRawValue().length; i++) {
          const DIFFERENCE_PAYMENT_FINE = this.SetDetail.at(i).get("DIFFERENCE_PAYMENT_FINE");
          const BRIBE_MONEY = this.SetDetail.at(i).get("BRIBE_MONEY");
          const REWARD_MONEY = this.SetDetail.at(i).get("REWARD_MONEY");
          const TREASURY_MONEY = this.SetDetail.at(i).get("TREASURY_MONEY");

            TREASURY_MONEY.setValue(
              this.convert_TREASURY_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
            )
            REWARD_MONEY.setValue(
              0.00
            )
            BRIBE_MONEY.setValue(
              0.00
            )
        }
      }
  
      else if (this._CaseReward == false) {
        this._IsRequestBribe = 0; this._IsRequestReward = 20; this._IsRequestTRE = 80;

        for (var i = 0; i < this.SetDetail.getRawValue().length; i++) {
          const DIFFERENCE_PAYMENT_FINE = this.SetDetail.at(i).get("DIFFERENCE_PAYMENT_FINE");
          const BRIBE_MONEY = this.SetDetail.at(i).get("BRIBE_MONEY");
          const REWARD_MONEY = this.SetDetail.at(i).get("REWARD_MONEY");
          const TREASURY_MONEY = this.SetDetail.at(i).get("TREASURY_MONEY");

  
            TREASURY_MONEY.setValue(
              this.convert_TREASURY_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))+ this.convert_BRIBE_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
            )
            REWARD_MONEY.setValue(
              this.convert_REWARD_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
            )
            BRIBE_MONEY.setValue(
              0.00
            )
        }
      }
    }else{
      if (this._CaseBribe == true && this._CaseReward == false) {
      this._IsRequestBribe = 0; this._IsRequestReward = 20; this._IsRequestTRE = 80;

      for (var i = 0; i < this.SetDetail.getRawValue().length; i++) {
        const DIFFERENCE_PAYMENT_FINE = this.SetDetail.at(i).get("DIFFERENCE_PAYMENT_FINE");
        const BRIBE_MONEY = this.SetDetail.at(i).get("BRIBE_MONEY");
        const REWARD_MONEY = this.SetDetail.at(i).get("REWARD_MONEY");
        const TREASURY_MONEY = this.SetDetail.at(i).get("TREASURY_MONEY");

          TREASURY_MONEY.setValue(
            this.convert_TREASURY_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
          REWARD_MONEY.setValue(
            this.convert_REWARD_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
          BRIBE_MONEY.setValue(
            0.00
          )
      }
    }

    else if (this._CaseBribe == false && this._CaseReward == true) {
      this._IsRequestBribe = 20; this._IsRequestReward = 0; this._IsRequestTRE = 80;

      for (var i = 0; i < this.SetDetail.getRawValue().length; i++) {
        const DIFFERENCE_PAYMENT_FINE = this.SetDetail.at(i).get("DIFFERENCE_PAYMENT_FINE");
        const BRIBE_MONEY = this.SetDetail.at(i).get("BRIBE_MONEY");
        const REWARD_MONEY = this.SetDetail.at(i).get("REWARD_MONEY");
        const TREASURY_MONEY = this.SetDetail.at(i).get("TREASURY_MONEY");

          TREASURY_MONEY.setValue(
            this.convert_TREASURY_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
          REWARD_MONEY.setValue(
            0.00
          )
          BRIBE_MONEY.setValue(
            this.convert_BRIBE_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
      }
    }

    else if (this._CaseBribe == true && this._CaseReward == true) {
      this._IsRequestBribe = 0; this._IsRequestReward = 0; this._IsRequestTRE = 100;

      for (var i = 0; i < this.SetDetail.getRawValue().length; i++) {
        const DIFFERENCE_PAYMENT_FINE = this.SetDetail.at(i).get("DIFFERENCE_PAYMENT_FINE");
        const BRIBE_MONEY = this.SetDetail.at(i).get("BRIBE_MONEY");
        const REWARD_MONEY = this.SetDetail.at(i).get("REWARD_MONEY");
        const TREASURY_MONEY = this.SetDetail.at(i).get("TREASURY_MONEY");

          TREASURY_MONEY.setValue(
            this.convert_TREASURY_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value)) + this.convert_REWARD_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value)) + this.convert_BRIBE_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
          REWARD_MONEY.setValue(
            0.00
          )
          BRIBE_MONEY.setValue(
            0.00
          )
      }
    }

    else if (this._CaseBribe == false && this._CaseReward == false) {
      this._IsRequestBribe = 20; this._IsRequestReward = 20; this._IsRequestTRE = 60;
      for (var i = 0; i < this.SetDetail.getRawValue().length; i++) {
        const DIFFERENCE_PAYMENT_FINE = this.SetDetail.at(i).get("DIFFERENCE_PAYMENT_FINE");
        const BRIBE_MONEY = this.SetDetail.at(i).get("BRIBE_MONEY");
        const REWARD_MONEY = this.SetDetail.at(i).get("REWARD_MONEY");
        const TREASURY_MONEY = this.SetDetail.at(i).get("TREASURY_MONEY");

          BRIBE_MONEY.setValue(
            this.convert_BRIBE_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
          REWARD_MONEY.setValue(
            this.convert_REWARD_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
          TREASURY_MONEY.setValue(
            this.convert_TREASURY_MONEY(parseFloat(DIFFERENCE_PAYMENT_FINE.value))
          )
      }
    }
    }

  }

  convert_Calculator(m) {
    const temp = `${m}`.replace(/\,/g, "");
    return this.currencyPipe.transform(temp).replace("$", "");
  }
  ///////////////////////////////////////////////////////////////////////// calulate //////////////////////////////////////////////////////////////////////////////////////////
  
  calTotal_Difference() : number{
    var total = 0;
    this.SetDetail.value.map(f=>{
      total += f.DIFFERENCE_PAYMENT_FINE;
    });
    return total;
  }

  calTotal_PAYMENT_FINE() : number{
    var total = 0;
    this.SetDetail.value.map(f=>{
      total += f.PAYMENT_FINE;
    });
    return total;
  }

  calTotal_BRIBE_MONEY() : number{
    var total = 0;
    this.SetDetail.value.map(f=>{
      total += f.BRIBE_MONEY;
    });
    return total;
  }

  calTotal_REWARD_MONEY() : number{
    var total = 0;
    this.SetDetail.value.map(f=>{
      total += f.REWARD_MONEY;
    });
    return total;
  }

  calTotal_TREASURY_MONEY() : number{
    var total = 0;
    this.SetDetail.value.map(f=>{
      total += f.TREASURY_MONEY;
    });
    return total;
  }

  calTotal_NEW_PAYMENT_FINE() : number{
    var total = 0;
    this.SetDetail.value.map(f=>{
      total += f.PIPE_PAYMENT_FINE;
    });
    return total;
  }

  convert_BRIBE_MONEY(m) : number{
    var money = m;
    var BRIBE_MONEY = money*0.2;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money*0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money*0.6;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY+REWARD_MONEY)+TREASURY_MONEY;
    var total = (total_BRIBE_MONEY+total_REWARD_MONEY)+total_TREASURY_MONEY;
    var cal = 0;

    if (total > money){
      cal = total-money;
      var a1 = total_BRIBE_MONEY-cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY+total_REWARD_MONEY)+total_TREASURY_MONEY;
      return total_BRIBE_MONEY;
    }else if (total < money){
      cal = money-total;
      var a1 = total_REWARD_MONEY+cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY+total_REWARD_MONEY)+total_TREASURY_MONEY;
      return total_BRIBE_MONEY;
    }else{
      return total_BRIBE_MONEY;
    }
  }

  convert_REWARD_MONEY(m) : number{
    var money = m;
    var BRIBE_MONEY = money*0.2;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money*0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money*0.6;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY+REWARD_MONEY)+TREASURY_MONEY;
    var total = (total_BRIBE_MONEY+total_REWARD_MONEY)+total_TREASURY_MONEY;
    var cal = 0;

    if (total > money){
      cal = total-money;
      var a1 = total_BRIBE_MONEY-cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY+total_REWARD_MONEY)+total_TREASURY_MONEY;
      return total_REWARD_MONEY;
    }else if (total < money){
      cal = money-total;
      var a1 = total_REWARD_MONEY+cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY+total_REWARD_MONEY)+total_TREASURY_MONEY;
      return total_REWARD_MONEY;
    }else{
      return total_REWARD_MONEY;
    }
  }

  convert_TREASURY_MONEY(m) : number{
    var money = m;
    var BRIBE_MONEY = money*0.2;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money*0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money*0.6;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY+REWARD_MONEY)+TREASURY_MONEY;
    var total = (total_BRIBE_MONEY+total_REWARD_MONEY)+total_TREASURY_MONEY;
    var cal = 0;

    if (total > money){
      cal = total-money;
      var a1 = total_BRIBE_MONEY-cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY+total_REWARD_MONEY)+total_TREASURY_MONEY;
      return total_TREASURY_MONEY;
    }else if (total < money){
      cal = money-total;
      var a1 = total_REWARD_MONEY+cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY+total_REWARD_MONEY)+total_TREASURY_MONEY;
      return total_TREASURY_MONEY;
    }else{
      return total_TREASURY_MONEY;
    }
  }

  /////////////////////////////////////////////////////////////////////////// ILG60_O_08_00_02_01 //////////////////////////////////////////////////////////////////////////////////////////

  ILG60_O_08_00_02_01(item,index){
    console.log("item",item,index)
    this.Return_ILG60_O_08_00_02_01(
      item,index,this.BANKING,this.COMPARE_ID,this.COMPARE_DETAIL_ID,this.showEditField,this.SetDetail.getRawValue()
    ).pipe( take(1) // take() manages unsubscription for us
    ).subscribe(result => {this.Result_ILG60_O_08_00_02_01(result,index);});
  };

  Return_ILG60_O_08_00_02_01(
    item,index,BANKING,COMPARE_ID,COMPARE_DETAIL_ID,showEditField,SetDetail
  ): Observable<string> {
    const modal = this.ngbModal.open(ILG60_O_08_00_02_01, { size: 'lg', centered: true });

    modal.componentInstance.item = item;
    modal.componentInstance.index = index;
    modal.componentInstance.BANKING = BANKING;
    modal.componentInstance.COMPARE_ID = COMPARE_ID;
    modal.componentInstance.COMPARE_DETAIL_ID = COMPARE_DETAIL_ID;
    modal.componentInstance.showEditField = showEditField;
    modal.componentInstance.SetDetail = SetDetail;

    return from(modal.result).pipe(
      catchError(error => {
        console.warn(error);
        return of(undefined);
      })
    );
  }

  Result_ILG60_O_08_00_02_01(result,index){
    console.log("result : ",result)

    if (result == null){
      console.log("cancel");
    }
    else if (result == 'dismiss'){
      console.log("dissmiss");
    let PAYMENT_DETAIL = this.SetDetail.at(index).get("PAYMENT_DETAIL") as FormArray;
    let setStaff = this.SetDetail.at(index).get("setStaff") as FormArray;
    if (PAYMENT_DETAIL.value.length !== 0) {
      for(var i=0;i<PAYMENT_DETAIL.value.length;i++){
        PAYMENT_DETAIL.removeAt(i);
      }
      for(var i=0;i<setStaff.value.length;i++){
        setStaff.removeAt(i);
      }
    }
      this.SetDetail.at(index).patchValue({
        NEW_RECEIPT_BOOK_NO : '',
        NEW_RECEIPT_NO : '',
        NEW_RECEIPT : '',
        REASON : '',
        IS_UP : 0
      });
      
    }else{
    let PAYMENT_DETAIL = this.SetDetail.at(index).get("PAYMENT_DETAIL") as FormArray;
    let setStaff = this.SetDetail.at(index).get("setStaff") as FormArray;
    if (PAYMENT_DETAIL.value.length !== 0) {
      for(var i=0;i<PAYMENT_DETAIL.value.length;i++){
        PAYMENT_DETAIL.removeAt(i);
      }
    }
    if (setStaff.value.length !== 0) {
      for(var i=0;i<setStaff.value.length;i++){
        setStaff.removeAt(i);
      }
    }
    this.SetDetail.at(index).get("NEW_RECEIPT_BOOK_NO").setValue(result.NEW_RECEIPT_BOOK_NO);
    this.SetDetail.at(index).get("NEW_RECEIPT_NO").setValue(result.NEW_RECEIPT_NO);
    if(result.RECEIPT_TYPE == 0){this.SetDetail.at(index).get("NEW_RECEIPT").setValue(`${result.NEW_RECEIPT_BOOK_NO || ''}/${result.NEW_RECEIPT_NO || ''}`);}
    else{this.SetDetail.at(index).get("NEW_RECEIPT").setValue(`${result.NEW_RECEIPT_NO || ''}`);}
    this.SetDetail.at(index).get("RECEIPT_TYPE").setValue(result.RECEIPT_TYPE);
    this.SetDetail.at(index).get("REASON").setValue(result.REASON);
    this.SetDetail.at(index).get("IS_UP").setValue(result.IS_UP);
    result.PAYMENT_DETAIL.map(m=>{PAYMENT_DETAIL.push(this.fb.group(m));});
    result.setStaff.map(m=>{setStaff.push(this.fb.group(m));});
    }
    

    console.log("this.SetDetail : ",this.SetDetail.getRawValue())
  
  }

  /////////////////////////////////////////////////////////////////////////// ILG60_O_08_00_02_02 //////////////////////////////////////////////////////////////////////////////////////////

  ILG60_O_08_00_02_02(item,index){
    console.log("item",item,index)
    this.Return_ILG60_O_08_00_02_02(
      item,index,this.COMPARE_ID,this.COMPARE_DETAIL_ID,this.showEditField
    ).pipe( take(1) // take() manages unsubscription for us
    ).subscribe(result => {this.Result_ILG60_O_08_00_02_02(result,index);});
  };

  Return_ILG60_O_08_00_02_02(
    item,index,COMPARE_ID,COMPARE_DETAIL_ID,showEditField
  ): Observable<string> {
    const modal = this.ngbModal.open(ILG60_O_08_00_02_02, { size: 'lg', centered: true });

    modal.componentInstance.item = item;
    modal.componentInstance.index = index;
    modal.componentInstance.COMPARE_ID = COMPARE_ID;
    modal.componentInstance.COMPARE_DETAIL_ID = COMPARE_DETAIL_ID;
    modal.componentInstance.showEditField = showEditField;

    return from(modal.result).pipe(
      catchError(error => {
        console.warn(error);
        return of(undefined);
      })
    );
  }

  Result_ILG60_O_08_00_02_02(result,index){
    console.log("result : ",result)
    if (result == null){
      console.log("cancel");
    }
    else if (result == 'dismiss'){
      console.log("dissmiss");
      let setStaff = this.SetDetail.at(index).get("setStaff") as FormArray;
      this.SetDetail.at(index).patchValue({
        RECEIPT : '',
        REASON : '',
        IS_DOWN : 0
      });
      for(var i=0;i<setStaff.value.length;i++){
        setStaff.removeAt(i);
      }
    }else{
    let setStaff = this.SetDetail.at(index).get("setStaff") as FormArray;
    if (setStaff.value.length !== 0) {
      for(var i=0;i<setStaff.value.length;i++){
        setStaff.removeAt(i);
      }
    }
    if(result.RECEIPT_TYPE == 0){this.SetDetail.at(index).get("RECEIPT").setValue(`${result.RECEIPT_BOOK_NO || ''}/${result.RECEIPT_NO || ''}`); }
    else{this.SetDetail.at(index).get("RECEIPT").setValue(`${result.RECEIPT_NO || ''}`);}

    
    this.SetDetail.at(index).get("REASON").setValue(result.REASON);
    this.SetDetail.at(index).get("IS_DOWN").setValue(result.IS_DOWN);
    result.setStaff.map(m=>{setStaff.push(this.fb.group(m));});
    }
    console.log("this.SetDetail : ",this.SetDetail.getRawValue())
  
  }

  ///////////////////////////////////////////////////////////////////////// toggleCollapse //////////////////////////////////////////////////////////////////////////////////////////
  collapse1 = new BehaviorSubject<Boolean>(true);
  collapse2 = new BehaviorSubject<Boolean>(true);
  collapse3 = new BehaviorSubject<Boolean>(false);
  toggleCollapse(event: BehaviorSubject<Boolean>): void {if (event.getValue()) {event.next(false);} else {event.next(true);}}


  ///////////////////////////////////////////////////////////////////////// document //////////////////////////////////////////////////////////////////////////////////////////
  fileList: Document[] = []
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
    if (!doc.DOCUMENT_ID) {
      this.fileList.splice(i, 1);
      return;
    }
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
        // this.preLoaderService.setShowPreloader(true);
        // this.lawsuitService.DocumentupdDelete({ DOCUMENT_ID: doc.DOCUMENT_ID })
        //   .subscribe(x => {
        //     let iSuccess: any;
        //     iSuccess = x;
        //     if (iSuccess.IsSuccess === "True") {
        //       Swal({
        //         title: '',
        //         text: Message.delComplete,
        //         type: 'success',
        //         confirmButtonColor: '#3085d6',
        //         confirmButtonText: 'ตกลง'
        //       })
        //       this.fileList.splice(i, 1);
        //       this.preLoaderService.setShowPreloader(false);
        //     } else {
        //       Swal({
        //         title: '',
        //         text: Message.delFail,
        //         type: 'error',
        //         confirmButtonColor: '#3085d6',
        //         confirmButtonText: 'ตกลง'
        //       })
        //       this.preLoaderService.setShowPreloader(false);
        //     }
        //   });
      }
    })
  }

  DownloadItem(item) {
    this.preloader.setShowPreloader(true);
    this.reductionService.downloadFile(item.DOCUMENT_ID)
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
    console.log("fileList : ",this.fileList)
  }

  // async testsavedoc(){
  // await this.fileList.map(async doc => {
  //         if (doc.IsNewItem) {
  //           const formData = new FormData();
  //           formData.append('FILE', doc.FILE);
  //           formData.append('DOCUMENT_NAME', doc.DOCUMENT_NAME);
  //           formData.append('DOCUMENT_OLD_NAME', doc.DOCUMENT_OLD_NAME);
  //           formData.append('DOCUMENT_TYPE', '6');
  //           formData.append('FOLDER', doc.FOLDER);
  //           formData.append('REFERENCE_CODE', '402');

  //           console.log("this.compare_ID : ",this.compare_ID)
  //           console.log("this.mode : ",this.mode)
  //           console.log("formData : ",formData)
  //           let result = await this.fineService.DocumentinsAll(formData);
  //           console.log("result : ",result)
  //         }
  //       });
  // }

  // testdeldoc(){
  // const DelDoc = this.DelDoc;
  //       for (let i in DelDoc) {
  //         let l = DelDoc[i]
  //         if (l)
  //           this.fineService.DocumentupdDelete({ DOCUMENT_ID: l.DOCUMENT_ID }).subscribe(isSuccess => { console.log("result : ",isSuccess) })
  //       }
  // }

  ngOnDestroy() {
  }

}
