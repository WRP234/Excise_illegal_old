import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { toInteger, isNumber, padNumber } from '@ng-bootstrap/ng-bootstrap/util/util';

const I18N_VALUES = {
  weekdays: ['อ.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
  months: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
};

@Injectable()
export class DatepickerI18nService extends NgbDatepickerI18n {

  getWeekdayShortName(weekday: number) {
    return I18N_VALUES.weekdays[weekday - 1];
  }

  getMonthShortName(month: number) {
    return I18N_VALUES.months[month - 1];
  }

  getMonthFullName(month: number) {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }

  // parse(value: string): NgbDateStruct {
  //   if (value) {
  //     const dateParts = value.trim().split('-');
  //     if (dateParts.length === 1 && isNumber(dateParts[0])) {
  //       return {day: toInteger(dateParts[0]), month: null, year: null};
  //     } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
  //       return {day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: null};
  //     } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
  //       return {day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: toInteger(dateParts[2])};
  //     }
  //   }
  //   return null;
  // }

  // format(date: NgbDateStruct): string {
  //   return date ?
  //       `${isNumber(date.day) ? padNumber(date.day) : ''}-${isNumber(date.month) ? padNumber(date.month) : ''}-${date.year}` :
  //       '';
  // }

}

