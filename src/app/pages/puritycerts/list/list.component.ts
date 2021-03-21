import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { PuritycertService } from '../puritycert.service';
import { Message } from '../../../config/message';
import { Puritycert } from '../puritycert';
import { pagination } from '../../../config/pagination';
import swal from 'sweetalert2';
import { Subject } from 'rxjs/Subject';
import { toLocalShort, setZero, MyDatePickerOptions, convertDateForSave, compareDate, toLocalNumeric, setZeroHours, getDateMyDatepicker, setDateMyDatepicker } from '../../../config/dateFormat';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { SidebarService } from '../../../shared/sidebar/sidebar.component';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { FormGroup } from '@angular/forms';
import { ListConfig } from './list.config';
import {appConfig} from '../../../app.config';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent extends ListConfig implements OnInit, OnDestroy, DoCheck {

  months: any[];
  monthsTh: any[];
  Textsearch: '';

  advSearch: any;
  isRequired = false;
  setDefaultDate: string;
  paginage = pagination;

  puritycert = [];
  puritycertList = [];

  putirycertStartDate: any;
  putirycertEndDate: any;


  public myDatePickerOptions = MyDatePickerOptions;

  public destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('advForm') advForm: FormGroup;

  constructor(
    private router: Router,
    private navservice: NavigationService,
    private puritycertService: PuritycertService,
    // private preLoaderService: PreloaderService,
    private sidebarService: SidebarService
  ) {
    super();
    this.advSearch = this.navservice.showAdvSearch;
  }

  ngDoCheck(): void {
    if (this.advSearch.getValue() === false && this.advForm !== undefined) {
      this.advForm.reset();
    }
  }

  // clickSearch(Textsearch) {
  //   console.log(Textsearch);
  //   let body = {
  //     text_search: Textsearch,
  //     user_account_id: localStorage.getItem('UserAccountID')
  //   };
  //   this.puritycertService
  //     .PuritycertListgetByKeyword(body).then(list => this.onSearchComplete(list));
  //
  // }

  setAdvSearch() {
    this.advSearch.next(!this.advSearch.getValue());
  }

  async ngOnInit() {
    this.advSearch.next(true);
    this.sidebarService.setVersion('0.0.0.76');
    this.paginage.TotalItems = 0;
    this.months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    this.monthsTh = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  }

  ngOnDestroy() {
    this.paginage.TotalItems = 0;
    // this.subOnSearch.unsubscribe();
    // this.subSetNextPage.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.advSearch.next(false);
  }

  async onSearch() {
    this.ngOnInit();
    const body = {
      TEXT_SEARCH : this.Textsearch,
      ACCOUNT_OFFICE_CODE : localStorage.getItem('officeCode')
    };

    if (body) {
      this.puritycertService.PuritycertListgetByKeyword(body).then(list => this.onSearchComplete(list));
    } else {
      swal('', Message.checkData, 'warning');
      return false;
    }
  }

  async onAdvSearch(form: any) {
    this.ngOnInit();

    if (this.putirycertStartDate && this.putirycertEndDate) {

      // const timestamp = form.value.DateStartFrom.jsdate.getTime();
      // const timestamp2 = form.value.DateStartTo.jsdate.getTime();

      // let sdate = getDateMyDatepicker(this.putirycertStartDate);
      // let edate = getDateMyDatepicker(this.putirycertEndDate);
      // if (!compareDate(sdate, edate)) {
      //   swal('', Message.checkDate, 'warning');
      //   return false;
      // }
      form.value.putirycertStartDate = (this.putirycertStartDate.date.year + 543) + '-' + (this.putirycertStartDate.date.month) + '-' + this.putirycertStartDate.date.day + ' 00:00:00';//setZeroHours(sdate);
      form.value.putirycertEndDate = (this.putirycertEndDate.date.year + 543) + '-' + (this.putirycertEndDate.date.month) + '-' + this.putirycertEndDate.date.day + ' 23:59:59';//setZeroHours(edate);

      // form.value.putirycertStartDate = timestamp ;
      // form.value.putirycertEndDate = timestamp2 ;
    } else {
      form.value.putirycertStartDate = "";
      form.value.putirycertEndDate = "";
    }


    let body = {
      ACCOUNT_OFFICE_CODE : localStorage.getItem('officeCode'),
      PURITYCERT_CODE : form.value.putirycertCode,
      PURITYCERT_DATE_START: form.value.putirycertStartDate,
      PURITYCERT_DATE_TO: form.value.putirycertEndDate,
      PERSON_NAME: form.value.personName,
      STAFF_NAME: form.value.staffName,
      OFFICE_NAME: form.value.officeName,
      IS_ARREST: form.value.isArrest
    };

    console.log(body);

    await this.puritycertService.PuritycertListByConAdv(body).then(list => this.onSearchComplete(list));

    // this.preLoaderService.setShowPreloader(false);
  }

  onSearchComplete(list) {

    // console.log(list);
    if (list.length === 0) {
      swal('', Message.noRecord, 'warning');
      return false;
    }

    let datas = [];
    // let datasNew = [];
    let cnt = 1;
    for (let i of list.PuritycertList) {
      // console.log(i);
      let dateOld = i.PURITYCERT_DATE.split('-');
      let dateNew = dateOld[0] - 543 +'-'+ dateOld[1] +'-'+ dateOld[2]  ;
      i.PURITYCERT_DATE = dateNew;
      i.index = '';
      datas.push(i);
      i.index = cnt++;
    }
    // console.log(datas);
    this.puritycert = datas.filter( item => item.CONTRIBUTOR_ID === 5 );
    // set total record
    this.paginage.TotalItems = this.puritycert.length;

  }

  onSDateChange(event: IMyDateModel) {
    this.putirycertStartDate = event;
    this.checkDate();
  }

  onEDateChange(event: IMyDateModel) {
    this.putirycertEndDate = event;
    this.checkDate();
  }

  checkDate() {
    if (this.putirycertStartDate && this.putirycertEndDate) {

      const _sdate = this.putirycertStartDate;
      const sdate = getDateMyDatepicker(this.putirycertStartDate);
      const edate = getDateMyDatepicker(this.putirycertEndDate);

      console.log(sdate);

      if (!compareDate(sdate, edate)) {
        swal('', Message.checkDate, 'warning');

        setTimeout(() => {
          this.putirycertStartDate = {date: _sdate.date};
        }, 0);
      }
    }
  }

  clickNew = () => this.router.navigate([`/puritycerts/manage/C/NEW`]);

  // formatDate(date) {
  //
  //   if (date) {
  //     let tmps = date.split(' ')[0].split('-');
  //     return tmps[2] + ' ' + this.monthsTh[parseInt(tmps[1]) - 1] + ' ' + +(parseInt(tmps[0]));
  //   }
  //   return '';
  // }

  getStatus(status) {
    switch (status) {
      case 0:
        return 'ยังไม่ดำเนินการ';
        break;
      case 1:
        return 'จับกุมแล้ว';
        break;
      case 2:
        return 'ไม่พบความผิด';
        break;
      default:
        break;
    }
  }

  // getStaff (list) {
  //   const staff = list.result.filter(s => s)[0];
  //   return staff.titleNameTh + staff.firstName + ' ' + staff.lastName
  // }

  view = (item) => this.router.navigate(['/puritycerts/manage/R/' +  JSON.stringify(item) ]);

  async pageChanges(event) {
    this.puritycertList = await this.puritycert.slice(event.startIndex - 1, event.endIndex);
  }


}

