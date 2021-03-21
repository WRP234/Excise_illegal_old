import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../../component/card-actions/card-actions.module';
import { MasterService } from '../../masters.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StaffModalModule } from '../staff-modal/staff-modal.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { PaginationTableModule } from '../../../component/pagination-table/pagination-table.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'จัดการข้อมูล',
            urls: [
                { title: 'หน้าหลัก', url: '/' },
                { title: 'ค้นหาคณะผู้จับกุม ผู้ตรวจ', url: '/msArrests/list' },
                { title: 'การจัดการคณะผู้จับกุม ผู้ตรวจ' },
                
            ],
            nextPage: { title: '', url: '' },
            codePage: 'ILG60-99-05-02-01'
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
        StaffModalModule,
        MyDatePickerTHModule,
        MatAutocompleteModule,
        PaginationTableModule,
        NgbModule.forRoot()
    ],
    declarations: [ManageComponent],
    providers: [MasterService],
    exports: [MatAutocompleteModule]
})
export class ManageModule { }
