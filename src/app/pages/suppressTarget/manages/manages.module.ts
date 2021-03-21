import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagesComponent } from './manages.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { SuppressTarget } from '../suppressTarget.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { TargetService } from '../target.service';
import { PrintDocModalModule } from '../printdoc-model/printdoc.module';
// import { BrowserModule } from '@angular/platform-browser';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
 
// Import your library
// import { AutocompleteModule } from 'ng2-input-autocomplete';

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'ค้นหาข้อมูล',
            urls: [{ title: 'หน้าหลัก', url: '/' }, 
            { title: 'ค้นหาเป้าปราบปราม', url:'/SuppressTarget/list'},
            { title: 'จัดการข้อมูลรายละเอียดเป้าหมายปราบปราม', url:'/SuppressTarget/manages'}],
            // nextPage: { title: 'สร้างเป้าปราบปราม', url: 'SuppressTarget/create' },
            codePage: 'ILG60_O_01_01_02_00'},
        component: ManagesComponent
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
        PrintDocModalModule,
        // NoopAnimationsModule,
        // AutocompleteModule.forRoot()
    ],
    declarations: [ManagesComponent],
    providers: [SuppressTarget,TargetService]
})
export class ManagesModule { }
