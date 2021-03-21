import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { NavigationService } from '../../../../shared/header-navigation/navigation.service';
import { pagination } from '../../../../config/pagination';
import { SuppressTarget } from '../../suppressTarget.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import {Nav_target_Service} from '../../../../shared/header-navigation/nav_target.service';
// import {Nav_Parktarget_Service} from '../nav_target.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ListComponent implements OnInit {
  
  private destroy$: Subject<boolean> = new Subject<boolean>();
  paginage = pagination;
  constructor(
    private navService: Nav_target_Service,
    private suppressTarget: SuppressTarget,
    private router: Router,
  ) { }

  ngOnInit() {
    localStorage.setItem('programcode', 'ILG60-99-01');
    this.navService.setSearchBar(true)
    


    // set true in my module
    // this.navService.setSearchBar_targetArea(true);
    


    // this.navigate_service();
  }

  viewTarget() {
    // switch (this.mode){
    //   case 'C' :{
    //     this.enableBtnC();
    //     this.router.navigate(['/SuppressTarget/manages/create']);
    // // this.navService
    //   }
    // }
    this.router.navigate(['/SuppressTarget/ParkTarget/view']);
    // this.OnCreate();
    // this.navService
    // this.ngView_target();
  }
  ngOnDestroy(): void {
    this.navService.setSearchBar(false)
    // this.navService.setSearchBar_target(false);
    // this.navService.setNewButton_target(false);
    // this.destroy$.unsubscribe();
  }
  ngView_target(): void {
    // this.navService.setOnSendIncome_target(true);
    // this.navService.setPrintButton_target(true);
    // this.navService.setEditButton_target(true);
    // this.navService.setDeleteButton_target(true);
    // this.navService.setSendButton_target(true);
    // this.navService.setSendTargetButton_target(true);
    // this.navService.setEditField(false);
    // this.navService.setEditField_target(true);
  }

}
