import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { StepWizardModule } from './../../component/step-wizard/step-wizard.module';
import { PreloaderModule } from '../../../shared/preloader/preloader.module';
import { NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvestgateService } from './../services/investgate.service';
import { PrintdocModalModule } from './../printdoc-modal/printdoc-modal.module';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { HttpClientModule } from '@angular/common/http';
import { SortPipe } from '../pipes/sort.pipe';
import { InvestgateDetailService, InvestgateMasLawbreakerService, InvestgateMasSuspectService, MasStaffService } from '../services';
import { MasterService } from '../services/master.service';
const routes: Routes = [
  { 
    path: '',
    data: {
        urls: [
            { title: 'หน้าหลัก', url: '/' },
            { title: 'ค้นหางานการสืบสวน', url: '/investigation/list' },
            { title: 'จัดการงานการสืบสวน' }
        ],
        codePage: 'ILG60_O_01_05_02_00'
    },
    component: ManageComponent
}
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    NgbModule.forRoot(),
    PaginationTableModule,
    MyDatePickerTHModule,
    StepWizardModule,
    PreloaderModule,
    CardActionsModule,
    PrintdocModalModule
  ],
  declarations: [
      ManageComponent, SortPipe
  ], 
  providers: [
    InvestgateService,
    InvestgateDetailService,
    InvestgateMasLawbreakerService,
    InvestgateMasSuspectService,
    MasStaffService,
    MasterService
  ],
  exports: [
    ManageComponent
  ]
})
export class ManageModule { }
