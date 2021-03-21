import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { SuppressTarget } from '../suppressTarget.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { PrintDocModalModule } from '../printdoc-model/printdoc.module'

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'ค้นหาข้อมูล',
            urls: [{ title: 'หน้าหลัก', url: '/' }, 
            { title: 'ค้นหาเป้าปราบปราม', url:'/SuppressTarget/list'},
            { title: 'จัดการข้อมูลเป้าปราบปราม', url:'/SuppressTarget/manages'},
            
            {
                title: 'จัดการข้อมูลรายละเอียดเป้าปราบปราม',
                url: '/SuppressTarget/manages/target'
            }],
            // nextPage: { title: 'งาน', url: '/SuppressTarget/manages' },
            codePage: 'ILG60_O_01_01_03_00'
        },
        component: CreateComponent
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
        PrintDocModalModule
    ],
    declarations: [CreateComponent,],
    providers: [SuppressTarget]
})
export class CreateModule { }