import { PrintdocModalComponent } from './printdoc-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [PrintdocModalComponent],
  exports: [PrintdocModalComponent]
})
export class PrintdocModalModule { }
