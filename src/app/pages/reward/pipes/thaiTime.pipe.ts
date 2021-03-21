import { Pipe, PipeTransform } from '@angular/core';

interface IOptionTimeLocale {
  hour: string;
  minute: string;
}
@Pipe({
  name: 'thaiTime'
})
export class ThaiTimePipe implements PipeTransform {

  transform(value: any, options: IOptionTimeLocale = { hour: 'numeric', minute: 'numeric' }): any {
    const newoptions = options;
    return new Date(value).toLocaleTimeString('th-TH', newoptions);
  }

}
