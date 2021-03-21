import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { DocumentComponent } from './document/document.component';

export const components: any[] = [
    ListComponent,
    ManageComponent,
    DocumentComponent
];

export * from "./manage/manage.component";
export * from "./list/list.component";
export * from "./document/document.component";