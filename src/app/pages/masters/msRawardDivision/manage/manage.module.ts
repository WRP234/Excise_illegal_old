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
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { PaginationTableModule } from '../../../component/pagination-table/pagination-table.module';

const routes: Routes = [
    {
        path: '',
        data: {
            urls: [
                { title: 'หน้าหลัก', url: '/' },
                { title: 'การจัดการสัดส่วนการแบ่งเงินรางวัล' },
                
            ],
            nextPage: { title: '', url: '' },
            codePage: 'ILG60-99-17-01-00'
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
        MatAutocompleteModule,
        PaginationTableModule
    ],
    declarations: [ManageComponent],
    providers: [MasterService],
    exports: [MatAutocompleteModule]
})
export class ManageModule { }
