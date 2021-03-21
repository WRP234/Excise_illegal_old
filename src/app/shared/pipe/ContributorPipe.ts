import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ContributorPipe',
    pure: false
})

export class ContributorPipe implements PipeTransform {
    transform(items: any[], code: string): any {
        let result = items.filter(item => item.ContributorCode == code);

        if(result.length > 0) { return result; }
        else { 
            let result = [  
                {  
                    TitleName: '-', 
                    FirstName: '', 
                    LastName: '' 
                }
            ];  

            return result;
        }
         
    }
}