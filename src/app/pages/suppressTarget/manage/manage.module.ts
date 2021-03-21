import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageComponent } from './manage.component';
import { CurrencyPipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MainMasterService } from '../../../services/main-master.service';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MyDatePickerModule } from 'mydatepicker';
import { AllowDecimalNumberDirective } from './dicimal';
import { OwlModule } from 'ngx-owl-carousel';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { StepWizardModule } from '../../component/step-wizard/step-wizard.module';
import { MasterService } from '../../model/master.service';
import { TargetService } from '../target.service';
import { disnumber } from './disnumber';

const routes: Routes = [
  {
    path: '',
    data: {
      urls: [
        { title: 'หน้าหลัก', url: '' },
        { title: 'ค้นหาเป้าปราบปราม', url: '/SuppressTarget/list' },
        { title: 'จัดการข้อมูลรายละเอียดเป้าหมายปราบปราม' }
      ],
      pageType: 'manage',
      codePage: 'ILG60_O_01_01_02_00'
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
    OwlModule,
    HttpModule,
    HttpClientModule,
    StepWizardModule,
  ],
  declarations: [
    ManageComponent,
    AllowDecimalNumberDirective,
    disnumber
    ],
  exports: [ ],
  providers: [
    NgbActiveModal, 
    MasterService,
    MainMasterService,
    CurrencyPipe,
    TargetService
  ],
  entryComponents:[
  ]
})
export class ManageModule { }
