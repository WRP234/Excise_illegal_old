import { InvestgateService } from './../services/investgate.service';
import { InvestigateList } from './../models/investigate-list.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Message } from 'app/config/message';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { SidebarService } from 'app/shared/sidebar/sidebar.component';
import { PreloaderService } from 'app/shared/preloader/preloader.component';
import { IMyDateModel } from 'mydatepicker-th';
import { compareDate, getDateMyDatepicker, toLocalShort, convertDateForSave, setDateMyDatepicker } from 'app/config/dateFormat';
import swal from 'sweetalert2';
import { ListConfig } from './list.config'

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})

export class ListComponent extends ListConfig implements OnInit, OnDestroy {

    constructor(
        private navService: NavigationService,
        private s_invest: InvestgateService,
        private router: Router,
        private sidebarService: SidebarService,
        private preLoader: PreloaderService
    ) {
        super();
        // set false
        this.navService.setEditButton(false);
        this.navService.setDeleteButton(false);
        this.navService.setPrintButton(false);
        this.navService.setSaveButton(false);
        this.navService.setCancelButton(false);
        this.navService.setNextPageButton(false);
        // set true
        this.navService.setSearchBar(true);
        this.navService.setNewButton(true);
        this.advSearch = this.navService.showAdvSearch;
    }

    ngOnInit() {
        localStorage.setItem('programcode', 'ILG60-01-00');
        this.advSearch.next(true)
        this.sidebarService.setVersion(this.s_invest.version);

        this.dateFromOption.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

        this.dateToOption.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

        this.navService.searchByKeyword.subscribe(async Textsearch => {
            if (Textsearch) {
                await this.navService.setOnSearch('');
                this.onSearch(Textsearch);
            }
        })

        this.navService.onNextPage.subscribe(async status => {
            if (status) {
                await this.navService.setOnNextPage(false);
                this.router.navigate([`/investigation/manage/C/NEW`]);
            }
        })
    }

    clickNew = () => this.router.navigate([`/investigation/manage/C/NEW`]);

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.paginage.TotalItems = 0;
        this.advSearch.next(false);
    }

    onSearch(form: any) {
        this.s_invest.InvestigateListgetByKeyword(form.TEXT_SEARCH, this.officeCode)
            .takeUntil(this.destroy$)
            .subscribe(x => this.onSearchComplete(x))

    }


    setAdvSearch() {
        this.advSearch.next(!this.advSearch.getValue());
    }

    onAdvSearch(form: any) {

        const sdate = getDateMyDatepicker(form.DATE_START);
        const edate = getDateMyDatepicker(form.DATE_END);

        if (sdate && edate) {
            if (!compareDate(sdate, edate)) {
                swal('', Message.checkDate, 'warning');
                return
            }
        }

        // form.DATE_START = setZeroHours(sdate) || '';
        // form.DATE_END = setZeroHours(edate) || '';   
        form.DATE_START = convertDateForSave(sdate) || '';
        form.DATE_END = convertDateForSave(edate) || '';
        form.ACCOUNT_OFFICE_CODE = this.officeCode;
        console.log(JSON.stringify(form));

        this.s_invest.InvestigateListgetByConAdv(form)
            .takeUntil(this.destroy$)
            .subscribe(list => {
                this.onSearchComplete(list)
            }, (err: HttpErrorResponse) => {
                swal('', Message.noRecord, 'warning');
            });
    }

    onSearchComplete(list: InvestigateList[]) {
        this.investigate = [];
        this.invesList = [];
        this.paginage.TotalItems = 0;

        if (!list.length) {
            swal('', Message.noRecord, 'warning');
            return false;
        }

        let rows = list.map((p, i) => {
            p.RowsId = i + 1;
            p.DATE_START = toLocalShort(new Date(p.DATE_START));
            p.DATE_END = toLocalShort(new Date(p.DATE_END));
            return p;
        })

        this.investigate = rows;
        this.invesList = this.investigate.slice(0, 5);
        console.log(' this.invesList : ', this.invesList)
        // set total record
        this.paginage.TotalItems = this.investigate.length;
    }

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

    private checkDate() {
        if (this.DATE_START && this.DATE_END) {

            let sdate = getDateMyDatepicker(this.DATE_START);
            let edate = getDateMyDatepicker(this.DATE_END);

            console.log('sdate : {}', sdate);
            console.log('edate : ', edate);

            if (!compareDate(sdate, edate)) {
                swal('', Message.checkDate, 'warning')
                setTimeout(() => {
                    this.DATE_END = setDateMyDatepicker(this.DATE_START);
                }, 0);
            }
        }
    }

    clickView(invesCode: string) {
        this.router.navigate([`/investigation/manage/R/${invesCode}`]);
    }

    async pageChanges(event) {
        this.invesList = await this.investigate.slice(event.startIndex - 1, event.endIndex);
    }
}
