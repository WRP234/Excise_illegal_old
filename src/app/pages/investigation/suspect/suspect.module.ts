import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuspectComponent } from './suspect.component';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ArrestsService } from '../../arrests/arrests.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MainMasterService } from '../../../services/main-master.service';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { OwlModule } from 'ngx-owl-carousel';
import { InvestgateService } from '../services';
import { NumuricDirective } from '../numuric.directive';
import { DocumentModule } from '../document/document.module';

const routes: Routes = [
  {
    path: '',
    data: {
      urls: [
        { title: 'หน้าหลัก', url: '/' },
        { title: 'ค้นหางานการสืบสวน', url: '/investigation/list' },
        { title: 'จัดการงานสืบสวน', url: ' /investigation/manage/C/NEW' },
        { title: 'จัดการข้อมูลรายละเอียดรายงานการสืบสวน' },
        { title: 'จัดการข้อมูลผู้ต้องสงสัย' }
      ],
      codePage: 'ILG60_M_01_01_02_00'
    },
    component: SuspectComponent
}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    NgbModule.forRoot(),
    CardActionsModule,
    MyDatePickerTHModule,
    DocumentModule,
    OwlModule,
    SweetAlert2Module.forRoot()
  ],
  declarations: [SuspectComponent, NumuricDirective],
  exports: [SuspectComponent],
  providers: [InvestgateService, MainMasterService],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SuspectModule { }
