import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageComponent } from './manage.component';
import { ReductionApiService } from '../reduction.api.service';
import { ReductionModelListComponent } from './reduction-model-list/reduction-model-list.component';
import { PrintReductionModalModule } from '../print-doc-modal/print-doc-modal.module' ;
import { ReductionService } from '../reduction.service'
import { PrintDocumentComponent } from './print-document/print-document.component';
import { CurrencyPipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MainMasterService } from '../../../services/main-master.service';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MyDatePickerModule } from 'mydatepicker';
import { ThaiDatePipe } from '../thaidate.pipe';
import { AllowDecimalNumberDirective } from './dicimal';
import { Ilg60O02000200Component } from '../ilg60-o-02-00-02-00/ilg60-o-02-00-02-00.component';
import { ILG60_O_08_00_02_01 } from '../ILG60_O_08_00_02_01/ILG60_O_08_00_02_01';
import { ILG60_O_08_00_02_02 } from '../ILG60_O_08_00_02_02/ILG60_O_08_00_02_02';
import { OwlModule } from 'ngx-owl-carousel';
import { disnumber } from '../../fine/manage/disnumber';

const routes: Routes = [
  {
    path: '',
    data: {
      urls: [
        { title: 'หน้าหลัก', url: '' },
        { title: 'ค้นหารายการปรับเพิ่ม-ปรับลด', url: '/reduction/list' },
        { title: 'จัดการข้อมูลรายการปรับเพิ่ม-ปรับลด' }
      ],
      pageType: 'manage',
      codePage: 'ILG60-0-08-00-02-00',
      nextPage: { title: 'จัดการข้อมูลรายละเอียดการปรับเพิ่ม-ปรับลด', url: '/reduction/manage-det, ReductionModelListComponentail/:code' }
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
    PrintReductionModalModule,
    SweetAlert2Module.forRoot(),
    OwlModule
  ],
  declarations: [
    ManageComponent, 
    ReductionModelListComponent, 
    PrintDocumentComponent, 
    AllowDecimalNumberDirective,
    Ilg60O02000200Component ,
    ILG60_O_08_00_02_01,
    ILG60_O_08_00_02_02,
    disnumber
    ],
  exports: [ ],
  providers: [
    ReductionApiService, 
    ReductionService, 
    NgbActiveModal, 
    MainMasterService,
    CurrencyPipe],
  entryComponents:[
    ILG60_O_08_00_02_01,
    ILG60_O_08_00_02_02
  ]
})
export class ManageModule { }
