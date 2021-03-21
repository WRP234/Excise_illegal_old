import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardActionsModule,
    PaginationTableModule
  ],
  declarations: [ProductsComponent],
  exports: [ProductsComponent]
})
export class ProductsModule { }