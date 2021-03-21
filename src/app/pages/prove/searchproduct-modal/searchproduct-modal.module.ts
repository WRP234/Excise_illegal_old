import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchProductModalComponent } from './searchproduct-modal.component';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { IsPipeModule } from "../../../shared/pipe/IsPipe.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CardActionsModule,
    FormsModule,
    IsPipeModule,
    PaginationTableModule
  ],
  declarations: [SearchProductModalComponent],
  exports: [
    SearchProductModalComponent
  ]
})
export class SearchProductModalModule { }
