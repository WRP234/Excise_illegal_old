import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { ManageConfig } from '../../manage/manage.component.config';

@Component({
  selector: 'app-E_O_1_12',
  templateUrl: './E_O_1_12.component.html',
  styleUrls: ['./E_O_1_12.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class E_O_1_12_Component extends ManageConfig implements OnInit {

  constructor() {
    super();
  }

  @Input() evidenceOutFG: any;
  @Input() showEditField: boolean;

  ngOnInit() {
  }

}
