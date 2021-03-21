import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { LawbreakerComponent } from './lawbreaker.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '',
    data: {
      urls: [
        { title: 'หน้าหลัก', url: '/' },
        { title: 'ค้นหางานการสืบสวน', url: '/investigation/list' },
        { title: 'จัดการงานสืบสวน', url: '/investigation/manage/C/NEW' },
        { title: 'จัดการข้อมูลรายละเอียดรายงานการสืบสวน' },
        { title: 'จัดการข้อมูลผู้ต้องหา' }
      ],
      codePage: 'ILG60-99-02-02-00'
    },
    component: LawbreakerComponent
}
];

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        CardActionsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
      LawbreakerComponent
    ]
})
export class LawbreakerModule { }
