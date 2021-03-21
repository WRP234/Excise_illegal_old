import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../../component/card-actions/card-actions.module';
import { SuppressTarget } from '../../suppressTarget.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../../component/pagination-table/pagination-table.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'ค้นหาข้อมูล',
            urls: [
                { title: 'หน้าหลัก', url: '/' }, 
                { title: 'ค้นหาเป้าปราบปราม', url:'/SuppressTarget/list'},
                { title: 'ข้อมูลรายละเอียดเป้าหมายปราบปราม', url:'/SuppressTarget/manages/view'}
            
            ],
            nextPage: { title: '', url: '' },
            codePage: 'ILG60_O_01_01_01_00'},
        component: ViewComponent
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
        MyDatePickerTHModule
    ],
    declarations: [ViewComponent],
    providers: [SuppressTarget]
})
export class ViewModule { }