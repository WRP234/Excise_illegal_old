import { Routes } from '@angular/router';
import * as fromComponents from './index';

export const ROUTES: Routes = [
    {
        path: 'list',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหารายการตรวจรับของกลางจากการโอนย้าย' }],
            codePage: 'ILG60_O_10_02_01_00'
        },
        component: fromComponents.ListComponent
    },
    {
        path: 'manage/:mode/:code',
        data: {
            urls: [
                { title: 'หน้าหลัก', url: '/' },
                { title: 'ค้นหารายการตรวจรับของกลางจากการโอนย้าย', url: '/receivedFromTransfer/list' },
                { title: 'จัดการข้อมูลรายการตรวจรับของกลางจากจากงานโอนย้าย' }
            ],
            codePage: 'ILG60_O_10_02_02_00'
        },
        component: fromComponents.ManageComponent
    }
]
