import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { IMyDateModel } from 'mydatepicker-th';
import { NavigationService } from '../../../../shared/header-navigation/navigation.service';
import { SidebarService } from '../../../../shared/sidebar/sidebar.component';
import { ArrestList } from '../../models/arrest';
import { getDateMyDatepicker, convertDateForSave, setDateMyDatepicker } from '../../../../config/dateFormat';
import { Message } from '../../../../config/message';
import { ArrestService } from '../../services';
import 'rxjs/add/operator/takeUntil';
import { FormGroup } from '@angular/forms';
import { ListConfig } from './list.config';
import { BehaviorSubject, Observable } from 'rxjs';
import { MasterService } from '../../services/master.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent extends ListConfig implements OnInit, OnDestroy, DoCheck {

    // private subOnSearch: Subscription;
    // private subSetNextPage: Subscription;
    // private destroy$: Subject<boolean> = new Subject<boolean>();
    // private dateStartFrom: any;
    // private dateStartTo: any;
    // OccurrenceDateTo: any;

    arrestList = new Array<ArrestList>();
    arrest = new Array<any>();

    searchFailed = false;
    searching = false;

    @ViewChild('arrestTable') arrestTable: ElementRef;
    @ViewChild('advForm') advForm: FormGroup;

    constructor(
        private s_MasMaster: MasterService,
        private navService: NavigationService,
        private arrestService: ArrestService,
        private router: Router,
        private sidebarService: SidebarService,
        public chRef: ChangeDetectorRef
    ) {
        super();
        this.advSearch = this.navService.showAdvSearch;
    }

    async ngOnInit() {
        // localStorage.setItem('programcode', 'ILG60-03-00');
        this.canOfficeSearch();

        this.advSearch.next(true);

        this.sidebarService.setVersion(this.arrestService.version);

        let currentdate = new Date();

        this.DATE_START_FROM = setDateMyDatepicker(currentdate);

        this.DATE_START_TO = setDateMyDatepicker(currentdate);

        this.dateFromOption.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

        this.dateToOption.disableDateRanges = [this.getDisLessthanCurrDateMyDatePicker(), this.getDisCurrDateMyDatePicker()];

        const AdvSearchOnInit = {
            OCCURRENCE_DATE_FROM: this.DATE_START_FROM,
            OCCURRENCE_DATE_TO: this.DATE_START_TO
        }

        this.onAdvSearch(AdvSearchOnInit);
    }

    ngDoCheck(): void {
        // if (this.advSearch.getValue() == false && this.advForm != undefined) {
        //     this.advForm.reset();
        // };
    }

    clickSearch(Textsearch: any) {
        const f = { ...Textsearch, ACCOUNT_OFFICE_CODE: this.officeCode }
        this.arrestService
            .ArrestListgetByKeyword(f)
            .takeUntil(this.destroy$)
            .finally(() => this.setDefualtInputSearch(1))
            .subscribe(x => this.onSearchComplete(x));
    }

    setAdvSearch() {
        this.advSearch.next(!this.advSearch.getValue());
    }

    onAdvSearch(form: any) {
        if (!form.OCCURRENCE_DATE_FROM && form.OCCURRENCE_DATE_TO) {
            this.DATE_START_FROM = setDateMyDatepicker(form.OCCURRENCE_DATE_TO);
            form.OCCURRENCE_DATE_FROM = form.OCCURRENCE_DATE_TO;

            var d = new Date(getDateMyDatepicker(form.OCCURRENCE_DATE_FROM));
            this.dateToOption = {
                disableDateRanges: [{
                    begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
                    end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
                }, this.getDisCurrDateMyDatePicker()]
            }
        } else if (form.OCCURRENCE_DATE_FROM && !form.OCCURRENCE_DATE_TO) {
            const currDate = setDateMyDatepicker(new Date());
            this.DATE_START_TO = setDateMyDatepicker(currDate);
        }

        let sdate = getDateMyDatepicker(form.OCCURRENCE_DATE_FROM);
        let edate = getDateMyDatepicker(form.OCCURRENCE_DATE_TO);

        let f = Object.assign({}, form);

        f.OCCURRENCE_DATE_FROM = convertDateForSave(sdate) || '';
        f.OCCURRENCE_DATE_TO = convertDateForSave(edate) || convertDateForSave(new Date());
        f = { ...f, ACCOUNT_OFFICE_CODE: this.officeCode }

        this.arrestService
            .ArrestListgetByConAdv(f)
            .takeUntil(this.destroy$)
            .finally(() => this.setDefualtInputSearch(0))
            .subscribe((x: ArrestList[]) => this.onSearchComplete(x));
    }

    private onSearchComplete(list: ArrestList[]) {
        if (!list.length) { this.swalFn('', Message.noRecord, 'warning'); }

        this.arrest = this.DateSorter(list)

        this.arrest = this.arrest.map((x, i) => {
            x.SUBSECTION_NAME$ = x.ArrestMasGuiltbase.reduce((a, c, i) =>
                [...a, `${this.comma(i)}${c.SUBSECTION_NAME}`], "");
            x.GUILTBASE_NAME$ = x.ArrestMasGuiltbase.reduce((a, c, i) =>
                [...a, `${this.comma(i)}${c.GUILTBASE_NAME}`], "");
            x.ArrestLawbreaker.map(m => {
                for (var key in m)
                    if (m[key] === 'null') m[key] = null;
            });
            x.OCCURRENCE_DATE = this.toLocalLong(x.OCCURRENCE_DATE);
            return { ROW_ID: i + 1, ...x };
        });
        this.arrestList = this.arrest.slice(0, 5);
        this.paginage.TotalItems = this.arrest.length;
    }

    comma = (i) => i != 0 ? ', ' : '';

    clickView = (code: string) =>
        this.router.navigate([`/arrest/manage/R/${code}`]);

    clickNew = () =>
        this.router.navigate([`/arrest/manage/C/NEW`]);

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

    Sorter(event: BehaviorSubject<Boolean>, type: string): void {
        if (event.getValue()) event.next(false); else event.next(true);

        switch (type) {
            case 'TN':
                if (event.getValue())
                    this.arrest.sort((a, b) => {
                        return <number>parseInt(b.ARREST_CODE.substring(2))
                            - <number>parseInt(a.ARREST_CODE.substring(2));
                    });
                else
                    this.arrest.sort((a, b) => {
                        return <number>parseInt(a.ARREST_CODE.substring(2))
                            - <number>parseInt(b.ARREST_CODE.substring(2));
                    });
                break;
            case 'TIME':
                if (event.getValue())
                    this.arrest.sort((a, b) => {
                        return <any>new Date(b.OCCURRENCE_DATE).getTime()
                            - <any>new Date(a.OCCURRENCE_DATE).getTime();
                    });
                else
                    this.arrest.sort((a, b) => {
                        return <any>new Date(a.OCCURRENCE_DATE).getTime()
                            - <any>new Date(b.OCCURRENCE_DATE).getTime();
                    });
                break;
            default:
                break;
        }
        this.reIndex();
        this.arrestList = this.arrest.slice(0, this.paginage.RowsPerPageOptions[0]);
    }

    reIndex() {
        this.arrest.map((m, i) => {
            m.ROW_ID = i + 1;
        })
    }

    async pageChanges(event: any) {
        this.arrestList = await this.arrest.slice(event.startIndex - 1, event.endIndex);
    }

    public searchOffice_ll = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.s_MasMaster.MasOfficegetByCon_forSearch({ TEXT_SEARCH: term })
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    ngOnDestroy() {
        this.paginage.TotalItems = 0;
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.advSearch.next(false);
    }

    setDefualtInputSearch(type: number) {
        switch (type) {
            case 0:
                this.TEMP_TEXT_SEARCH = '';
                break;
            case 1:
                // this.advForm.reset();
                this.TEMP_ARREST_CODE = '';
                this.TEMP_STAFF_NAME = '';
                this.TEMP_LAWBREAKER_NAME = '';
                this.TEMP_SUBSECTION_NAME = '';
                this.TEMP_GUILTBASE_NAME = '';
                this.TEMP_LOCALE_NAME = '';
                this.TEMP_OFFICE_NAME = '';
                this.TEMP_IS_LAWSUIT_COMPLETE = '';
                this.DATE_START_FROM = null;
                this.DATE_START_TO = null;
                this.dateFromOption = {
                    disableDateRanges: [this.getDisCurrDateMyDatePicker()]
                }
                this.dateToOption = {
                    disableDateRanges: [this.getDisCurrDateMyDatePicker()]
                }
                break;
            default:
                break;
        }
    }

}