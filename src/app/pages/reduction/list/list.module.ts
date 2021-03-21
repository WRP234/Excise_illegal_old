import { NavigationComponent } from '../../../shared/header-navigation/navigation.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReductionApiService } from '../reduction.api.service';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MyDatePickerModule } from 'mydatepicker';
import { MatInputModule } from '@angular/material';
import { ReductionService } from  '../reduction.service';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { ThaiDatePipe } from '../thaidate.pipe';

const routes: Routes = [
    {
        path: '',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหางานรายการปรับเพิ่ม-ปรับลด' }],
            codePage: 'ILG60-08-00-01-00',
            pageType: 'list',
            nextPage: { title: 'จัดการข้อมูลรายการปรับเพิ่ม-ปรับลด', url: '/reduction/manage' }
        },
        component: ListComponent
    }
]

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild(routes),
        MyDatePickerTHModule,
        MyDatePickerModule,
        MatInputModule,
        CardActionsModule,
        PaginationTableModule
    ],
    providers: [NavigationComponent, ReductionApiService ,ReductionService],
    declarations: [ListComponent,ThaiDatePipe]
})
export class ListModule { }
