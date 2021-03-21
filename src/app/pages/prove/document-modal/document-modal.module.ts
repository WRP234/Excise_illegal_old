import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocuemntModalComponent } from './document-modal.component';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CardActionsModule,
    PaginationTableModule,
    FormsModule
  ],
  declarations: [DocuemntModalComponent],
  exports: [
    DocuemntModalComponent
  ]
})
export class DocumentModalModule { }
