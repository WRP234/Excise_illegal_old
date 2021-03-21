import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ManageDetailComponent } from './manage-detail.component';
import { ReductionApiService } from '../reduction.api.service';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MyDatePickerModule } from 'mydatepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PrintReductionModalModule } from '../print-doc-modal/print-doc-modal.module' ;
import { ReductionDatePipe } from '../pipe/reduction-date.pipe';

const routes: Routes = [
  {
    path: '',
    data: {
      urls: [
        { title: 'หน้าหลัก', url: '/' },
        { title: 'ค้นหารายการปรับเพิ่ม-ปรับลด', url: '/reduction/list' },
        // { title: 'จัดการข้อมูลรายการปรับเพิ่ม-ปรับลด', url: '/reduction/manage' },
        { title: 'จัดการข้อมูลรายการปรับเพิ่ม-ปรับลด', back: true },
        { title: 'จัดการข้อมูลรายละเอียดการปรับเพิ่ม-ปรับลด' }
      ],
      pageType: 'manage',
      codePage: 'ILG60-09-03-00-00',
    },
    component: ManageDetailComponent
  }

];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    CardActionsModule,
    RouterModule.forChild(routes),
    MyDatePickerTHModule,
    MyDatePickerModule,
    MatAutocompleteModule,
    PrintReductionModalModule
  ],
  declarations: [
    ManageDetailComponent,
    ReductionDatePipe
  ],
  providers: [ReductionApiService],
  exports: [MatAutocompleteModule]
})
export class ManageDetailModule { }
