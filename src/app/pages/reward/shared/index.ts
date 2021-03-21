import { FormGroupComponent } from './form-group/form-group.component';
import { TableDataComponent } from './table-data/table-data.component';
import { PagerService } from './services/Pager.service';
import { PrintDialogComponent } from './print-dialog/print-dialog.component';
import { TIMELINE_COMPONENTS } from './timeline';

export const REWARD_SHARED_COMPONENTS = [
  FormGroupComponent,
  TableDataComponent,
  PrintDialogComponent,
  ...TIMELINE_COMPONENTS
];
export const REWARD_SHARED_SERVICES = [PagerService];
