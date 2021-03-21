import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

// Components
import * as fromComponents from './components';

// Services
import * as fromServices from './services';

import { MyDatePickerTHModule } from 'mydatepicker-th';
import { PaginationTableModule } from '../component/pagination-table/pagination-table.module';
import { CardActionsModule } from '../component/card-actions/card-actions.module';
import { StepWizardModule } from '../component/step-wizard/step-wizard.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalOffenseModule } from '../component/modal-offense/modal-offense.module';
import { ROUTES } from './search-warrant.routing';
import { PreloaderModule } from 'app/shared/preloader/preloader.module';
import {ManageConfig} from './components/manage/manage.config';
import {OwlModule} from 'ngx-owl-carousel';
import {MatAutocompleteModule} from '@angular/material';
import {MyDatePickerModule} from 'mydatepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(ROUTES),
    NgbModule.forRoot(),
    CardActionsModule,
    PaginationTableModule,
    MyDatePickerModule,
    MyDatePickerTHModule,
    StepWizardModule,
    ModalOffenseModule,
    PreloaderModule,
    OwlModule,
    MyDatePickerTHModule,
    MatAutocompleteModule
  ],
  declarations: [...fromComponents.components],
  exports: [...fromComponents.components],
  providers: [...fromServices.services, ManageConfig]
})
export class SearchWarrantModule { }
