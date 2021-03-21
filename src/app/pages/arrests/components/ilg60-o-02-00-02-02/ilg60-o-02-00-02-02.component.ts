import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Ilg60O02000202Config } from './ilg60-o-02-00-02-02.config';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ArrestSearchWarrantService } from '../../services/arrest-search-warrant.service';
import { ArrestSearchWarrant } from '../../models';
import { Message } from '../../../../config/message';
import { IMyDateModel } from 'mydatepicker';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { setDateMyDatepicker } from 'app/config/dateFormat';

@Component({
  selector: 'app-ilg60-o-02-00-02-02',
  templateUrl: './ilg60-o-02-00-02-02.component.html',
  styleUrls: ['./ilg60-o-02-00-02-02.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg60O02000202Component extends Ilg60O02000202Config implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.paginage.TotalItems = 0;
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  constructor(
    private fb: FormBuilder,
    private navService: NavigationService,
    private s_searchWrant: ArrestSearchWarrantService
  ) {
    super();
    this.advSearch = this.navService.showAdvSearch;
  }

  get ArrestSearchWarrant(): FormArray {
    return this.formGroup.get('ArrestSearchWarrant') as FormArray;
  }

  public REQUEST_DATE_TO_OPTION = Object.assign({}, this.myDatePickerOptions);
  public CONSIDER_DATE_TO_OPTION = Object.assign({}, this.myDatePickerOptions);
  public SEARCH_WARRANT_DATE_TO_OPTION = Object.assign({}, this.myDatePickerOptions);

  // public onRequestDateFromChange(event: IMyDateModel) {
  //   this.myDatePickerOptions
  //     .disableUntil = event.date;
  // }

  // public onConsiderDateFromChange(event: IMyDateModel) {
  //   this.CONSIDER_DATE_TO_OPTION
  //     .disableUntil = event.date;
  // }

  // public onSearchWarrantDateFromChange(event: IMyDateModel) {
  //   this.SEARCH_WARRANT_DATE_TO_OPTION
  //     .disableUntil = event.date;;
  // }

  ngOnInit() {
    this.formGroup = this.fb.group({
      ArrestSearchWarrant: this.fb.array([])
    });
    // this.onSearchComplete(ArrestSearchWarrantMock);
    this.advSearch.next(true);

    // this.requestDateFromOption= [this.getDisCurrDateMyDatePicker()];
    // this.requestDateToOption= [this.getDisCurrDateMyDatePicker()];
    // this.considerDateFromOptions
    // this.considerDateToOptions
    // this.warrantDateFromOptions
    // this.warrantDateToOptions
  }

  public onSearch(form: any) {
    this.selectedEntry = '';
    const f = { ...form, ACCOUNT_OFFICE_CODE: this.officeCode }
    this.s_searchWrant.ArrestSearchWarrantgetByKeyword(f)
      .takeUntil(this.destroy$)
      .finally(() => this.setDefualtInputSearch(1))
      .subscribe(x => this.onSearchComplete(x));
  }

  public onAdvSearch(form: any) {
    this.selectedEntry = '';
    if (!form.REQUEST_DATE_FROM && form.REQUEST_DATE_TO) {
      this._REQUEST_DATE_FROM = setDateMyDatepicker(form.REQUEST_DATE_TO);
      form.REQUEST_DATE_FROM = form.REQUEST_DATE_TO;
    } else if (form.REQUEST_DATE_FROM && !form.REQUEST_DATE_TO) {
      const currDate = new Date();
      this._REQUEST_DATE_TO = setDateMyDatepicker(currDate);
      form.REQUEST_DATE_TO = this.convertDateForSave(currDate);
    }

    if (!form.CONSIDER_DATE_FROM && form.CONSIDER_DATE_TO) {
      this._CONSIDER_DATE_FROM = setDateMyDatepicker(form.CONSIDER_DATE_TO);
      form.CONSIDER_DATE_FROM = form.CONSIDER_DATE_TO;
    } else if (form.CONSIDER_DATE_FROM && !form.CONSIDER_DATE_TO) {
      const currDate = new Date();
      this._CONSIDER_DATE_TO = setDateMyDatepicker(currDate);
      form.CONSIDER_DATE_TO = this.convertDateForSave(currDate);
    }

    if (!form.SEARCH_WARRANT_DATE_FROM && form.SEARCH_WARRANT_DATE_TO) {
      this._SEARCH_WARRANT_DATE_FROM = setDateMyDatepicker(form.SEARCH_WARRANT_DATE_TO);
      form.SEARCH_WARRANT_DATE_FROM = form.SEARCH_WARRANT_DATE_TO;
    } else if (form.SEARCH_WARRANT_DATE_FROM && !form.SEARCH_WARRANT_DATE_TO) {
      const currDate = new Date();
      this._SEARCH_WARRANT_DATE_TO = setDateMyDatepicker(currDate);
      form.SEARCH_WARRANT_DATE_TO = this.convertDateForSave(currDate);
    }


    let f = Object.assign({}, form);

    f.REQUEST_DATE_FROM = this.convertDateForSave(this.getDateMyDatepicker(f.REQUEST_DATE_FROM)) || '';
    f.REQUEST_DATE_TO = this.convertDateForSave(this.getDateMyDatepicker(f.REQUEST_DATE_TO)) || '';
    f.CONSIDER_DATE_FROM = this.convertDateForSave(this.getDateMyDatepicker(f.CONSIDER_DATE_FROM)) || '';
    f.CONSIDER_DATE_TO = this.convertDateForSave(this.getDateMyDatepicker(f.CONSIDER_DATE_TO)) || '';
    f.SEARCH_WARRANT_DATE_FROM = this.convertDateForSave(this.getDateMyDatepicker(f.SEARCH_WARRANT_DATE_FROM)) || '';
    f.SEARCH_WARRANT_DATE_TO = this.convertDateForSave(this.getDateMyDatepicker(f.SEARCH_WARRANT_DATE_TO)) || '';

    f.REQUEST_NO_YEAR = (parseInt(f.REQUEST_NO_YEAR) - 543) || '';
    f.CONSIDER_UNDECIDE_NO_YEAR = (parseInt(f.CONSIDER_UNDECIDE_NO_YEAR) - 543) || '';
    f.CONSIDER_DECIDE_NO_YEAR = (parseInt(f.CONSIDER_DECIDE_NO_YEAR) - 543) || '';
    f.SEARCH_WARRANT_NO_YEAR = (parseInt(f.SEARCH_WARRANT_NO_YEAR) - 543) || '';

    f = { ...f, ACCOUNT_OFFICE_CODE: this.officeCode }

    this.s_searchWrant.ArrestSearchWarrantgetByConAdv(f)
      .takeUntil(this.destroy$)
      .finally(() => this.setDefualtInputSearch(0))
      .subscribe(x => this.onSearchComplete(x));
  }

  private async onSearchComplete(list: ArrestSearchWarrant[]) {
    if (!list.length) {
      this.swalFn('', Message.noRecord, 'warning');
      this.formGroup = this.fb.group({
        ArrestSearchWarrant: this.fb.array([])
      });
    }

    list = this.DateSorter(list);

    this.dataList = list.map((x, i) => {
      return { ROW_ID: i + 1, ...x };
    });
    const __list = this.dataList.slice(0, 5);
    this.setItemFormArray(__list, 'ArrestSearchWarrant');
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
    this.Output.emit({
      SEARCH_WARRANT_ID: this.selectedEntry.SEARCH_WARRANT_ID,
      REQUEST_CODE: this.selectedEntry.REQUEST_CODE
    });

    this.c.emit(e);
  }

  async pageChanges(event: any) {
    const list = await this.dataList.slice(event.startIndex - 1, event.endIndex);
    this.setItemFormArray(list, 'ArrestSearchWarrant');
  }

  onRequestDateFromChange(event: IMyDateModel) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.requestDateToOption = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.requestDateToOption = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  onRequestDateToChange(event: IMyDateModel) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.requestDateFromOption = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.requestDateFromOption = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  onConsiderDateFromChange(event: IMyDateModel) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.considerDateToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.considerDateToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  onConsiderDateToChange(event: IMyDateModel) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.considerDateFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.considerDateFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  onWarrantDateFromChange(event: IMyDateModel) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.warrantDateToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.warrantDateToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  onWarrantDateToChange(event: IMyDateModel) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.warrantDateFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.warrantDateFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  setAdvSearch() {
    this.advSearch.next(!this.advSearch.getValue());
  }

  setYearTh = (DT: any = null) => {
    if (DT) DT = parseInt(DT.slice(0, 4)) + 543;
    return DT;
  }

  DateSorter(Arr: any[] = []) {
    return Arr.sort((a, b) => {
      return <any>new Date(b.REQUEST_DATE).getTime() - <any>new Date(a.REQUEST_DATE).getTime();
    });
  }

  setDefualtInputSearch(type: number) {
    switch (type) {
      case 0:
        this.TEMP_TEXT_SEARCH = '';
        break;
      case 1:
        this.TEMP_REQUEST_CODE = '';
        this.TEMP_REQUEST_NO = '';
        this.TEMP_REQUEST_NO_YEAR = '';
        this.TEMP_COURT_NAME = '';
        this.TEMP_PERSON_NAME = '';
        this.TEMP_STAFF_NAME = '';
        this.TEMP_CONSIDER_UNDECIDE_NO = '';
        this.TEMP_CONSIDER_UNDECIDE_NO_YEAR = '';
        this.TEMP_CONSIDER_DECIDE_NO = '';
        this.TEMP_CONSIDER_DECIDE_NO_YEAR = '';
        this.TEMP_SEARCH_WARRANT_NO = '';
        this.TEMP_SEARCH_WARRANT_NO_YEAR = '';

        this._REQUEST_DATE_FROM = null;
        this._REQUEST_DATE_TO = null;
        this._CONSIDER_DATE_FROM = null;
        this._CONSIDER_DATE_TO = null;
        this._SEARCH_WARRANT_DATE_FROM = null;
        this._SEARCH_WARRANT_DATE_TO = null;

        this.requestDateToOption = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.requestDateFromOption = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.considerDateToOptions = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.considerDateFromOptions = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.warrantDateToOptions = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.warrantDateFromOptions = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        break;
      default:
        break;
    }
  }

}
