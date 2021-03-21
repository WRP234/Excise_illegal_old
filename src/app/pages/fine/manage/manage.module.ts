import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { FineService } from '../fine.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ArrestService } from '../../model/arrest.service';
import { LawsuitService } from '../../model/lawsuit.service';
import { MasterService } from '../../model/master.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MyDatePickerModule } from 'mydatepicker';
import { PrintDocModalModule } from '../printdoc-modal/printdoc-modal.module';
import { PrintDocModalComponent } from '../printdoc-modal/printdoc-modal.component';
import { ILG60_O_05_00_02_01 } from '../ILG60_O_05_00_02_01/ILG60_O_05_00_02_01';
import { ILG60_O_05_00_02_02 } from '../ILG60_O_05_00_02_02/ILG60_O_05_00_02_02';
import { ILG60_O_05_00_02_03 } from '../ILG60_O_05_00_02_03/ILG60_O_05_00_02_03';
import { ILG60_O_05_00_02_04 } from '../ILG60_O_05_00_02_04/ILG60_O_05_00_02_04';

import { Ilg6003020000E28Component } from '../../fine/ilg60-03-02-00-00-e28/ilg60-03-02-00-00-e28.component';
import { OwlModule } from 'ngx-owl-carousel';
import { ThaiDatePipe } from './thaidate.pipe';
import { Ilg60O02000200Component } from '../ilg60-o-02-00-02-00/ilg60-o-02-00-02-00.component';
import { StepWizardModule } from '../../component/step-wizard/step-wizard.module';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MainMasterService } from '../../../services/main-master.service';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { DisableControlDirective } from '../disible'
import { AllowDecimalNumberDirective } from './dicimal'
import { CurrencyPipe } from '@angular/common';
import { NumberCommaDirective } from '../../../shared/pipe/number-comma.directive';
import { disnumber } from './disnumber';

const routes: Routes = [
  {
    path: '',
    data: {
      urls: [
        { title: 'หน้าหลัก', url: '/' },
        { title: 'ค้นหางานเปรียบแทียบและชำระค่าปรับ', url: '/fine/list' },
        { title: 'จัดการงานเปรียบเทียบและชำระค่าปรับ' }
      ],
      codePage: "ILG60_O_05_00_02_00",
    },
    component: ManageComponent
  }
];
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule.forRoot(),
    RouterModule.forChild(routes),
    HttpModule,
    HttpClientModule,
    CardActionsModule,
    MatAutocompleteModule,
    PrintDocModalModule,
    MyDatePickerTHModule,
    MyDatePickerModule,
    OwlModule,
    StepWizardModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
  ],
  providers: 
  [
    FineService,
    NgbActiveModal,
    ArrestService,
    LawsuitService,
    MasterService,
    MainMasterService,
    CurrencyPipe
  ],
  declarations: 
  [
    ManageComponent, 
    Ilg6003020000E28Component, 
    ThaiDatePipe, 
    DisableControlDirective,
    Ilg60O02000200Component ,
    ILG60_O_05_00_02_01,
    ILG60_O_05_00_02_02,
    ILG60_O_05_00_02_03,
    ILG60_O_05_00_02_04,
    AllowDecimalNumberDirective,
    disnumber
  ],
  entryComponents: [
    PrintDocModalComponent,
    ILG60_O_05_00_02_01,
    ILG60_O_05_00_02_02,
    ILG60_O_05_00_02_03,
    ILG60_O_05_00_02_04
  ],
  exports: [MatAutocompleteModule]
})
export class ManageModule { }
