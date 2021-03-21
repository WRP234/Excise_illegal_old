import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, FormControlName, Form } from '@angular/forms';
import { convertDateForSave, MyDatePickerOptions, toLocalNumeric, setZero } from '../../../../config/dateFormat';
import { IMyOptions } from 'mydatepicker';
import { MasOfficeModel_New } from 'app/models';
import { MainMasterService } from '../../../../services/main-master.service';
import { PreloaderService } from '../../../../shared/preloader/preloader.component';
import { Observable } from 'rxjs';
import { ReportService } from '../../report.service';


@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CriteriaComponent implements OnInit {

  RevenueReportGF: FormGroup;
  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };
  typeheadOffice = new Array<MasOfficeModel_New>();
  ProductGroup: any[] = [];
  constructor(private fb: FormBuilder,
    private reportService: ReportService,
    private mainMasterService: MainMasterService,
    private preloaderService: PreloaderService) {
    this.createform();
  }

  async ngOnInit() {
    let currentdate = new Date();
    this.myDatePickerOptions.disableSince = { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 };
    await this.preloaderService.setShowPreloader(true);
    await this.setOfficeStore();
    await this.setProductGroup();
    await this.preloaderService.setShowPreloader(false);
    console.log('ngOnInit this.RevenueReportGF : ', this.RevenueReportGF)
  }

  createform() {
    this.RevenueReportGF = this.fb.group({
      OFFICE_CODE: new FormControl(null),
      OFFICE_NAME: new FormControl(null),
      OFFICE_ID: new FormControl(null),
      // office: new FormControl(this.fb.array([
      //   this.fb.group({
      //     OFFICE_CODE: new FormControl(''),
      //     OFFICE_NAME: new FormControl(''),
      //     OFFICE_ID: new FormControl(''),
      //   })
      // ]))
    })
  }
  async OnPrint(form: any) {
    await this.preloaderService.setShowPreloader(true);
    let _DateStart = form.value.DateStart == null ? '' : form.value.DateStart.date;
    let _DateEnd = form.value.DateEnd == null ? '' : form.value.DateEnd.date;
    const DateStart = form.value.DateStart == null ? '' : `${setZero(_DateStart.day)}-${setZero(_DateStart.month)}-${_DateStart.year}`;
    const DateEnd = form.value.DateEnd == null ? '' : `${setZero(_DateEnd.day)}-${setZero(_DateEnd.month)}-${_DateEnd.year}`;
    const ACCOUNT_OFFICE_CODE = this.RevenueReportGF.value.OFFICE_CODE;
    const ProductGroup = form.value.ProductGroup;
    const ObjForm = Object.assign({}, { DateStart, DateEnd, ACCOUNT_OFFICE_CODE, ProductGroup });
    console.log('ObjForm : ', ObjForm);
    await this.reportService.ILG60_00_12_005(ObjForm).subscribe(x => {
      const file = new Blob([x], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
      this.preloaderService.setShowPreloader(false);
    })
  }

  private async setProductGroup() {
    await this.reportService.MasProductGroupgetByCon('', '').then(res => {
      this.ProductGroup = res;
      console.log('onPagesload MasProductGroupgetByCon res : ', this.ProductGroup)
    })
  }

  private async setOfficeStore() {
    await this.mainMasterService.MasOfficegetByCon().then(res =>
      this.typeheadOffice = res.RESPONSE_DATA
    )
    let officeCode = localStorage.getItem("officeCode");
    for (let l of this.typeheadOffice) {
      let code = l.OFFICE_CODE;
      if (officeCode == code) {
        this.RevenueReportGF.patchValue({
          OFFICE_CODE: l.OFFICE_CODE || '-',
          OFFICE_NAME: l.OFFICE_NAME,
          OFFICE_ID: l.OFFICE_ID
        });
        break;
      }
    }
  }

  formatterOffice = (x: { OFFICE_NAME: string }) => x.OFFICE_NAME
  serachOffice = (text3$: Observable<string>) =>
    text3$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term === '' ? []
        : this.typeheadOffice
          .filter(v =>
            (`${v.OFFICE_NAME || ''} ${v.OfficeShortName || ''}`.toLowerCase().indexOf(term.toLowerCase()) > -1)
          ).slice(0, 10));
  selectItemOffice(e) {
    this.RevenueReportGF.patchValue({
      OFFICE_CODE: e.item.OFFICE_CODE || '-',
      OFFICE_NAME: e.item.OFFICE_NAME,
      OFFICE_ID: e.item.OFFICE_ID
    });
    console.log('selectItemOffice this.RevenueReportGF : ', this.RevenueReportGF.value)
  }
}
