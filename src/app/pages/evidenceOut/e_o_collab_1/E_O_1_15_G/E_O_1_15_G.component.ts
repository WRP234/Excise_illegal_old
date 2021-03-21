import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ManageConfig } from '../../manage/manage.component.config';

@Component({
  selector: 'app-E_O_1_15_G',
  templateUrl: './E_O_1_15_G.component.html',
  styleUrls: ['./E_O_1_15_G.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class E_O_1_15_G_Component extends ManageConfig implements OnInit {

  constructor() {
    super();
  }

  @Input() evidenceOutFG: any;
  @Input() showEditField: boolean;

  ngOnInit() {
  }
  
}
