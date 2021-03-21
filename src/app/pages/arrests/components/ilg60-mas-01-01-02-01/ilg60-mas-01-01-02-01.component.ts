import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Ilg60Mas01010201Config } from './ilg60-mas-01-01-02-01.config';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-ilg60-mas-01-01-02-01',
  templateUrl: './ilg60-mas-01-01-02-01.component.html',
  styleUrls: ['./ilg60-mas-01-01-02-01.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg60Mas01010201Component extends Ilg60Mas01010201Config implements OnInit {

  constructor(
    private fb: FormBuilder
  ) {
    super();
   }

  ngOnInit() {
  }

  pageChanges(event: any) {
    const list =  this.dataList.slice(event.startIndex - 1, event.endIndex);
    this.setItemFormArray(list, 'Array');
  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.formGroup.setControl(formControl, itemFormArray);
    }
  }

}
