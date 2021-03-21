import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import {
  LocationStrategy,
  HashLocationStrategy,
  CommonModule,
} from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { NavigationComponent } from "./shared/header-navigation/navigation.component";
import {
  SidebarComponent,
  SidebarService,
} from "./shared/sidebar/sidebar.component";
import { BreadcrumbComponent } from "./shared/breadcrumb/breadcrumb.component";
import { RightSidebarComponent } from "./shared/right-sidebar/rightsidebar.component";
import { AppComponent } from "./app.component";
import { routes } from "./app.routing";
import { NavigationService } from "./shared/header-navigation/navigation.service";
import { Nav_target_Service } from "./shared/header-navigation/nav_target.service";
import { PreloaderModule } from "./shared/preloader/preloader.module";

import { MatAutocompleteModule } from "@angular/material";
import { LayoutComponent } from "./shared/layout/layout.component";
import { AuthGuard } from "./pages/login/auth.guard";
import { CoreModule } from "./core/core.module";
//ไม่ได้ใช้// import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from "@angular/common/http";

import { TransactionRunningService } from "./services/transaction-running.service";
import { MasDocumentMainService } from "./services/mas-document-main.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthService } from "./pages/login/auth.service";
import { CaseStatusService } from "./pages/caseTracking/caseStatus/caseStatus.service";
import { MainMasterService } from "./services/main-master.service";

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent,
    RightSidebarComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    PreloaderModule,
    CoreModule,
    MatAutocompleteModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthGuard,
    AuthService,
    NavigationService,
    SidebarService,
    MainMasterService,
    MasDocumentMainService,
    TransactionRunningService,
    Nav_target_Service,
    CaseStatusService,
  ],
  exports: [MatAutocompleteModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
