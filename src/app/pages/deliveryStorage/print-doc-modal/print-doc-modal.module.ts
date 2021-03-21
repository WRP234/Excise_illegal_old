import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintDocModalComponent } from './print-doc-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [PrintDocModalComponent],
  exports: [PrintDocModalComponent]
})
export class PrintDocModalModule { }
