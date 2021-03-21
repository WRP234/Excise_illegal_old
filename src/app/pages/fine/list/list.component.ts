import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { FineService } from '../fine.service';
import { Compare } from '../compare';
import { pagination } from '../../../config/pagination';
import { Message } from '../../../config/message';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { SidebarService } from 'app/shared/sidebar/sidebar.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import swal from 'sweetalert2';
import { async } from '@angular/core/testing';
import { Observable, of, generate } from 'rxjs';
import { MasOfficeModel, MasOfficeModel_New } from '../../../models/mas-office.model';
import { MainMasterService } from '../../../services/main-master.service';
import { FormGroup, FormControl, NgForm, FormArray, FormBuilder, FormControlName, Form, ValidatorFn, Validators } from '@angular/forms';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { toLocalShort, setZero } from 'app/config/dateFormat';
// import { toDatePickerFormat ,getDatepiker , noYear,conditionDateFrom , conditionDatePikerFrom, conditionDateTo, conditionDatePikerTo } from './conditionDatePiker';

@Component({

  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  mas_office: any;
  office_name: any;
  show_office: boolean = true;
  advSearch: any;
  Compare = [];
  CompareList = [];
  paginage = pagination;
  getConAdvSub: any;
  getConKeySub: any;

  myDatePickerOccurrenceFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerOccurrenceToOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerLawsuitFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerLawsuitToOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerReceiveFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerReceiveToOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerCompareFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerCompareToOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  typeheadOffice = new Array<MasOfficeModel_New>();
  constructor(
    private _router: Router,
    private navService: NavigationService,
    private fineService: FineService,
    private preLoaderService: PreloaderService,
    private sidebarService: SidebarService,
    private mainMasterService: MainMasterService,
    private fb: FormBuilder,
  ) {
    // set false
    this.navService.setEditButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setPrintButton(false);
    this.navService.setSaveButton(false);
    this.navService.setCancelButton(false);
    this.navService.setNextPageButton(false);
    // set true
    this.navService.setSearchBar(false);
    this.navService.setSearchBar(true);
    this.navService.setNewButton(false);
    this.advSearch = true;
  }

  async ngOnInit() {
    this.preLoaderService.setShowPreloader(true);
    this.myDatePickerOccurrenceFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerOccurrenceToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerLawsuitFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerLawsuitToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerReceiveFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerReceiveToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerCompareFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerCompareToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.paginage.TotalItems = 0;
    this.sidebarService.setVersion('0.0.0.58');
    localStorage.setItem('programcode', 'ILG60-06-00');

    const offCode = localStorage.getItem("officeCode");
    const offname = localStorage.getItem("officeShortName");
    const staff = JSON.parse(localStorage.getItem("staffInfo"));

    // this.office_name = staff.OPERATION_OFFICE_NAME;
    this.office_name = offname;

    var officecode = "";
    officecode = offCode;

    var nums1 = officecode.charAt(0);
    var nums2 = officecode.charAt(1);
    var nums3 = officecode.charAt(2);
    var nums4 = officecode.charAt(3);
    var nums5 = officecode.charAt(4);
    var nums6 = officecode.charAt(5);

    //สนง
    var first2 = nums1 + nums2;
    if (first2 == "00") {
      this.show_office = false;
    } else {
      this.show_office = true;
    }

    // console.log('+++++++++++++++++++++++',offCode)
    this.mas_office = offCode;

    var Textsearch = { Textsearch: '' };
    var set = [];
    this.fineService.getByKeyword(Textsearch).subscribe(list => {
      var map = [];
      map = list
      map.map(m => {
        if (m.COMPARE_ID == 0) {
          set.push(m)
          // console.log(set)
        }
      })
      this.onSearchComplete(set)
      this.preLoaderService.setShowPreloader(false);
    });
  }

  ngOnDestroy(): void { }

  async onSearch(Textsearch: any) {
    this.ARREST_CODE = '';
    this.ARREST_NAME = '';
    this.PERSON_NAME = '';
    this.GUILTBASE_NAME = '';
    this.SUBSECTION_NAME = '';
    this.SUBDISTRIC_NAME = '';

    this.LAWSUIT_NO = '';
    this.LAWSUIT_NO_YEAR = '';
    this.LAWSUIT_IS_OUTSIDE = '';
    this.LAWSUIT_NAME = '';
    this.LAWSUIT_TYPE = '';
    this.PROVE_NO = '';
    this.PROVE_NO_YEAR = '';
    this.PROVE_IS_OUTSIDE = '';
    this.PROVE_NAME = '';
    this.COMPARE_OFFICE_NAME = '';
    this.COMPARE_NO = '';
    this.COMPARE_NO_YEAR = '';
    this.COMPARE_IS_OUTSIDE = '';
    this.COMPARE_NAME = '';
    this.COMPARE_TYPE = '';
    this.OCCURRENCE_DATE_FROM = null;
    this.OCCURRENCE_DATE_TO = null;
    this.COMPARE_DATE_FORM = null;
    this.COMPARE_DATE_TO = null;
    this.LAWSUIT_DATE_FROM = null;
    this.LAWSUIT_DATE_TO = null;
    this.RECEIVE_DOC_DATE_FROM = null;
    this.RECEIVE_DOC_DATE_TO = null;

    this.CompareList = [];
    this.Compare = [];
    this.preLoaderService.setShowPreloader(true);
    // console.log(Textsearch);
    if (Textsearch.Textsearch == '') {
      Textsearch = { Textsearch: '' };
    }
    // console.log(Textsearch);
    var ss = Textsearch;
    this.fineService.getByKeyword(ss).subscribe(list => {
      this.onSearchComplete(list)
    });
    this.preLoaderService.setShowPreloader(false);
  }

  getDisCurrDateMyDatePicker() {
    let currentdate = new Date();
    const disCurrDate = {
      begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
      end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
    }
    return disCurrDate;
  }

  public onDateFromChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerOccurrenceToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.myDatePickerOccurrenceToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerOccurrenceFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerOccurrenceFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onLawsuitDateFromChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerLawsuitToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.myDatePickerLawsuitToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onLawsuitDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerLawsuitFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerLawsuitFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onReceiveDateFromChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerReceiveToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.myDatePickerReceiveToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onReceiveDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerReceiveFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerReceiveFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onCompareDateFromChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerCompareToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.myDatePickerCompareToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onCompareDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerCompareFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerCompareFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  //model
  OCCURRENCE_DATE_FROM: any;
  OCCURRENCE_DATE_TO: any;
  COMPARE_DATE_FORM: any;
  COMPARE_DATE_TO: any;
  LAWSUIT_DATE_FROM: any;
  LAWSUIT_DATE_TO: any;
  RECEIVE_DOC_DATE_FROM: any;
  RECEIVE_DOC_DATE_TO: any;

  public TEXT_SEARCH: any = '';
  public ARREST_CODE: any = '';
  public ARREST_NAME: any = '';
  public PERSON_NAME: any = '';
  public SUBSECTION_NAME: any = '';
  public GUILTBASE_NAME: any = '';
  public SUBDISTRIC_NAME: any = '';
  public LAWSUIT_NO: any = '';
  public LAWSUIT_NO_YEAR: any = '';
  public COMPARE_IS_OUTSIDE: any = '';
  public LAWSUIT_IS_OUTSIDE: any = '';
  public LAWSUIT_NAME: any = '';
  public LAWSUIT_TYPE: any = '';
  public PROVE_NO: any = '';
  public PROVE_NO_YEAR: any = '';
  public PROVE_NAME: any = '';
  public RECEIVE_OFFICE_NAME: any = '';
  // public PROVE_TYPE: any = '';
  public PROVE_IS_OUTSIDE: any = '';
  public COMPARE_NO: any = '';
  public COMPARE_NO_YEAR: any = '';
  public COMPARE_NAME: any = '';
  public COMPARE_OFFICE_NAME: any = '';
  public COMPARE_TYPE: any = '0';

  async onAdvSearch(form: any) {

    this.CompareList = [];
    this.Compare = [];
    let OCCURRENCE_DATE_FROM = this.conditionDateFrom(form.OCCURRENCE_DATE_FROM, form.OCCURRENCE_DATE_TO);
    this.OCCURRENCE_DATE_FROM = this.conditionDatePikerFrom(this.OCCURRENCE_DATE_FROM, this.OCCURRENCE_DATE_TO);
    let OCCURRENCE_DATE_TO = this.conditionDateTo(form.OCCURRENCE_DATE_FROM, form.OCCURRENCE_DATE_TO);
    this.OCCURRENCE_DATE_TO = this.conditionDatePikerTo(this.OCCURRENCE_DATE_FROM, this.OCCURRENCE_DATE_TO);

    let LAWSUIT_DATE_FROM = this.conditionDateFrom(form.LAWSUIT_DATE_FROM, form.LAWSUIT_DATE_TO);
    this.LAWSUIT_DATE_FROM = this.conditionDatePikerFrom(this.LAWSUIT_DATE_FROM, this.LAWSUIT_DATE_TO);
    let LAWSUIT_DATE_TO = this.conditionDateTo(form.LAWSUIT_DATE_FROM, form.LAWSUIT_DATE_TO);
    this.LAWSUIT_DATE_TO = this.conditionDatePikerTo(this.LAWSUIT_DATE_FROM, this.LAWSUIT_DATE_TO);

    let RECEIVE_DOC_DATE_FROM = this.conditionDateFrom(form.RECEIVE_DOC_DATE_FROM, form.RECEIVE_DOC_DATE_TO);
    this.RECEIVE_DOC_DATE_FROM = this.conditionDatePikerFrom(this.RECEIVE_DOC_DATE_FROM, this.RECEIVE_DOC_DATE_TO);
    let RECEIVE_DOC_DATE_TO = this.conditionDateTo(form.RECEIVE_DOC_DATE_FROM, form.RECEIVE_DOC_DATE_TO);
    this.RECEIVE_DOC_DATE_TO = this.conditionDatePikerTo(this.RECEIVE_DOC_DATE_FROM, this.RECEIVE_DOC_DATE_TO);

    let COMPARE_DATE_FROM = this.conditionDateFrom(form.COMPARE_DATE_FORM, form.COMPARE_DATE_TO);
    this.COMPARE_DATE_FORM = this.conditionDatePikerFrom(this.COMPARE_DATE_FORM, this.COMPARE_DATE_TO);
    let COMPARE_DATE_TO = this.conditionDateTo(form.COMPARE_DATE_FORM, form.COMPARE_DATE_TO);
    this.COMPARE_DATE_TO = this.conditionDatePikerTo(this.COMPARE_DATE_FORM, this.COMPARE_DATE_TO);

    let params;
    if (this.show_office == false) {
      params =
      {
        "ACCOUNT_OFFICE_CODE": this.mas_office,
        "ARREST_CODE": this.ARREST_CODE,
        "OCCURRENCE_DATE_FROM": OCCURRENCE_DATE_FROM,
        "OCCURRENCE_DATE_TO": OCCURRENCE_DATE_TO,
        "ARREST_NAME": this.ARREST_NAME,
        "LAWBREAKER_STAFF_NAME": this.PERSON_NAME,
        "GUILTBASE_NAME": this.GUILTBASE_NAME,
        "SUBSECTION_NAME": this.SUBSECTION_NAME,
        "ARREST_OFFICE_NAME": this.SUBDISTRIC_NAME,


        "LAWSUIT_NO": this.LAWSUIT_NO,
        "LAWSUIT_NO_YEAR": this.LAWSUIT_NO_YEAR,
        "LAWSUIT_IS_OUTSIDE": this.LAWSUIT_IS_OUTSIDE,
        "LAWSUIT_DATE_FROM": LAWSUIT_DATE_FROM,
        "LAWSUIT_DATE_TO": LAWSUIT_DATE_TO,
        "LAWSUIT_NAME": this.LAWSUIT_NAME,
        "LAWSUIT_TYPE": this.LAWSUIT_TYPE,

        "PROVE_NO": this.PROVE_NO,
        "PROVE_NO_YEAR": this.PROVE_NO_YEAR,
        "PROVE_IS_OUTSIDE": this.PROVE_IS_OUTSIDE,
        "PROVE_NAME": this.PROVE_NAME,
        "RECEIVE_DOC_DATE_FROM": RECEIVE_DOC_DATE_FROM,
        "RECEIVE_DOC_DATE_TO": RECEIVE_DOC_DATE_TO,
        "RECEIVE_OFFICE_NAME": "",


        "COMPARE_NO": this.COMPARE_NO,
        "COMPARE_NO_YEAR": this.COMPARE_NO_YEAR,
        "COMPARE_IS_OUTSIDE": this.COMPARE_IS_OUTSIDE,
        "COMPARE_DATE_FROM": COMPARE_DATE_FROM,
        "COMPARE_DATE_TO": COMPARE_DATE_TO,
        "COMPARE_NAME": this.COMPARE_NAME,
        "COMPARE_OFFICE_NAME": this.COMPARE_OFFICE_NAME,
        "COMPARE_STATUS": this.COMPARE_TYPE
      }
    }
    else {
      params =
      {
        "ACCOUNT_OFFICE_CODE": this.mas_office,
        "ARREST_CODE": this.ARREST_CODE,
        "OCCURRENCE_DATE_FROM": OCCURRENCE_DATE_FROM,
        "OCCURRENCE_DATE_TO": OCCURRENCE_DATE_TO,
        "ARREST_NAME": this.ARREST_NAME,
        "LAWBREAKER_STAFF_NAME": this.PERSON_NAME,
        "GUILTBASE_NAME": this.GUILTBASE_NAME,
        "SUBSECTION_NAME": this.SUBSECTION_NAME,
        "ARREST_OFFICE_NAME": this.SUBDISTRIC_NAME,


        "LAWSUIT_NO": this.LAWSUIT_NO,
        "LAWSUIT_NO_YEAR": this.LAWSUIT_NO_YEAR,
        "LAWSUIT_IS_OUTSIDE": this.LAWSUIT_IS_OUTSIDE,
        "LAWSUIT_DATE_FROM": LAWSUIT_DATE_FROM,
        "LAWSUIT_DATE_TO": LAWSUIT_DATE_TO,
        "LAWSUIT_NAME": this.LAWSUIT_NAME,
        "LAWSUIT_TYPE": this.LAWSUIT_TYPE,

        "PROVE_NO": this.PROVE_NO,
        "PROVE_NO_YEAR": this.PROVE_NO_YEAR,
        "PROVE_IS_OUTSIDE": this.PROVE_IS_OUTSIDE,
        "PROVE_NAME": this.PROVE_NAME,
        "RECEIVE_DOC_DATE_FROM": RECEIVE_DOC_DATE_FROM,
        "RECEIVE_DOC_DATE_TO": RECEIVE_DOC_DATE_TO,
        "RECEIVE_OFFICE_NAME": "",


        "COMPARE_NO": this.COMPARE_NO,
        "COMPARE_NO_YEAR": this.COMPARE_NO_YEAR,
        "COMPARE_IS_OUTSIDE": this.COMPARE_IS_OUTSIDE,
        "COMPARE_DATE_FROM": COMPARE_DATE_FROM,
        "COMPARE_DATE_TO": COMPARE_DATE_TO,
        "COMPARE_NAME": this.COMPARE_NAME,
        "COMPARE_OFFICE_NAME": "",
        "COMPARE_STATUS": this.COMPARE_TYPE
      }
    }

    this.preLoaderService.setShowPreloader(true);
    this.fineService.getByConAdv(params).subscribe(list => {
      this.onSearchComplete(list);

      this.preLoaderService.setShowPreloader(false);
    });
  }



  clearADV() {
    this.TEXT_SEARCH = '';
  }
  clearCon() {
    // this.mas_office,
    this.ARREST_CODE = '';
    this.ARREST_NAME = '';
    this.PERSON_NAME = '';
    this.GUILTBASE_NAME = '';
    this.SUBSECTION_NAME = '';
    this.SUBDISTRIC_NAME = '';

    this.LAWSUIT_NO = '';
    this.LAWSUIT_NO_YEAR = '';
    this.LAWSUIT_IS_OUTSIDE = '';
    this.LAWSUIT_NAME = '';
    this.LAWSUIT_TYPE = '';
    this.PROVE_NO = '';
    this.PROVE_NO_YEAR = '';
    this.PROVE_IS_OUTSIDE = '';
    this.PROVE_NAME = '';
    this.COMPARE_OFFICE_NAME = '';
    this.COMPARE_NO = '';
    this.COMPARE_NO_YEAR = '';
    this.COMPARE_IS_OUTSIDE = '';
    this.COMPARE_NAME = '';
    this.COMPARE_TYPE = '';
    this.OCCURRENCE_DATE_FROM = null;
    this.OCCURRENCE_DATE_TO = null;
    this.COMPARE_DATE_FORM = null;
    this.COMPARE_DATE_TO = null;
    this.LAWSUIT_DATE_FROM = null;
    this.LAWSUIT_DATE_TO = null;
    this.RECEIVE_DOC_DATE_FROM = null;
    this.RECEIVE_DOC_DATE_TO = null;
  }

  onSearchComplete(list: any[] = [],) {
    let _list = [];
    list.map(m => {
      if (m.LAWSUIT_TYPE == "1" || m.LAWSUIT_TYPE == 1) {
        if (m.IS_PROVE == 0) { _list.push(m); }
        else { if (m.PROVE_NO == null || m.PROVE_NO == '') { } else { _list.push(m) }; }
      }
    });
    if (_list.length < 1) {
      swal({
        type: 'warning',
        text: 'ไม่พบข้อมูล',
        confirmButtonText: 'ตกลง',
        buttonsStyling: true,
      })
      this.CompareList = [];
      return false;
    } else {
      var sort_date = _list.sort((a, b) => {
        return <any>new Date(b.OCCURRENCE_DATE) - <any>new Date(a.OCCURRENCE_DATE);
      });

      this.Compare = sort_date.map((item, i) => {
        item.RowsId = i + 1;

        for (let s in item.ArrestLawbreaker) {
          if (item.ArrestLawbreaker[s].TITLE_NAME_TH == 'null') {
            item.ArrestLawbreaker[s].TITLE_NAME_TH = '';
          }
          if (item.ArrestLawbreaker[s].TITLE_NAME_EN == 'null') {
            item.ArrestLawbreaker[s].TITLE_NAME_EN = '';
          }
          if (item.ArrestLawbreaker[s].TITLE_SHORT_NAME_TH == 'null') {
            item.ArrestLawbreaker[s].TITLE_SHORT_NAME_TH = '';
          }
          if (item.ArrestLawbreaker[s].TITLE_SHORT_NAME_EN == 'null') {
            item.ArrestLawbreaker[s].TITLE_SHORT_NAME_EN = '';
          }
          if (item.ArrestLawbreaker[s].FIRST_NAME == 'null') {
            item.ArrestLawbreaker[s].FIRST_NAME = '';
          }
          if (item.ArrestLawbreaker[s].MIDDLE_NAME == 'null') {
            item.ArrestLawbreaker[s].MIDDLE_NAME = '';
          }
          if (item.ArrestLawbreaker[s].LAST_NAME == 'null') {
            item.ArrestLawbreaker[s].LAST_NAME = '';
          }
          if (item.ArrestLawbreaker[s].COMPANY_NAME == 'null') {
            item.ArrestLawbreaker[s].COMPANY_NAME = '';
          }
        }
        return item;
      });

      this.CompareList = this.Compare.slice(0, 5);
      this.paginage.TotalItems = this.Compare.length;
    }
  }

  ARREST_CODE_SORTING = new BehaviorSubject<Boolean>(true);
  OCCURRENCE_DATE_SORTING = new BehaviorSubject<Boolean>(true);
  LAWSUIT_NO_SORTING = new BehaviorSubject<Boolean>(true);
  LAWSUIT_DATE_SORTING = new BehaviorSubject<Boolean>(true);
  PROVE_NO_SORTING = new BehaviorSubject<Boolean>(true);
  RECEIVE_DOC_DATE_SORTING = new BehaviorSubject<Boolean>(true);
  COMPARE_NO_SORTING = new BehaviorSubject<Boolean>(true);
  COMPARE_DATE_SORTING = new BehaviorSubject<Boolean>(true);
  Sorter(event: BehaviorSubject<Boolean>, type: string): void {
    if (event.getValue()) event.next(false); else event.next(true);

    switch (type) {
      case 'ARREST_CODE':
        if (event.getValue())
          this.Compare.sort((a, b) => {
            return <number>parseInt(b.ARREST_CODE.substring(2)) - <number>parseInt(a.ARREST_CODE.substring(2));
          });
        else
          this.Compare.sort((a, b) => {
            return <number>parseInt(a.ARREST_CODE.substring(2)) - <number>parseInt(b.ARREST_CODE.substring(2));
          });
        break;
      case 'OCCURRENCE_DATE':
        if (event.getValue())
          this.Compare.sort((a, b) => {
            return <any>new Date(b.OCCURRENCE_DATE) - <any>new Date(a.OCCURRENCE_DATE);
          });
        else
          this.Compare.sort((a, b) => {
            return <any>new Date(a.OCCURRENCE_DATE) - <any>new Date(b.OCCURRENCE_DATE);
          });
        break;
      case 'LAWSUIT_NO':
        if (event.getValue())
          this.Compare.sort((a, b) => {
            return <any>new Date(b.LAWSUIT_NO_YEAR) - <any>new Date(a.LAWSUIT_NO_YEAR)
          });
        else
          this.Compare.sort((a, b) => {
            return <any>new Date(a.LAWSUIT_NO_YEAR) - <any>new Date(b.LAWSUIT_NO_YEAR)
          });
        break;
      case 'LAWSUIT_DATE':
        if (event.getValue())
          this.Compare.sort((a, b) => {
            return <any>new Date(b.LAWSUIT_DATE) - <any>new Date(a.LAWSUIT_DATE)
          });
        else
          this.Compare.sort((a, b) => {
            return <any>new Date(a.LAWSUIT_DATE) - <any>new Date(b.LAWSUIT_DATE)
          });
        break;
      case 'PROVE_NO':
        if (event.getValue())
          this.Compare.sort((a, b) => {
            return <any>new Date(b.PROVE_NO_YEAR) - <any>new Date(a.PROVE_NO_YEAR)
          });
        else
          this.Compare.sort((a, b) => {
            return <any>new Date(a.PROVE_NO_YEAR) - <any>new Date(b.PROVE_NO_YEAR)
          });
        break;
      case 'RECEIVE_DOC_DATE':
        if (event.getValue())
          this.Compare.sort((a, b) => {
            return <any>new Date(b.RECEIVE_DOC_DATE) - <any>new Date(a.RECEIVE_DOC_DATE)
          });
        else
          this.Compare.sort((a, b) => {
            return <any>new Date(a.RECEIVE_DOC_DATE) - <any>new Date(b.RECEIVE_DOC_DATE)
          });
        break;
      case 'COMPARE_NO':
        if (event.getValue())
          this.Compare.sort((a, b) => {
            return <any>new Date(b.COMPARE_NO_YEAR) - <any>new Date(a.COMPARE_NO_YEAR)
          });
        else
          this.Compare.sort((a, b) => {
            return <any>new Date(a.COMPARE_NO_YEAR) - <any>new Date(b.COMPARE_NO_YEAR)
          });
        break;
      case 'COMPARE_DATE':
        if (event.getValue())
          this.Compare.sort((a, b) => {
            return <any>new Date(b.COMPARE_DATE) - <any>new Date(a.COMPARE_DATE)
          });
        else
          this.Compare.sort((a, b) => {
            return <any>new Date(a.COMPARE_DATE) - <any>new Date(b.COMPARE_DATE)
          });
        break;
      default:
        break;
    }
    this.reIndex();
    this.CompareList = this.Compare.slice(0, this.paginage.RowsPerPageOptions[0]);
  }

  reIndex() {
    this.Compare.map((m, i) => {
      m.RowsId = i + 1;
    })
  }


  setDateStruct(date) {
    let months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    let temp = date = new Date(date);
    let CompDate = `${temp.getUTCDate()} ${months[temp.getMonth()]} ${temp.getUTCFullYear() + 543}`;
    return CompDate;
  }

  clickView(INDICTMENT_ID: string = '0', ARREST_ID: string = '0', COMPARE_ID: string = '0') {
    try {
      this._router.navigate([`/fine/manage/${((!COMPARE_ID || COMPARE_ID == '0') ? 'C' : 'R')}/${COMPARE_ID}/${INDICTMENT_ID}/${ARREST_ID}`]);
    } catch (err) {
      alert(JSON.stringify(err));
    }
  }

  async pageChanges(event) {
    this.CompareList = await this.Compare.slice(event.startIndex - 1, event.endIndex);
  }

  collapse1 = new BehaviorSubject<Boolean>(true);

  toggleCollapse(event: BehaviorSubject<Boolean>): void {
    if (event.getValue()) { event.next(false); } else { event.next(true); }
  }
  setZero(num: number) {
    return num < 10 ? '0' + num : num;
  }

  toDatePickerFormat(d: any) {
    return { date: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }, formatted: toLocalShort(d.toString()).replace(/ /g, ' ') };
  }

  getDatepiker(d) {
    if (d.date.month < 10 && d.date.day < 10) {
      var date = d.date.year + "-0" + d.date.month + "-0" + d.date.day;
      return date;
    } else if (d.date.month < 10 && d.date.day >= 10) {
      var date = d.date.year + "-0" + d.date.month + "-" + d.date.day;
      return date;
    } else if (d.date.day < 10 && d.date.month >= 10) {
      var date = d.date.year + "-" + d.date.month + "-0" + d.date.day;
      return date;
    } else {
      var date = d.date.year + "-" + d.date.month + "-" + d.date.day;
      return date;
    }
  }

  toLocalShort(date: Date): string {
    if (!date) return null;
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const dd = new Date(date);
    return dd.toLocaleString('th-TH', options);
  }

  conditionDateFrom(dateFrom, dateTo) {
    let date;
    if (dateFrom == null || dateFrom == '') {
      if (dateTo == null || dateTo == '') {
        return date = '';
      } else {
        return date = this.getDatepiker(dateTo);
      }
    } else {
      return date = this.getDatepiker(dateFrom);
    }
  }

  conditionDatePikerFrom(dateFrom, dateTo) {
    let date;
    if (dateFrom == null || dateFrom == '') {
      if (dateTo == null || dateTo == '') {
        return date = '';
      } else {
        return date = dateTo;
      }
    } else {
      return date = dateFrom;
    }
  }

  conditionDateTo(dateFrom, dateTo) {
    let date;
    if (dateTo == null || dateTo == '') {
      if (dateFrom == null || dateFrom == '') {
        return date = '';
      } else {
        return date = this.getDatepiker(this.toDatePickerFormat(new Date()));
      }
    } else {
      return date = this.getDatepiker(dateTo);
    }
  }

  conditionDatePikerTo(dateFrom, dateTo) {
    let date;
    if (dateTo == null || dateTo == '') {
      if (dateFrom == null || dateFrom == '') {
        return date = '';
      } else {
        return date = this.toDatePickerFormat(new Date());
      }
    } else {
      return date = dateTo;
    }
  }

  noYear(year) {
    let y;
    if (year == null || year == '') {
      return y = '';
    } else {
      return y = (parseInt(year) - 543).toString();
    }
  }


  /////////////////////////////////////////////////////////////////////////// SEARCH OFFICE //////////////////////////////////////////////////////////////////////////////////////////
  searchFailed = false;
  searching = false;
  public searchOffice_ll = (text2$: Observable<string>) =>
    text2$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.fineService.MasOfficegetByCon_forSearch({ TEXT_SEARCH: term })
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          })
      )
      .do(() => this.searching = false);

}
