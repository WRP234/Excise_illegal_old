import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveEvidenceJoinModalComponent } from './proveevidencejoin-modal.component';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CardActionsModule,
    FormsModule,
    PaginationTableModule
  ],
  declarations: [ProveEvidenceJoinModalComponent],
  exports: [
    ProveEvidenceJoinModalComponent
  ]
})
export class ProveEvidenceJoinModalModule { }
