import { Router } from '@angular/router';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { Component, OnInit } from '@angular/core';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { SidebarService } from 'app/shared/sidebar/sidebar.component';
import { RewardService } from '../reward.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { pagination } from '../../../config/pagination';
import swal from 'sweetalert2';
import { Message } from '../../../config/message';
import { toLocalShort, setZero } from 'app/config/dateFormat';
import { RewardHelper } from '../reward.helper';
// import { toDatePickerFormat ,getDatepiker , noYear,conditionDateFrom , conditionDatePikerFrom, conditionDateTo, conditionDatePikerTo } from './conditionDatePiker';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends RewardHelper implements OnInit {

  AccountOfficeCode = '';

  constructor(
    private navService: NavigationService,
    private router: Router,
    private preloaderService: PreloaderService,
    private sidebarService: SidebarService,
    private rewardService: RewardService,
  ) {
    super();
  }

  ngOnInit() {
    this.preloaderService.setShowPreloader(true);
    localStorage.setItem('programcode', 'ILG60-07-00');
    this.AccountOfficeCode = localStorage.getItem('officeCode');
    this.sidebarService.setVersion('0.0.4.22');
    this.navService.setSearchBar(true);
    this.navService.setPrintButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setCancelButton(false);
    this.navService.setEditButton(false);
    this.navService.setSaveButton(false);
    this.navService.setNewButton(false);
    this.paginage.TotalItems = 0;

    this.myDatePickerCompareFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerArrestToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerArrestFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerCompareToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerNoticeFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerNoticeToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerLawsuitFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerLawsuitToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

    const param = { TEXT_SEARCH: '', ACCOUNT_OFFICE_CODE: this.AccountOfficeCode };
    this.rewardService.RequestListgetByKeyword("RequestListgetByKeyword", param).then(res => {

      var sort = res.sort((a, b) => {
        return <any>new Date(b.COMPARE_DATE) - <any>new Date(a.COMPARE_DATE);
      });

      sort.map((item, i) => {
        if (item.BRIBE_ID == null && item.REWARD_ID == null) {
          item.danger = 1;
          this.Reward.push(item)
        }

      });
      console.log("list : ", this.Reward)
      this.RewardList = this.Reward.slice(0, 5);
      this.paginage.TotalItems = this.Reward.length;

      // console.log("res : ",res)
      // this.onSearchComplete(res);
      this.preloaderService.setShowPreloader(false);
    });
  }

  public TEXT_SEARCH: any = '';
  public ARREST_CODE: any = '';
  public ARREST_DATE_FROM: any = '';
  public ARREST_DATE_TO: any = '';
  public ARREST_STAFF: any = '';
  public BRIBE_CODE: any = '';
  public COMPARE_DATE_FROM: any = '';
  public COMPARE_DATE_TO: any = '';
  public COMPARE_NO: any = '';
  public COMPARE_NO_YEAR: any = '';
  public COMPARE_STAFF: any = '';
  public IS_OUTSIDE: any = '';
  public LAWSUIT_DATE_FROM: any = '';
  public LAWSUIT_DATE_TO: any = '';
  public LAWSUIT_NO: any = '';
  public LAWSUIT_NO_YEAR: any = '';
  public LAWSUIT_STAFF: any = '';
  public LAWSUIT_TYPE: any = '';
  public NOTICE_CODE: any = '';
  public NOTICE_DATE_FROM: any = '';
  public NOTICE_DATE_TO: any = '';
  public OFFICE_NAME: any = '';
  public REWARD_CODE: any = '';

  public SUB_DISTRICT: any = '';
  public BRIBE_REWARD_STATUS: any = '0';
  public BRIBE_REWARD_PAY: any = '';
  public LAWSUIT_IS_OUTSIDE: any = '';

  RewardList = [];
  Reward = [];
  paginage = pagination;

  public async onSearch(text: string) {
    this.preloaderService.setShowPreloader(true);
    // const param = {TEXT_SEARCH: this.TEXT_SEARCH || '',ACCOUNT_OFFICE_CODE: ""};
    const param = { TEXT_SEARCH: this.TEXT_SEARCH || '', ACCOUNT_OFFICE_CODE: this.AccountOfficeCode };
    await this.rewardService.RequestListgetByKeyword("RequestListgetByKeyword", param).then(res => {
      this.onSearchComplete(res);
      this.preloaderService.setShowPreloader(false);
    });
  }

  public async onAdvSearch(form: any) {

    this.preloaderService.setShowPreloader(true);
    let NOTICE_DATE_FROM = this.conditionDateFrom(form.NOTICE_DATE_FROM, form.NOTICE_DATE_TO);
    let NOTICE_DATE_TO = this.conditionDateTo(form.NOTICE_DATE_FROM, form.NOTICE_DATE_TO);
    this.NOTICE_DATE_FROM = this.conditionDatePikerFrom(this.NOTICE_DATE_FROM, this.NOTICE_DATE_TO);
    this.NOTICE_DATE_TO = this.conditionDatePikerTo(this.NOTICE_DATE_FROM, this.NOTICE_DATE_TO);

    let ARREST_DATE_FROM = this.conditionDateFrom(form.ARREST_DATE_FROM, form.COMPARE_DATE_TO);
    let ARREST_DATE_TO = this.conditionDateTo(form.ARREST_DATE_FROM, form.ARREST_DATE_TO);
    this.ARREST_DATE_FROM = this.conditionDatePikerFrom(this.ARREST_DATE_FROM, this.ARREST_DATE_TO);
    this.ARREST_DATE_TO = this.conditionDatePikerTo(this.ARREST_DATE_FROM, this.ARREST_DATE_TO);

    let LAWSUIT_DATE_FROM = this.conditionDateFrom(form.LAWSUIT_DATE_FROM, form.COMPARE_DATE_TO);
    let LAWSUIT_DATE_TO = this.conditionDateTo(form.LAWSUIT_DATE_FROM, form.LAWSUIT_DATE_TO);
    this.LAWSUIT_DATE_FROM = this.conditionDatePikerFrom(this.LAWSUIT_DATE_FROM, this.LAWSUIT_DATE_TO);
    this.LAWSUIT_DATE_TO = this.conditionDatePikerTo(this.LAWSUIT_DATE_FROM, this.LAWSUIT_DATE_TO);

    let COMPARE_DATE_FROM = this.conditionDateFrom(form.COMPARE_DATE_FROM, form.COMPARE_DATE_TO);
    let COMPARE_DATE_TO = this.conditionDateTo(form.COMPARE_DATE_FROM, form.COMPARE_DATE_TO);
    this.COMPARE_DATE_FROM = this.conditionDatePikerFrom(this.COMPARE_DATE_FROM, this.COMPARE_DATE_TO);
    this.COMPARE_DATE_TO = this.conditionDatePikerTo(this.COMPARE_DATE_FROM, this.COMPARE_DATE_TO);

    var param;
    if (this.BRIBE_REWARD_STATUS == '' || this.BRIBE_REWARD_STATUS == null) {
      console.log("CASE 1 :");
      param = {
        NOTICE_CODE: this.NOTICE_CODE,
        NOTICE_DATE_FROM: NOTICE_DATE_FROM,
        NOTICE_DATE_TO: NOTICE_DATE_TO,

        ARREST_CODE: this.ARREST_CODE,
        ARREST_DATE_FROM: ARREST_DATE_FROM,
        ARREST_DATE_TO: ARREST_DATE_TO,
        OFFICE_NAME: this.SUB_DISTRICT,
        ARREST_STAFF: this.ARREST_STAFF,

        LAWSUIT_NO: this.LAWSUIT_NO,
        LAWSUIT_NO_YEAR: this.LAWSUIT_NO_YEAR,
        LAWSUIT_DATE_FROM: LAWSUIT_DATE_FROM,
        LAWSUIT_DATE_TO: LAWSUIT_DATE_TO,
        LAWSUIT_STAFF: this.LAWSUIT_STAFF,
        LAWSUIT_TYPE: this.LAWSUIT_TYPE,
        IS_OUTSIDE: this.IS_OUTSIDE,

        COMPARE_DATE_FROM: COMPARE_DATE_FROM,
        COMPARE_DATE_TO: COMPARE_DATE_TO,
        COMPARE_NO: this.COMPARE_NO,
        COMPARE_NO_YEAR: this.COMPARE_NO_YEAR,
        COMPARE_STAFF: this.COMPARE_STAFF,

        BRIBE_REWARD_STATUS: '',
        BRIBE_REWARD_PAY: '',
        ACCOUNT_OFFICE_CODE: this.AccountOfficeCode,
      }
    } else if (this.BRIBE_REWARD_STATUS == '0' || this.BRIBE_REWARD_STATUS == 0) {
      console.log("CASE 2 :");
      param = {
        NOTICE_CODE: this.NOTICE_CODE,
        NOTICE_DATE_FROM: NOTICE_DATE_FROM,
        NOTICE_DATE_TO: NOTICE_DATE_TO,

        ARREST_CODE: this.ARREST_CODE,
        ARREST_DATE_FROM: ARREST_DATE_FROM,
        ARREST_DATE_TO: ARREST_DATE_TO,
        OFFICE_NAME: this.SUB_DISTRICT,
        ARREST_STAFF: this.ARREST_STAFF,

        LAWSUIT_NO: this.LAWSUIT_NO,
        LAWSUIT_NO_YEAR: this.LAWSUIT_NO_YEAR,
        LAWSUIT_DATE_FROM: LAWSUIT_DATE_FROM,
        LAWSUIT_DATE_TO: LAWSUIT_DATE_TO,
        LAWSUIT_STAFF: this.LAWSUIT_STAFF,
        LAWSUIT_TYPE: this.LAWSUIT_TYPE,
        IS_OUTSIDE: this.IS_OUTSIDE,

        COMPARE_DATE_FROM: COMPARE_DATE_FROM,
        COMPARE_DATE_TO: COMPARE_DATE_TO,
        COMPARE_NO: this.COMPARE_NO,
        COMPARE_NO_YEAR: this.COMPARE_NO_YEAR,
        COMPARE_STAFF: this.COMPARE_STAFF,

        BRIBE_REWARD_STATUS: this.BRIBE_REWARD_STATUS,
        BRIBE_REWARD_PAY: this.BRIBE_REWARD_PAY,
        ACCOUNT_OFFICE_CODE: this.AccountOfficeCode,
      }
    } else if (this.BRIBE_REWARD_STATUS == '1' || this.BRIBE_REWARD_STATUS !== 1) {
      console.log("CASE 3 :");
      param = {
        // NOTICE_CODE  : this.NOTICE_CODE,
        // NOTICE_DATE_FROM : NOTICE_DATE_FROM,
        // NOTICE_DATE_TO : NOTICE_DATE_TO,

        ARREST_CODE: this.ARREST_CODE,
        ARREST_DATE_FROM: ARREST_DATE_FROM,
        ARREST_DATE_TO: ARREST_DATE_TO,
        OFFICE_NAME: this.SUB_DISTRICT,
        ARREST_STAFF: this.ARREST_STAFF,

        LAWSUIT_NO: this.LAWSUIT_NO,
        LAWSUIT_NO_YEAR: this.LAWSUIT_NO_YEAR,
        LAWSUIT_DATE_FROM: LAWSUIT_DATE_FROM,
        LAWSUIT_DATE_TO: LAWSUIT_DATE_TO,
        LAWSUIT_STAFF: this.LAWSUIT_STAFF,
        LAWSUIT_TYPE: this.LAWSUIT_TYPE,
        IS_OUTSIDE: this.IS_OUTSIDE,

        COMPARE_DATE_FROM: COMPARE_DATE_FROM,
        COMPARE_DATE_TO: COMPARE_DATE_TO,
        COMPARE_NO: this.COMPARE_NO,
        COMPARE_NO_YEAR: this.COMPARE_NO_YEAR,
        COMPARE_STAFF: this.COMPARE_STAFF,

        BRIBE_REWARD_STATUS: this.BRIBE_REWARD_STATUS,
        BRIBE_REWARD_PAY: this.BRIBE_REWARD_PAY,
        ACCOUNT_OFFICE_CODE: this.AccountOfficeCode,
      }
    }

    console.log("param : ", param)
    await this.rewardService.RequestListgetByConAdv("RequestListgetByConAdv", param).then(res => {
      this.onSearchComplete(res);
      this.preloaderService.setShowPreloader(false);
    });
  }


  clearCon() {
    this.ARREST_CODE = '';
    this.ARREST_DATE_FROM = '';
    this.ARREST_DATE_TO = '';
    this.ARREST_STAFF = '';
    this.BRIBE_CODE = '';
    this.COMPARE_DATE_FROM = '';
    this.COMPARE_DATE_TO = '';
    this.COMPARE_NO = '';
    this.COMPARE_NO_YEAR = '';
    this.COMPARE_STAFF = '';
    this.IS_OUTSIDE = '';
    this.LAWSUIT_DATE_FROM = '';
    this.LAWSUIT_DATE_TO = '';
    this.LAWSUIT_NO = '';
    this.LAWSUIT_NO_YEAR = '';
    this.LAWSUIT_STAFF = '';
    this.LAWSUIT_TYPE = '';
    this.NOTICE_CODE = '';
    this.NOTICE_DATE_FROM = '';
    this.NOTICE_DATE_TO = '';
    this.OFFICE_NAME = '';
    this.REWARD_CODE = '';
    this.BRIBE_REWARD_STATUS = '';
    this.BRIBE_REWARD_PAY = '';
    this.LAWSUIT_IS_OUTSIDE = '';
    this.SUB_DISTRICT = '';
  }

  clearADV() {
    this.TEXT_SEARCH = '';
  }

  public async onSearchComplete(form: any) {
    let list = [];
    form.map(m => {
      list.push(m)
    });

    if (list.length < 1) {
      swal({
        type: 'warning',
        text: "ไม่พบข้อมูล",
        confirmButtonText: 'ตกลง',
        buttonsStyling: true,
      })
      this.RewardList = [];
      return false;
    } else {

      var sort = list.sort((a, b) => {
        return <any>new Date(b.COMPARE_DATE) - <any>new Date(a.COMPARE_DATE);
      });

      this.Reward = sort.map((item, i) => {
        if (item.BRIBE_ID !== null && item.REWARD_ID == null) {
          item.danger = 1;
        } else if (item.BRIBE_ID == null && item.REWARD_ID == null) {
          item.danger = 1;
        } else {
          item.danger = 2;
        }
        // item.COMPARE_DATE = this.setDateStruct(item.COMPARE_DATE);
        // item.OCCURRENCE_DATE = this.setDateStruct(item.OCCURRENCE_DATE);
        // item.LAWSUIT_DATE = this.setDateStruct(item.LAWSUIT_DATE);
        // item.RECEIVE_DOC_DATE = this.setDateStruct(item.RECEIVE_DOC_DATE);
        return item;
      });

      this.RewardList = this.Reward.slice(0, 5);
      this.paginage.TotalItems = this.Reward.length;
    }
  }

  async pageChanges(event) {
    this.RewardList = await this.Reward.slice(event.startIndex - 1, event.endIndex);
  }

  public clickView(item) {
    if (item.danger == 1) {
      this.router.navigate([`/reward/manage/${'C'}/${item.ARREST_INDICTMENT_ID}/${0}/${0}`]);
    } else {
      if (item.BRIBE_ID == null) { item.BRIBE_ID = 0 }; if (item.REWARD_ID == null) { item.REWARD_ID = 0 };
      this.router.navigate([`/reward/manage/${'R'}/${item.ARREST_INDICTMENT_ID}/${item.BRIBE_ID}/${item.REWARD_ID}`]);
    }
  }

  collapse1 = new BehaviorSubject<Boolean>(true);
  toggleCollapse(event: BehaviorSubject<Boolean>): void {
    if (event.getValue()) {
      event.next(false);
    } else { event.next(true); }
  }


  NOTICE_CODE_SORTING = new BehaviorSubject<Boolean>(true);
  NOTICE_DATE_SORTING = new BehaviorSubject<Boolean>(true);
  ARREST_CODE_SORTING = new BehaviorSubject<Boolean>(true);
  ARREST_DATE_SORTING = new BehaviorSubject<Boolean>(true);
  LAWSUIT_NO_SORTING = new BehaviorSubject<Boolean>(true);
  LAWSUIT_DATE_SORTING = new BehaviorSubject<Boolean>(true);
  COMPARE_NO_SORTING = new BehaviorSubject<Boolean>(true);
  COMPARE_DATE_SORTING = new BehaviorSubject<Boolean>(true);

  Sorter(event: BehaviorSubject<Boolean>, type: string): void {
    if (event.getValue()) event.next(false); else event.next(true);

    switch (type) {
      case 'NOTICE_CODE':
        if (event.getValue())
          this.Reward.sort((a, b) => {
            return <number>parseInt(b.NOTICE_CODE.substring(2)) - <number>parseInt(a.NOTICE_CODE.substring(2));
          });
        else
          this.Reward.sort((a, b) => {
            return <number>parseInt(a.NOTICE_CODE.substring(2)) - <number>parseInt(b.NOTICE_CODE.substring(2));
          });
        break;
      case 'NOTICE_DATE':
        if (event.getValue())
          this.Reward.sort((a, b) => {
            return <any>new Date(b.NOTICE_DATE) - <any>new Date(a.NOTICE_DATE);
          });
        else
          this.Reward.sort((a, b) => {
            return <any>new Date(a.NOTICE_DATE) - <any>new Date(b.NOTICE_DATE);
          });
        break;
      case 'ARREST_CODE':
        if (event.getValue())
          this.Reward.sort((a, b) => {
            return <number>parseInt(b.ARREST_CODE.substring(2)) - <number>parseInt(a.ARREST_CODE.substring(2));
          });
        else
          this.Reward.sort((a, b) => {
            return <number>parseInt(a.ARREST_CODE.substring(2)) - <number>parseInt(b.ARREST_CODE.substring(2));
          });
        break;
      case 'ARREST_CODE':
        if (event.getValue())
          this.Reward.sort((a, b) => {
            return <any>new Date(b.ARREST_CODE) - <any>new Date(a.ARREST_CODE)
          });
        else
          this.Reward.sort((a, b) => {
            return <any>new Date(a.ARREST_CODE) - <any>new Date(b.ARREST_CODE)
          });
        break;
      case 'ARREST_DATE':
        if (event.getValue())
          this.Reward.sort((a, b) => {
            return <any>new Date(b.ARREST_DATE) - <any>new Date(a.ARREST_DATE)
          });
        else
          this.Reward.sort((a, b) => {
            return <any>new Date(a.ARREST_DATE) - <any>new Date(b.ARREST_DATE)
          });
        break;
      case 'LAWSUIT_NO':
        if (event.getValue())
          this.Reward.sort((a, b) => {
            return <any>new Date(b.LAWSUIT_NO) - <any>new Date(a.LAWSUIT_NO)
          });
        else
          this.Reward.sort((a, b) => {
            return <any>new Date(a.LAWSUIT_NO) - <any>new Date(b.LAWSUIT_NO)
          });
        break;
      case 'LAWSUIT_DATE':
        if (event.getValue())
          this.Reward.sort((a, b) => {
            return <any>new Date(b.LAWSUIT_DATE) - <any>new Date(a.LAWSUIT_DATE)
          });
        else
          this.Reward.sort((a, b) => {
            return <any>new Date(a.LAWSUIT_DATE) - <any>new Date(b.LAWSUIT_DATE)
          });
        break;
      case 'COMPARE_NO':
        if (event.getValue())
          this.Reward.sort((a, b) => {
            return <any>new Date(b.COMPARE_NO_YEAR) - <any>new Date(a.COMPARE_NO_YEAR)
          });
        else
          this.Reward.sort((a, b) => {
            return <any>new Date(a.COMPARE_NO_YEAR) - <any>new Date(b.COMPARE_NO_YEAR)
          });
        break;
      case 'COMPARE_DATE':
        if (event.getValue())
          this.Reward.sort((a, b) => {
            return <any>new Date(b.COMPARE_DATE) - <any>new Date(a.COMPARE_DATE)
          });
        else
          this.Reward.sort((a, b) => {
            return <any>new Date(a.COMPARE_DATE) - <any>new Date(b.COMPARE_DATE)
          });
        break;
      default:
        break;
    }
    // this.reIndex();
    this.RewardList = this.Reward.slice(0, this.paginage.RowsPerPageOptions[0]);
  }

  // reIndex() {
  //       this.Reward.map((m, i) => {
  //           m.RowsId = i + 1;
  //       })
  //   }

  myDatePickerCompareFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerCompareToOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerArrestFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerArrestToOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerNoticeFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerNoticeToOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerLawsuitFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerLawsuitToOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  public onCompareDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerCompareFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerCompareFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onCompareDateFromChanged(event) {
    if (event.jsdate) {
      this.COMPARE_DATE_TO = '';
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerCompareToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.COMPARE_DATE_TO = '';
      this.myDatePickerCompareToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onArrestDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerArrestFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerArrestFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onArrestDateFromChanged(event) {
    if (event.jsdate) {
      this.COMPARE_DATE_TO = '';
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerArrestToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.COMPARE_DATE_TO = '';
      this.myDatePickerArrestToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onNoticeDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerNoticeFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerNoticeFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onNoticeDateFromChanged(event) {
    if (event.jsdate) {
      this.COMPARE_DATE_TO = '';
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerNoticeToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.COMPARE_DATE_TO = '';
      this.myDatePickerNoticeToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onLawsuitDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerLawsuitFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerLawsuitFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onLawsuitDateFromChanged(event) {
    if (event.jsdate) {
      this.COMPARE_DATE_TO = '';
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerLawsuitToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.COMPARE_DATE_TO = '';
      this.myDatePickerLawsuitToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  getDisCurrDateMyDatePicker() {
    let currentdate = new Date();
    const disCurrDate = {
      begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
      end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
    }
    return disCurrDate;
  }

  setZero(num: number) {
    return num < 10 ? '0' + num : num;
  }

  toDatePickerFormat(d: any) {
    return { date: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }, formatted: toLocalShort(d.toString()).replace(/ /g, ' ') };
  }

  getDatepiker(d) {
    if (d.date.month < 10 && d.date.day < 10) {
      var date = d.date.year + "-0" + d.date.month + "-0" + d.date.day;
      return date;
    } else if (d.date.month < 10 && d.date.day >= 10) {
      var date = d.date.year + "-0" + d.date.month + "-" + d.date.day;
      return date;
    } else if (d.date.day < 10 && d.date.month >= 10) {
      var date = d.date.year + "-" + d.date.month + "-0" + d.date.day;
      return date;
    } else {
      var date = d.date.year + "-" + d.date.month + "-" + d.date.day;
      return date;
    }
  }

  toLocalShort(date: Date): string {
    if (!date) return null;
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const dd = new Date(date);
    return dd.toLocaleString('th-TH', options);
  }

  conditionDateFrom(dateFrom, dateTo) {
    let date;
    if (dateFrom == null || dateFrom == '') {
      if (dateTo == null || dateTo == '') {
        return date = '';
      } else {
        return date = this.getDatepiker(dateTo);
      }
    } else {
      return date = this.getDatepiker(dateFrom);
    }
  }

  conditionDatePikerFrom(dateFrom, dateTo) {
    let date;
    if (dateFrom == null || dateFrom == '') {
      if (dateTo == null || dateTo == '') {
        return date = '';
      } else {
        return date = dateTo;
      }
    } else {
      return date = dateFrom;
    }
  }

  conditionDateTo(dateFrom, dateTo) {
    let date;
    if (dateTo == null || dateTo == '') {
      if (dateFrom == null || dateFrom == '') {
        return date = '';
      } else {
        return date = this.getDatepiker(this.toDatePickerFormat(new Date()));
      }
    } else {
      return date = this.getDatepiker(dateTo);
    }
  }

  conditionDatePikerTo(dateFrom, dateTo) {
    let date;
    if (dateTo == null || dateTo == '') {
      if (dateFrom == null || dateFrom == '') {
        return date = '';
      } else {
        return date = this.toDatePickerFormat(new Date());
      }
    } else {
      return date = dateTo;
    }
  }

  noYear(year) {
    let y;
    if (year == null || year == '') {
      return y = '';
    } else {
      return y = (parseInt(year) - 543).toString();
    }
  }

}
