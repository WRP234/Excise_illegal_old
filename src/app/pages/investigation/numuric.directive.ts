import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNumuricOnly]'
})
export class NumuricDirective {

  constructor(public el: ElementRef) {
    this.el.nativeElement.onkeypress = (evt) => {
      let keyChar = String.fromCharCode(evt.which);
      if (!keyChar.match(/[0-9]/g)) {
        evt.preventDefault();
      }
    };
  }
}
