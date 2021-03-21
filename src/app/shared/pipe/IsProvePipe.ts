import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'IsProvePipe',
    pure: false
})

export class IsProvePipe implements PipeTransform {
    transform(items: any[]): any {
        return items.filter(item => item.ISPROVE == false && item.IsDelItem == false);
    }
}