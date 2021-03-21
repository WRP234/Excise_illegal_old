import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PaginationTableModule } from '../component/pagination-table/pagination-table.module';
import { CardActionsModule } from '../component/card-actions/card-actions.module';
import { StepWizardModule } from '../component/step-wizard/step-wizard.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalOffenseModule } from '../component/modal-offense/modal-offense.module';
import { ROUTES } from './lawsuit.routing';
import { LawsuitService } from './lawsuit.service';
import { MyDatePickerModule } from 'mydatepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { PrintLawsuitModalModule } from './components/print-doc-modal/print-doc-modal.module';
import { MatAutocompleteModule } from '@angular/material';
import { ManageComponent } from '../masters/msLawGroup/manage/manage.component';
import { ManageLawsuitModule } from './components/manage/manage.module';
import { OwlModule } from 'ngx-owl-carousel';
import { DocumentModule } from './components/document/document.module';
import * as fromComponents from './components';


@NgModule({
  imports: [
    CommonModule,
    ManageLawsuitModule,
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
    TypeaheadModule.forRoot(),
    PrintLawsuitModalModule,
    MatAutocompleteModule,
    DocumentModule,
    OwlModule
  ],
  declarations: [...fromComponents.components,],
  exports: [...fromComponents.components],
  providers: [LawsuitService, ManageComponent]
})

export class LawsuitModule { }