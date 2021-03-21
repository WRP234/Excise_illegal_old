import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationTableComponent } from './pagination-table.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [PaginationTableComponent],
  exports: [PaginationTableComponent]
})
export class PaginationTableModule { }
