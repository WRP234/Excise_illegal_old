import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { Nav_Areatarget_Service } from '../nav_target.service';
import { pagination } from '../../../../config/pagination';
import { SuppressTarget } from '../../suppressTarget.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import {Nav_target_Service} from '../../../../shared/header-navigation/nav_target.service'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PreloaderService } from '../../../../shared/preloader/preloader.component';
import { TargetService } from '../../target.service';
import swal from 'sweetalert2';
import { Message } from '../../../../config/message';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ListComponent implements OnInit {
  private prevPageButton = true;

  private destroy$: Subject<boolean> = new Subject<boolean>();

    // buttom on header
    craete_btn = <Boolean>(false);
    search_text= <Boolean>(true);
    // print_btn = <Boolean>(false);
    // edit_btn= <Boolean>(false);
    // delete_btn = <Boolean>(false);
    // save_btn= <Boolean>(false);
    // cancel_btn = <Boolean>(false);

    advSearch: any;
    showAdvSearch = new BehaviorSubject<Boolean>(true);
    dataList = [];
    showDataList = [];
    paginage = pagination;
    modal: any;

    //var of api
    TargetList: any;
  
  constructor(
    private navService: Nav_target_Service,
    private suppressTarget: SuppressTarget,
    private router: Router,
    private preloader: PreloaderService,
    private targetService : TargetService,
  ) { }

  ngOnInit() {
    localStorage.setItem('programcode', 'ILG60-99-01');
    this.prevPageButton = true
    this.navService.setSearchBar(true)
    this.advSearch = this.showAdvSearch;
  }

  viewTarget() {
    this.router.navigate(['/SuppressTarget/targetArea/view']);
    this.navService.setSendButton(true);
    this.navService.setPrintButton(true);
  }
  ngOnDestroy(): void {
    this.navService.setSearchBar(false)
  }
  ngView_target(): void {
  }


ShowAlertNoRecord() {
  swal({
      title: '',
      text: Message.noRecord,
      type: 'warning',
      confirmButtonText: 'ตกลง'
  });
}

async onSearchComplete(list: any) {
  this.dataList = [];

  if (!list.length) {
      this.ShowAlertNoRecord();
      this.showDataList = [];

      return false;
  }

    await list.map((item) => {
      switch (item.IS_SEND) {
          case 0:
              item.TxtStatus = "ยังไม่ส่งเป้าปราบปราม";
              break;
          case 1:
              item.TxtStatus = "ส่งเป้าปราบปรามแล้ว";
              break;
      }})

  if (Array.isArray(list)) {
      this.dataList = list;
  } else {
      this.dataList.push(list);
  }
  // set total record
  this.paginage.TotalItems = this.dataList.length;
  this.showDataList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);
  
}

async pageChanges(event) {
  this.showDataList = await this.dataList.slice(event.startIndex - 1, event.endIndex);
  this.showDataList.map((item => {
    item.TARGET_ITEM_DATE = this.setDateStruct(item.TARGET_ITEM_DATE);
  }))
}
  

   //step 1 : search
   clickSearch(TEXT_SEARCH) {
    if (TEXT_SEARCH) {

      let ts;
      ts = { TEXT_SEARCH: "" }
      ts = TEXT_SEARCH;

      if (ts.TEXT_SEARCH == null) { this.onSearch({ TEXT_SEARCH: "" }); }
      else { this.onSearch(TEXT_SEARCH); }
    }
  }

  //step 2 :
  async onSearch(TEXT_SEARCH) {
    this.targetService.TargetListgetByKeyword(TEXT_SEARCH).subscribe(list => {

      var targetKeywordlist = list;

      console.log(list);


      if (!targetKeywordlist.length) {
        swal('', Message.noRecord, 'warning');
        return false;
      } 
      else { this.onSearchComplete(targetKeywordlist) }

      console.log(targetKeywordlist);

    })
  }

  //set dateThai
  setDateStruct(date) {
    let months = this.targetService.I18N_VALUES.months;
    let temp = date = new Date(date);
    let CompDate = `${temp.getUTCDate()} ${months[temp.getMonth()]} ${temp.getUTCFullYear() + 543}`;
    return CompDate;
  }

  setAdvSearch() {
    if (this.showAdvSearch.getValue()) {
      this.showAdvSearch.next(false);
    } else {
      this.showAdvSearch.next(true);
    }
  }

  onAdvSearch(advForm){

    console.log(advForm);
  }

}
