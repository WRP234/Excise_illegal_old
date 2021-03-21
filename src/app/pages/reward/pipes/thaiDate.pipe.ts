import { Pipe, PipeTransform } from '@angular/core';

interface IOptionDateLocale {
  year: string,
  month: string,
  day: string
}

@Pipe({
  name: 'thaiDate'
})
export class ThaiDatePipe implements PipeTransform {

  transform(value: any, options: IOptionDateLocale = { year: 'numeric', month: 'short', day: 'numeric' } ): any {
    const newoptions = options;
    const dd = new Date(value);
    return dd.toLocaleString('th-TH', newoptions);
  }

}
