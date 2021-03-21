import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { NoticeService } from '../notice.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
    {
        path: '',
        data: {
            urls: [
                { title: 'หน้าหลัก', url: '/' }, 
                { title: 'ค้นหาใบแจ้งความนำจับ' }
            ],
            codePage: 'ILG60_O_01_04_01_00' 
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
        SweetAlert2Module.forRoot(),
        NgbModule
    ],
    declarations: [
        ListComponent,
    ],
    providers: [
        NoticeService
    ]
})
export class ListModule { }
