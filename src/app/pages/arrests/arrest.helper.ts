import { FormGroup, FormArray } from '@angular/forms';
import {
  setZero,
  setDateMyDatepicker,
  MyDatePickerOptions,
  toLocalShort,
  getDateMyDatepicker,
  compareDate,
  convertDateForSave,
  toLocalLong
} from '../../config/dateFormat';
import { ArrestLawbreaker, PERSON_TYPE, ENTITY_TYPE } from "./models";
import { Subject } from "rxjs/Subject";
import * as moment from 'moment-timezone';
import { isNull } from 'util';
import swal from 'sweetalert2';

export class ArrestHelper {

  public toLocalLong = toLocalLong;
  public dateStartFrom: any;
  public dateStartTo: any;
  public myDatePickerOptions = MyDatePickerOptions;
  public getDateMyDatepicker = getDateMyDatepicker;
  public convertDateForSave = convertDateForSave;
  public toLocalShort = toLocalShort;
  public compareDate = compareDate;

  public officeId = localStorage.getItem("officeId") || '1';
  public officeCode = localStorage.getItem("officeCode");
  public staffCode = localStorage.getItem('staffCode');
  public officeShortName = localStorage.getItem('officeShortName');
  public userAccountId = localStorage.getItem('UserAccountID');

  public IsEmpty = IsEmpty;

  public destroy$: Subject<boolean> = new Subject<boolean>();
  public formGroup: FormGroup;
  public modal: any;
  public yyyy_th = (new Date().getFullYear() + 543)
  public yy_th = (new Date().getFullYear() + 543)
    .toString()
    .substr(2, 2);

  public setDateNow = setDateMyDatepicker(new Date());
  public setTimeNow = `${setZero(new Date().getHours())}.${setZero(
    new Date().getMinutes()
  )}`;

  public I18N_VALUES = {
    weekdays: ['อ.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
    months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
  };

  constructor() {
  }

  public getDisCurrDateMyDatePicker() {
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

  public filterDuplicate(array: any[], prop: string) {
    return array.filter((v, i, a) => a.map(x => x[prop])
      .indexOf(v[prop]) === i);
  }

  public toDateTZ(date: Date) {
    return `${moment(date).format('YYYY-MM-DD HH:mm:ss.ms Z')}`;
    // .tz('Asia/Bangkok')
  }

  public setZero(num: number) {
    return num < 10 ? '0' + num : num;
  }

  public leftPad(str: string, len: number, ch = '0'): string {
    len = len - str.length + 1;
    return len > 0 ? new Array(len).join(ch) + str : str;
  }

  public rightPad(str: string, len: number, ch = '0'): string {
    len = len - str.length + 1;
    return len > 0 ? str + new Array(len).join(ch) : str;
  }

  public sortFormArray(arr: any[], arg: string) {
    return arr.sort((a, b) => {
      if (a[arg] < b[arg]) return -1; // asc
      if (a[arg] > b[arg]) return 1; // desc
      return 0;
    });
  }

  public swalFn(title: string, msg: string, type: any) {
    return swal({
      title: title,
      text: msg,
      type: type,
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'ตกลง'
    })
  }

  public swalFnMulti(title: string, msg: string, type: any) {
    return swal({
      title: title,
      text: msg,
      type: type,
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    })
  }
  // public onSDateChange(event: IMyDateModel) {
  //   this.dateStartFrom = event
  //   this.checkDate();
  // }

  // public onEDateChange(event: IMyDateModel) {
  //   this.dateStartTo = event
  //   this.checkDate()
  // }

  // public checkDate() {
  //   if (this.dateStartFrom && this.dateStartTo) {

  //     const sdate = getDateMyDatepicker(this.dateStartFrom);
  //     const edate = getDateMyDatepicker(this.dateStartTo);

  //     if (!compareDate(sdate, edate)) {
  //       swal('', Message.checkDate, 'warning')
  //       setTimeout(() => {
  //         this.dateStartTo = { date: this.dateStartFrom.date };
  //       }, 0);
  //     }
  //   }
  // }
  public setDateStruct(date) {
    if (date) {
      const months = this.I18N_VALUES.months;
      const temp = date = new Date(date);
      const CompDate = `${temp.getUTCDate()} ${months[temp.getMonth()]} ${temp.getUTCFullYear() + 543}`;
      return CompDate;
    } else return null;
  }

  public setDateForThaiYear(date) {
    const months = this.I18N_VALUES.months;
    const temp = date = new Date(date);
    const CompDate = `${temp.getUTCDate()} ${months[temp.getMonth()]} ${temp.getUTCFullYear()}`;
    return CompDate;
  }

  public canOfficeSearch(): boolean {
    const OFFICE_CODE_SLICE = this.officeCode.slice(0, 2);
    return OFFICE_CODE_SLICE == '00' ? false : true;
  }

  public DateSorter(Arr: any[] = []) {
    return Arr.sort((a, b) => {
      return <any>new Date(b.OCCURRENCE_DATE).getTime() - <any>new Date(a.OCCURRENCE_DATE).getTime();
    });
  }

  getPersonType(personType: number) {
    return PERSON_TYPE.find(x => x.value == personType).text;
  }

  getEntityType(entityType: number) {
    return ENTITY_TYPE.find(x => x.value == entityType).text;
  }

  setPersonReferenceNo(item: ArrestLawbreaker): string {
    let REFERENCE_NO: string;
    switch (item.PERSON_TYPE) {
      case 0: // ชาวไทย
        REFERENCE_NO = item.ID_CARD;
        break;
      case 1: // ต่างชาติ
        REFERENCE_NO = item.PASSPORT_NO;
        break;
      case 2: // นิติบุคคล
        if (item.ENTITY_TYPE == 1)
          REFERENCE_NO = item.COMPANY_REGISTRATION_NO;
        else if (item.ENTITY_TYPE == 0)
          REFERENCE_NO = item.ID_CARD;
        break;
    }
    return REFERENCE_NO;
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  CreditNumericOnly(event): boolean {
    let patt = /^([0-9,-])$/;
    let result = patt.test(event.key);
    return result;
  }

  NumericDotOnly(event): boolean {
    let patt = /^([0-9,.])$/;
    let result = patt.test(event.key);
    return result;
  }

  AddComma(x) { /* Formate Number 9,999.00 */
    // return ("" + str).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); //OLD
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  removeComma(value) {/* Remove comma , */
    var str = String(value);
    str = str.replace(/,/g, '');
    if (String(str) == 'NaN')
      return '0';
    else
      return str;
  }

  setToFixed(PRODUCT_GROUP_ID: string) {
    let toFixed: string;
    switch (PRODUCT_GROUP_ID.toString()) {
      case '1':
      case '2':
      case '13':
        toFixed = '1.3';
        break;
      default:
        toFixed = '1.0';
        break;
    }
    return toFixed;
  }

  ConvDateTimeToDate = (datetime: string) => datetime ? datetime.substr(0, 10) : '';


  // ====================== Formatter ======================
  T_OfficeFormatter = (x: { OFFICE_NAME: string }) => x.OFFICE_NAME;

  T_StaffFormatter = (x: { TITLE_SHORT_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
    `${x.TITLE_SHORT_NAME_TH || ''}${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`

  T_LocaleFormatter = (x: { SUB_DISTRICT_NAME_TH: string, DISTRICT_NAME_TH: string, PROVINCE_NAME_TH: string }) =>
    `${x.SUB_DISTRICT_NAME_TH || ''} ${x.DISTRICT_NAME_TH || ''} ${x.PROVINCE_NAME_TH || ''}`;

  T_MasProductGroupFormatter = (x: { PRODUCT_GROUP_NAME: string }) => x.PRODUCT_GROUP_NAME;

  T_MasProductCategory = (x: { PRODUCT_CATEGORY_NAME: string }) => x.PRODUCT_CATEGORY_NAME;

  T_MasProductType = (x: { PRODUCT_TYPE_NAME: string }) => x.PRODUCT_TYPE_NAME;

  T_MasProductSubType = (x: { PRODUCT_SUBTYPE_NAME: string }) => x.PRODUCT_SUBTYPE_NAME;

  T_MasProductSubSetType = (x: { PRODUCT_SUBSETTYPE_NAME: string }) => x.PRODUCT_SUBSETTYPE_NAME;

  T_MasProductBrand = (x: { PRODUCT_BRAND_NAME_TH: string }) => x.PRODUCT_BRAND_NAME_TH;

  T_MasProductSubBrand = (x: { PRODUCT_SUBBRAND_NAME_TH: string }) => x.PRODUCT_SUBBRAND_NAME_TH;

  T_MasProductModel = (x: { PRODUCT_MODEL_NAME_TH: string }) => x.PRODUCT_MODEL_NAME_TH;

  T_MasCountry = (x: { COUNTRY_NAME_TH: string }) => x.COUNTRY_NAME_TH;

  T_MasTitle = (x: { TITLE_NAME_TH: string }) => x.TITLE_NAME_TH;

  T_MasTitleShort = (x: { TITLE_SHORT_NAME_TH: string }) => x.TITLE_SHORT_NAME_TH;

  T_MasTitleShortEN = (x: { TITLE_SHORT_NAME_EN: string }) => x.TITLE_SHORT_NAME_EN;

  T_MasRace = (x: { RACE_NAME_TH: string }) => x.RACE_NAME_TH;

  T_MasNationality = (x: { NATIONALITY_NAME_TH: string }) => x.NATIONALITY_NAME_TH;

  T_MasReligion = (x: { RELIGION_NAME_TH: string }) => x.RELIGION_NAME_TH;

  T_MasRelationship = (x: { RELATIONSHIP_NAME: string }) => x.RELATIONSHIP_NAME;
}

export type RequiredSome<T, K extends keyof T> = Pick<T, K> & Partial<T>;

type Empty = null | undefined | 0 | false | '';

export function IsEmpty<T>(thing: T | undefined | null | 0 | false | '' | 'null'): thing is Empty {
  const undefinedOrNull = typeof thing === 'undefined' || thing === null

  if (undefinedOrNull) {
    return true
  }

  if (typeof thing === 'string' && thing === 'null') {
    return null
  }

  if (typeof thing === 'string' && thing.length === 0) {
    return null
  }

  if (typeof thing === 'number') {
    return thing === 0 || isNaN(thing)
  }

  if (typeof thing === 'boolean') {
    return !thing
  }
  return false || isNull(thing)
}

export function groupArrayItem(array: any[], arg: any) {
  return array.reduce((a, b) => {
    var i = a.findIndex(x => x[arg] === b[arg]);
    return i === -1 ? a.push(b) : a[i], a;
  }, []);
}

export function removeObjectItem(obj: any, arg) {
  return Object.keys(obj).reduce((object, key) => {
    if (key !== arg) {
      object[key] = obj[key]
    }
    return object
  }, {})
}

export async function sortFormArray(arr: any[], arg: string) {
  let a = await arr.sort((a, b) => {
    if (a[arg] < b[arg]) return -1; // asc
    if (a[arg] > b[arg]) return 1; // desc
    return 0;
  });
  let i = 0;
  a.map((x) => { if (x[arg] != 0) x[arg] = ++i; });
  return a;
}

export const IntialLastRowID: number = 9999;
export function sortingArray(arr: any[], arg: string) {
  let a = arr.sort((a, b) => {
    if (a[arg] < b[arg]) return -1; // asc
    if (a[arg] > b[arg]) return 1; // desc
    return 0;
  });
  let i = 0;
  a.map((x) => { if (x[arg] < IntialLastRowID) x[arg] = ++i; });
  return a;
}

export function clearFormArray(formArray: FormArray) {
  while (formArray.length !== 0) {
    formArray.removeAt(0)
  }
}