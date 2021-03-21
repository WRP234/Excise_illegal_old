import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { FineService } from '../fine.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { ContributorPipe } from '../../../shared/pipe/ContributorPipe';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MyDatePickerModule } from 'mydatepicker';
import { ThaiDatePipe } from '../thaidate.pipe';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { disnumber } from './disnumber'

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'ค้นหาข้อมูล',
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหางานเปรียบเทียบและชำระค่าปรับ' }],
            pageType: 'list',
            nextPage: { title: 'แจ้งความ', url: '/fine/manage' },
            codePage: 'ILG60_O_05_00_01_00'
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
        MyDatePickerTHModule,
        MyDatePickerModule,
        RouterModule.forChild(routes),
        CardActionsModule,
        PaginationTableModule,
        NgbModule.forRoot(),
    ],
    declarations: [ListComponent, ContributorPipe, ThaiDatePipe, disnumber],
    providers: [FineService,NgbActiveModal,]
})
export class ListModule { }
