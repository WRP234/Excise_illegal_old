import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../../component/card-actions/card-actions.module';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../../component/pagination-table/pagination-table.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
// import { MasProdService } from '../masProd.service';
// import { MasProductService } from '../masProduct.service'
import { MatAutocompleteModule } from '@angular/material/autocomplete';


const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'ค้นหาข้อมูล',
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหางานติดตามสถานะคดี', url: '/caseStatus/list' }], 
            // nextPage: { title: 'xxx', url: '/masProducts/list' },
            codePage: 'ILG60_O_10_01_01_00'
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
        MatAutocompleteModule
    ],
    declarations: [ListComponent],
    providers: [],
    exports: [MatAutocompleteModule]
})
export class ListModule { }