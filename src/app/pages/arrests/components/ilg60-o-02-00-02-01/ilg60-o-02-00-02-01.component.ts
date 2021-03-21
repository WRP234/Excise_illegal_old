import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Ilg60O02000201Config } from './ilg60-o-02-00-02-01.config';
import { ArrestPurityCert } from '../../models';
import { Message } from '../../../../config/message';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { PurityCertService } from '../../services/arrest-purity-cert.service';
import { IMyDateModel } from 'mydatepicker';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { setDateMyDatepicker } from 'app/config/dateFormat';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MasterService } from '../../services/master.service';

@Component({
  selector: 'app-ilg60-o-02-00-02-01',
  templateUrl: './ilg60-o-02-00-02-01.component.html',
  styleUrls: ['./ilg60-o-02-00-02-01.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg60O02000201Component extends Ilg60O02000201Config implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.paginage.TotalItems = 0;
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  constructor(
    private fb: FormBuilder,
    private s_purityCert: PurityCertService,
    private navService: NavigationService,
    private s_MasMaster: MasterService,
    private router: Router,

  ) {
    super();
    this.advSearch = this.navService.showAdvSearch;
  }

  get PurityCert(): FormArray {
    return this.formGroup.get('PurityCert') as FormArray;
  }

  ngOnInit() {
    this.advSearch.next(true);

    this.formGroup = this.fb.group({
      PurityCert: this.fb.array([])
    });
    // this.onSearchComplete(ArrestPurityCertMock)
    this.canOfficeSearch();

    this.sDateOption.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

    this.eDateOption.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

  }

  public onSearch(form: any) {
    this.selectedEntry = '';

    const f = { ...form, ACCOUNT_OFFICE_CODE: this.officeCode }
    this.s_purityCert.ArrestPurityCertgetByKeyword(f)
      .takeUntil(this.destroy$)
      .finally(() => this.setDefualtInputSearch(1))
      .subscribe(x => this.onSearchComplete(x));
  }

  public onAdvSearch(form: any) {
    this.selectedEntry = '';

    if (!form.PURITYCERT_DATE_FROM && form.PURITYCERT_DATE_TO) {
      this.DATE_START_FROM = setDateMyDatepicker(form.PURITYCERT_DATE_TO);
      form.PURITYCERT_DATE_FROM = form.PURITYCERT_DATE_TO;
    } else if (form.PURITYCERT_DATE_FROM && !form.PURITYCERT_DATE_TO) {
      const currDate = new Date();
      this.DATE_START_TO = setDateMyDatepicker(currDate);
      form.PURITYCERT_DATE_TO = this.convertDateForSave(currDate);
    }

    let sdate = this.getDateMyDatepicker(form.PURITYCERT_DATE_FROM);
    let edate = this.getDateMyDatepicker(form.PURITYCERT_DATE_TO);

    let f = Object.assign({}, form);

    f.PURITYCERT_DATE_FROM = this.convertDateForSave(sdate) || '';
    f.PURITYCERT_DATE_TO = this.convertDateForSave(edate) || '';
    f = { ...f, ACCOUNT_OFFICE_CODE: this.officeCode }

    this.s_purityCert
      .ArrestPurityCertgetByConAdv(f)
      .takeUntil(this.destroy$)
      .finally(() => this.setDefualtInputSearch(0))
      .subscribe(x => this.onSearchComplete(x));
  }

  private async onSearchComplete(list: ArrestPurityCert[]) {
    if (!list.length) {
      this.swalFn('', Message.noRecord, 'warning');
      this.formGroup = this.fb.group({
        PurityCert: this.fb.array([])
      });
    }

    list = this.DateSorter(list);

    this.dataList = list.map((x, i) => {
      return { ROW_ID: i + 1, ...x };
    });
    const __list = this.dataList.slice(0, 5);
    this.setItemFormArray(__list, 'PurityCert');
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
      PURITYCERT_ID: this.selectedEntry.PURITYCERT_ID,
      PURITYCERT_CODE: this.selectedEntry.PURITYCERT_CODE
    });

    this.c.emit(e);
  }

  async pageChanges(event: any) {
    const list = await this.dataList.slice(event.startIndex - 1, event.endIndex);
    this.setItemFormArray(list, 'PurityCert');
  }

  public onSDateChange(event: IMyDateModel) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.eDateOption = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.eDateOption = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onEDateChange(event: IMyDateModel) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.sDateOption = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.sDateOption = {
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

  setAdvSearch() {
    this.advSearch.next(!this.advSearch.getValue());
  }

  DateSorter(Arr: any[] = []) {
    return Arr.sort((a, b) => {
      return <any>new Date(b.PURITYCERT_DATE).getTime() - <any>new Date(a.PURITYCERT_DATE).getTime();
    });
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

  setDefualtInputSearch(type: number) {
    switch (type) {
      case 0:
        this.TEMP_TEXT_SEARCH = '';
        break;
      case 1:
        // const currentdate = new Date();
        this.TEMP_PURITYCERT_CODE = '';

        this.TEMP_STAFF_NAME = '';
        this.TEMP_OFFICE_NAME = '';
        this.TEMP_PERSON_NAME = '';
        this.DATE_START_FROM = null;
        this.DATE_START_TO = null;
        this.sDateOption = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        this.eDateOption = {
          disableDateRanges: [this.getDisCurrDateMyDatePicker()]
        }
        break;
      default:
        break;
    }
  }

}
