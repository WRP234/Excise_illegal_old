import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {pagination} from '../../../../config/pagination';
import {ListConfig} from './list.config';
import {SearchWarrantService} from '../../services';
import {Message} from '../../../../config/message';
import swal from 'sweetalert2';
import {SearchWarrant, SearchWarrantList} from '../../models/search-warrant';
import {convertDateForSave, getDateMyDatepicker} from '../../../../config/dateFormat';
import {ListSearchWarrant} from '../../models/list-search-warrant';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})

export class ListComponent extends ListConfig implements OnInit, OnDestroy {
  @ViewChild('advForm') advForm: NgForm;

  advSearch: any;
  showAdvSearch = new BehaviorSubject<Boolean>(true);
  searchWarrant = new Array<any>();
  showDataList = [];

  paginage = pagination;
  searchWarrantList = new Array<SearchWarrantList>();

  constructor(
    private router: Router,
    private searchWarrantService: SearchWarrantService,
  ) {
    super();
  }

  ngOnInit() {
    this.advSearch = this.showAdvSearch;
  }

  setAdvSearch() {
    if (this.showAdvSearch.getValue()) {
      this.showAdvSearch.next(false);
    } else {
      this.showAdvSearch.next(true);
    }
  }

  async pageChanges(event: any) {
    this.searchWarrantList = await this.searchWarrant.slice(event.startIndex - 1, event.endIndex);
  }

  clickNew() {
    this.router.navigate([`/searchWarrant/manage/C/NEW`]);
  }

  clickView(masterID: string) {
    this.router.navigate([`/searchWarrant/manage/R/${masterID}`]);
  }

  clickSearch(form: any) {
    let f = Object.assign(form);
    f = { ...f, ACCOUNT_OFFICE_CODE: this.officeCode };
    this.searchWarrantService.SearchWarrantListGetByKeyword(f)
      .subscribe((x: ListSearchWarrant[]) => this.onSearchComplete(x));
  }

  private onSearchComplete(list: ListSearchWarrant[]) {
    if (!list['response'].length) {
      swal('', Message.noRecord, 'warning');
      return false;
    }
    this.searchWarrant = list['response'].map((x, i) => {
      return { ROW_ID: i + 1, ...x };
    });
    this.searchWarrantList = this.searchWarrant.slice(0, 5);
    this.paginage.TotalItems = this.searchWarrant.length;
    this.showDataList = list['response'];
  }

  onAdvSearch(form: any) {
    let f = Object.assign(form);
    f.REQUEST_DATE_FROM = convertDateForSave(getDateMyDatepicker(f.REQUEST_DATE_FROM)) || '';
    f.REQUEST_DATE_TO = convertDateForSave(getDateMyDatepicker(f.REQUEST_DATE_TO)) || '';
    f.CONSIDER_DATE_FROM = convertDateForSave(getDateMyDatepicker(f.CONSIDER_DATE_FROM)) || '';
    f.CONSIDER_DATE_TO = convertDateForSave(getDateMyDatepicker(f.CONSIDER_DATE_TO)) || '';
    f.SEARCH_WARRANT_DATE_FROM = convertDateForSave(getDateMyDatepicker(f.SEARCH_WARRANT_DATE_FROM)) || '';
    f.SEARCH_WARRANT_DATE_TO = convertDateForSave(getDateMyDatepicker(f.SEARCH_WARRANT_DATE_TO)) || '';
    f = { ...f, ACCOUNT_OFFICE_CODE: this.officeCode };

    this.searchWarrantService.searchWarrantRequestByConAdv(f);
    this.searchWarrantService
      .searchWarrantRequestByConAdv(form)
      .takeUntil(this.destroy$)
      .subscribe((x: ListSearchWarrant[]) => this.onSearchComplete(x));
  }

  ngOnDestroy() {
    this.paginage.TotalItems = 0;
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.advSearch.next(false);
  }
}
