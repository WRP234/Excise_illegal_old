import { Routes, RouterModule } from '@angular/router';
import { RoleListComponent } from './list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MyDatePickerModule } from 'mydatepicker';
import { PaginationTableModule } from '../../../component/pagination-table/pagination-table.module';
import { CardActionsModule } from '../../../component/card-actions/card-actions.module';
import {RoleListService } from './list.service';

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'ค้นหาข้อมูล',
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหาบทบาทงานเพื่อจัดการรายละเอียด' }],
            pageType: 'list',
            // nextPage: { title: '', url: '/list/manage' },
            codePage: 'ILG60-23-01-00-00'
        },
        component: RoleListComponent
    }
]
@NgModule({
    imports: [
      CommonModule,
      HttpModule,
      HttpClientModule,
      FormsModule,
      RouterModule.forChild(routes),
      MyDatePickerTHModule,
      MyDatePickerModule,
      PaginationTableModule,
      CardActionsModule
    ],
    declarations: [RoleListComponent],
    providers: [RoleListService]
})
export class ListModule { }