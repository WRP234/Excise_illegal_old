import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'IsProveSciencePipe',
    pure: false
})

export class IsProveSciencePipe implements PipeTransform {
    transform(items: any[]): any {
        return items.filter(item => item.ISPROVESCIENCE == true && item.IsDelItem == false);
    }
}