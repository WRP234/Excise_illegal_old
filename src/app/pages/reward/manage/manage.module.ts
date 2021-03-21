import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageComponent } from './manage.component';
import { RewardService } from '../reward.service'
import { CurrencyPipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MainMasterService } from '../../../services/main-master.service';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MyDatePickerModule } from 'mydatepicker';
import { ThaiDatePipe } from '../thaidate.pipe';
import { AllowDecimalNumberDirective } from './dicimal';
import { OwlModule } from 'ngx-owl-carousel';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { StepWizardModule } from '../../component/step-wizard/step-wizard.module';
import { MasterService } from '../../model/master.service';

import { PrintDocModalModule } from '../printdoc-modal/printdoc-modal.module';
import { PrintDocModalComponent } from '../printdoc-modal/printdoc-modal.component';

const routes: Routes = [
  {
    path: '',
    data: {
      urls: [
        { title: 'หน้าหลัก', url: '' },
        { title: 'ค้นหางานคำร้องขอรับเงินสินบนรางวัล', url: '/reward/list' },
        { title: 'จัดการข้อมูลคำร้องขอรับเงินรางวัล' }
      ],
      pageType: 'manage',
      codePage: 'ILG60-07-00-01-01',
      nextPage: { title: 'จัดการข้อมูลรายละเอียดการปรับเพิ่ม-ปรับลด', url: '/reward/manage-det, ReductionModelListComponentail/:code' }
    },
    component: ManageComponent
  }

];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CardActionsModule,
    NgbModule.forRoot(),
    RouterModule.forChild(routes),
    MyDatePickerTHModule,
    MyDatePickerModule,
    SweetAlert2Module.forRoot(),
    PrintDocModalModule,
    OwlModule,
    HttpModule,
    HttpClientModule,
    StepWizardModule,
  ],
  declarations: [
    ManageComponent,
    AllowDecimalNumberDirective,
    ],
  exports: [ ],
  providers: [
    RewardService, 
    NgbActiveModal, 
    MasterService,
    MainMasterService,
    CurrencyPipe],
  entryComponents:[
    PrintDocModalComponent,
  ]
})
export class ManageModule { }
