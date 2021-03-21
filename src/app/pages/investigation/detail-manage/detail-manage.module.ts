import { DocumentModule } from './../document/document.module';
import { OwlModule } from 'ngx-owl-carousel';
import { HttpClientModule } from '@angular/common/http';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { DetailManageComponent } from './detail-manage.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { StepWizardModule } from './../../component/step-wizard/step-wizard.module';
import { PreloaderModule } from '../../../shared/preloader/preloader.module';
import { NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvestgateService } from './../services/investgate.service';
import { PrintdocModalModule } from './../printdoc-modal/printdoc-modal.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { InvestSuspectModalModule } from '../suspect-modal/invest-suspect-modal.module';
import { InvestgateDetailService, MasStaffService } from '../services';
import { MasterService } from '../services/master.service';
import { ProductsModule } from '../products/products.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';


const routes: Routes = [
  {
    path: '',
    data: {
      urls: [
        { title: 'หน้าหลัก', url: '/' },
        { title: 'ค้นหางานการสืบสวน', url: '/investigation/list' },
        { title: 'จัดการงานสืบสวน', url: '/investigation/manage/C/NEW' },
        { title: 'จัดการข้อมูลรายละเอียดรายงานการสืบสวน' }
      ],
      codePage: 'ILG60_O_01_05_03_00'
    },
    component: DetailManageComponent
}
];

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        CardActionsModule,
        RouterModule.forChild(routes),
        NgbModule.forRoot(),
        MyDatePickerTHModule,
        StepWizardModule,
        PreloaderModule,
        CardActionsModule,
        PrintdocModalModule,
        InvestSuspectModalModule,
        ProductsModule,
        DocumentModule,
        OwlModule,
        SweetAlert2Module.forRoot()
    ],
    declarations: [
      DetailManageComponent
    ],
    providers: [
      InvestgateService, InvestgateDetailService, MasStaffService, MasterService
    ],
})
export class DetailManageModule { }
