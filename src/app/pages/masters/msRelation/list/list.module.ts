import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../../component/card-actions/card-actions.module';
import { MasterService } from '../../masters.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../../component/pagination-table/pagination-table.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const routes: Routes = [
    {
        path: '',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหาข้อมูลความสัมพันธ์' }],
            codePage: 'ILG60_M_08_00_01_00'
        },
        
        component: ListComponent
    }
]

@NgModule({
    imports: [
      CommonModule,
      HttpModule,
      HttpClientModule,
      FormsModule,
      RouterModule.forChild(routes),
      CardActionsModule,
      PaginationTableModule,
      MyDatePickerTHModule,
      MatAutocompleteModule
    ],
    declarations: [ListComponent],
    providers: [MasterService],
    exports: [MatAutocompleteModule]
  })
  export class ListModule { }
