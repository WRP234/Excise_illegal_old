import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffModalComponent } from './staff-modal.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../../component/card-actions/card-actions.module';
import { MasterService } from '../../masters.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../../component/pagination-table/pagination-table.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    CardActionsModule,
    PaginationTableModule,
    MyDatePickerTHModule,
    MatAutocompleteModule
  ],
  declarations: [StaffModalComponent],
  exports: [
    StaffModalComponent
  ]
})
export class StaffModalModule { }
