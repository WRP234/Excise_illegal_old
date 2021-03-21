import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportService } from '../../report.service';
import { PreloaderService } from '../../../../shared/preloader/preloader.component';
import {
  setZero, setDateMyDatepicker,
  MyDatePickerOptions,

} from 'app/config/dateFormat';
import { ActivatedRoute } from "@angular/router";
import { caseReportConfig, reportCode } from '../case-report.config'
import { async } from '@angular/core/testing';
import { IMyDateModel } from 'mydatepicker-th';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})

export class ManageComponent extends caseReportConfig implements OnInit, OnDestroy {

  tempOfficeCode: string = '';
  DepartmentAll: any[] = [];
  Area: any[] = [];
  Branch: any[] = [];
  typeNgIF: any;
  officeCode: any;

  private getDataFromListPage: any;
  private getQueryParamsFromListPage: any;

  public dateFromOption = Object.assign({}, MyDatePickerOptions);
  public dateToOption = Object.assign({}, MyDatePickerOptions);

  reportCode: string;
  reportName: string;

  constructor(private reportService: ReportService,
    private activeRoute: ActivatedRoute,
    private preLoaderService: PreloaderService) {
    super();
  }

  ngOnInit() {
    this.preLoaderService.setShowPreloader(true);

    this.dateFromOption.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.dateToOption.disableDateRanges = [this.getDisLessthanCurrDateMyDatePicker(), this.getDisCurrDateMyDatePicker()];

    this.officeCode = localStorage.getItem("officeCode");
    var nums1 = this.officeCode.charAt(0);
    var nums2 = this.officeCode.charAt(1);
    var nums3 = this.officeCode.charAt(2);
    var nums4 = this.officeCode.charAt(3);
    var nums5 = this.officeCode.charAt(4);
    var nums6 = this.officeCode.charAt(5);

    let date = new Date();
    let year = date.getFullYear();
    this.YEAR_I = year + 543;
    this.YEAR_II = year + 542;
    this.YEAR_III = year + 541;
    this._YEAR_I = year;
    this._YEAR_II = year - 1;
    this._YEAR_III = year - 2;
    this.FIRSTYEAR_I = `${this._YEAR_I}${this.MONTH_I}`;
    this.FIRSTYEAR_II = `${this._YEAR_II}${this.MONTH_I}`;
    this.FIRSTYEAR_III = `${this._YEAR_III}${this.MONTH_I}`;
    this.SECONDYEAR_I = `${this._YEAR_I}${this.MONTH_II}`;
    this.SECONDYEAR_II = `${this._YEAR_II}${this.MONTH_II}`;
    this.SECONDYEAR_III = `${this._YEAR_III}${this.MONTH_II}`;

    let Depart = `${nums1}${nums2}${'0000'}`;
    let Area = `${nums1}${nums2}${nums3}${nums4}${'00'}`;
    let Branch = `${nums1}${nums2}${nums3}${nums4}${nums5}${nums6}`;

    if (`${nums1}${nums2}${nums3}${nums4}` == `${'0007'}`) {
      this.tempOfficeCode = '0007';
      this.typeNgIF = 1;
      this.getEDOfficeDepartmentgetAll();
      this.getParamFromActiveRoute();
    } else if (`${nums3}${nums4}${nums5}${nums6}` == `${'0000'}`) {
      this.typeNgIF = 2;
      this.setDepart(Depart, Area, Branch);
      this.getParamFromActiveRoute();
    } else if (`${nums3}${nums4}` !== `${'00'}` && `${nums5}${nums6}` == `${'00'}`) {
      this.typeNgIF = 3;
      this.setArea(Depart, Area, Branch);
      this.getParamFromActiveRoute();
    } else if (`${nums3}${nums4}` !== `${'00'}` && `${nums5}${nums6}` !== `${'00'}`) {
      this.typeNgIF = 4;
      this.setBranch(Depart, Area, Branch);
      this.getParamFromActiveRoute();
    }
    this.preLoaderService.setShowPreloader(false);
  }

  MONTH: Array<any> = [
    { MONTH: 'มกราคม' },
    { MONTH: 'กุมภาพันธ์' },
    { MONTH: 'มีนาคม' },
    { MONTH: 'เมษายน' },
    { MONTH: 'พฤษภาคม' },
    { MONTH: 'มิถุนายน' },
    { MONTH: 'กรกฎาคม' },
    { MONTH: 'สิงหาคม' },
    { MONTH: 'กันยายน' },
    { MONTH: 'ตุลาคม' },
    { MONTH: 'พฤศจิกายน' },
    { MONTH: 'ธันวาคม' },
  ];

  YEAR_I: any;
  YEAR_II: any;
  YEAR_III: any;
  _YEAR_I: any;
  _YEAR_II: any;
  _YEAR_III: any;
  MONTH_I = '01';
  MONTH_II = '01';
  FIRSTYEAR_I: any;
  FIRSTYEAR_II: any;
  FIRSTYEAR_III: any;
  SECONDYEAR_I: any;
  SECONDYEAR_II: any;
  SECONDYEAR_III: any;

  setMONTH1(e) {
    if (e == 'มกราคม') { this.MONTH_I = '01'; }
    else if (e == 'กุมภาพันธ์') { this.MONTH_I = '02'; }
    else if (e == 'มีนาคม') { this.MONTH_I = '03'; }
    else if (e == 'เมษายน') { this.MONTH_I = '04'; }
    else if (e == 'พฤษภาคม') { this.MONTH_I = '05'; }
    else if (e == 'มิถุนายน') { this.MONTH_I = '06'; }
    else if (e == 'กรกฎาคม') { this.MONTH_I = '07'; }
    else if (e == 'สิงหาคม') { this.MONTH_I = '08'; }
    else if (e == 'กันยายน') { this.MONTH_I = '09'; }
    else if (e == 'ตุลาคม') { this.MONTH_I = '10'; }
    else if (e == 'พฤศจิกายน') { this.MONTH_I = '11'; }
    else if (e == 'ธันวาคม') { this.MONTH_I = '12'; }

    this.FIRSTYEAR_I = `${this._YEAR_I}${this.MONTH_I}`;
    this.FIRSTYEAR_II = `${this._YEAR_II}${this.MONTH_I}`;
    this.FIRSTYEAR_III = `${this._YEAR_III}${this.MONTH_I}`;
    this.SECONDYEAR_I = `${this._YEAR_I}${this.MONTH_II}`;
    this.SECONDYEAR_II = `${this._YEAR_II}${this.MONTH_II}`;
    this.SECONDYEAR_III = `${this._YEAR_III}${this.MONTH_II}`;

  }

  setMONTH2(e) {
    if (e == 'มกราคม') { this.MONTH_II = '01'; }
    else if (e == 'กุมภาพันธ์') { this.MONTH_II = '02'; }
    else if (e == 'มีนาคม') { this.MONTH_II = '03'; }
    else if (e == 'เมษายน') { this.MONTH_II = '04'; }
    else if (e == 'พฤษภาคม') { this.MONTH_II = '05'; }
    else if (e == 'มิถุนายน') { this.MONTH_II = '06'; }
    else if (e == 'กรกฎาคม') { this.MONTH_II = '07'; }
    else if (e == 'สิงหาคม') { this.MONTH_II = '08'; }
    else if (e == 'กันยายน') { this.MONTH_II = '09'; }
    else if (e == 'ตุลาคม') { this.MONTH_II = '10'; }
    else if (e == 'พฤศจิกายน') { this.MONTH_II = '11'; }
    else if (e == 'ธันวาคม') { this.MONTH_II = '12'; }

    this.FIRSTYEAR_I = `${this._YEAR_I}${this.MONTH_I}`;
    this.FIRSTYEAR_II = `${this._YEAR_II}${this.MONTH_I}`;
    this.FIRSTYEAR_III = `${this._YEAR_III}${this.MONTH_I}`;
    this.SECONDYEAR_I = `${this._YEAR_I}${this.MONTH_II}`;
    this.SECONDYEAR_II = `${this._YEAR_II}${this.MONTH_II}`;
    this.SECONDYEAR_III = `${this._YEAR_III}${this.MONTH_II}`;

  }

  setYEAR1(e) {
    let year = e.target.value;
    if (year.length == 4) {
      this.YEAR_I = parseInt(year);
      this.YEAR_II = parseInt(year) - 1;
      this.YEAR_III = parseInt(year) - 2;
      this._YEAR_I = parseInt(year) - 543;
      this._YEAR_II = parseInt(year) - 544;
      this._YEAR_III = parseInt(year) - 545;
      this.FIRSTYEAR_I = `${this._YEAR_I}${this.MONTH_I}`;
      this.FIRSTYEAR_II = `${this._YEAR_II}${this.MONTH_I}`;
      this.FIRSTYEAR_III = `${this._YEAR_III}${this.MONTH_I}`;
      this.SECONDYEAR_I = `${this._YEAR_I}${this.MONTH_II}`;
      this.SECONDYEAR_II = `${this._YEAR_II}${this.MONTH_II}`;
      this.SECONDYEAR_III = `${this._YEAR_III}${this.MONTH_II}`;
    } else {
      this.YEAR_I = '';
      this.YEAR_II = '';
      this.YEAR_III = '';
      this._YEAR_I = '';
      this._YEAR_II = '';
      this._YEAR_III = '';
      this.FIRSTYEAR_I = '';
      this.FIRSTYEAR_II = '';
      this.FIRSTYEAR_III = '';
      this.SECONDYEAR_I = '';
      this.SECONDYEAR_II = '';
      this.SECONDYEAR_III = '';
    }
  }

  setYEAR2(e) {
    let year = e.target.value;
    if (year.length == 4) {
      this.YEAR_I = parseInt(year) + 1;
      this.YEAR_II = parseInt(year);
      this.YEAR_III = parseInt(year) - 1;
      this._YEAR_I = parseInt(year) - 542;
      this._YEAR_II = parseInt(year) - 543;
      this._YEAR_III = parseInt(year) - 544;
      this.FIRSTYEAR_I = `${this._YEAR_I}${this.MONTH_I}`;
      this.FIRSTYEAR_II = `${this._YEAR_II}${this.MONTH_I}`;
      this.FIRSTYEAR_III = `${this._YEAR_III}${this.MONTH_I}`;
      this.SECONDYEAR_I = `${this._YEAR_I}${this.MONTH_II}`;
      this.SECONDYEAR_II = `${this._YEAR_II}${this.MONTH_II}`;
      this.SECONDYEAR_III = `${this._YEAR_III}${this.MONTH_II}`;
    } else {
      this.YEAR_I = '';
      this.YEAR_II = '';
      this.YEAR_III = '';
      this._YEAR_I = '';
      this._YEAR_II = '';
      this._YEAR_III = '';
      this.FIRSTYEAR_I = '';
      this.FIRSTYEAR_II = '';
      this.FIRSTYEAR_III = '';
      this.SECONDYEAR_I = '';
      this.SECONDYEAR_II = '';
      this.SECONDYEAR_III = '';
    }
  }

  setYEAR3(e) {
    let year = e.target.value;
    if (year.length == 4) {
      this.YEAR_I = parseInt(year) + 2;
      this.YEAR_II = parseInt(year) + 1;
      this.YEAR_III = parseInt(year);
      this._YEAR_I = parseInt(year) - 541;
      this._YEAR_II = parseInt(year) - 542;
      this._YEAR_III = parseInt(year) - 543;
      this.FIRSTYEAR_I = `${this._YEAR_I}${this.MONTH_I}`;
      this.FIRSTYEAR_II = `${this._YEAR_II}${this.MONTH_I}`;
      this.FIRSTYEAR_III = `${this._YEAR_III}${this.MONTH_I}`;
      this.SECONDYEAR_I = `${this._YEAR_I}${this.MONTH_II}`;
      this.SECONDYEAR_II = `${this._YEAR_II}${this.MONTH_II}`;
      this.SECONDYEAR_III = `${this._YEAR_III}${this.MONTH_II}`;
    } else {
      this.YEAR_I = '';
      this.YEAR_II = '';
      this.YEAR_III = '';
      this._YEAR_I = '';
      this._YEAR_II = '';
      this._YEAR_III = '';
      this.FIRSTYEAR_I = '';
      this.FIRSTYEAR_II = '';
      this.FIRSTYEAR_III = '';
      this.SECONDYEAR_I = '';
      this.SECONDYEAR_II = '';
      this.SECONDYEAR_III = '';
    }
  }

  ngOnDestroy() {
    this.getQueryParamsFromListPage.unsubscribe();
    this.getDataFromListPage.unsubscribe();
  }

  private getParamFromActiveRoute() {
    this.getQueryParamsFromListPage = this.activeRoute.queryParams.subscribe(
      (p) => {
        this.reportCode = p['reportCode'];
        this.reportName = p['reportName'];
      });


    this.getDataFromListPage = this.activeRoute.data.subscribe(
      (data) => {
        data.urls[2].title = this.reportName;
        data.codePage = this.reportCode;
      });
  }

  async onSelect(e: any, type: string) {
    this.preLoaderService.setShowPreloader(true);
    const ev = e.target.value;

    switch (type) {
      case 'Depart':
        this.tempOfficeCode = ev;

        this.Area = [];
        this.Branch = [];
        const depart: any[] = await this.reportService.EDOfficeDepartmentgetbyCon(ev);
        this.Area = depart.filter(m => m.INDC_OFF === 'E');
        break;

      case 'Area':
        if (ev) this.tempOfficeCode = ev;
        else this.tempOfficeCode = this.tempOfficeCode.substring(0, 2) + '0000';

        this.Branch = [];
        const area: any[] = await this.reportService.EDOfficeDepartmentgetbyCon(ev);
        let officefilter: string = ev.substring(0, 4);
        this.Branch = area.filter(m => m.INDC_OFF === 'F' && m.OFFCODE.substring(0, 4) == officefilter);
        break;

      case 'Branch':
        if (ev) this.tempOfficeCode = ev;
        else this.tempOfficeCode = this.tempOfficeCode.substring(0, 4) + '00';
        break;

      default:
        break;
    }

    this.preLoaderService.setShowPreloader(false);
  }

  clickPrint(form: any) {
    this.preLoaderService.setShowPreloader(true);

    /** Set OFFICE_CODE */
    if (this.tempOfficeCode == '0007') { form.value.ACCOUNT_OFFICE_CODE = ''; } else { form.value.ACCOUNT_OFFICE_CODE = this.tempOfficeCode; }

    /** Set Date */
    form.value.DateStart = form.value.DateStart ? form.value.DateStart : '';
    form.value.DateEnd = form.value.DateEnd ? form.value.DateEnd : '';

    let _DateStart = form.value.DateStart == '' ? '' : form.value.DateStart.date;
    let _DateEnd = form.value.DateEnd == '' ? '' : form.value.DateEnd.date;

    let StartDate = form.value.DateStart == '' ? '' : `${setZero(_DateStart.day)}-${setZero(_DateStart.month)}-${_DateStart.year}`;
    let EndDate = form.value.DateEnd == '' ? '' : `${setZero(_DateEnd.day)}-${setZero(_DateEnd.month)}-${_DateEnd.year}`;

    // const StartDate = form.value.DateStart == '' ? '' : `${_DateStart.year}-${setZero(_DateStart.month)}-${setZero(_DateStart.day)}`;
    // const EndDate = form.value.DateEnd == '' ? '' : `${_DateEnd.year}-${setZero(_DateEnd.month)}-${setZero(_DateEnd.day)}`;

    const ACCOUNT_OFFICE_CODE = form.value.ACCOUNT_OFFICE_CODE;
    const OfficeCode1 = `${ACCOUNT_OFFICE_CODE.slice(0, 2)}${"0000"}`;
    const OfficeCode2 = `${ACCOUNT_OFFICE_CODE.slice(0, 2)}${ACCOUNT_OFFICE_CODE.slice(2, 4)}${"00"}`;
    const OfficeCode3 = `${ACCOUNT_OFFICE_CODE}`;

    const getDatefrom = form.value.DateStart == '' ? '' : `${_DateStart.year}-${setZero(_DateStart.month)}-${setZero(_DateStart.day)}`;
    const getDateto = form.value.DateEnd == '' ? '' : `${_DateEnd.year}-${setZero(_DateEnd.month)}-${setZero(_DateEnd.day)}`;
    const getOffcode1 = `${ACCOUNT_OFFICE_CODE.slice(0, 2)}${"0000"}`;
    const getOffcode2 = `${ACCOUNT_OFFICE_CODE.slice(0, 2)}${ACCOUNT_OFFICE_CODE.slice(2, 4)}${"00"}`;
    const getOffcode3 = `${ACCOUNT_OFFICE_CODE}`;

    const startdate = form.value.DateStart == '' ? '' : `${_DateStart.year}-${setZero(_DateStart.month)}-${setZero(_DateStart.day)}`;
    const enddate = form.value.DateEnd == '' ? '' : `${_DateEnd.year}-${setZero(_DateEnd.month)}-${setZero(_DateEnd.day)}`;
    const officecode = `${ACCOUNT_OFFICE_CODE}`;

    // const getMonthfrom1 = form.value.DateStart == '' ? '' : `${_DateStart.year}-${setZero(_DateStart.month)}-${setZero(_DateStart.day)}`;
    // const getMonthfrom2 = form.value.DateStart == '' ? '' : `${_DateStart.year}-${setZero(_DateStart.month)}-${setZero(_DateStart.day)}`;
    // const getMonthfrom3 = form.value.DateStart == '' ? '' : `${_DateStart.year}-${setZero(_DateStart.month)}-${setZero(_DateStart.day)}`;
    // const getMonthto1 = form.value.DateEnd == '' ? '' : `${_DateEnd.year}-${setZero(_DateEnd.month)}-${setZero(_DateEnd.day)}`;
    // const getMonthto2 = form.value.DateEnd == '' ? '' : `${_DateEnd.year}-${setZero(_DateEnd.month)}-${setZero(_DateEnd.day)}`;
    // const getMonthto3 = form.value.DateEnd == '' ? '' : `${_DateEnd.year}-${setZero(_DateEnd.month)}-${setZero(_DateEnd.day)}`;

    const getMonthfrom1 = this.FIRSTYEAR_I;
    const getMonthfrom2 = this.FIRSTYEAR_II;
    const getMonthfrom3 = this.FIRSTYEAR_III;
    const getMonthto1 = this.SECONDYEAR_I;
    const getMonthto2 = this.SECONDYEAR_II;
    const getMonthto3 = this.SECONDYEAR_III;

    if (this.tempOfficeCode == '0007') {
      switch (this.reportCode) {
        case reportCode.ILG_12_1:
          this.onPrint(Object.assign({}, { StartDate, EndDate, OfficeCode1, OfficeCode2, OfficeCode3 }));
          break;
        case reportCode.ILG_12_2:
          this.onPrint_007(Object.assign({}, { enddate, startdate }));

          break;
        case reportCode.ILG_12_3:
          this.onPrint(Object.assign({}, { getDatefrom, getDateto, getOffcode1, getOffcode2, getOffcode3 }));
          break;
        case reportCode.ILLR8113:
          this.onPrint(Object.assign({}, { getMonthfrom1, getMonthfrom2, getMonthfrom3, getMonthto1, getMonthto2, getMonthto3, getOffcode1, getOffcode2, getOffcode3 }));
          break;
        case reportCode.ILG_12_5:
          StartDate = form.value.DateStart == '' ? '' : `${_DateStart.year}-${setZero(_DateStart.month)}-${setZero(_DateStart.day)}`;
          EndDate = form.value.DateEnd == '' ? '' : `${_DateEnd.year}-${setZero(_DateEnd.month)}-${setZero(_DateEnd.day)}`;
          this.onPrint(Object.assign({}, { StartDate, EndDate, OfficeCode1, OfficeCode2, OfficeCode3 }));
          break;
      }
    } else {
      switch (this.reportCode) {
        case reportCode.ILG_12_1:
          this.onPrint(Object.assign({}, { StartDate, EndDate, OfficeCode1, OfficeCode2, OfficeCode3 }));
          break;
        case reportCode.ILG_12_2:
          this.onPrint(Object.assign({}, { startdate, enddate, officecode }));
          break;
        case reportCode.ILG_12_3:
          this.onPrint(Object.assign({}, { getDatefrom, getDateto, getOffcode1, getOffcode2, getOffcode3 }));
          break;
        case reportCode.ILLR8113:
          this.onPrint(Object.assign({}, { getMonthfrom1, getMonthfrom2, getMonthfrom3, getMonthto1, getMonthto2, getMonthto3, getOffcode1, getOffcode2, getOffcode3 }));
          break;
        case reportCode.ILG_12_5:
          StartDate = form.value.DateStart == '' ? '' : `${_DateStart.year}-${setZero(_DateStart.month)}-${setZero(_DateStart.day)}`;
          EndDate = form.value.DateEnd == '' ? '' : `${_DateEnd.year}-${setZero(_DateEnd.month)}-${setZero(_DateEnd.day)}`;
          this.onPrint(Object.assign({}, { StartDate, EndDate, OfficeCode1, OfficeCode2, OfficeCode3 }));
          break;
      }
    }
  }

  onPrint_007(ObjForm: any) {
    console.log('ObjForm : ', ObjForm);
    console.log('this.reportCode : ', this.reportCode);

    switch (this.reportCode) {

      case reportCode.ILG_12_1:

        this.reportService.ILG60_00_12_001(ObjForm).subscribe(x => {
          const file = new Blob([x], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.preLoaderService.setShowPreloader(false);
        });
        break;

      case reportCode.ILG_12_2:

        this.reportService.ILG60_00_12_002_1(ObjForm).subscribe(x => {
          const file = new Blob([x], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.preLoaderService.setShowPreloader(false);
        });
        break;

      case reportCode.ILG_12_3:

        this.reportService.ILG60_00_12_003(ObjForm).subscribe(x => {
          const file = new Blob([x], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.preLoaderService.setShowPreloader(false);
        });
        break;

      case reportCode.ILLR8113:

        this.reportService.ILG60_00_12_004(ObjForm).subscribe(x => {
          const file = new Blob([x], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.preLoaderService.setShowPreloader(false);
        });
        break;
      case reportCode.ILG_12_5:

        this.reportService.ILG60_00_12_005(ObjForm).subscribe(x => {
          const file = new Blob([x], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.preLoaderService.setShowPreloader(false);
        });
        break;
    }
  }
  onPrint(ObjForm: any) {
    console.log('ObjForm : ', ObjForm);
    console.log('this.reportCode : ', this.reportCode);

    switch (this.reportCode) {

      case reportCode.ILG_12_1:

        this.reportService.ILG60_00_12_001(ObjForm).subscribe(x => {
          const file = new Blob([x], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.preLoaderService.setShowPreloader(false);
        });
        break;

      case reportCode.ILG_12_2:

        this.reportService.ILG60_00_12_002(ObjForm).subscribe(x => {
          const file = new Blob([x], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.preLoaderService.setShowPreloader(false);
        });
        break;

      case reportCode.ILG_12_3:

        this.reportService.ILG60_00_12_003(ObjForm).subscribe(x => {
          const file = new Blob([x], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.preLoaderService.setShowPreloader(false);
        });
        break;

      case reportCode.ILLR8113:

        this.reportService.ILG60_00_12_004(ObjForm).subscribe(x => {
          const file = new Blob([x], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.preLoaderService.setShowPreloader(false);
        });
        break;
      case reportCode.ILG_12_5:

        this.reportService.ILG60_00_12_005(ObjForm).subscribe(x => {
          const file = new Blob([x], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.preLoaderService.setShowPreloader(false);
        });
        break;
    }
  }

  async getEDOfficeDepartmentgetAll() {
    this.DepartmentAll = await this.reportService.EDOfficeDepartmentgetAll();
  }

  rEDepart: string = '';
  rEArea: string = '';
  rEBranch: string = '';

  async setDepart(val1, val2, val3) {

    this.tempOfficeCode = val1;

    let DepartmentAll = await this.reportService.EDOfficeDepartmentgetAll();
    DepartmentAll.map(m => {
      if (m.OFFCODE == val1) {
        this.rEDepart = m.OFFNAME;
      }
    });

    this.Area = [];
    this.Branch = [];
    const depart: any[] = await this.reportService.EDOfficeDepartmentgetbyCon(val2);
    this.Area = depart.filter(m => m.INDC_OFF === 'E');

  }

  async setArea(val1, val2, val3) {

    this.tempOfficeCode = val2;

    let DepartmentAll = await this.reportService.EDOfficeDepartmentgetAll();
    DepartmentAll.map(m => {
      if (m.OFFCODE == val1) {
        this.rEDepart = m.OFFNAME;
      }
    });

    const para: any[] = await this.reportService.EDOfficeDepartmentgetbyCon(val2);
    para.map(m => {
      if (m.OFFCODE == val2) {
        this.rEArea = m.OFFNAME;
      }
    });

    this.Branch = [];
    const area: any[] = await this.reportService.EDOfficeDepartmentgetbyCon(val2);
    let officefilter: string = val2.substring(0, 4);
    this.Branch = area.filter(m => m.INDC_OFF === 'F' && m.OFFCODE.substring(0, 4) == officefilter);

  }

  async setBranch(val1, val2, val3) {

    this.tempOfficeCode = val3;

    let DepartmentAll = await this.reportService.EDOfficeDepartmentgetAll();
    DepartmentAll.map(m => {
      if (m.OFFCODE == val1) {
        this.rEDepart = m.OFFNAME;
      }
    });

    const para: any[] = await this.reportService.EDOfficeDepartmentgetbyCon(val2);
    para.map(m => {
      if (m.OFFCODE == val2) {
        this.rEArea = m.OFFNAME;
      }
    });

    const paras: any[] = await this.reportService.EDOfficeDepartmentgetbyCon(val3);
    paras.map(m => {
      if (m.OFFCODE == val3) {
        this.rEBranch = m.OFFNAME;
      }
    });

    this.preLoaderService.setShowPreloader(false);
  }
  public onSDateChange(event: IMyDateModel) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.dateToOption = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.dateToOption = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onEDateChange(event: IMyDateModel) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.dateFromOption = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.dateFromOption = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  getDisCurrDateMyDatePicker() {
    let currentdate = new Date();
    const disCurrDate = {
      begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
      end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
    }
    return disCurrDate;
  }

  public getDisLessthanCurrDateMyDatePicker() {
    let currentdate = new Date();
    const disCurrDate = {
      begin: { year: currentdate.getFullYear() - 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
      end: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() },
    }
    return disCurrDate;
  }


}