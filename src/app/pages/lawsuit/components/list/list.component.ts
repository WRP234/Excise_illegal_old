import { Router } from "@angular/router";
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { pagination } from "../../../../config/pagination";
import { Message } from "../../../../config/message";
import { Lawsuit } from "../../models/lawsuit";
import { PreloaderService } from "../../../../shared/preloader/preloader.component";
import { SidebarService } from "../../../../shared/sidebar/sidebar.component";
import { IMyDpOptions } from 'mydatepicker';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { LawsuitService } from "../../lawsuit.service";
import { NavigationService } from "../../../../shared/header-navigation/navigation.service";
import { toLocalShort, toLocalLong, compareDate, toLocalNumeric, setZeroHours, getDateMyDatepicker, setDateMyDatepicker, convertDateForSave } from '../../../../config/dateFormat';
import Swal from 'sweetalert2';
import { BehaviorSubject, Observable } from "rxjs";

declare const window: any;
declare const document: any;
@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})

export class ListComponent implements OnInit {

  results: Lawsuit[] = [];

  resultsPerPage: Lawsuit[] = [];

  Textsearch: string;

  subOnSearchByKeyword: any;

  subSetNextPage: any;

  advSearch: any;

  searchFailed = false;
  searching = false;

  LAWSUILT_DATE_START_FROM: any;
  LAWSUILT_DATE_START_TO: any;
  OCCURRENCE_DATE_FROM: any;
  OCCURRENCE_DATE_TO: any;
  months: any[];
  monthsTh: any[];

  //TEMP_DEFAULTs
  public TEMP_ARREST_CODE: any = '';
  public TEMP_ARREST_STAFF: any = '';
  public TEMP_LAWBREAKER_NEME: any = '';
  public TEMP_SUBSECTION_NAME: any = '';
  public TEMP_GUILTBASE_NAME: any = '';
  public TEMP_ARREST_LOCAL: any = '';
  public TEMP_LAWSUIT_NO: any = '';
  public TEMP_LAWSUIT_NO_YEAR: any = '';
  public TEMP_IS_OUTSIDE: any = '';
  public TEMP_LAWSUILT_STAFF: any = '';
  public TEMP_LAWSUILT_OFFICE_NAME: any = '';
  public TEMP_LAWSUIT_TYPE: any = '';
  public TEMP_IS_LAWSUIT_COMPLETE: any = 0;

  LAWSUIT_TYPE: any[] = [
    { NAME: 'เปรียบเทียบปรับ', VALUE: 1 },
    { NAME: 'ส่งฟ้องศาล', VALUE: 0 },
    { NAME: 'ส่งพนักงานสอบสวน', VALUE: 2 }
  ]
  //SEARCH_SORTING
  TN_SORTING = new BehaviorSubject<Boolean>(true);
  TIME_SORTING = new BehaviorSubject<Boolean>(true);
  LAWSUIT_NO_SORTING = new BehaviorSubject<Boolean>(true);
  LAWSUIT_DATE_SORTING = new BehaviorSubject<Boolean>(true);

  public officeCode = localStorage.getItem("officeCode");

  staffInfo: string;

  myDatePickerOccurrenceFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerOccurrenceToOptions: IMyOptions = {
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

  @ViewChild('advForm') advForm: NgForm;

  paginage = pagination;

  constructor(
    private router: Router,
    private navService: NavigationService,
    private preLoaderService: PreloaderService,
    private lawsuitService: LawsuitService,
    private sidebarService: SidebarService
  ) {
    this.navService.showAdvSearch = new BehaviorSubject<Boolean>(true);
    this.advSearch = this.navService.showAdvSearch;
  }

  async ngOnInit() {

    this.setPagination();

    this.sidebarService.setVersion('Lawsuit 0.2.0.7');

    this.myDatePickerOccurrenceFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerOccurrenceToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerLawsuitFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerLawsuitToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

    this.months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    this.monthsTh = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

    this.staffInfo = JSON.parse(localStorage.getItem("staffInfo"));

    await this.OnPageLoad();
  }

  async OnPageLoad() {

    let f = Object.assign({});

    f.IS_LAWSUIT_COMPLETE = this.TEMP_IS_LAWSUIT_COMPLETE;
    f.ACCOUNT_OFFICE_CODE = localStorage.getItem("officeCode");

    this.preLoaderService.setShowPreloader(true);

    let ArrestGetByCon = await this.lawsuitService.LawsuitArrestGetByConAdv(f);

    await this.setLawsuitArrestList(ArrestGetByCon);

    this.preLoaderService.setShowPreloader(false);
  }

  setPagination() {
    this.paginage.TotalItems = 0;
  }

  async pageChanges(event) {
    this.resultsPerPage = await this.results.slice(event.startIndex - 1, event.endIndex);
  }

  onSearchByKeyword() { }

  onNextPage() { }

  setLawsuitArrestList(list: any[] = []) {
    if (list.length == 0) {
      Swal({
        text: Message.noRecord,
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'ตกลง'
      });

    } else {
      list = this.DateSorter(list);
      list.map((m, i) => {
        m.RowsId = i + 1;
        m.LAWSUIT_DATE_TH = m.LAWSUIT_DATE != null
          ? toLocalLong(m.LAWSUIT_DATE)
          : '';
        m.LAWSUIT_TEXT = m.IS_LAWSUIT == 1 ?
          m.LAWSUIT_NO ?
            `${m.LAWSUIT_IS_OUTSIDE == 1 ? 'น.' : ''} ${m.LAWSUIT_NO}/${m.LAWSUIT_NO_YEAR ? parseInt(m.LAWSUIT_NO_YEAR.slice(0, 4)) + 543 : ''}`
            : ''
          : '';
        m.OCCURRENCE_DATE_TEXT = m.OCCURRENCE_DATE != null
          ? toLocalLong(m.OCCURRENCE_DATE)
          : '';
        m.LAWSUIT_FULL_NAME = `${m.LAWSUIT_TITLE_SHORT_NAME_TH || ''}${m.LAWSUIT_FIRST_NAME || ''} ${m.LAWSUIT_LAST_NAME || ''}`;
        m.LAWSUIT_TYPE = m.IS_LAWSUIT == 1 ?
          m.LAWSUIT_ID ?
            this.getLawsuitType(m.LAWSUIT_TYPE)
            : ''
          : '';

        m.LawsuitLawbreaker.map(m => {
          for (let key in m)
            if (m[key] === "null") m[key] = null
        });

      });
    }

    this.results = list;
    this.resultsPerPage = list.slice(0, 5);
    this.paginage.TotalItems = list.length;
    this.preLoaderService.setShowPreloader(false);
  }

  getLawsuitType(LAWSUIT_TYPE) {
    const temp = this.LAWSUIT_TYPE.find(f => f.VALUE == LAWSUIT_TYPE);
    return temp ? temp.NAME : '';
  }

  async onSearch(Textsearch: any = null) {
    Textsearch = Textsearch || (this.Textsearch || "");
    if (Textsearch || Textsearch === "") {
      this.preLoaderService.setShowPreloader(true);

      let LawsuitArrestList: any[] = [];

      LawsuitArrestList = await this.lawsuitService.LawsuitArrestGetByKeyword({ 'TEXT_SEARCH': Textsearch, 'ACCOUNT_OFFICE_CODE': '' });

      this.setDefualtInputSearch(1);

      await this.setLawsuitArrestList(LawsuitArrestList);

      this.preLoaderService.setShowPreloader(false);
    } else {
      return false;
    }
  }

  async onAdvSearch(form: any) {

    if (!form.value.OCCURRENCE_DATE_FROM && form.value.OCCURRENCE_DATE_TO) {
      this.OCCURRENCE_DATE_FROM = setDateMyDatepicker(form.value.OCCURRENCE_DATE_TO);
      form.value.OCCURRENCE_DATE_FROM = form.value.OCCURRENCE_DATE_TO;

      var d = new Date(form.value.OCCURRENCE_DATE_FROM.jsdate);
      this.myDatePickerOccurrenceToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else if (form.value.OCCURRENCE_DATE_FROM && !form.value.OCCURRENCE_DATE_TO) {
      const currDate = setDateMyDatepicker(new Date());
      this.OCCURRENCE_DATE_TO = setDateMyDatepicker(currDate);
      form.value.OCCURRENCE_DATE_TO = this.OCCURRENCE_DATE_TO
    }

    let occ_sdate = getDateMyDatepicker(form.value.OCCURRENCE_DATE_FROM);
    let occ_edate = getDateMyDatepicker(form.value.OCCURRENCE_DATE_TO);

    form.value.OCCURRENCE_DATE_FROM = convertDateForSave(occ_sdate) || null;
    form.value.OCCURRENCE_DATE_TO = convertDateForSave(occ_edate) || null;

    if (!form.value.LAWSUILT_DATE_START_FROM && form.value.LAWSUILT_DATE_START_TO) {
      this.LAWSUILT_DATE_START_FROM = setDateMyDatepicker(form.value.LAWSUILT_DATE_START_TO);
      form.value.LAWSUILT_DATE_START_FROM = form.value.LAWSUILT_DATE_START_TO;

      var d = new Date(form.value.LAWSUILT_DATE_START_FROM.jsdate);
      this.myDatePickerLawsuitToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else if (form.value.LAWSUILT_DATE_START_FROM && !form.value.LAWSUILT_DATE_START_TO) {
      const currDate = setDateMyDatepicker(new Date());
      this.LAWSUILT_DATE_START_TO = setDateMyDatepicker(currDate);
      form.value.LAWSUILT_DATE_START_TO = this.LAWSUILT_DATE_START_TO
    }

    let law_sdate = getDateMyDatepicker(form.value.LAWSUILT_DATE_START_FROM);
    let law_edate = getDateMyDatepicker(form.value.LAWSUILT_DATE_START_TO);

    form.value.LAWSUILT_DATE_START_FROM = convertDateForSave(law_sdate) || null;
    form.value.LAWSUILT_DATE_START_TO = convertDateForSave(law_edate) || null;

    form.value.ACCOUNT_OFFICE_CODE = localStorage.getItem("officeCode");

    this.preLoaderService.setShowPreloader(true);

    let ArrestGetByCon: any[] = [];

    ArrestGetByCon = await this.lawsuitService.LawsuitArrestGetByConAdv(form.value);

    this.setDefualtInputSearch(0);

    await this.setLawsuitArrestList(ArrestGetByCon);

    this.preLoaderService.setShowPreloader(false);
  }

  toggleAdv() {
    this.advSearch.next(!this.advSearch.getValue());
  }

  checkLawsuitType(item) {
    try {
      return item.LAWSUIT_IS_OUTSIDE == 1 ? "น. " : ""
    } catch (err) {
      console.log(err);
      return "";
    }
  }

  showLawsuitDate(item) {
    try {
      if (item.Lawsuit) {
        return toLocalShort(item.Lawsuit.LAWSUIT_DATE)
      }
    } catch {
      return "";
    }

  }

  checkNullLawsuitNo(data) {
    try {
      return data.Lawsuit.LAWSUIT_NO;
    } catch (err) {
      return "";
    }
  }

  viewData(item) {
    let LawsuitID = ""
    if (item) {
      LawsuitID = item.LAWSUIT_ID;
    }
    if (LawsuitID != "") {
      this.router.navigate(['/lawsuit/manage', 'R'], {
        queryParams: { IndictmentID: item.INDICTMENT_ID, LawsuitID: LawsuitID }
      });
    } else {
      this.router.navigate(['/lawsuit/manage', 'C'], {
        queryParams: { IndictmentID: item.INDICTMENT_ID, LawsuitID: LawsuitID }
      });
    }
  }

  public onDateFromChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerOccurrenceToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.myDatePickerOccurrenceToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerOccurrenceFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerOccurrenceFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onLawsuitDateFromChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerLawsuitToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.myDatePickerLawsuitToOptions = {
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
    // if (event.jsdate) {
    //   let d = new Date(event.jsdate);
    //   this.myDatePickerLawsuitFromOptions = {
    //     // ...this.myDatePickerLawsuitOptions,
    //     disableSince: {
    //       year: d.getFullYear(),
    //       month: d.getMonth() + 1,
    //       day: d.getDate() + 1
    //     }
    //   }
    // } else {
    //   let currentdate = new Date();
    //   this.myDatePickerLawsuitFromOptions = {
    //     // ...this.myDatePickerLawsuitOptions,
    //     disableSince: {
    //       year: currentdate.getFullYear(),
    //       month: currentdate.getMonth() + 1,
    //       day: currentdate.getDate() + 1
    //     }
    //   }
    // }
  }

  getDisCurrDateMyDatePicker() {
    let currentdate = new Date();
    const disCurrDate = {
      begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
      end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
    }
    return disCurrDate;
  }

  setLawsuitCompleteText(INDICTMENT_IS_LAWSUIT_COMPLETE: any): string {
    return INDICTMENT_IS_LAWSUIT_COMPLETE == 0 ? 'ยังไม่พิจารณา' : 'พิจารณา';
  }

  setIsOutSideText(LAWSUIT_IS_OUTSIDE: any, INDICTMENT_IS_LAWSUIT_COMPLETE: any): string {
    if (INDICTMENT_IS_LAWSUIT_COMPLETE == 0) return '';
    else return LAWSUIT_IS_OUTSIDE == 0 ? 'คดีในสถานที่ทำการ' : 'คดีนอกสถานที่ทำการ';
  }

  public canOfficeSearch(): boolean {
    const OFFICE_CODE_SLICE = this.officeCode.slice(0, 2);
    return OFFICE_CODE_SLICE == '00' ? false : true;
  }

  Sorter(event: BehaviorSubject<Boolean>, type: string): void {
    if (event.getValue()) event.next(false); else event.next(true);

    switch (type) {

      case 'TN':
        if (event.getValue())
          this.results.sort((a, b) => {
            return <number>parseInt(b.ARREST_CODE.substring(2))
              - <number>parseInt(a.ARREST_CODE.substring(2));
          });
        else
          this.results.sort((a, b) => {
            return <number>parseInt(a.ARREST_CODE.substring(2))
              - <number>parseInt(b.ARREST_CODE.substring(2));
          });
        break;

      case 'TIME':
        if (event.getValue())
          this.results.sort((a, b) => {
            return <any>new Date(b.OCCURRENCE_DATE).getTime()
              - <any>new Date(a.OCCURRENCE_DATE).getTime();
          });
        else
          this.results.sort((a, b) => {
            return <any>new Date(a.OCCURRENCE_DATE).getTime()
              - <any>new Date(b.OCCURRENCE_DATE).getTime();
          });
        break;

      case 'LAWSUIT_DATE':
        if (event.getValue())
          this.results.sort((a, b) => {
            return <any>new Date(b.LAWSUIT_DATE).getTime()
              - <any>new Date(a.LAWSUIT_DATE).getTime();
          });
        else
          this.results.sort((a, b) => {
            return <any>new Date(a.LAWSUIT_DATE).getTime()
              - <any>new Date(b.LAWSUIT_DATE).getTime();
          });
        break;

      case 'LAWSUIT_NO':
        const LAWSUIT_NO = (LAWSUIT_NO, LAWSUIT_NO_YEAR) => parseInt(
          `${LAWSUIT_NO}${LAWSUIT_NO_YEAR ? parseInt(LAWSUIT_NO_YEAR.slice(0, 4)) : ''}`);

        if (event.getValue())
          this.results.sort((a, b) => {
            return <any>LAWSUIT_NO(b.LAWSUIT_NO, b.LAWSUIT_NO_YEAR)
              - <any>LAWSUIT_NO(a.LAWSUIT_NO, a.LAWSUIT_NO_YEAR);
          });
        else
          this.results.sort((a, b) => {
            return <any>LAWSUIT_NO(a.LAWSUIT_NO, a.LAWSUIT_NO_YEAR)
              - <any>LAWSUIT_NO(b.LAWSUIT_NO, b.LAWSUIT_NO_YEAR);
          });
        break;
      default:
        break;
    }
    this.reIndex();
    this.resultsPerPage = this.results.slice(0, this.paginage.RowsPerPageOptions[0]);
  }

  reIndex() {
    this.results.map((m, i) => {
      m.RowsId = i + 1;
    })
  }

  DateSorter(Arr: any[] = []) {
    return Arr.sort((a, b) => {
      return <any>new Date(b.OCCURRENCE_DATE).getTime() - <any>new Date(a.OCCURRENCE_DATE).getTime();
    });
  }

  public searchOffice_ll = (text2$: Observable<string>) =>
    text2$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.lawsuitService.MasOfficegetByCon_forSearch({ TEXT_SEARCH: term })
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
        this.Textsearch = '';
        break;
      case 1:
        this.TEMP_ARREST_CODE = '';
        this.TEMP_ARREST_STAFF = '';
        this.TEMP_LAWBREAKER_NEME = '';
        this.TEMP_SUBSECTION_NAME = '';
        this.TEMP_GUILTBASE_NAME = '';
        this.TEMP_ARREST_LOCAL = '';
        this.TEMP_LAWSUIT_NO = '';
        this.TEMP_LAWSUIT_NO_YEAR = '';
        this.TEMP_IS_OUTSIDE = '';
        this.TEMP_LAWSUILT_STAFF = '';
        this.TEMP_LAWSUILT_OFFICE_NAME = '';
        this.TEMP_LAWSUIT_TYPE = '';
        this.TEMP_IS_LAWSUIT_COMPLETE = '';
        this.OCCURRENCE_DATE_FROM = null;
        this.OCCURRENCE_DATE_TO = null;
        this.LAWSUILT_DATE_START_FROM = null;
        this.LAWSUILT_DATE_START_TO = null;

        this.myDatePickerOccurrenceFromOptions = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.myDatePickerOccurrenceToOptions = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.myDatePickerLawsuitFromOptions = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.myDatePickerLawsuitToOptions = {
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

}
