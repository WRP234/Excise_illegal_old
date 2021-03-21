import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestSuspectModalComponent, InvestSuspectService } from './invest-suspect-modal.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';

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
  declarations: [InvestSuspectModalComponent],
  exports: [InvestSuspectModalComponent],
  providers: [InvestSuspectService]
})
export class InvestSuspectModalModule { }
