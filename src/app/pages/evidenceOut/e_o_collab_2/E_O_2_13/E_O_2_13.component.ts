import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageConfig } from '../../manage/manage.component.config';

@Component({
  selector: 'app-E_O_2_13',
  templateUrl: './E_O_2_13.component.html',
  styleUrls: ['./E_O_2_13.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class E_O_2_13_Component extends ManageConfig implements OnInit {

  constructor(private ngbModel: NgbModal,) {
    super();
  }

  @Output() Output = new EventEmitter<any[]>();
  @Output() eOutItemDel$ = new EventEmitter<number>();

  @Input() evidenceOutFG: any;
  @Input() showEditField: boolean;

  @Input() moduleType: string;

  ngOnInit() {
  }

  openModal(e) {
    this.modal = this.ngbModel.open(e, { size: 'lg', centered: true });
  }

  private evidenceOutItemSelected(event: any) {
    this.Output.emit(event);
  }

  private eOutItemDelete(i: number) {
    this.eOutItemDel$.emit(i);
  }

}
