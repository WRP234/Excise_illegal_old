import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { RevenueService } from '../revenue.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RevenueMasterService } from '../revenue.mas.service'

const routes: Routes = [
    {
        path: '',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหางานนำส่งเงินรายได้' }],
            codePage: 'ILG60_O_06_00_01_00'
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
        NgbModule.forRoot()
    ],
    declarations: [ListComponent],
    providers: [RevenueService, RevenueMasterService],
    exports: [MatAutocompleteModule]
})
export class ListModule { }
