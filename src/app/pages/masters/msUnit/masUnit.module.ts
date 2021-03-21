import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Components
import * as fromComponents from './index';

import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { ROUTES } from './masUnit.routing';
import { PreloaderModule } from '../../../shared/preloader/preloader.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(ROUTES),
    CardActionsModule,
    PaginationTableModule
  ],
  declarations: [...fromComponents.components],
  exports: [...fromComponents.components],
  providers: [...fromComponents.services, ]
})
export class masUnitModule {

}
