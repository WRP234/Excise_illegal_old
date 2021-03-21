
import { Ilg60O02000203Config } from './ilg60-o-02-00-02-03.config';
import { ArrestNoticeService } from '../../services';
import { Message } from '../../../../config/message';
import { ArrestNotice } from '../../models';
import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { IMyDateModel } from 'mydatepicker';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { setDateMyDatepicker } from 'app/config/dateFormat';
import { Observable } from 'rxjs';
import { MasterService } from '../../services/master.service';

@Component({
  selector: 'app-ilg60-o-02-00-02-03',
  templateUrl: './ilg60-o-02-00-02-03.component.html',
  styleUrls: ['./ilg60-o-02-00-02-03.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg60O02000203Component extends Ilg60O02000203Config implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.paginage.TotalItems = 0;
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  constructor(
    private fb: FormBuilder,
    private s_notice: ArrestNoticeService,
    private s_MasMaster: MasterService,
    private navService: NavigationService
  ) {
    super();
    this.advSearch = this.navService.showAdvSearch;
  }

  get Notice(): FormArray {
    return this.formGroup.get('Notice') as FormArray;
  }

  get NoticeList(): ArrestNotice[] {
    return this.Notice.value.filter(x => x.IS_CHECKED == true);
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      Notice: this.fb.array([])
    });
    // this.onSearchComplete(ArrestNoticeMock)
    this.advSearch.next(true);

    let currentdate = new Date();

    this.noticeDateFormOption.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

    this.noticeDateToOption.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

  }

  setAdvSearch() {
    this.advSearch.next(!this.advSearch.getValue());
  }

  public onSearch(form: any) {
    const f = { ...form, ACCOUNT_OFFICE_CODE: this.officeCode }
    this.s_notice.ArrestNoticegetByKeyword(f)
      .takeUntil(this.destroy$)
      .finally(() => this.setDefualtInputSearch(1))
      .subscribe(x => this.onSearchComplete(x));
  }

  public onAdvSearch(form: any) {

    if (!form.NOTICE_DATE_FROM && form.NOTICE_DATE_TO) {
      this.NOTICE_DATE_FROM = setDateMyDatepicker(form.NOTICE_DATE_TO);
      form.NOTICE_DATE_FROM = form.NOTICE_DATE_TO;
    } else if (form.NOTICE_DATE_FROM && !form.NOTICE_DATE_TO) {
      const currDate = setDateMyDatepicker(new Date());
      this.NOTICE_DATE_TO = setDateMyDatepicker(currDate);
    }

    let sdate = this.getDateMyDatepicker(form.NOTICE_DATE_FROM);
    let edate = this.getDateMyDatepicker(form.NOTICE_DATE_TO);

    let f = Object.assign({}, form);

    f.NOTICE_DATE_FROM = this.convertDateForSave(sdate) || '';
    f.NOTICE_DATE_TO = this.convertDateForSave(edate) || '';
    f = { ...f, ACCOUNT_OFFICE_CODE: this.officeCode }
    this.s_notice.ArrestNoticegetByConAdv(f)
      .takeUntil(this.destroy$)
      .finally(() => this.setDefualtInputSearch(0))
      .subscribe(x => this.onSearchComplete(x));
  }

  private async onSearchComplete(list: ArrestNotice[]) {
    if (!list.length) {
      this.swalFn('', Message.noRecord, 'warning');
      this.formGroup = this.fb.group({
        Notice: this.fb.array([])
      });
    }
    this.dataList = this.DateSorter(list);

    this.dataList = this.dataList.map((x, i) => {
      return Object.assign(x, { IS_CHECKED: false, ROW_ID: i + 1 });
      // { ...x, IS_CHECKED: false, ROW_ID: i + 1 };
    });
    const __list = this.dataList.slice(0, 5);
    this.setItemFormArray(__list, 'Notice');

    this.paginage.TotalItems = list.length;

  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.formGroup.setControl(formControl, itemFormArray);
    }
  }

  onSelectionChange(entry: FormGroup) {
    this.selectedEntry = entry.value;
  }

  public onSelect(e: any) {
    const newObj = Object.assign([], this.NoticeList);
    this.Output.emit(newObj);
    this.c.emit(e);
  }

  async pageChanges(event: any) {
    const list = await this.dataList.slice(event.startIndex - 1, event.endIndex);
    this.setItemFormArray(list, 'Notice');
  }

  onNoticeDateFromChange(event: IMyDateModel) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.noticeDateToOption = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.noticeDateToOption = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  onNoticeDateToChange(event: IMyDateModel) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.noticeDateFormOption = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.noticeDateFormOption = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  searchOffice_ll = (text2$: Observable<string>) =>
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


  public DateSorter(Arr: any[] = []) {
    return Arr.sort((a, b) => {
      return <any>new Date(b.NOTICE_DATE) - <any>new Date(a.NOTICE_DATE);
    });
  }

  setDefualtInputSearch(type: number) {
    switch (type) {
      case 0:
        this.TEMP_TEXT_SEARCH = '';
        break;
      case 1:
        this.TEMP_NOTICE_CODE = '';
        this.TEMP_STAFF_NAME = '';
        this.TEMP_OFFICE_NAME = '';
        this.NOTICE_DATE_FROM = null;
        this.NOTICE_DATE_TO = null;
        this.noticeDateToOption = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.noticeDateFormOption = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        break;
      default:
        break;
    }
  }

}
