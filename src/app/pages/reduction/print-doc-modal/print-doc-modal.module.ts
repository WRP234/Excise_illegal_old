import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintDocModalComponent } from './print-doc-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
  ],
  declarations: [PrintDocModalComponent],
  exports: [ PrintDocModalComponent ],
  entryComponents: [ PrintDocModalComponent ]
})
export class PrintReductionModalModule { }
