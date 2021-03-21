import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-offense',
  templateUrl: './modal-offense.component.html',
  styleUrls: ['./modal-offense.component.scss']
})
export class ModalOffenseComponent implements OnInit {

  dataTable: any;
  @Output() d = new EventEmitter();
  @Output() c = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  dismiss(e: any) {
    this.d.emit(e);
  }

  close(e: any) {
    this.c.emit(e);
  }

}
