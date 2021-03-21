import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IsActivePipe } from "./IsActivePipe";

@NgModule({
    imports: [
      CommonModule
    ],
    declarations: [IsActivePipe],
    exports: [IsActivePipe],
    providers: [IsActivePipe]
  })
  export class IsActivePipeModule { }