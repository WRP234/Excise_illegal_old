import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { ManageConfig } from '../../manage/manage.component.config';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-E_O_1_15_D',
  templateUrl: './E_O_1_15_D.component.html',
  styleUrls: ['./E_O_1_15_D.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class E_O_1_15_D_Component extends ManageConfig implements OnInit {

  constructor() {
    super();
  }

  @Input() evidenceOutFG: any;
  @Input() showEditField: boolean;
  @Input() RECIPIENT_STAFF: any
  @Input() RECIPIENT_FULL_NAME_REQ = new BehaviorSubject<Boolean>(false);
  @Input() RECIPIENT_OFFICE_NAME_REQ = new BehaviorSubject<Boolean>(false);

  @Output() directValue = new EventEmitter<any>();


  ngOnInit() {
  }

  setReceipientStaff(value$: string, field$: string) {
    this.directValue.emit(Object.assign({}, { value: value$, field: field$ }));
  }

}
