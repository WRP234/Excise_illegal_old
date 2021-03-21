import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MyDatePickerModule } from 'mydatepicker';
import { PaginationTableModule } from '../../../component/pagination-table/pagination-table.module';
import { CardActionsModule } from '../../../component/card-actions/card-actions.module';
import { ReportService } from '../../report.service';

const routes: Routes = [
    {
        path: '',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' },
            { title: 'รายงานส่วนคดี', url: '/report/case-report/list' },
            { title: 'รายงานผลคดี' }
            ],
            pageType: 'list',
            codePage: 'ILG60-12-02-00-00'
        },
        component: ManageComponent
    }
];

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
        CardActionsModule,

    ],
    declarations: [ManageComponent],
    providers: [ReportService]
})
export class ManageModule {
}