import { Component, OnInit, OnDestroy, ElementRef, ChangeDetectorRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { pagination } from '../../../../config/pagination';
import { Router } from '@angular/router';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { Message } from '../../../../config/message';
import { Subject } from 'rxjs';
import { SidebarService } from '../../../../shared/sidebar/sidebar.component';
import swal from 'sweetalert2'
import { UserListService } from './list.service';
import * as uacDataModel from '../../uac-user-datamodel';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ListStaffModel } from '../manage/list-staff-model';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class UserListComponent implements OnInit, OnDestroy {
  @ViewChild('advForm') advForm: NgForm;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  paginage = pagination;
  advSearch: any;
  userAccountList = new Array<uacDataModel.UserAccountListItem>();
  userAccounts = new Array<uacDataModel.UserAccountListItem>();
  showAdvSearch = new BehaviorSubject<Boolean>(true);



  getUserAccountlist = [];
  getUserAccountPagelist = [];
  detailStaff;

  constructor(private router: Router,
    private navService: NavigationService,
    private sidebarService: SidebarService,
    private userListService: UserListService) {
  }

  async ngOnInit() {
    localStorage.setItem('programcode', 'ILG60-12-00');
    this.sidebarService.setVersion('UserAccount List 0.0.0.2');

    // set button false
    await this.navService.setEditButton(false);
    await this.navService.setDeleteButton(false);
    await this.navService.setPrintButton(false);
    await this.navService.setSaveButton(false);
    await this.navService.setCancelButton(false);
    await this.navService.setNextPageButton(false);
    await this.navService.setNewButton(false);
    // set button true
    await this.navService.setSearchBar(true);
    await this.navService.searchByKeyword.getValue

    // this.advSearch = this.navService.showAdvSearch;
    this.advSearch = this.showAdvSearch;

    this.navService.searchByKeyword
      .takeUntil(this.destroy$)
      .subscribe(async Textsearch => {
        if (Textsearch) {
          await this.navService.setOnSearch('');
          this.onSearch(Textsearch);
        }
      })
  }

  onSearch(value: any) {


    const params = {

      TEXT_SEARCH: value.TEXT_SEARCH

    }
    this.searchByKeyword(params);
    // let request: uacDataModel.UserAccountListgetByKeywordRequest = new uacDataModel.UserAccountListgetByKeywordRequest();
    // request.TextSearch = Textsearch.Textsearch == null ? "" : Textsearch.Textsearch;
    // console.log(request)
    // this.userListService.loadUserAccountListgetByKeyword(request).then(result => {

    //   console.log(result)
    // if (!this.userListService.UserAccountList.length) {
    //   swal('', Message.noRecord, 'warning');
    //   this.paginage.TotalItems = 0;
    // } else {
    //   this.userAccounts = this.userListService.UserAccountList;
    //   this.userAccountList = this.userAccounts.slice(0, 5);
    //   // set total record                           
    //   this.paginage.TotalItems = this.userAccounts.length;
    // }
    // }).catch(error => {
    //   swal('', error, 'error');
    // });
  }
  onAdvSearch(form: any) {
    // console.log(form)

    const params = {

      MANAGEMENT_POS_NAME: "",
      OPERATION_DEPT_NAME: "",
      OPERATION_OFFICE_NAME: "",
      OPERATION_OFFICE_SHORT_NAME: "",
      OPERATION_UNDER_DEPT_NAME: "",
      OPREATION_POS_NAME: "",
      REPRESENT_POS_NAME: "",
      STAFF_CODE: "",
      STAFF_NAME: "",

      USER_NAME: "",


    }
    this.searchConditionAdvance(params);

  }

  searchByKeyword(params) {

    this.getUserAccountlist = []
    this.getUserAccountPagelist = []
    this.paginage.TotalItems = 0;
    this.userListService.SearchByKeyword(params).then(data => {
      const result = data as any;
      this.searchStaffDetail(result);
      // if (result.length > 0) {
      //   for (let i = 0; i < result.length; i++) {
      //     result[i].count_number = i + 1
      //     this.getUserAccountlist.push(result[i])
      //     this.getUserAccountPagelist.push(result[i])

      //   }
      //   this.getUserAccountlist.slice(0, 5);
      //   this.paginage.TotalItems = result.length;

      // }
      // else {
      //   this.paginage.TotalItems = 0;
      // }

    })


  }
  async pageChanges(event: any) {

    this.getUserAccountlist = await this.getUserAccountPagelist.slice(event.startIndex - 1, event.endIndex);
  }
  searchConditionAdvance(params) {
    // console.log(params)

    this.getUserAccountlist = []
    this.getUserAccountPagelist = []
    this.paginage.TotalItems = 0;
    this.userListService.SearchByAdvance(params).then(data => {
      const result = data as any;
      this.searchStaffDetail(result);



    })
  }
  searchStaffDetail(result) {


    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        result[i].count_number = i + 1

        const params = {
          TEXT_SEARCH: "",
          STAFF_ID: result[i].STAFF_ID
        };
        this.userListService.searchStaff(params).then(data => {
          const detailStaff = data as ListStaffModel;

          if (detailStaff.RESPONSE_DATA.length > 0) {
            result[i].postion = detailStaff.RESPONSE_DATA[0].OPREATION_POS_NAME;
            result[i].deparment = detailStaff.RESPONSE_DATA[0].OPERATION_DEPT_NAME;
            result[i].name =
              detailStaff.RESPONSE_DATA[0].TITLE_NAME_TH +
              " " +
              detailStaff.RESPONSE_DATA[0].FIRST_NAME +
              " " +
              detailStaff.RESPONSE_DATA[0].LAST_NAME;
          }
        });



        this.getUserAccountlist.push(result[i])
        this.getUserAccountPagelist.push(result[i])

      }
      this.getUserAccountlist.slice(0, 5);
      this.paginage.TotalItems = result.length;


    }
    else {
      this.paginage.TotalItems = 0;
    }


    // const params = {
    //   TEXT_SEARCH: "",
    //   STAFF_ID: result.STAFF_ID
    // };
    //  this.userListService.searchStaff(params).then(data => {
    //   this.detailStaff = data as ListStaffModel;
    //   console.log(this.detailStaff.RESPONSE_DATA)
    //   if (this.detailStaff.RESPONSE_DATA.length > 0) {

    //   }
    // });
  }


  clickManage(userAccount) {

    if (userAccount.ROLE_ID == null) {
      swal('', 'กรุณาติดต่อผู้ดูแลระบบเพื่อกำหนดบทบาท การเข้าใช้งานระบบ !', 'warning');
      return;
    }

    this.router.navigate([`/uac/useraccount/manage/${userAccount.USER_ACCOUNT_ID}`]);
  }
  clickNew() {
    // console.log(userAccount)
    // if (userAccount.ROLE_ID == null) {
    //   swal('', 'กรุณาติดต่อผู้ดูแลระบบเพื่อกำหนดบทบาท การเข้าใช้งานระบบ !', 'warning');
    //   return;
    // }

    this.router.navigate([`/uac/useraccount/manage/0`]);
  }

  // async onAdvSearch(form: any) {
  //   let request: uacDataModel.UserAccountListgetByConAdvRequest = new uacDataModel.UserAccountListgetByConAdvRequest()

  //   request.staffName = form.StaffName;
  //   request.officeName = form.OfficeName;
  //   request.operationPosName = form.PositionName;
  //   //console.log(JSON.stringify(request));
  //   this.userListService.loadUserAccountListgetByConAdv(request).then(result => {
  //     if (result == "OK") {
  //       if (!this.userListService.UserAccountList.length) {
  //         swal('', Message.noRecord, 'warning');
  //         this.paginage.TotalItems = 0;
  //       } else {
  //         this.userAccounts = this.userListService.UserAccountList;
  //         this.userAccountList = this.userAccounts.slice(0, 5);
  //         // set total record                           
  //         this.paginage.TotalItems = this.userAccounts.length;
  //       }
  //     }
  //   }).catch(error => {
  //     alert(error);
  //   });
  // }

  ngOnDestroy() {
    this.paginage.TotalItems = 0;
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.advSearch.next(false);
  }
}