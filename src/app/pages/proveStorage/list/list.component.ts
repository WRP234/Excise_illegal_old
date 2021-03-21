import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { pagination } from '../../../config/pagination';
import { Message } from '../../../config/message';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { SidebarService } from '../../../shared/sidebar/sidebar.component';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { MatAutocomplete } from '@angular/material';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ProveStorageList } from '../proveStorage';
import { ProveStorageService } from '../proveStorage.service';
import { setZeroHours, setDateMyDatepicker, getDateMyDatepicker, convertDateForSave } from 'app/config/dateFormat';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public dataList = [];
  public advSearch: any;
  public proveStorageDataList = new Array<ProveStorageList>();
  public paginage = pagination;
  modal: any;

  staffInfo: any;
  searchFailed = false;
  searching = false;


  //SEARCH_SORTING
  TN_SORTING = new BehaviorSubject<Boolean>(true);
  LAWSUIT_NO_SORTING = new BehaviorSubject<Boolean>(true);

  //TEMP_DEFAULTs
  public TEMP_TEXT_SEARCH: any = '';
  public TEMP_ARREST_CODE: any = '';
  public TEMP_LAWSUIT_NO: any = '';
  public TEMP_LAWSUIT_NO_YEAR: any = '';
  public EVIDENCE_IN_DATE_START: any;
  public EVIDENCE_IN_DATE_END: any;
  public TEMP_DELIVERY_NO: any = '';
  public DELIVERY_DATE_START: any;
  public DELIVERY_DATE_END: any;
  public TEMP_DELIVERY_NAME: any = '';
  public TEMP_DELIVERY_OFFICE_NAME: any = '';
  public TEMP_IS_RECEIVE: any = '0';

  public TEMP_EVIDENCE_IN_CODE: any = '';
  public TEMP_PROVE_NAME: any = '';
  public TEMP_RECEIVE_OFFICE_NAME: any = '';

  myDatePickerDeliveryFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerDeliveryToOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerEvidenceInFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerEvidenceInToOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };


  constructor(
    private _router: Router,
    private navService: NavigationService,
    private sidebarService: SidebarService,
    private proveStorageService: ProveStorageService,
    private preloader: PreloaderService,
    private ngbModel: NgbModal
  ) {
    this.navService.showAdvSearch = new BehaviorSubject<Boolean>(true);
    this.advSearch = this.navService.showAdvSearch;
  }

  async ngOnInit() {
    this.sidebarService.setVersion('proveStorage 0.0.0.1');

    this.myDatePickerDeliveryFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerDeliveryToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerEvidenceInFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerEvidenceInToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

    this.staffInfo = JSON.parse(localStorage.getItem("staffInfo"));

    await this.OnPageLoad();
  }

  async OnPageLoad() {

    let f = Object.assign({});

    f.IS_RECEIVE = this.TEMP_IS_RECEIVE;
    // f.ACCOUNT_OFFICE_CODE = localStorage.getItem("officeCode");

    this.preloader.setShowPreloader(true);

    this.proveStorageService.getByConAdv(f).then(list => {
      if (list.length > 0) {
        this.onSearchComplete(list);
        this.preloader.setShowPreloader(false);
      } else {
        this.proveStorageDataList = [];
        this.paginage.TotalItems = list.length;
        this.ShowAlert(Message.noRecord, 'warning')
        this.preloader.setShowPreloader(false);
      }
    }, (err: HttpErrorResponse) => {
      this.ShowAlert(err.message, 'error')
      this.proveStorageDataList = [];
      this.preloader.setShowPreloader(false);
    });
  }

  clickView(evidenceInType: string, arrestId: string, evidenceInId: string) {
    if (evidenceInType == "0") {
      this._router.navigate([`/proveStorage/manage/ADD/${arrestId}/${evidenceInId}`]);
    } else if (evidenceInType == "1") {
      this._router.navigate([`/proveStorage/manage/EDIT/${arrestId}/${evidenceInId}`]);
    }

  }

  clickSearch(Textsearch: any) {
    this.preloader.setShowPreloader(true);
    this.setDefualtInputSearch(1);
    var paramsOther = {
      ...Textsearch,
      ACCOUNT_OFFICE_CODE: localStorage.getItem("officeCode")
    }

    this.proveStorageService.getByKeyword(paramsOther).then(list => {

      if (list.length > 0) {
        this.onSearchComplete(list);
        this.preloader.setShowPreloader(false);
      } else {
        this.proveStorageDataList = [];
        this.paginage.TotalItems = list.length;
        this.ShowAlert(Message.noRecord, 'warning')
        this.preloader.setShowPreloader(false);
      }
    }, (err: HttpErrorResponse) => {
      this.ShowAlert(err.message, 'error')
      this.proveStorageDataList = [];
      this.preloader.setShowPreloader(false);
    });
  }

  setAdvSearch() {
    this.advSearch.next(!this.advSearch.getValue());
  }

  async onAdvSearch(form: any) {
    this.preloader.setShowPreloader(true);
    this.setDefualtInputSearch(0);

    if (!form.value.EVIDENCE_IN_DATE_START && form.value.EVIDENCE_IN_DATE_END) {
      this.EVIDENCE_IN_DATE_START = setDateMyDatepicker(form.value.EVIDENCE_IN_DATE_END);
      form.value.EVIDENCE_IN_DATE_START = form.value.EVIDENCE_IN_DATE_END;

      var d = new Date(form.value.EVIDENCE_IN_DATE_START.jsdate);
      this.myDatePickerDeliveryToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else if (form.value.EVIDENCE_IN_DATE_START && !form.value.EVIDENCE_IN_DATE_END) {
      const currDate = setDateMyDatepicker(new Date());
      this.EVIDENCE_IN_DATE_END = setDateMyDatepicker(currDate);
      form.value.EVIDENCE_IN_DATE_END = this.EVIDENCE_IN_DATE_END
    }

    let evidence_sdate = getDateMyDatepicker(form.value.EVIDENCE_IN_DATE_START);
    let evidence_edate = getDateMyDatepicker(form.value.EVIDENCE_IN_DATE_END);

    form.value.EVIDENCE_IN_DATE_START = convertDateForSave(evidence_sdate) || null;
    form.value.EVIDENCE_IN_DATE_END = convertDateForSave(evidence_edate) || null;

    if (!form.value.DELIVERY_DATE_START && form.value.DELIVERY_DATE_END) {
      this.DELIVERY_DATE_START = setDateMyDatepicker(form.value.DELIVERY_DATE_END);
      form.value.DELIVERY_DATE_START = form.value.DELIVERY_DATE_END;

      var d = new Date(form.value.DELIVERY_DATE_START.jsdate);
      this.myDatePickerDeliveryToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else if (form.value.DELIVERY_DATE_START && !form.value.DELIVERY_DATE_END) {
      const currDate = setDateMyDatepicker(new Date());
      this.DELIVERY_DATE_END = setDateMyDatepicker(currDate);
      form.value.DELIVERY_DATE_END = this.DELIVERY_DATE_END
    }

    let delivery_sdate = getDateMyDatepicker(form.value.DELIVERY_DATE_START);
    let delivery_edate = getDateMyDatepicker(form.value.DELIVERY_DATE_END);

    form.value.DELIVERY_DATE_START = convertDateForSave(delivery_sdate) || null;
    form.value.DELIVERY_DATE_END = convertDateForSave(delivery_edate) || null;

    // // ประเภทรายการรับ
    if (form.value.IS_RECEIVE == "") {
      form.value.IS_RECEIVE = null;
    }

    form.value.ACCOUNT_OFFICE_CODE = localStorage.getItem("officeCode");

    console.log(form.value);


    this.proveStorageService.getByConAdv(form.value).then(list => {
      if (list.length > 0) {
        this.onSearchComplete(list);
        this.preloader.setShowPreloader(false);
      } else {
        this.proveStorageDataList = [];
        this.paginage.TotalItems = list.length;
        this.ShowAlert(Message.noRecord, 'warning')
        this.preloader.setShowPreloader(false);
      }
    }, (err: HttpErrorResponse) => {
      this.ShowAlert(err.message, 'error')
      this.proveStorageDataList = [];
      this.preloader.setShowPreloader(false);
    });
  }

  ShowAlert(text, type) {
    swal({
      title: '',
      text: text,
      type: type,
      confirmButtonText: 'ตกลง'
    });
  }



  async onSearchComplete(list: any) {
    this.dataList = [];
    //list = this.mockDateList;

    if (Array.isArray(list)) {
      this.dataList = list;
    } else {
      this.dataList.push(list);
    }

    // set total record
    this.paginage.TotalItems = this.dataList.length;
    this.proveStorageDataList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);
  }

  async pageChanges(event) {
    this.proveStorageDataList = await this.dataList.slice(event.startIndex - 1, event.endIndex);
  }





  // ----- Validate Date -----

  public onDeliveryDateFromChanged(event) {
    console.log(event.jsdate)
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerDeliveryToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.myDatePickerDeliveryToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onDeliveryDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerDeliveryFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerDeliveryFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onEvidenceInDateFromChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerEvidenceInToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.myDatePickerEvidenceInToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onEvidenceInDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerEvidenceInFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerEvidenceInFromOptions = {
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


  setDefualtInputSearch(type: number) {
    switch (type) {
      case 0:
        this.TEMP_TEXT_SEARCH = '';
        break;
      case 1:
        this.TEMP_ARREST_CODE = '';
        this.TEMP_LAWSUIT_NO = '';
        this.TEMP_LAWSUIT_NO_YEAR = '';
        this.EVIDENCE_IN_DATE_START = null;
        this.EVIDENCE_IN_DATE_END = null;
        this.TEMP_DELIVERY_NO = '';
        this.DELIVERY_DATE_START = null;
        this.DELIVERY_DATE_END = null;
        this.TEMP_DELIVERY_NAME = '';
        this.TEMP_DELIVERY_OFFICE_NAME = '';
        this.TEMP_IS_RECEIVE = '0';
        this.TEMP_EVIDENCE_IN_CODE = '';
        this.TEMP_PROVE_NAME = '';
        this.TEMP_RECEIVE_OFFICE_NAME = '';

        this.myDatePickerDeliveryFromOptions = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.myDatePickerDeliveryToOptions = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.myDatePickerEvidenceInFromOptions = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.myDatePickerEvidenceInToOptions = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }

        break;
      default:
        break;
    }
  }

  isNumberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  Sorter(event: BehaviorSubject<Boolean>, type: string): void {
    if (event.getValue()) event.next(false); else event.next(true);

    switch (type) {

      case 'TN':
        if (event.getValue())
          this.dataList.sort((a, b) => {
            return <number>parseInt(b.ARREST_CODE.substring(2))
              - <number>parseInt(a.ARREST_CODE.substring(2));
          });
        else
          this.dataList.sort((a, b) => {
            return <number>parseInt(a.ARREST_CODE.substring(2))
              - <number>parseInt(b.ARREST_CODE.substring(2));
          });
        break;

      case 'LAWSUIT_NO':
        const LAWSUIT_NO = (LAWSUIT_NO, LAWSUIT_NO_YEAR) => parseInt(
          `${LAWSUIT_NO}${LAWSUIT_NO_YEAR ? parseInt(LAWSUIT_NO_YEAR.slice(0, 4)) : ''}`);

        if (event.getValue())
          this.dataList.sort((a, b) => {
            return <any>LAWSUIT_NO(b.LAWSUIT_NO, b.LAWSUIT_NO_YEAR)
              - <any>LAWSUIT_NO(a.LAWSUIT_NO, a.LAWSUIT_NO_YEAR);
          });
        else
          this.dataList.sort((a, b) => {
            return <any>LAWSUIT_NO(a.LAWSUIT_NO, a.LAWSUIT_NO_YEAR)
              - <any>LAWSUIT_NO(b.LAWSUIT_NO, b.LAWSUIT_NO_YEAR);
          });
        break;
      default:
        break;
    }
    this.reIndex();
    this.proveStorageDataList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);
  }

  reIndex() {
    this.dataList.map((m, i) => {
      m.RowsId = i + 1;
    })
  }

  public canOfficeSearch(): boolean {
    const officeCode = localStorage.getItem("officeCode");
    const OFFICE_CODE_SLICE = officeCode.slice(0, 2);
    return OFFICE_CODE_SLICE == '00' ? false : true;
  }

  public searchOffice_ll = (text2$: Observable<string>) =>
    text2$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.proveStorageService.MasOfficegetByCon_forSearch({ TEXT_SEARCH: term })
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          })
      )
      .do(() => this.searching = false);



  mockDateList: any[] = [
    {
      ARREST_CODE: "TN1003006300022",
      ARREST_DATE: "21 มี.ค 2563",
      LAWSUIT_NO: "5/2556",
      LAWSUIT_DATE: "21 มี.ค 2563",
      DELIVERY_NO: "กค 100300.01.005",
      DELIVERY_DATE: "21 มี.ค 2563",
      DELIVERY_FULL_NAME: "นายชนันธนัตย์ สำเริง",
      DELIVERY_OFFICE_NAME: "สำนักกฎหมาย ส่วนพิสูจน์และจัดการของกลาง",
      IS_RECEIVE: 0
    },
    {
      ARREST_CODE: "TN1003006300022",
      ARREST_DATE: "21 มี.ค 2563",
      LAWSUIT_NO: "5/2556,5/2557",
      LAWSUIT_DATE: "21 มี.ค 2563",
      DELIVERY_NO: "กค 100300.01.005",
      DELIVERY_DATE: "21 มี.ค 2563",
      DELIVERY_FULL_NAME: "นายชนันธนัตย์ สำเริง",
      DELIVERY_OFFICE_NAME: "สำนักกฎหมาย ส่วนพิสูจน์และจัดการของกลาง",
      IS_RECEIVE: 0
    }
  ]

}
