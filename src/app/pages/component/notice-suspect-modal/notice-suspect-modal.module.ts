import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeSuspectModalComponent, NoticeSuspectService } from './notice-suspect-modal.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardActionsModule } from '../card-actions/card-actions.module';
import { PaginationTableModule } from '../pagination-table/pagination-table.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CardActionsModule,
    PaginationTableModule,
    SweetAlert2Module.forRoot()
  ],
  declarations: [NoticeSuspectModalComponent],
  exports: [NoticeSuspectModalComponent],
  providers: [NoticeSuspectService]
})
export class NoticeSuspectModalModule { }
