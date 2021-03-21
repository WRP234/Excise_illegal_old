import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'IsActivePipe',
    pure: false
})

export class IsActivePipe implements PipeTransform {
    transform(items: any[]): any {
        return items.filter(item => item.IsDelItem == false);
    }
}