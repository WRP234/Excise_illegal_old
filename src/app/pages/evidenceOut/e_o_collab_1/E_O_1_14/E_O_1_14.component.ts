import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ManageConfig } from '../../manage/manage.component.config';

@Component({
  selector: 'app-E_O_1_14',
  templateUrl: './E_O_1_14.component.html',
  styleUrls: ['./E_O_1_14.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class E_O_1_14_Component extends ManageConfig implements OnInit {

  constructor() {
    super();
  }

  @Input() evidenceOutFG: any;
  @Input() showEditField: boolean;

  ngOnInit() {
  }

}
