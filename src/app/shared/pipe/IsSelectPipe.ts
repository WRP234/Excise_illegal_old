import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'IsSelectPipe',
    pure: false
})

export class IsSelectPipe implements PipeTransform {
    transform(items: any[]): any {
        return items.filter(item => item.ISSELECTED == true);
    }
}