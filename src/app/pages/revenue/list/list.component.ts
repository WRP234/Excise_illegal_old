import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RevenueService } from '../revenue.service';
import { HttpErrorResponse } from '@angular/common/http';
import { getDateMyDatepicker, toLocalLong, setDateMyDatepicker, convertDateForSave } from '../../../config/dateFormat';
import { IMyDateModel } from 'mydatepicker-th';
import { SidebarService } from '../../../shared/sidebar/sidebar.component';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { NavigationService } from "../../../shared/header-navigation/navigation.service";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ListConfig } from './list.component.config';
import { RevenueMasterService } from '../revenue.mas.service';
import { mergeMap, map, reduce } from 'rxjs/operators';
import { from, Observable, forkJoin } from 'rxjs';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent extends ListConfig implements OnInit {

    constructor(
        private _router: Router,
        private sidebarService: SidebarService,
        private navService: NavigationService,
        private revService: RevenueService,
        private preloader: PreloaderService,
        private RevenueMasService: RevenueMasterService

    ) {
        super();
        this.navService.showAdvSearch = new BehaviorSubject<Boolean>(true);
        this.advSearch = this.navService.showAdvSearch;
    }

    searchOffice_forList = this.RevenueMasService.searchOffice_forList;

    ngOnInit() {
        localStorage.setItem('programcode', 'ILG60-99-06');
        this.sidebarService.setVersion('Renenue II V 0.0.0.3');

        let currentdate = new Date();

        this.REVENUE_DATE_FROM = setDateMyDatepicker(currentdate);

        this.REVENUE_DATE_TO = setDateMyDatepicker(currentdate);

        this.RevenueSearchStatus1();
    }

    RevenueSearchStatus1() {
        this.preloader.setShowPreloader(true);
        this.revService.RevenueSearchStatus1(this.localOfficeCode).subscribe(res => {
            let Status1 = res.reduce((a, c) => [...a, { ...c, REVENUE_CODE: c.REVENUE_CODE, REVENUE_ID: c.REVENUE_ID }], []);
            if (Status1.length) {
                this.checkRecStatusWithIncFri8100(Status1);
            } else {
                this.checkStatusCompleted();
            }
        }, () => {
            this.preloader.setShowPreloader(false);
            this.swalFn('', 'RevenueSearchStatus1 Service Failed', 'warning')
                .then(next => { if (next) this._router.navigate([`home`]); })
        });
    }

    checkRecStatusWithIncFri8100(Status1) {
        let result = [];
        let zip$ = new Observable<any>();
        let request = new Observable<any>();

        request = from(Status1).pipe(
            mergeMap(x => this.revService.IncFri8100(x['REVENUE_CODE']).pipe(
                reduce((a, c) => { return { ...a, ...c, REVENUE_ID: x['REVENUE_ID'], RevenueDetail: x['RevenueDetail'] } }, {})
            ))
        );

        zip$ = Observable.zip(request)
            .pipe(map(x => { return result = [...result, ...x]; }));

        forkJoin(zip$)
            .subscribe(o => {
                let IncExcise = o[0];
                let temp = IncExcise
                    .filter(f => f['PenaltyList']) //กรองที่มี
                    .filter(f => f['PenaltyList'][0]['RecStatus'] == '1'); //กรองที่ RecStatus == '1'

                const RecStatusEqualto1 = temp.reduce((a, c) =>
                    [...a, {
                        REVENUE_ID: c['REVENUE_ID'],
                        RECEIVE_DATE: c['PenaltyList'][0]['TrnDate'] ? this.toDateTZ(c['PenaltyList'][0]['TrnDate']) : '',
                        RECEIVE_REF_NO: c['PenaltyList'][0]['IncctlNo'] || '',
                        COMPARE_DETAIL: c['RevenueDetail']
                            .reduce((a, c) => { return [...a, { COMPARE_DETAIL_ID: c['COMPARE_DETAIL_ID'] }] }, [])
                            .filter(f => f['COMPARE_DETAIL_ID']),

                        PAYMENT: c['RevenueDetail']
                            .reduce((a, c) => { return [...a, { PAYMENT_ID: c['PAYMENT_ID'] }] }, [])
                            .filter(f => f['PAYMENT_ID']),

                        REVENUE_DETAIL: c['RevenueDetail']
                            .reduce((a, c) => { return [...a, { REVENUE_DETAIL_ID: c['REVENUE_DETAIL_ID'] }] }, [])
                            .filter(f => f['REVENUE_DETAIL_ID'])
                    }], []);

                if (RecStatusEqualto1.length) {
                    this.RevuenueComparePaymentUpdREFno(RecStatusEqualto1);
                } else {
                    this.checkStatusCompleted();
                }
            });
    }

    RevuenueComparePaymentUpdREFno(RecStatusEqualto1) {
        this.revService.RevenueReturnUpdateREFno(RecStatusEqualto1).subscribe(x => {
            const objRes: any[] = [x];
            if (objRes.filter(o => o['IsSuccess'] == 'False').length) {
                this.preloader.setShowPreloader(false);
                this.swalFn('', 'RevenueReturnUpdateREFno Service Failed', 'warning')
                    .then(next => { if (next) this._router.navigate([`home`]); })
            }
        }, () => {
            this.preloader.setShowPreloader(false);
            this.swalFn('', 'RevenueReturnUpdateREFno Service Failed', 'warning')
                .then(next => { if (next) this._router.navigate([`home`]); })
        });
        this.checkStatusCompleted();
    }

    checkStatusCompleted = () => {
        this.preloader.setShowPreloader(false)

        let AdvSearchOnInit = {
            REVENUE_DATE_FROM: this.REVENUE_DATE_FROM,
            REVENUE_DATE_TO: this.REVENUE_DATE_TO
        }

        this.onAdvSearch(AdvSearchOnInit);
    };

    clickView(revenueID: string) {
        this._router.navigate([`/revenue/manage/R/${revenueID}`]);
    }

    clickNew = () => this._router.navigate([`/revenue/manage/C/NEW`]);

    clickSearch(Textsearch: any) {
        this.preloader.setShowPreloader(true);

        this.setDefualtInputSearch(1);

        var paramsOther = {
            ...Textsearch,
            ACCOUNT_OFFICE_CODE: this.localOfficeCode
        }

        this.revService.requestAPI("RevenueListgetByKeyword", paramsOther).then(list => {
            if (list.length > 0) {
                this.onSearchComplete(list);
                this.preloader.setShowPreloader(false);
            } else {
                this.showDataList = [];
                this.paginage.TotalItems = list.length;
                this.ShowAlertWarning(this.noRecordMsg);
                this.preloader.setShowPreloader(false);
            }
        }, (err: HttpErrorResponse) => {

            this.ShowAlertWarning(this.noRecordMsg);
            this.showDataList = [];
            this.preloader.setShowPreloader(false);
        });
    }

    setAdvSearch() {
        this.advSearch.next(!this.advSearch.getValue());
    }

    onAdvSearch(form: any) {
        this.preloader.setShowPreloader(true);

        this.setDefualtInputSearch(0);

        if (!form.REVENUE_DATE_FROM && form.REVENUE_DATE_TO) {
            this.REVENUE_DATE_FROM = setDateMyDatepicker(form.REVENUE_DATE_TO);
            form.REVENUE_DATE_FROM = form.REVENUE_DATE_TO;

            var d = new Date(getDateMyDatepicker(form.REVENUE_DATE_FROM));
            this.dateToOption = {
                disableDateRanges: [{
                    begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
                    end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
                }, this.getDisCurrDateMyDatePicker()]
            }
        } else if (form.REVENUE_DATE_FROM && !form.REVENUE_DATE_TO) {
            const currDate = setDateMyDatepicker(new Date());
            this.REVENUE_DATE_TO = setDateMyDatepicker(currDate);
        }

        if (form.COMPARE_NO) {
            form.COMPARE_IS_OUTSIDE = form.LAWSUIT_IS_OUTSIDE;
            form.LAWSUIT_IS_OUTSIDE = '';
        } else
            form.COMPARE_IS_OUTSIDE = '';

        let sdate = getDateMyDatepicker(form.REVENUE_DATE_FROM);
        let edate = getDateMyDatepicker(form.REVENUE_DATE_TO);

        let f = Object.assign({}, form);

        f.REVENUE_DATE_FROM = convertDateForSave(sdate) || '';
        f.REVENUE_DATE_TO = convertDateForSave(edate) || convertDateForSave(new Date());
        f = { ...f, ACCOUNT_OFFICE_CODE: this.localOfficeCode };

        this.revService.requestAPI("RevenueListgetByConAdv", f).then(list => {
            if (list.length > 0) {
                this.onSearchComplete(list);
                this.preloader.setShowPreloader(false);
            } else {
                this.onSearchComplete([]);
                this.preloader.setShowPreloader(false);
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError(err.message)
            this.preloader.setShowPreloader(false);
        });
    }

    async onSearchComplete(list: any) {
        this.dataList = [];

        if (!list.length) {
            this.ShowAlertWarning(this.noRecordMsg);
            this.showDataList = [];

            return false;
        }

        list.map((item) => {
            switch (item.REVENUE_STATUS) {
                case 1:
                    item.REVENUE_STATUS_TEXT = this.revenueStatus0Msg;
                    break;
                case 2:
                    item.REVENUE_STATUS_TEXT = this.revenueStatus1Msg;
                    break;
            }

            item.REVENUE_DATE_TEXT = toLocalLong(item.REVENUE_DATE);

            item.RevenueStaff.filter(f => f.CONTRIBUTOR_ID == 36).map(s => {
                item.STAFF_NAME_SEND = `${s.TITLE_SHORT_NAME_TH == 'null' || s.TITLE_SHORT_NAME_TH == null ? '' : s.TITLE_SHORT_NAME_TH}`
                    + `${s.FIRST_NAME == 'null' || s.FIRST_NAME == null ? '' : s.FIRST_NAME}` + ' '
                    + `${s.LAST_NAME == 'null' || s.LAST_NAME == null ? '' : s.LAST_NAME}`;

            });

            item.RevenueStaff.filter(f => f.CONTRIBUTOR_ID == 37).map(s => {
                item.STAFF_NAME_SIGN = `${s.TITLE_SHORT_NAME_TH == 'null' || s.TITLE_SHORT_NAME_TH == null ? '' : s.TITLE_SHORT_NAME_TH}`
                    + `${s.FIRST_NAME == 'null' || s.FIRST_NAME == null ? '' : s.FIRST_NAME}` + ' '
                    + `${s.LAST_NAME == 'null' || s.LAST_NAME == null ? '' : s.LAST_NAME}`;

            });
        });

        list = this.DateSorter(list);

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
    }

    // #region "Validate Datetime"
    public onSDateChange(event: IMyDateModel) {
        if (event.jsdate) {
            var d = new Date(event.jsdate);
            d.setDate(d.getDate() - 1);
            this.dateToOption = {
                disableDateRanges: [{
                    begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
                    end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
                }, this.getDisCurrDateMyDatePicker()]
            }
        } else {
            this.dateToOption = {
                disableDateRanges: [this.getDisCurrDateMyDatePicker()]
            }
        }
    }

    public onEDateChange(event: IMyDateModel) {
        if (event.jsdate) {
            var d = new Date(event.jsdate);
            this.dateFromOption = {
                disableDateRanges: [{
                    begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
                    end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
                }]
            }
        } else {
            this.dateFromOption = {
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
    //#endregion

    public Sorter(event: BehaviorSubject<Boolean>, type: string): void {
        if (event.getValue()) event.next(false); else event.next(true);

        switch (type) {
            case 'REVENUE_CODE':
                if (event.getValue())
                    this.dataList.sort((a, b) => {
                        return <number>parseInt(b.REVENUE_CODE.substring(8)) - <number>parseInt(a.REVENUE_CODE.substring(8));
                    });
                else
                    this.dataList.sort((a, b) => {
                        return <number>parseInt(a.REVENUE_CODE.substring(8)) - <number>parseInt(b.REVENUE_CODE.substring(8));
                    });
                break;
            case 'REVENUE_DATE':
                if (event.getValue())
                    this.dataList.sort((a, b) => {
                        return <any>new Date(b.REVENUE_DATE).getTime() - <any>new Date(a.REVENUE_DATE).getTime();
                    });
                else
                    this.dataList.sort((a, b) => {
                        return <any>new Date(a.REVENUE_DATE).getTime() - <any>new Date(b.REVENUE_DATE).getTime();
                    });
                break;
            default:
                break;
        }
        this.reIndex();
        this.showDataList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);
    }

    public DateSorter(Arr: any[] = []) {
        return Arr.sort((a, b) => {
            return <any>new Date(b.REVENUE_DATE).getTime() - <any>new Date(a.REVENUE_DATE).getTime();
        });
    }

    public reIndex() {
        this.dataList.map((m, i) => {
            m.index = i + 1;
        })
    }

    setDefualtInputSearch(type: number) {
        switch (type) {
            case 0:
                this.TEMP_TEXT_SEARCH = '';
                break;
            case 1:
                this.TEMP_DELIVERY_OFFICE_NAME = '';
                this.TEMP_STAFF_NAME_SEND = '';
                this.TEMP_STAFF_NAME_SIGN = '';
                this.TEMP_LAWSUIT_NO = '';
                this.REVENUE_DATE_FROM = null;
                this.REVENUE_DATE_TO = null;
                this.TEMP_LAWSUIT_NO_YEAR = '';
                this.TEMP_LAWSUIT_IS_OUTSIDE = '';
                this.TEMP_COMPARE_NO = '';
                this.TEMP_COMPARE_NO_YEAR = '';
                this.TEMP_REVENUE_STATUS = '';
                this.TEMP_REVENUE_CODE = '';
                this.myDatePickerOptions = {
                    disableDateRanges: [this.getDisCurrDateMyDatePicker()]
                }
                break;
            default:
                break;
        }
    }

}
