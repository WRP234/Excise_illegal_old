import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvidenceTypeModalComponent } from './evidencetype-modal.component';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CardActionsModule,
    FormsModule
  ],
  declarations: [EvidenceTypeModalComponent],
  exports: [
    EvidenceTypeModalComponent
  ]
})
export class EvidenceTypeModalModule { }
