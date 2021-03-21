import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

// Components
import * as fromComponents from './components';

// Services
import * as fromServices from './services';

import { PaginationTableModule } from '../component/pagination-table/pagination-table.module';
import { CardActionsModule } from '../component/card-actions/card-actions.module';
import { StepWizardModule } from '../component/step-wizard/step-wizard.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalOffenseModule } from '../component/modal-offense/modal-offense.module';
import { ROUTES } from './arrest.routing';
import { PreloaderModule } from '../../shared/preloader/preloader.module';
import { ManageConfig } from './components/manage/manage.config';
import { MyDatePickerModule } from 'mydatepicker';
import { NguCarouselModule } from '@ngu/carousel';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { NumberCommaDirective } from './number-comma.directive';
import { OwlModule } from 'ngx-owl-carousel';

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
    // PreloaderModule,
    OwlModule,
    MyDatePickerTHModule,
    // NguCarouselModule
    // ['ui.carousel']
  ],
  declarations: [...fromComponents.components, NumberCommaDirective],
  exports: [...fromComponents.components],
  providers: [...fromServices.services, ManageConfig]
})
export class ArrestModule {

}
