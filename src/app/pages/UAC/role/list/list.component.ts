import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { pagination } from '../../../../config/pagination';
import { Router } from '@angular/router';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { Message } from '../../../../config/message';
import { Subject } from 'rxjs';
import { RoleListService } from './list.service';
import { SidebarService } from '../../../../shared/sidebar/sidebar.component';
import swal from 'sweetalert2'
import * as uacDataModel from '../../uac-user-datamodel';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-role-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class RoleListComponent implements OnInit, OnDestroy {
  @ViewChild('advForm') advForm: NgForm;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  paginage = pagination;
  advSearch: any;
  showAdvSearch = new BehaviorSubject<Boolean>(true);
  roleList = new Array<uacDataModel.RoleListItem>();
  roles = new Array<uacDataModel.RoleListItem>();

  roleListPage: uacDataModel.RoleListItem[] = [];
  roleListPageAll: uacDataModel.RoleListItem[] = [];


  constructor(private router: Router,
    private navService: NavigationService,
    private sidebarService: SidebarService,
    private roleListService: RoleListService) {
    
  }

  async ngOnInit() {
    localStorage.setItem('programcode', 'ILG60-12-00');
    this.sidebarService.setVersion('Role List 0.0.0.1');

    // set button false
    this.navService.setEditButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setPrintButton(false);
    this.navService.setSaveButton(false);
    this.navService.setCancelButton(false);
    this.navService.setNextPageButton(false);
    this.navService.setNewButton(false);
    // set button true
    this.navService.setSearchBar(true);
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


  // private onSearchComplete(list: uacDataModel.RoleListItem[]) {
  //   console.log('onSearchComplete -> ', list.length);
  //   if (!list.length) {
  //     swal('', Message.noRecord, 'warning');
  //     return false;
  //   }

  //   this.roles = list;
  //   this.roleList = this.roles.slice(0, 5);
  //   // set total record     
  //   this.paginage.TotalItems = this.roles.length;
  // }

  onSearch(Textsearch: any) {
    this.roleListPage=[]
    this.roleListPageAll =[]
    this.paginage.TotalItems = 0;
    let request: uacDataModel.RoleListgetByKeywordRequest = new uacDataModel.RoleListgetByKeywordRequest();
    request.TEXT_SEARCH = Textsearch.TEXT_SEARCH == null ? "" : Textsearch.TEXT_SEARCH;
    this.roleListService.loadRoleListgetByKeyword(request)
    .then(result => {
      if (result.length <= 0) {
        swal('', Message.noRecord, 'warning');
        this.paginage.TotalItems = 0;
      } else {      
        for (let i = 0; i < result.length; i++) {
          result[i].count_number = i + 1
          this.roleListPage.push(result[i])
          this.roleListPageAll.push(result[i])
        }
        // this.roles = this.roleListService.RoleList;
        this.roleListPage.slice(0, 5);                       
        this.paginage.TotalItems = result.length;
      }
      console.log(this.roleListPage)
    })
    .catch(error => {
      console.log(error)
      swal('', error, 'error');
    });
  }

  async pageChanges(event: any) {
    this.roleListPage = await this.roleListPageAll.slice(event.startIndex - 1, event.endIndex);
  }

  clickManage(role: uacDataModel.RoleListItem) {
    localStorage.setItem('roleID', role.ROLE_ID.toString());
    this.router.navigate(['/uac/role/manage/' + role.ROLE_ID.toString()]);
  }

  async onAdvSearch(form: any) {
    this.roleListPage=[]
    this.roleListPageAll =[]
    this.paginage.TotalItems = 0;
    let request: uacDataModel.RoleListgetByConAdvRequest = new uacDataModel.RoleListgetByConAdvRequest()
    request.ROLE_CODE = form.RoleCode;
    request.ROLE_NAME = form.RoleName;
    this.roleListService.loadRoleListgetByConAdv(request).then(result => {
      if (result.length <= 0) {
        swal('', Message.noRecord, 'warning');
        this.paginage.TotalItems = 0;
      } else {
        for (let i = 0; i < result.length; i++) {
          result[i].count_number = i + 1
          this.roleListPage.push(result[i])
          this.roleListPageAll.push(result[i])
        }
        // this.roles = this.roleListService.RoleList;
        this.roleListPage.slice(0, 5);                       
        this.paginage.TotalItems = result.length;
      }
    }).catch(error => {
      alert(error);
    });
  }

  ngOnDestroy() {
    this.paginage.TotalItems = 0;
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.advSearch.next(false);
  }

  clickNew() {
    this.router.navigate(['/uac/role/manage/0']);
  }
}