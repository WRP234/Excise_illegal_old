import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    CardActionsComponent,
    CardActionsCloseComponent,
    CardActionsCollapseComponent
} from './card-actions.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CardActionsComponent,
        CardActionsCloseComponent,
        CardActionsCollapseComponent
    ],
    exports: [
        CardActionsComponent,
        CardActionsCloseComponent,
        CardActionsCollapseComponent
    ]
})
export class CardActionsModule { }
