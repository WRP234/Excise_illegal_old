import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintLawsuitModalComponent } from './print-doc-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [PrintLawsuitModalComponent],
  exports: [PrintLawsuitModalComponent]
})
export class PrintLawsuitModalModule { }
