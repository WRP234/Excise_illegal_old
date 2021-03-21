import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortFormArray',
  pure: false
})
export class SortFormArrayPipe implements PipeTransform {

  transform(array: Array<string>, args: string): Array<string> {
    if (array !== undefined) {
        return array.sort((a: any, b: any) => {

            const aValue = a.controls[args].value;
            const bValue = b.controls[args].value;

            if (aValue < bValue) {
                return -1;
            } else if (aValue > bValue) {
                return 1;
            } else {
                return 0;
            }
        });
    }
    return array;
}

}
