import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isMatches',
  pure: false
})
export class IsMatchesPipe implements PipeTransform {
  transform(items: Array<any>, field: string, value: any): Array<any> {
    if (items.length > 0) {
      return items.filter(item => item.controls[field].value === value);
    }
    return items;
  }
}
