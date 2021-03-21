import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MyDatePickerModule } from 'mydatepicker';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';


const routes: Routes = [
    {
        path: '',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' },{ title: 'ค้นหาเจ้าพนักงานเพื่อจัดการสิทธิเข้าถึงข้อมูล', url: '/uac/list' }, 
            { title: 'การจัดการสิทธิเข้าถึงข้อมูลระบบผู้กระทำผิด' }],
            pageType: 'list',
            // nextPage: { title: 'แจ้งความ', url: '' },
            codePage: 'ILG60-11-02-00-00'
        },
        component: ManageComponent
    }
]

@NgModule({
    imports: [
      CommonModule,
      HttpModule,
      HttpClientModule,
      FormsModule,
      RouterModule.forChild(routes),
      MyDatePickerTHModule,
      MyDatePickerModule,
      CardActionsModule
    ],
    declarations: [ManageComponent],
    providers: []
})
export class ManageModule { }