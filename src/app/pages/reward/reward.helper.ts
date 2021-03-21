import { FormGroup, Validators } from '@angular/forms';
import { ColumnsInterface } from './shared/interfaces/columns-interface';
import { IMyOptions } from 'mydatepicker-th';
import { setZero, setDateMyDatepicker, MyDatePickerOptions } from 'app/config/dateFormat';
import { Subject } from 'rxjs/Subject';

export class RewardHelper {

  public myDatePickerOptions = MyDatePickerOptions;
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public formGroup: FormGroup;
  public yy_thaibuddha = (new Date().getFullYear() + 543)
    .toString()
    .substr(2, 1);
  public setDateNow = setDateMyDatepicker(new Date());
  public setTimeNow = `${setZero(new Date().getHours())}.${setZero(new Date().getMinutes())} น.`;

  constructor() {

  }

  public setZero(num: number) {
    return num < 10 ? '0' + num : num;
  }

  public leftPad(str: string, len: number, ch = '0'): string {
    len = len - str.length + 1;
    return len > 0 ? new Array(len).join(ch) + str : str;
  }

  ConvObjectValue = obj => {
    const newObj = {};
    Object.keys(obj).forEach(f => {
      if (typeof obj[f] === 'number') {
        newObj[f] = obj[f].toString();
      } else if (typeof obj[f] === 'undefined') {
        newObj[f] = '';
      } else {
        newObj[f] = obj[f] || '';
      }
    });
    return newObj;
  };

  ConvDateTimeToDate = (datetime: string) => datetime ? datetime.substr(0, 10) : '';

  // ===== create form =====
  validateSetting(valid) {
    const arr = [];
    let validSet = null;
    const d_val = valid.default;
    const required = valid.isRequired ? arr.push(Validators.required) : null;
    const email = valid.isEmail ? arr.push(Validators.email) : null;
    const min = valid.minLenght
      ? arr.push(Validators.minLength(valid.min_length))
      : null;
    const max = valid.maxLenght
      ? arr.push(Validators.maxLength(valid.max_length))
      : null;
    const pattern = valid.pattern
      ? arr.push(Validators.pattern(valid.pattern))
      : null;
    if (arr.length > 0) {
      validSet = [d_val, arr];
    } else {
      validSet = [d_val];
    }
    //  console.log('valid',  valid);

    return validSet;
  }

  createForm(columns: Array<ColumnsInterface>) {
    const allColumns = this.mergeField(columns);
    const obj = {};
    allColumns.forEach(val => {
      if (val.children) {
        val.children.forEach(val2 => {
          if (!val2.primaryKey && !val2.doNotEditor) {
            obj[val2.field] = this.validateSetting(val);
            if (val2.field2) {
              obj[val2.field2] = this.validateSetting(val);
            }
          }
        });
      } else {
        if (!val.primaryKey && !val.doNotEditor) {
          obj[val.field] = this.validateSetting(val);
          if (val.field2) {
            obj[val.field2] = this.validateSetting(val);
          }
        }
      }
    });
    return obj;
  }
  // ===== create form =====

  mergeField(columns: Array<ColumnsInterface>): ColumnsInterface[] {
    const fieldNew: ColumnsInterface[] = columns;
    // columns.forEach((x, index) => {
    //   if (x.mergeField) {
    //     x.mergeField.forEach(e => {
    //       if (e.substring(0, 1) !== '&') {
    //         fieldNew.push({
    //           field: e,
    //           inputType: 'hidden'
    //         })
    //       }
    //     });
    //   }
    // });
    return fieldNew;
  }
  // ===== merge Field =====
  // ===== setDefault Columns ======
  public setDefaultDataColumns(
    columns: Array<ColumnsInterface>,
    defaultData: any
  ): Array<ColumnsInterface> {
    // console.log('columns', columns);

    columns.forEach((x, index) => {
      if (columns[index].inputType === 'date') {
        columns[index].default = new Date(
          defaultData[x.field] && typeof defaultData[x.field] === 'string'
            ? defaultData[x.field]
            : Date.now
        );

        if (x.field2) {
          columns[index].default2 = new Date(
            defaultData[x.field2] && typeof defaultData[x.field2] === 'string'
              ? defaultData[x.field2]
              : Date.now
          );
        }
      } else {
        columns[index].default = defaultData[x.field]
          ? defaultData[x.field]
          : null;
        if (x.field2) {
          columns[index].default2 = defaultData[x.field2]
            ? defaultData[x.field2]
            : null;
        }
      }
    });
    return columns;
  }
  // ===== setDefault Columns ======

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  setReceiotBookNo(recBookNo: string, recNo: string): string {
    recBookNo = '' + recBookNo;
    let pad = '00000';
    let $recBookNo = pad.substring(0, pad.length - recBookNo.length) + recBookNo;

    recNo = '' + recNo;
    let pad1 = '00';
    let $recNo = pad.substring(0, pad1.length - recNo.length) + recNo;
    return `${$recBookNo}/${$recNo}`;
  }
}
