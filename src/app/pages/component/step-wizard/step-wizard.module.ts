import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepWizardComponent } from './step-wizard.component';
import { StepWizardService } from './step-wizard.service'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StepWizardComponent],
  exports: [StepWizardComponent],
  providers: [StepWizardService]
})
export class StepWizardModule { }
