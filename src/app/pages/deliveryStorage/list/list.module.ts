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
import { DeliveryStorageService } from '../deliveryStorage.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'ค้นหาข้อมูล',
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหารายการนำส่งของกลางเพื่อจัดเก็บ' }],
            codePage: 'ILG60_O_08_01_01_00'
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
      NgbModule
    ],
    declarations: [ListComponent],
    providers: [DeliveryStorageService],
    exports: [MatAutocompleteModule]
  })
  export class ListModule { }
