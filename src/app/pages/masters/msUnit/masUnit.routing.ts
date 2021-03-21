import { Routes } from '@angular/router';

// Components
import * as fromComponents from './index';

export const ROUTES: Routes = [
    {

        path: 'list',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหารายการหน่วยนับ' }],
            codePage: 'ILG60_M_20_00_01_00'
        },
        component: fromComponents.ListComponent
    },
    {
        path: 'manage/:mode/:code',
        data: {
            urls: [
                { title: 'หน้าหลัก', url: '/' },
                { title: 'ค้นหารายการหน่วยนับ', url: '/msUnit/list' },
                { title: 'จัดการข้อมูลหน่วยนับ' }
            ],
            codePage: 'ILG60_M_20_00_02_00',
        },
        component: fromComponents.ManageComponent
    }

]
