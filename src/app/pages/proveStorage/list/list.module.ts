import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProveStorageService } from '../proveStorage.service';
import { MyDatePickerModule } from 'mydatepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'ค้นหาข้อมูล',
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหารายการตรวจรับของกลางเพื่อเก็บ' }],
            codePage: 'ILG60_O_08_02_01_00'
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
      MatAutocompleteModule,
      MyDatePickerModule,
      NgbModule
    ],
    declarations: [ListComponent],
    providers: [ProveStorageService],
    exports: [MatAutocompleteModule]
  })
  export class ListModule { }
