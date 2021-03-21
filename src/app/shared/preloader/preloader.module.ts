import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreloaderComponent, PreloaderService } from "./preloader.component";

@NgModule({
    imports: [
      CommonModule
    ],
    declarations: [PreloaderComponent],
    exports: [PreloaderComponent],
    providers: [PreloaderService]
  })
  export class PreloaderModule { }
