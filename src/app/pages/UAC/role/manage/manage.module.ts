import { Routes, RouterModule } from '@angular/router';
import { RoleManageComponent } from './manage.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CardActionsModule } from '../../../component/card-actions/card-actions.module';
import { ManageService } from './manage.service';

const routes: Routes = [
    {
        path: '',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' },{ title: 'ค้นหาเจ้าพนักงานเพื่อจัดการสิทธิเข้าถึงข้อมูล', url: '/uac/role/list' }, 
            { title: 'การจัดการสิทธิเข้าถึงข้อมูลระบบผู้กระทำผิด' }],
            pageType: 'list',
            // nextPage: { title: 'แจ้งความ', url: '' },
            codePage: 'ILG60-23-02-00-00'
        },
        component: RoleManageComponent
    }
]

@NgModule({
    imports: [
      CommonModule,
      HttpModule,
      HttpClientModule,
      FormsModule,
      RouterModule.forChild(routes),
      CardActionsModule
    ],
    declarations: [RoleManageComponent],
    providers: [ManageService]
})
export class ManageModule { }