import { Routes, RouterModule } from '@angular/router';
import { CriteriaComponent } from './criteria.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MyDatePickerModule } from 'mydatepicker';
import { PaginationTableModule } from '../../../component/pagination-table/pagination-table.module';
import { CardActionsModule } from '../../../component/card-actions/card-actions.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from '../../report.service'

const routes: Routes = [
  {
    path: '',
    data: {
      urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'รายงานสถานะผลคดี', url: '/report/status-caseResults-report/criteria' }
      ],
      codePage: 'ILG60_00_12_003'
    },
    component: CriteriaComponent
  }
]
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    RouterModule.forChild(routes),
    MyDatePickerTHModule,
    MyDatePickerModule,
    PaginationTableModule,
    CardActionsModule
  ],
  declarations: [CriteriaComponent],
  providers: [ReportService]
})
export class CriteriaModule { }