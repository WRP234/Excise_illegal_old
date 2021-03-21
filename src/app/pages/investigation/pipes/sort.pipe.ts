import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'sort',
	pure: false
})
export class SortPipe implements PipeTransform {

	transform(value: any, args?: any, param?: any): any {
		if (value !== undefined) {
			return value.sort((a: any, b: any) => {

				const aValue = a.controls[args].value;
				const bValue = b.controls[args].value;
				if (param == 'desc') {
					return -1;
				} else if (param == 'asc') {
					return 1
				}
				// if (aValue < bValue) {
				// 	return -1;
				// } else if (aValue > bValue) {
				// 	return 1;
				// } else {
				// 	return 0;
				// }
			});
		}
		return value;
	}

}
