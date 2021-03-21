import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { pagination } from '../../../../../config/pagination';

@Component({
  selector: 'app-mistreat-detail',
  templateUrl: './mistreat-detail.component.html',
  styleUrls: ['./mistreat-detail.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MistreatDetailComponent implements OnInit {

  @Input() ARREST_LAWBREAKER_DETAILS: any;
  ArstLawbkDetailList: any[] = [];

  @Output() d = new EventEmitter();
  @Output() c = new EventEmitter();

  paginage = pagination;

  constructor() { }

  ngOnInit() {
    console.log('ARREST_LAWBREAKER_DETAILS :', this.ARREST_LAWBREAKER_DETAILS)
    this.onLoadData(this.ARREST_LAWBREAKER_DETAILS);
  }

  async onLoadData(list) {
    this.paginage.TotalItems = list.length;
    this.ArstLawbkDetailList = this.ARREST_LAWBREAKER_DETAILS.slice(0, this.paginage.RowsPerPageOptions[0]);
  }
  async pageChanges(event) {
    this.ArstLawbkDetailList = await this.ARREST_LAWBREAKER_DETAILS.slice(event.startIndex - 1, event.endIndex);
  }

  dismiss(e: any) {
    this.d.emit(e);
  }

  close(e: any) {
    this.c.emit(e);
  }

}
