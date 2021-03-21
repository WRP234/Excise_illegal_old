import { LawsuitService } from "../../lawsuit.service";
import { CardActionsModule } from "../../../component/card-actions/card-actions.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { NgbDatepickerI18n, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PrintLawsuitModalModule } from '../print-doc-modal/print-doc-modal.module';
import { DatepickerI18nService } from "../../../../services/datepicker-i18n.service";
import { MatDialogModule } from '@angular/material/dialog';
import { MyDatePickerTHModule } from "mydatepicker-th";
import { MyDatePickerModule } from "mydatepicker";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DialogJudgment } from './dialog-judgment'
import { StepWizardModule } from '../../../component/step-wizard/step-wizard.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NumberCommaDirective } from '../../../../shared/pipe/number-comma.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    NgbModule.forRoot(),
    CardActionsModule,
    PrintLawsuitModalModule,
    MatDialogModule,
    MyDatePickerTHModule,
    MyDatePickerModule,
    MatAutocompleteModule,
    StepWizardModule,
    SweetAlert2Module.forRoot()
  ],
  entryComponents: [
    DialogJudgment
  ],
  declarations: [
    DialogJudgment,
    NumberCommaDirective
  ], providers: [
    { provide: NgbDatepickerI18n, useClass: DatepickerI18nService },
    LawsuitService
  ]
})
export class ManageLawsuitModule { }
