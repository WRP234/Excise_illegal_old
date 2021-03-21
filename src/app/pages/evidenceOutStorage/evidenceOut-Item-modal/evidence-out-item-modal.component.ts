import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { pagination } from "../../../config/pagination";
import { IMyOptions } from 'mydatepicker-th';
import { PreloaderService } from 'app/shared/preloader/preloader.component';
import { EvidenceOutStorageService } from '../evidenceOutStorage.service';
import { setDateMyDatepicker, getDateMyDatepicker, convertDateForSave } from 'app/config/dateFormat';
import { EvidenceOutStockBalanceByLawsuitNo } from '../evidenceOutStorage';
import { HttpErrorResponse } from '@angular/common/http';
import { Message } from 'app/config/message';
import swal from 'sweetalert2';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-evidence-out-item-modal',
  templateUrl: './evidence-out-item-modal.component.html',
  styleUrls: ['./evidence-out-item-modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EvidenceOutItemModalComponent implements OnInit, AfterViewInit {

  paginage: any;
  isCheckAll = false;
  evidenceInItemSeleted: any[] = [];
  public dataList = [];
  public evidenceOutStockBalanceByLawsuitNo = new Array<EvidenceOutStockBalanceByLawsuitNo>();

  

  public TEMP_LAWSUIT_NO: any = '';
  public TEMP_LAWSUIT_NO_YEAR: any = '';
  public TEMP_IS_OUTSIDE: any = '';
  public LAWSUIT_DATE_FROM: any;
  public LAWSUIT_DATE_TO: any;
  public TEMP_DELIVERY_NO: any = '';
  public DELIVERY_DATE_FROM: any;
  public DELIVERY_DATE_TO: any;
  public EVIDENCE_IN_DATE_FROM: any = '';
  public EVIDENCE_IN_DATE_TO: any = '';

  @Output() d = new EventEmitter();
  @Output() c = new EventEmitter();
  @Output() Output = new EventEmitter<any[]>();

  evidenceInItemFormGroup: FormGroup;

  constructor(
    private preloader: PreloaderService,
    private evidenceOutStorageService: EvidenceOutStorageService,
    private fb: FormBuilder,
  ) { }


  ngOnInit() {
    this.paginage = pagination;
    this.paginage.TotalItems = 0;
    this.paginage.CurrentPage = 1;
    this.paginage.PageSize = 5;
    this.evidenceInItemFormGroup = this.fb.group({
      EvidenceInItems: this.fb.array([])
  });
  }

  get EvidenceInItems(): FormArray {
    return this.evidenceInItemFormGroup.get('EvidenceInItems') as FormArray;
  }

  ngAfterViewInit(): void {
    this.suspectFormChange();
  }

  suspectFormChange() {
    this.evidenceInItemFormGroup
      .valueChanges
      .subscribe(x => {
        this.evidenceInItemSeleted = x['EvidenceInItems'].filter(f => f.IsChecked == true);
        if (!this.evidenceInItemSeleted.length) this.isCheckAll = false;
      })
  }


  checkAll() {
    this.isCheckAll = !this.isCheckAll;
    this.EvidenceInItems.value.map(item => item.IsChecked = this.isCheckAll);
    this.setItemFormArray(this.EvidenceInItems.value, 'EvidenceInItems');
  }

  onAdvSearch(form: any) {

    this.preloader.setShowPreloader(true);


    if (!form.DELIVERY_DATE_FROM && form.DELIVERY_DATE_TO) {
      this.DELIVERY_DATE_FROM = setDateMyDatepicker(form.DELIVERY_DATE_TO);
      form.DELIVERY_DATE_FROM = form.DELIVERY_DATE_TO;

      var d = new Date(form.DELIVERY_DATE_FROM.jsdate);
      this.myDatePickerDeliveryToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else if (form.DELIVERY_DATE_FROM && !form.DELIVERY_DATE_TO) {
      const currDate = setDateMyDatepicker(new Date());
      this.DELIVERY_DATE_TO = setDateMyDatepicker(currDate);
      form.DELIVERY_DATE_TO = this.DELIVERY_DATE_TO
    }

    let delivery_sdate = getDateMyDatepicker(form.DELIVERY_DATE_FROM);
    let delivery_edate = getDateMyDatepicker(form.DELIVERY_DATE_TO);

    form.DELIVERY_DATE_FROM = convertDateForSave(delivery_sdate) || null;
    form.DELIVERY_DATE_TO = convertDateForSave(delivery_edate) || null;


    if (!form.EVIDENCE_IN_DATE_FROM && form.EVIDENCE_IN_DATE_TO) {
      this.EVIDENCE_IN_DATE_FROM = setDateMyDatepicker(form.EVIDENCE_IN_DATE_TO);
      form.EVIDENCE_IN_DATE_FROM = form.EVIDENCE_IN_DATE_TO;

      var d = new Date(form.EVIDENCE_IN_DATE_FROM.jsdate);
      this.myDatePickerEvidenceInToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else if (form.EVIDENCE_IN_DATE_FROM && !form.EVIDENCE_IN_DATE_TO) {
      const currDate = setDateMyDatepicker(new Date());
      this.EVIDENCE_IN_DATE_TO = setDateMyDatepicker(currDate);
      form.EVIDENCE_IN_DATE_TO = this.EVIDENCE_IN_DATE_TO
    }

    let evidenceIn_sdate = getDateMyDatepicker(form.EVIDENCE_IN_DATE_FROM);
    let evidenceIn_edate = getDateMyDatepicker(form.EVIDENCE_IN_DATE_TO);

    form.EVIDENCE_IN_DATE_FROM = convertDateForSave(evidenceIn_sdate) || null;
    form.EVIDENCE_IN_DATE_TO = convertDateForSave(evidenceIn_edate) || null;


    if (!form.LAWSUIT_DATE_FROM && form.LAWSUIT_DATE_TO) {
      this.LAWSUIT_DATE_FROM = setDateMyDatepicker(form.LAWSUIT_DATE_TO);
      form.LAWSUIT_DATE_FROM = form.LAWSUIT_DATE_TO;

      var d = new Date(form.LAWSUIT_DATE_FROM.jsdate);
      this.myDatePickerLawsuitToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else if (form.LAWSUIT_DATE_FROM && !form.LAWSUIT_DATE_TO) {
      const currDate = setDateMyDatepicker(new Date());
      this.LAWSUIT_DATE_TO = setDateMyDatepicker(currDate);
      form.LAWSUIT_DATE_TO = this.LAWSUIT_DATE_TO
    }

    let lawsuit_sdate = getDateMyDatepicker(form.LAWSUIT_DATE_FROM);
    let lawsuit_edate = getDateMyDatepicker(form.LAWSUIT_DATE_TO);

    form.LAWSUIT_DATE_FROM = convertDateForSave(lawsuit_sdate) || null;
    form.LAWSUIT_DATE_TO = convertDateForSave(lawsuit_edate) || null;

    // // ประเภทรายการรับ
    if (form.IS_OUTSIDE == "") {
      form.IS_OUTSIDE = null;
    }

    console.log(form);

    this.evidenceOutStorageService.getEvidenceOutStockBalanceByLawsuitNo(form).then(list => {
      if (list.length > 0) {
        this.onSearchComplete(list);
        this.preloader.setShowPreloader(false);
      } else {
        this.evidenceOutStockBalanceByLawsuitNo = [];
        this.paginage.TotalItems = list.length;
        this.ShowAlert(Message.noRecord, 'warning')
        this.preloader.setShowPreloader(false);
      }
    }, (err: HttpErrorResponse) => {
      this.ShowAlert(err.message, 'error')
      this.evidenceOutStockBalanceByLawsuitNo = [];
      this.preloader.setShowPreloader(false);
    });
  }

  async onSearchComplete(list: any) {

    //console.log(list)
    this.dataList = [];
    if (Array.isArray(list)) {
      this.dataList = list;
    } else {
      this.dataList.push(list);
    }
    
    this.evidenceOutStockBalanceByLawsuitNo = this.dataList
    this.setItemFormArray(this.dataList, 'EvidenceInItems');
    if (this.dataList.length == 0) {
      this.evidenceInItemFormGroup.setControl("EvidenceInItems", this.fb.array([]));
    }
    this.paginage.TotalItems = this.evidenceOutStockBalanceByLawsuitNo.length;


  }

  private async setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {

      //const itemFGs = array.map(item => this.fb.group(item));
      let itemFGs = []
      for(let item of array){
        let data = await this.fb.group({
          IsChecked : this.isCheckAll,
          DELIVERY_NO: item.DELIVERY_NO,
          DELIVERY_DATE: item.DELIVERY_DATE,
          EVIDENCE_IN_DATE: item.EVIDENCE_IN_DATE,
          EVIDENCE_IN_ID: item.EVIDENCE_IN_ID,
          LAWSUIT_NO: item.LAWSUIT_NO ,
          EvidenceInItem : this.fb.array(item.EvidenceInItem)
        })
      itemFGs.push(data)
      }
      console.log(itemFGs)
      const itemFormArray = this.fb.array(itemFGs);
      this.evidenceInItemFormGroup.setControl(formControl, itemFormArray);
    }
  }

  async pageChanges(event) {
    this.evidenceOutStockBalanceByLawsuitNo = await this.dataList.slice(event.startIndex - 1, event.endIndex);
  }

  async itemSelected() {
    let form = this.evidenceInItemFormGroup.value.EvidenceInItems;
        form = await form.filter(item => item.IsChecked === true);
        form.map(m => {
            console.log('m MISTREAT_NO : ', m)
        })
        // console.log('Fn exportData suspectFormGroup : ', form);
        this.Output.emit(form);
        this.close('Save click');
  }

  close(e: any) {
    this.c.emit(e);
  }

  ShowAlert(text, type) {
    swal({
      title: '',
      text: text,
      type: type,
      confirmButtonText: 'ตกลง'
    });
  }

  // ----- Validate Date -----

  public onLawsuitDateFromChanged(event) {
    console.log(event.jsdate)
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
  }

  public onDeliveryDateFromChanged(event) {
    console.log(event.jsdate)
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerDeliveryToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.myDatePickerDeliveryToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onDeliveryDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerDeliveryFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerDeliveryFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onEvidenceInDateFromChanged(event) {
    console.log(event.jsdate)
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerEvidenceInToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.myDatePickerEvidenceInToOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onEvidenceInDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerEvidenceInFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerEvidenceInFromOptions = {
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

  myDatePickerDeliveryFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerDeliveryToOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerEvidenceInFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerEvidenceInToOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  setFormControl1() {

    this.evidenceInItemFormGroup = this.fb.group({
      DELIVERY_NO: new FormControl(""),
      DELIVERY_DATE: new FormControl(""),
      EVIDENCE_IN_DATE: new FormControl(""),
      EVIDENCE_IN_ID: new FormControl(""),
      LAWSUIT_NO: new FormControl(""),
      EvidenceInItem: this.fb.array([]),
    });
  }



  private createForm(): void {
    console.log('create form')
    this.evidenceInItemFormGroup = new FormGroup({
      EvidenceInItems: this.fb.array([this.setMain()]),
    });

  }

  private setMain(): FormGroup {
    const MainControl = {
      DELIVERY_NO: new FormControl(''),
      DELIVERY_DATE: new FormControl(''),
      EVIDENCE_IN_DATE: new FormControl(''),
      EVIDENCE_IN_ID: new FormControl(0),
      LAWSUIT_NO: new FormControl(''),
      EvidenceInItem: this.fb.array([this.setEvidenceInItem()]),
    }
    return this.fb.group(MainControl)
  }
 
  private setEvidenceInItem(): FormGroup {
    const EvidenceInItemControl = {
      EVIDENCE_IN_ITEM_ID: new FormControl(0),
      EVIDENCE_IN_ITEM_CODE: new FormControl(''),
      EVIDENCE_IN_ID: new FormControl(0),
      PRODUCT_MAPPING_ID: new FormControl(0),
      PRODUCT_CODE: new FormControl(0),
      PRODUCT_REF_CODE: new FormControl(0),
      PRODUCT_GROUP_ID: new FormControl(0),
      PRODUCT_CATEGORY_ID: new FormControl(0),
      PRODUCT_TYPE_ID: new FormControl(0),
      PRODUCT_SUBTYPE_ID: new FormControl(0),
      PRODUCT_SUBSETTYPE_ID: new FormControl(0),
      PRODUCT_BRAND_ID: new FormControl(0),
      PRODUCT_SUBBRAND_ID: new FormControl(0),
      PRODUCT_MODEL_ID: new FormControl(0),
      PRODUCT_TAXDETAIL_ID: new FormControl(0),
      PRODUCT_GROUP_CODE: new FormControl(0),
      PRODUCT_GROUP_NAME: new FormControl(''),
      PRODUCT_CATEGORY_CODE: new FormControl(0),
      PRODUCT_CATEGORY_NAME: new FormControl(''),
      PRODUCT_TYPE_CODE: new FormControl(0),
      PRODUCT_TYPE_NAME: new FormControl(''),
      PRODUCT_SUBTYPE_CODE: new FormControl(0),
      PRODUCT_SUBTYPE_NAME: new FormControl(''),
      PRODUCT_SUBSETTYPE_CODE: new FormControl(0),
      PRODUCT_SUBSETTYPE_NAME: new FormControl(''),
      PRODUCT_BRAND_CODE: new FormControl(0),
      PRODUCT_BRAND_NAME_TH: new FormControl(''),
      PRODUCT_BRAND_NAME_EN: new FormControl(''),
      PRODUCT_SUBBRAND_CODE: new FormControl(0),
      PRODUCT_SUBBRAND_NAME_TH: new FormControl(''),
      PRODUCT_SUBBRAND_NAME_EN: new FormControl(''),
      PRODUCT_MODEL_CODE: new FormControl(0),
      PRODUCT_MODEL_NAME_TH: new FormControl(''),
      PRODUCT_MODEL_NAME_EN: new FormControl(''),
      LICENSE_PLATE: new FormControl(''),
      ENGINE_NO: new FormControl(''),
      CHASSIS_NO: new FormControl(''),
      PRODUCT_DESC: new FormControl(''),
      SUGAR: new FormControl(0),
      CO2: new FormControl(0),
      DEGREE: new FormControl(0),
      PRICE: new FormControl(0),
      DELIVERY_QTY: new FormControl(0),
      DELIVERY_QTY_UNIT: new FormControl(''),
      DELIVERY_SIZE: new FormControl(0),
      DELIVERY_SIZE_UNIT: new FormControl(''),
      DELIVERY_NET_VOLUMN: new FormControl(0),
      DELIVERY_NET_VOLUMN_UNIT: new FormControl(''),
      DAMAGE_QTY: new FormControl(0),
      DAMAGE_QTY_UNIT: new FormControl(''),
      DAMAGE_SIZE: new FormControl(0),
      DAMAGE_SIZE_UNIT: new FormControl(''),
      DAMAGE_NET_VOLUMN: new FormControl(0),
      DAMAGE_NET_VOLUMN_UNIT: new FormControl(''),
      IS_DOMESTIC: new FormControl(0),
      IS_ACTIVE: new FormControl(0),
      REMARK: new FormControl(''),
      EvidenceInItem: this.fb.array([]),
    }
    return this.fb.group(EvidenceInItemControl)
  }


}
