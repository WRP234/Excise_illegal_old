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
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { InvestgateService } from '../services';

const routes: Routes = [
    {
        path: '',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหางานการสืบสวน' }],
            codePage: 'ILG60_O_01_05_01_00',
            nextPage: { title: 'รายงานสืบสวน', url: '/investigation/manage' }
        },
        component: ListComponent
    }
]

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        HttpModule,
        HttpClientModule,
        RouterModule.forChild(routes),
        CardActionsModule,
        PaginationTableModule,
        MyDatePickerTHModule,
        SweetAlert2Module.forRoot()
    ],
    declarations: [
        ListComponent,
    ],
    providers: [
        InvestgateService
    ]
})
export class ListModule { }
