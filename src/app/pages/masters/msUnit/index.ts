import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { MasUnitService } from './masUnit.service';


export const components: any[] = [
    ListComponent,
    ManageComponent
]

export const services: any[] = [
    MasUnitService
]

export * from './list/list.component';
export * from './manage/manage.component';