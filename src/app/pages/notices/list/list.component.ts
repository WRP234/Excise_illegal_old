import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { NoticeService } from '../notice.service';
import { Message } from '../../../config/message';
import { Notice } from '../notice';
import { pagination } from '../../../config/pagination';
import { toLocalShort, compareDate, toLocalNumeric, setZeroHours, getDateMyDatepicker, setDateMyDatepicker, convertDateForSave } from '../../../config/dateFormat';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { SidebarService } from '../../../shared/sidebar/sidebar.component';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { notice_list } from '../notice'
import { MainMasterService } from '../../../services/main-master.service';
import swal from 'sweetalert2';
import { ShareFunctions } from '../share/function'
import { Observable } from 'rxjs';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends ShareFunctions implements OnInit, OnDestroy {

  // @ViewChild('alertSwal') private alertSwal: SwalComponent;

  months: any[];
  monthsTh: any[];

  advSearch: any;
  isRequired = false;
  setDefaultDate: string;
  paginage = pagination;

  DATE_START_FROM: any;
  DATE_START_TO: any;
  officeShortName: any;
  // OPERATION_OFFICE_SHORT_NAME: any;

  staffInfo: string;

  myDatePickerOptions_From: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerOptions_To: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  noticeStatusOptions = [
    { value: '', label: 'ทั้งหมด' },
    { value: '0', label: 'ยังไม่ดำเนินการจับกุม' },
    { value: '1', label: 'จับกุมแล้ว' },
    { value: '2', label: 'หมดอายุ' },
  ];

  //TEMP_DEFAULTs
  public TEMP_TEXT_SEARCH: any = '';
  public TEMP_NOTICE_CODE: any = '';
  public TEMP_STAFF_NAME: any = '';
  public TEMP_OFFICE_NAME: any = '';

  noticeStatusCode = '';
  private subOnsearchByKeyword: any;
  private subSetNextPage: any;

  constructor(
    private _router: Router,
    private navservice: NavigationService,
    private noticeService: NoticeService,
    private preLoaderService: PreloaderService,
    private sidebarService: SidebarService,
    private mainMasterService: MainMasterService
  ) {
    super();
    // set false
    this.navservice.setEditButton(false);
    this.navservice.setDeleteButton(false);
    this.navservice.setPrintButton(false);
    this.navservice.setSaveButton(false);
    this.navservice.setCancelButton(false);
    this.navservice.setNextPageButton(false);
    // set true
    this.navservice.setSearchBar(true);
    this.navservice.setNewButton(true);

    this.navservice.showAdvSearch = new BehaviorSubject<Boolean>(true);
    this.advSearch = this.navservice.showAdvSearch;
  }

  async ngOnInit() {

    this.sidebarService.setVersion('Notice 0.0.2.7');

    localStorage.setItem('programcode', 'ILG60-02-00');

    this.staffInfo = JSON.parse(localStorage.getItem("staffInfo"));

    

    this.paginage.TotalItems = 0;

    this.navservice.setCancelButton(false);

    sessionStorage.removeItem("notice_form_data");

    let currentdate = new Date();

    this.DATE_START_FROM = setDateMyDatepicker(currentdate);
    this.DATE_START_TO = setDateMyDatepicker(currentdate);

    this.myDatePickerOptions_From.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerOptions_To.disableDateRanges = [this.getDisLessthanCurrDateMyDatePicker(), this.getDisCurrDateMyDatePicker()];

    this.OnInitSearchAdv();

    this.subOnsearchByKeyword = this.navservice.searchByKeyword.subscribe(async Textsearch => {
      if (Textsearch) {
        await this.navservice.setOnSearch('');
        this.onSearch(Textsearch);
      }
    });

    this.subSetNextPage = this.navservice.onNextPage.subscribe(async status => {
      if (status) {
        await this.navservice.setOnNextPage(false);
        this._router.navigateByUrl('/notice/manage/C/NEW?from=new');
      }
    });

    await this.InitiaDataByLogin();

    this.months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    this.monthsTh = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

    // this.preLoaderService.setShowPreloader(false);
  }

  InitiaDataByLogin() {
    this.officeShortName = localStorage.getItem('officeShortName');
  }

  ngOnDestroy(): void {

    if (this.subOnsearchByKeyword)
      this.subOnsearchByKeyword.unsubscribe();

    if (this.subSetNextPage)
      this.subSetNextPage.unsubscribe();
  }

  async onSearch(Textsearch: any) {
    this.preLoaderService.setShowPreloader(true);
    const officeCode = localStorage.getItem("officeCode");
    await this.noticeService.getByKeyword(Textsearch, officeCode).then(list => this.onSearchComplete(list));
    this.setDefualtInputSearch(1);
    this.preLoaderService.setShowPreloader(false);
  }

  async setAdvSearch() {
    this.advSearch.next(!this.advSearch.getValue());
  }

  async onAdvSearch(form: any) {

    let currDate = setDateMyDatepicker(new Date());
    if (this.DATE_START_FROM) {
      form.value.DATE_START_FROM = this.DATE_START_FROM.date.day + "-" + this.months[this.DATE_START_FROM.date.month - 1] + "-" + this.DATE_START_FROM.date.year;
    } else if (!this.DATE_START_FROM && this.DATE_START_TO) {
      this.DATE_START_FROM = this.DATE_START_TO;
      form.value.DATE_START_FROM = this.DATE_START_FROM.date.day + "-" + this.months[this.DATE_START_FROM.date.month - 1] + "-" + this.DATE_START_FROM.date.year;

      var d = new Date(form.value.DATE_START_FROM);
      this.myDatePickerOptions_To = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
        }, this.getDisCurrDateMyDatePicker()]
      }
    }

    if (this.DATE_START_TO) {
      form.value.DATE_START_TO = this.DATE_START_TO.date.day + "-" + this.months[this.DATE_START_TO.date.month - 1] + "-" + this.DATE_START_TO.date.year;
    } else if (this.DATE_START_FROM && !this.DATE_START_TO) {
      this.DATE_START_TO = currDate;
      form.value.DATE_START_TO = this.DATE_START_TO.date.day + "-" + this.months[this.DATE_START_TO.date.month - 1] + "-" + this.DATE_START_TO.date.year;
    }

    form.value.DATE_START_FROM = form.value.DATE_START_FROM ? form.value.DATE_START_FROM : null;
    form.value.DATE_START_TO = form.value.DATE_START_TO ? form.value.DATE_START_TO : null;
    form.value.DATE_START_FROM = form.value.DATE_START_FROM != null || undefined || "" ? convertDateForSave(form.value.DATE_START_FROM).slice(0, 10) : "";
    form.value.DATE_START_TO = form.value.DATE_START_TO != null || undefined || "" ? convertDateForSave(form.value.DATE_START_TO).slice(0, 10) : "";
    form.value.ACCOUNT_OFFICE_CODE = localStorage.getItem("officeCode");

    this.preLoaderService.setShowPreloader(true);
    await this.noticeService.getByConAdv(form.value).then(list => this.onSearchComplete(list));
    this.setDefualtInputSearch(0);
    this.preLoaderService.setShowPreloader(false);
  }

  async  OnInitSearchAdv() {
    this.preLoaderService.setShowPreloader(true);

    const form = {
      DATE_START_TO: convertDateForSave(getDateMyDatepicker(this.DATE_START_TO)).slice(0, 10),
      DATE_START_FROM: convertDateForSave(getDateMyDatepicker(this.DATE_START_FROM)).slice(0, 10),
      ACCOUNT_OFFICE_CODE: localStorage.getItem("officeCode")
    }
    await this.noticeService.getByConAdv(form).then(list => this.onSearchComplete(list));

    this.preLoaderService.setShowPreloader(false);
  }

  // onKDutyGroup(){
  //     let index = this.dutyGroupNameOptions.map(m => m.value).indexOf(this.dutyGroupCode);
  //     index = (index + 1) % this.dutyGroupNameOptions.length;
  //     this.dutyGroupCode = this.dutyGroupNameOptions[index].value;
  // }

  onKNoticeStatus() {
    let index = this.noticeStatusOptions.map(m => m.value).indexOf(this.noticeStatusCode);
    index = (index + 1) % this.noticeStatusOptions.length;
    this.noticeStatusCode = this.noticeStatusOptions[index].value;
  }

  onSearchComplete(list: any[] = []) {
    this.notice = this.DateSorter(list);
    if (!list || list.length == 0) {
      swal({
        text: Message.noRecord,
        type: 'warning',
        confirmButtonText: 'ตกลง'
      })
    } else {
      this.notice.map((m, i) => {
        m.index = i + 1;

        m.NOTICE_DATE_TH = this.setDateStruct(m.NOTICE_DATE);

        // m.STAFF_FULL_NAME = m.NoticeStaff
        //   .reduce((a, c) => {
        //     return [...a, `${c.TITLE_SHORT_NAME_TH || ''}${c.FIRST_NAME || ''} ${c.LAST_NAME || ''}   `]
        //   }, "")

        // m.SUSPECT_FULL_NAME = m.NoticeSuspect
        //   .reduce((a, c) => {
        //     return [...a, `${c.TITLE_SHORT_NAME_TH || ''}${c.FIRST_NAME || ''} ${c.LAST_NAME || ''}   `]
        //   }, "")
      })
    }

    this.noticeList = this.notice.slice(0, 5);
    this.paginage.TotalItems = list.length;
  }

  onDateFromChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerOptions_To = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.myDatePickerOptions_To = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  onDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerOptions_From = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerOptions_From = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }


  // onSDateChange(event: IMyDateModel) {
  //   // this.DATE_START_FROM = event;
  //   // this.checkDate();
  // }

  // onEDateChange(event: IMyDateModel) {
  //   // this.DATE_START_TO = event;
  //   // this.checkDate();
  // }

  // checkDate() {
  //   // if (this.DATE_START_FROM && this.DATE_START_TO) {

  //   //   const _sdate = this.DATE_START_FROM;
  //   //   const sdate = getDateMyDatepicker(this.DATE_START_FROM);
  //   //   const edate = getDateMyDatepicker(this.DATE_START_TO);

  //   //   if (!compareDate(sdate, edate)) {
  //   //     swal({
  //   //       text: Message.checkDate,
  //   //       type: 'warning',
  //   //       confirmButtonText: 'ตกลง'
  //   //     })
  //   //     setTimeout(() => {
  //   //       this.DATE_START_TO = { date: _sdate.date };
  //   //     }, 0);
  //   //   }
  //   // }
  // }

  view(noticeCode: string) {
    this._router.navigate([`/notice/manage/R/${noticeCode}`]);
  }

  clickNew = () => this._router.navigate([`/notice/manage/C/NEW`]);

  getNoticeNameByIsArrest(isArrest) {
    let Status = [
      { value: 0, label: 'ยังไม่ดำเนินการจับกุม' },
      { value: 1, label: 'จับกุมแล้ว' },
      { value: 2, label: 'หมดอายุ' },
    ];
    let result = Status.find(f => f.value == isArrest).label;
    return result;
  }

  setDateStruct(date) {
    let months = this.noticeService.I18N_VALUES.months;
    let temp = date = new Date(date);
    let CompDate = `${temp.getUTCDate()} ${months[temp.getMonth()]} ${temp.getUTCFullYear() + 543}`;
    return CompDate;
  }

  async pageChanges(event: any) {
    this.noticeList = await this.notice.slice(event.startIndex - 1, event.endIndex);
  }

  public searchOffice_ll = (text2$: Observable<string>) =>
    text2$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.noticeService.MasOfficegetByCon_Search({ TEXT_SEARCH: term })
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          })
      )
      .do(() => this.searching = false);

  setDefualtInputSearch(type: number) {
    switch (type) {
      case 0:
        this.TEMP_TEXT_SEARCH = '';
        break;
      case 1:
        this.TEMP_NOTICE_CODE = '';
        this.TEMP_STAFF_NAME = '';
        this.TEMP_OFFICE_NAME = '';
        this.noticeStatusCode = '';

        this.DATE_START_FROM = null;
        this.DATE_START_TO = null;

        this.myDatePickerOptions_To = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.myDatePickerOptions_From = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }

        break;
      default:
        break;
    }
  }



}
