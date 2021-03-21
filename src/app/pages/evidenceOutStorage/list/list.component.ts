import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { pagination } from '../../../config/pagination';
import { Message } from '../../../config/message';
import { toLocalShort, compareDate, setZeroHours, getDateMyDatepicker, setDateMyDatepicker, convertDateForSave } from '../../../config/dateFormat';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { SidebarService } from '../../../shared/sidebar/sidebar.component';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { MatAutocomplete } from '@angular/material';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from "rxjs";
import { EvidenceOutStorageService } from '../evidenceOutStorage.service';
import { EvidenceOutStorageList } from '../evidenceOutStorage';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {

    public dataList = [];
    public advSearch: any;
    public evidenceOutStorageList = new Array<EvidenceOutStorageList>();
    public paginage = pagination;
    modal: any;
    
    staffInfo: any;
    searchFailed = false;
    searching = false;


    //SEARCH_SORTING
    EVIDENCE_OUT_CODE_SORTING = new BehaviorSubject<Boolean>(true);
    EVIDENCE_OUT_DATE_SORTING = new BehaviorSubject<Boolean>(true);
    APPROVE_DATE_SORTING = new BehaviorSubject<Boolean>(true);

    //TEMP_DEFAULTs
    public TEMP_TEXT_SEARCH: any = '';
    public TEMP_EVIDENCE_OUT_CODE: any = '';
    public EVIDENCE_OUT_DATE_START: any;
    public EVIDENCE_OUT_DATE_END: any;
    public TEMP_EVIDENCE_OUT_NO: any = '';
    public APPROVE_DATE_START: any;
    public APPROVE_DATE_END: any;
    public TEMP_EVIDENCE_OUT_STAFF: any = '';
    public TEMP_OFFICE_NAME: any = '';



    myDatePickerEvidenceOutFromOptions: IMyOptions = {
        editableDateField: false,
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: true,
        height: '30px'
      };
    
    myDatePickerEvidenceOutToOptions: IMyOptions = {
        editableDateField: false,
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: true,
        height: '30px'
    };

    myDatePickerApproveFromOptions: IMyOptions = {
        editableDateField: false,
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: true,
        height: '30px'
      };
    
    myDatePickerApproveToOptions: IMyOptions = {
        editableDateField: false,
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: true,
        height: '30px'
    };

    
    constructor(
        private _router: Router,
        private navService: NavigationService,
        private sidebarService: SidebarService,
        private evidenceOutStorageService: EvidenceOutStorageService,
        private preloader: PreloaderService,
        private ngbModel: NgbModal
    ) {
        this.navService.showAdvSearch = new BehaviorSubject<Boolean>(true);
        this.advSearch = this.navService.showAdvSearch;
    }

    async ngOnInit() {
        this.sidebarService.setVersion('evidenceOutStorage 0.0.0.1');

        this.myDatePickerEvidenceOutFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
        this.myDatePickerEvidenceOutToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
        this.myDatePickerApproveFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
        this.myDatePickerApproveToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

        this.staffInfo = JSON.parse(localStorage.getItem("staffInfo"));

        await this.OnPageLoad();
    }

    async OnPageLoad() {

        let f = Object.assign({});
    
        f.ACCOUNT_OFFICE_CODE = localStorage.getItem("officeCode");
        f.EVIDENCE_OUT_TYPE = []
    
        this.preloader.setShowPreloader(true);
    
        this.evidenceOutStorageService.getByConAdv(f).then(list => {
            console.log(list)
            if (list.length > 0) {
                this.onSearchComplete(list);
                this.preloader.setShowPreloader(false);
            } else {
                this.evidenceOutStorageList = [];
                this.paginage.TotalItems = list.length;
                this.ShowAlert(Message.noRecord,'warning')
                this.preloader.setShowPreloader(false);
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlert(err.message,'error')
            this.evidenceOutStorageList = [];
            this.preloader.setShowPreloader(false);
        });
    }

    clickEdit(EVIDENCE_OUT_ID: number) {
      this._router.navigate([`/evidenceOutStorage/manage/EDIT/${EVIDENCE_OUT_ID}`]);
        
    }

    clickNew() {
      this._router.navigate([`/evidenceOutStorage/manage/ADD/0`]);
    }

    clickSearch(Textsearch: any) {
        this.preloader.setShowPreloader(true);
        this.setDefualtInputSearch(1);
        var paramsOther = {
            ...Textsearch,
            EVIDENCE_OUT_TYPE:[],
            ACCOUNT_OFFICE_CODE: localStorage.getItem("officeCode")
        }

        this.evidenceOutStorageService.getByKeyword(paramsOther).then(list => {

            if (list.length > 0) {
                this.onSearchComplete(list);
                this.preloader.setShowPreloader(false);
            } else {
                this.evidenceOutStorageList = [];
                this.paginage.TotalItems = list.length;
                this.ShowAlert(Message.noRecord,'warning')
                this.preloader.setShowPreloader(false);
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlert(err.message,'error')
            this.evidenceOutStorageList = [];
            this.preloader.setShowPreloader(false);
        });
    }

    setAdvSearch() {
        this.advSearch.next(!this.advSearch.getValue());
    }

    async onAdvSearch(form: any) {
        this.preloader.setShowPreloader(true);
        this.setDefualtInputSearch(0);

        if (!form.value.EVIDENCE_OUT_DATE_START && form.value.EVIDENCE_OUT_DATE_END) {
            this.EVIDENCE_OUT_DATE_START = setDateMyDatepicker(form.value.EVIDENCE_OUT_DATE_END);
            form.value.EVIDENCE_OUT_DATE_START = form.value.EVIDENCE_OUT_DATE_END;
      
            var d = new Date(form.value.EVIDENCE_OUT_DATE_START.jsdate);
            this.myDatePickerEvidenceOutToOptions = {
              disableDateRanges: [{
                begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
                end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
              }, this.getDisCurrDateMyDatePicker()]
            }
          } else if (form.value.EVIDENCE_OUT_DATE_START && !form.value.EVIDENCE_OUT_DATE_END) {
            const currDate = setDateMyDatepicker(new Date());
            this.EVIDENCE_OUT_DATE_END = setDateMyDatepicker(currDate);
            form.value.EVIDENCE_OUT_DATE_END = this.EVIDENCE_OUT_DATE_END
          }
      
          let evidenceoutdate_sdate = getDateMyDatepicker(form.value.EVIDENCE_OUT_DATE_START);
          let evidenceoutdate_edate = getDateMyDatepicker(form.value.EVIDENCE_OUT_DATE_END);
      
          form.value.EVIDENCE_OUT_DATE_START = convertDateForSave(evidenceoutdate_sdate) || null;
          form.value.EVIDENCE_OUT_DATE_END = convertDateForSave(evidenceoutdate_edate) || null;


        if (!form.value.APPROVE_DATE_START && form.value.APPROVE_DATE_END) {
            this.APPROVE_DATE_START = setDateMyDatepicker(form.value.APPROVE_DATE_END);
            form.value.APPROVE_DATE_START = form.value.APPROVE_DATE_END;
      
            var d = new Date(form.value.APPROVE_DATE_START.jsdate);
            this.myDatePickerApproveToOptions = {
              disableDateRanges: [{
                begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
                end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
              }, this.getDisCurrDateMyDatePicker()]
            }
          } else if (form.value.APPROVE_DATE_START && !form.value.APPROVE_DATE_END) {
            const currDate = setDateMyDatepicker(new Date());
            this.APPROVE_DATE_END = setDateMyDatepicker(currDate);
            form.value.APPROVE_DATE_END = this.APPROVE_DATE_END
          }
      
          let provedate_sdate = getDateMyDatepicker(form.value.APPROVE_DATE_START);
          let provedate_edate = getDateMyDatepicker(form.value.APPROVE_DATE_END);
      
          form.value.APPROVE_DATE_START = convertDateForSave(provedate_sdate) || null;
          form.value.APPROVE_DATE_END = convertDateForSave(provedate_edate) || null;



        form.value.ACCOUNT_OFFICE_CODE = localStorage.getItem("officeCode");
        form.value.EVIDENCE_OUT_TYPE = []

        console.log(form.value);


        
        this.evidenceOutStorageService.getByConAdv(form.value).then(list => {
            if (list.length > 0) {
                this.onSearchComplete(list);
                this.preloader.setShowPreloader(false);
            } else {
                this.evidenceOutStorageList = [];
                this.paginage.TotalItems = list.length;
                this.ShowAlert(Message.noRecord,'warning')
                this.preloader.setShowPreloader(false);
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlert(err.message,'error')
            this.evidenceOutStorageList = [];
            this.preloader.setShowPreloader(false);
        });
    }

    ShowAlert(text,type) {
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
        this.evidenceOutStorageList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);
    }

    async pageChanges(event) {
       this.evidenceOutStorageList = await this.dataList.slice(event.startIndex - 1, event.endIndex);
    }

    

    // ----- Validate Date -----

      public onEvidenceOutDateFromChanged(event) {
        console.log(event.jsdate)
        if (event.jsdate) {
          var d = new Date(event.jsdate);
          d.setDate(d.getDate() - 1);
          this.myDatePickerEvidenceOutToOptions = {
            disableDateRanges: [{
              begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
              end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
            }, this.getDisCurrDateMyDatePicker()]
          }
        } else {
          this.myDatePickerEvidenceOutToOptions = {
            disableDateRanges: [this.getDisCurrDateMyDatePicker()]
          }
        }
      }
    
      public onEvidenceOutDateToChanged(event) {
        if (event.jsdate) {
          var d = new Date(event.jsdate);
          this.myDatePickerEvidenceOutFromOptions = {
            disableDateRanges: [{
              begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
              end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
            }]
          }
        } else {
          this.myDatePickerEvidenceOutFromOptions = {
            disableDateRanges: [this.getDisCurrDateMyDatePicker()]
          }
        }
      }

      public onApproveDateFromChanged(event) {
        console.log(event.jsdate)
        if (event.jsdate) {
          var d = new Date(event.jsdate);
          d.setDate(d.getDate() - 1);
          this.myDatePickerApproveToOptions = {
            disableDateRanges: [{
              begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
              end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
            }, this.getDisCurrDateMyDatePicker()]
          }
        } else {
          this.myDatePickerApproveToOptions = {
            disableDateRanges: [this.getDisCurrDateMyDatePicker()]
          }
        }
      }
    
      public onApproveDateToChanged(event) {
        if (event.jsdate) {
          var d = new Date(event.jsdate);
          this.myDatePickerApproveFromOptions = {
            disableDateRanges: [{
              begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
              end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
            }]
          }
        } else {
          this.myDatePickerApproveFromOptions = {
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
                this.TEMP_EVIDENCE_OUT_CODE = '';
                this.EVIDENCE_OUT_DATE_START = null;
                this.EVIDENCE_OUT_DATE_END = null;
                this.TEMP_EVIDENCE_OUT_NO = '';
                this.APPROVE_DATE_START = null;
                this.APPROVE_DATE_END = null;
                this.TEMP_EVIDENCE_OUT_STAFF = '';
                this.TEMP_OFFICE_NAME = '';


                this.myDatePickerEvidenceOutFromOptions= {
                    disableDateRanges: [this.getDisCurrDateMyDatePicker()]
                  }
                this.myDatePickerEvidenceOutToOptions = {
                    disableDateRanges: [this.getDisCurrDateMyDatePicker()]
                  }

                this.myDatePickerApproveFromOptions = {
                    disableDateRanges: [this.getDisCurrDateMyDatePicker()]
                  }
                this.myDatePickerApproveToOptions = {
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
        console.log(this.dataList)
    
        switch (type) {
    
          case 'EVIDENCE_OUT_CODE':
            if (event.getValue())
              this.dataList.sort((a, b) => {
                return <number>parseInt(b.EVIDENCE_OUT_CODE.substring(2))
                  - <number>parseInt(a.EVIDENCE_OUT_CODE.substring(2));
              });
            else
              this.dataList.sort((a, b) => {
                return <number>parseInt(a.EVIDENCE_OUT_CODE.substring(2))
                  - <number>parseInt(b.EVIDENCE_OUT_CODE.substring(2));
              });
            break;
    
          case 'EVIDENCE_OUT_DATE':
            if (event.getValue())
              this.dataList.sort((a, b) => {
                return <any>new Date(b.EVIDENCE_OUT_DATE).getTime()
                  - <any>new Date(a.EVIDENCE_OUT_DATE).getTime();
              });
            else
              this.dataList.sort((a, b) => {
                return <any>new Date(a.EVIDENCE_OUT_DATE).getTime()
                  - <any>new Date(b.EVIDENCE_OUT_DATE).getTime();
              });
            break;
    
          case 'APPROVE_DATE':
            if (event.getValue())
              this.dataList.sort((a, b) => {
                return <any>new Date(b.APPROVE_DATE).getTime()
                  - <any>new Date(a.APPROVE_DATE).getTime();
              });
            else
              this.dataList.sort((a, b) => {
                return <any>new Date(a.APPROVE_DATE).getTime()
                  - <any>new Date(b.APPROVE_DATE).getTime();
              });
            break;

          default:
            break;
        }
        this.reIndex();
        this.evidenceOutStorageList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);
      }
    
      reIndex() {
        this.dataList.map((m, i) => {
          m.RowsId = i + 1;
        })
      }
    
      DateSorter(Arr: any[] = []) {
        return Arr.sort((a, b) => {
          return <any>new Date(b.OCCURRENCE_DATE).getTime() - <any>new Date(a.OCCURRENCE_DATE).getTime();
        });
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
        this.evidenceOutStorageService.MasOfficegetByCon_forSearch({ TEXT_SEARCH: term })
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
