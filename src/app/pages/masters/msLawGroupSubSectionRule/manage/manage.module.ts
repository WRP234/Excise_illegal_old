import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../../component/card-actions/card-actions.module';
import { MasterService } from '../../masters.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { PaginationTableModule } from '../../../component/pagination-table/pagination-table.module';
import { IsPipeModule } from '../../../../shared/pipe/IsPipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'จัดการข้อมูล',
            urls: [
                { title: 'หน้าหลัก', url: '/' },
                { title: 'ค้นหาบัญชีรายละเอียดฐานความผิดและอัตรโทษ', url: '/msLawGroupSubSectionRule/list' },
                { title: 'การจัดการบัญชีรายละเอียดฐานความผิดและอัตรโทษ' },
                
            ],
            nextPage: { title: '', url: '' },
            codePage: 'ILG60_M_14_03_02_00'
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
        CardActionsModule,
        MyDatePickerTHModule,
        PaginationTableModule,
        IsPipeModule,
        NgbModule.forRoot()
    ],
    declarations: [ManageComponent],
    providers: [MasterService],
    exports: []
})
export class ManageModule { }
