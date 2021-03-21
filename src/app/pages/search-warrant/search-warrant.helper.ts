import {
  compareDate,
  convertDateForSave,
  getDateMyDatepicker,
  MyDatePickerOptions, setDateMyDatepicker, setZero,
  toLocalShort
} from '../../config/dateFormat';
import {Subject} from 'rxjs/Subject';
import {FormGroup} from '@angular/forms';
import {IMyDateModel} from 'mydatepicker';
import {Message} from '../../config/message';
import swal from 'sweetalert2';

export class SearchWarrantHelper {

  months: Array<{th: string}> = [
    {th: 'ม.ค.'},
    {th: 'ก.พ.'},
    {th: 'มี.ค.'},
    {th: 'เม.ย.'},
    {th: 'พ.ค.'},
    {th: 'มิ.ย.'},
    {th: 'ก.ค.'},
    {th: 'ส.ค.'},
    {th: 'ก.ย.'},
    {th: 'ต.ค.'},
    {th: 'พ.ย.'},
    {th: 'ธ.ค.'},
  ];

  year: number;
  month: string;
  day: number;

  approveTypes: Array<{value: string}> = [
    {value: 'อนุมัติ'},
    {value: 'ไม่อนุมัติ'}
  ];
  arrestTypes: Array<{value: string}> = [
    {value: 'ยังไม่ดำเนินการ'},
    {value: 'จับกุมแล้ว'},
    {value: 'ไม่พบความผิด'},
  ];

  public officeId = localStorage.getItem('officeId') || '1';
  public officeCode = localStorage.getItem('officeCode');
  public staffCode = localStorage.getItem('staffCode');
  public userAccountId = localStorage.getItem('UserAccountID');
  public dateStartFrom: any;
  public dateStartTo: any;
  public myDatePickerOptions = MyDatePickerOptions;
  public getDateMyDatepicker = getDateMyDatepicker;
  public convertDateForSave = convertDateForSave;
  public toLocalShort = toLocalShort;
  public compareDate = compareDate;
  // public officeCode = localStorage.getItem("officeCode") || '050000';
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public formGroup: FormGroup;
  public modal: any;
  public yyyy_th = (new Date().getFullYear() + 543);
  public yy_th = (new Date().getFullYear() + 543)
    .toString()
    .substr(2, 1);

  public setDateNow = setDateMyDatepicker(new Date());
  public setTimeNow = `${setZero(new Date().getHours())}.${setZero(
    new Date().getMinutes()
  )}`;

  constructor() { }

  public setZero(num: number) {
    return num < 10 ? '0' + num : num;
  }

  public leftPad(str: string, len: number, ch = '0'): string {
    len = len - str.length + 1;
    return len > 0 ? new Array(len).join(ch) + str : str;
  }

  public onSDateChange(event: IMyDateModel) {
    this.dateStartFrom = event;
    this.checkDate();
  }

  public onEDateChange(event: IMyDateModel) {
    this.dateStartTo = event;
    this.checkDate();
  }

  public checkDate() {
    if (this.dateStartFrom && this.dateStartTo) {

      const sdate = getDateMyDatepicker(this.dateStartFrom);
      const edate = getDateMyDatepicker(this.dateStartTo);

      if (!compareDate(sdate, edate)) {
        swal('', Message.checkDate, 'warning');
        setTimeout(() => {
          this.dateStartTo = { date: this.dateStartFrom.date };
        }, 0);
      }
    }
  }

  ConvDateTimeToDate = (datetime: string) => datetime ? datetime.substr(0, 10) : '';

  // ====================== Formatter ======================
  T_OfficeFormatter = (x: { OFFICE_NAME: string }) => x.OFFICE_NAME;

  T_StaffFormatter = (x: { TITLE_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
    `${x.TITLE_NAME_TH || ''} ${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`

  T_LocaleFormatter = (x: { SUB_DISTRICT_NAME_TH: string, DISTRICT_NAME_TH: string, PROVINCE_NAME_TH: string }) =>
    `${x.SUB_DISTRICT_NAME_TH || ''} / ${x.DISTRICT_NAME_TH || ''} / ${x.PROVINCE_NAME_TH || ''}`;

  T_MasProductGroupFormatter = (x: { PRODUCT_GROUP_NAME: string }) => x.PRODUCT_GROUP_NAME;

  T_MasProductCategory = (x: { PRODUCT_CATEGORY_NAME: string }) => x.PRODUCT_CATEGORY_NAME;

  T_MasProductType = (x: { PRODUCT_TYPE_NAME: string }) => x.PRODUCT_TYPE_NAME;

  T_MasProductSubType = (x: { PRODUCT_SUBTYPE_NAME: string }) => x.PRODUCT_SUBTYPE_NAME;

  T_MasProductSubSetType = (x: { PRODUCT_SUBSETTYPE_NAME: string }) => x.PRODUCT_SUBSETTYPE_NAME;

  T_MasProductBrand = (x: { PRODUCT_BRAND_NAME_TH: string }) => x.PRODUCT_BRAND_NAME_TH;

  T_MasProductSubBrand = (x: { PRODUCT_SUBBRAND_NAME_TH: string }) => x.PRODUCT_SUBBRAND_NAME_TH;

  T_MasProductModel = (x: { PRODUCT_MODEL_NAME_TH: string }) => x.PRODUCT_MODEL_NAME_TH;

  T_MasTitle = (x: { TITLE_NAME_TH: string }) => x.TITLE_NAME_TH;

  public convertApproveTypesService(value: number) {
    let type = '';
    if (value === 0) {
      type = this.approveTypes[1].value;
    } else if (value === 1) {
      type = this.approveTypes[0].value;
    } else {
      type = '';
    }
    return type;
  }

  public convertArrestTypesService(value: number) {
    let type = '';
    if (value === 0) {
      type = this.arrestTypes[0].value;
    } else if (value === 1) {
      type = this.arrestTypes[1].value;
    } else if (value === 2) {
      type = this.arrestTypes[2].value;
    } else {
      type = '';
    }
    return type;
  }

  public convertDate(value: string): any {
    if (value === null || value === '' || value === undefined) {
      return '';
    }
    const date = new Date(value);
    this.year = date.getFullYear() + 543;
    const monthNumber: number = date.getMonth();
    this.month = this.months[monthNumber].th;
    this.day = date.getDate();
    return this.day + ' ' + this.month + ' ' + this.year;
  }

  public convertYear(value: string): any {
    if (value === null || value === '' || value === undefined) {
      return '';
    }
    const date = new Date(value);
    this.year = date.getFullYear() + 543;
    return this.year;
  }
}
