import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { PuritycertService } from '../puritycert.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { PreloaderModule } from '../../../shared/preloader/preloader.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlModule } from 'ngx-owl-carousel';
import { MyDatePickerModule } from 'mydatepicker';
import {SharedModule} from '../../reward/shared/shared.module';

const routes: Routes = [
  {
      path: '',
      data: {
          urls: [{ title: 'หน้าหลัก', url: '/' },
                 { title: 'ค้นหาใบรับรองความบริสุทธิ์', url: '/puritycerts/list'  }],
          nextPage: { title: 'จัดการข้อมูลใบรับรองความบริสุทธิ์', url: '/puritycerts/manage' },
          codePage: 'ILG60_O_01_02_01_00'
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
    OwlModule,
    MyDatePickerModule,
    PreloaderModule,
    NgbModule,
    SharedModule
  ],
  declarations: [ListComponent],
  providers: [PuritycertService]
})
export class ListModule { }
