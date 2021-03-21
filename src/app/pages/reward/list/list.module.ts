import { NavigationComponent } from '../../../shared/header-navigation/navigation.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MyDatePickerModule } from 'mydatepicker';
import { MatInputModule } from '@angular/material';
import { RewardService } from  '../reward.service';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { ThaiDatePipe,NoyearPipe } from '../thaidate.pipe';

const routes: Routes = [
    {
        path: '',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหางานคำร้องขอรับเงินสินบนรางวัล' }],
            codePage: 'ILG60-07-00-01-00',
            pageType: 'list',
            nextPage: { title: 'จัดการข้อมูลคำร้องขอรับเงินรางวัล', url: '/reward/manage' }
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
    providers: [NavigationComponent ,RewardService],
    declarations: [ListComponent,ThaiDatePipe,NoyearPipe]
})
export class ListModule { }
