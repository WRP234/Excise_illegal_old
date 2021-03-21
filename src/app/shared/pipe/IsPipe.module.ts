import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IsActivePipe } from "./IsActivePipe";
import { IsProvePipe } from "./IsProvePipe";
import { IsProveSciencePipe } from "./IsProveSciencePipe";
import { IsSelectPipe } from "./IsSelectPipe";

@NgModule({
    imports: [
      CommonModule
    ],
    declarations: [IsActivePipe, IsProvePipe, IsProveSciencePipe, IsSelectPipe],
    exports: [IsActivePipe, IsProvePipe, IsProveSciencePipe, IsSelectPipe],
    providers: [IsActivePipe, IsProvePipe, IsProveSciencePipe, IsSelectPipe]
  })
  export class IsPipeModule { }
