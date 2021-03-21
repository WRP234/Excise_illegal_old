import { Router } from '@angular/router';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { Component, OnInit } from '@angular/core';
import { ReductionApiService } from '../reduction.api.service';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { SidebarService } from 'app/shared/sidebar/sidebar.component';
import { ReductionService } from  '../reduction.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { pagination } from '../../../config/pagination';
import { reduction } from '../reduction';
import swal from 'sweetalert2';
import { Message } from '../../../config/message';
import { toLocalShort, setZero } from 'app/config/dateFormat';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  AccountOfficeCode = '';

  constructor(
    private navService: NavigationService,
    private router: Router,
    private apiServer: ReductionApiService,
    private preloaderService: PreloaderService,
    private sidebarService: SidebarService,
    private reductionService : ReductionService,
  ) {
  }

  ngOnInit() {
    this.preloaderService.setShowPreloader(true);
    localStorage.setItem('programcode', 'ILG60-08-00');
    this.AccountOfficeCode = localStorage.getItem('officeCode');
    this.sidebarService.setVersion('0.0.4.22');
    this.navService.setSearchBar(true);
    this.navService.setPrintButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setCancelButton(false);
    this.navService.setEditButton(false);
    this.navService.setSaveButton(false);
    this.navService.setNewButton(false);
    this.paginage.TotalItems = 0;

    this.myDatePickerCompareFromOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    this.myDatePickerCompareToOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
    const param = { TEXT_SEARCH: '', ACCOUNT_OFFICE_CODE : this.AccountOfficeCode };
    this.reductionService.AdjustCompareListgetByKeyword("AdjustCompareListgetByKeyword",param).then(res =>{
      this.onSearchComplete(res);
      this.preloaderService.setShowPreloader(false);
    });
  }

  public TEXT_SEARCH : any = '';
  public ARREST_CODE : any = '';
  public PERSON_NAME : any = '';
  public COMPARE_NO : any = '';
  public COMPARE_NO_YEAR : any = '';
  public COMPARE_DATE_FORM : any = '';
  public COMPARE_DATE_TO : any = '';
  public COMPARE_OFFICE_NAME : any =  localStorage.getItem("officeShortName");
  public ARREST_OFFICE_NAME : any =  localStorage.getItem("officeShortName");
  public LAWSUIT_IS_OUTSIDE : any = '';
  public COMPARE_TYPE : any = '';
  ReductionList = [];
  Reduction = [];
  paginage = pagination;

  public async onSearch(text: string) {
    this.preloaderService.setShowPreloader(true);
    const param = {TEXT_SEARCH: this.TEXT_SEARCH || '',ACCOUNT_OFFICE_CODE: this.AccountOfficeCode};
    await this.reductionService.AdjustCompareListgetByKeyword("AdjustCompareListgetByKeyword",param).then(res =>{
      this.onSearchComplete(res);
      this.preloaderService.setShowPreloader(false);
    });
  }

  setZero(num: number) {
    return num < 10 ? '0' + num : num;
  }

  toDatePickerFormat(d: any) {
    return { date: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }, formatted: toLocalShort(d.toString()).replace(/ /g, ' ') };
  }


  public async onAdvSearch(form : any){
    this.preloaderService.setShowPreloader(true);
    const _date = new Date;
        const dd = this.setZero(_date.getDate());
        const mm = this.setZero(_date.getMonth() + 1);
        const yy = _date.getFullYear();

    const _COMPARE_DATE_FORM_ = form.COMPARE_DATE_FORM;
    let _COMPARE_DATE_FORM;
    if (_COMPARE_DATE_FORM_ == null){
        _COMPARE_DATE_FORM = "";
    }else {
        const dd1 = _COMPARE_DATE_FORM_.date.day;
        const mm1 = _COMPARE_DATE_FORM_.date.month+1;
        const yy1 = _COMPARE_DATE_FORM_.date.year;
  
        _COMPARE_DATE_FORM = yy1+"-"+mm1+"-"+dd1;
    }

    const _COMPARE_DATE_TO_ = form.COMPARE_DATE_TO;
    let _COMPARE_DATE_TO;
    if (_COMPARE_DATE_TO_ == null){
        if (_COMPARE_DATE_FORM !== "" ){
          this.COMPARE_DATE_TO = this.toDatePickerFormat(new Date());
          _COMPARE_DATE_TO = yy+"-"+mm+"-"+dd;
        }else{
          _COMPARE_DATE_TO = "";
        }
    }else {
        const dd1 = _COMPARE_DATE_TO_.date.day;
        const mm1 = _COMPARE_DATE_TO_.date.month+1;
        const yy1 = _COMPARE_DATE_TO_.date.year;

        _COMPARE_DATE_TO = yy1+"-"+mm1+"-"+dd1;
    }

    var _COMPARE_NO_YEAR;
    if (form.COMPARE_NO_YEAR == ""){
      _COMPARE_NO_YEAR == "";
    }else{
      _COMPARE_NO_YEAR = (parseInt(form.COMPARE_NO_YEAR)-543);
    }

    const param = {
      ACCOUNT_OFFICE_CODE: this.AccountOfficeCode,
      ARREST_CODE : this.ARREST_CODE ,
      // PERSON_NAME : this.PERSON_NAME ,
      COMPARE_NO : this.COMPARE_NO ,
      COMPARE_NO_YEAR :  _COMPARE_NO_YEAR,
      COMPARE_DATE_FROM : _COMPARE_DATE_FORM,
      COMPARE_DATE_TO : _COMPARE_DATE_TO ,
      // COMPARE_OFFICE_NAME : this.COMPARE_OFFICE_NAME ,
      // ARREST_OFFICE_NAME : this.ARREST_OFFICE_NAME ,
      LAWSUIT_IS_OUTSIDE : this.LAWSUIT_IS_OUTSIDE ,
      // COMPARE_TYPE : this.COMPARE_TYPE ,

      ARREST_NAME: "",
      COMPARE_IS_OUTSIDE: "",
      COMPARE_NAME: "",
      COMPARE_OFFICE_NAME : "",
      ARREST_OFFICE_NAME : "",
      GUILTBASE_NAME: "",
      LAWSUIT_DATE_FROM: "",
      LAWSUIT_DATE_TO: "",
      LAWSUIT_NAME: "",
      LAWSUIT_NO: "",
      LAWSUIT_NO_YEAR: "",
      LAWSUIT_OFFICE_NAME: "",
      OCCURRENCE_DATE_FROM: "",
      OCCURRENCE_DATE_TO: "",
      PROVE_IS_OUTSIDE: "",
      PROVE_NAME: "",
      PROVE_NO: "",
      PROVE_NO_YEAR: "",
      RECEIVE_DOC_DATE_FROM: "",
      RECEIVE_DOC_DATE_TO: "",
      RECEIVE_OFFICE_NAME: "",
      SUBSECTION_NAME: "",
    }
    console.log("param : ",param)
    await this.reductionService.AdjustCompareListgetByConAdv("AdjustCompareListgetByConAdv",param).then(res =>{
      this.onSearchComplete(res);
      this.preloaderService.setShowPreloader(false);
    });
  }

  
  clearCon(){
    this.ARREST_CODE = '';
    this.PERSON_NAME = '';
    this.COMPARE_NO = '';
    this.COMPARE_NO_YEAR = '';
    this.COMPARE_DATE_FORM = '';
    this.COMPARE_DATE_TO = '';
    this.COMPARE_OFFICE_NAME =  localStorage.getItem("officeShortName");
    this.ARREST_OFFICE_NAME =  localStorage.getItem("officeShortName");
    this.LAWSUIT_IS_OUTSIDE = '';
    this.COMPARE_TYPE = '';
  }
  clearADV(){
    this.TEXT_SEARCH = '';
  }

  public async onSearchComplete(form : any){
    console.log("form : ",form)
    let list = [];
    ///case search
    form.map(m=>{
      if(m.COMPARE_NO == null || m.COMPARE_NO == ''){
      }else{
      list.push(m)}
    });


    if (list.length < 1) {
      swal({
        type: 'warning',
        text: "ไม่พบข้อมูล",
        confirmButtonText: 'ตกลง',
        buttonsStyling: true,
      })
      this.ReductionList = [];
      return false;
  }else{

    var sort = list.sort((a,b)=>{ 
      return <any>new Date(b.COMPARE_DATE) - <any>new Date(a.COMPARE_DATE);
    });

    this.Reduction = sort.map((item, i) => {
      item.RowsId = i + 1;
      // item.COMPARE_DATE = this.setDateStruct(item.COMPARE_DATE);
      // item.OCCURRENCE_DATE = this.setDateStruct(item.OCCURRENCE_DATE);
      // item.LAWSUIT_DATE = this.setDateStruct(item.LAWSUIT_DATE);
      // item.RECEIVE_DOC_DATE = this.setDateStruct(item.RECEIVE_DOC_DATE);
      return item;
    });
  
    this.ReductionList = this.Reduction.slice(0, 5);
    this.paginage.TotalItems = this.Reduction.length;
  }
  }

  async pageChanges(event) {
    this.ReductionList = await this.Reduction.slice(event.startIndex - 1, event.endIndex);
  }

  public clickView (compareID: string = '', indictmentID: string = '', arrestCode: string = '') {
    console.log("compareID: ",compareID," | indictmentID: ",indictmentID," | arrestCode: ",arrestCode)
    this.router.navigate([`/reduction/manage/${'C'}/${compareID}/${indictmentID}/${arrestCode}`]);
  }

  collapse1 = new BehaviorSubject<Boolean>(true);
  toggleCollapse(event: BehaviorSubject<Boolean>): void {
    if (event.getValue()) {event.next(false);
    } else {event.next(true);}
  }

  
  ARREST_CODE_SORTING = new BehaviorSubject<Boolean>(true);
  COMPARE_DATE_SORTING = new BehaviorSubject<Boolean>(true);
  COMPARE_NO_SORTING = new BehaviorSubject<Boolean>(true);
  Sorter(event: BehaviorSubject<Boolean>, type: string): void {
        if (event.getValue()) event.next(false); else event.next(true);

        switch (type) {
            case 'ARREST_CODE':
                if (event.getValue())
                    this.Reduction.sort((a, b) => {
                        return <number>parseInt(b.ARREST_CODE.substring(2)) - <number>parseInt(a.ARREST_CODE.substring(2));
                    });
                else
                    this.Reduction.sort((a, b) => {
                        return <number>parseInt(a.ARREST_CODE.substring(2)) - <number>parseInt(b.ARREST_CODE.substring(2));
                    });
                break;
            case 'OCCURRENCE_DATE':
                if (event.getValue())
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(b.OCCURRENCE_DATE) - <any>new Date(a.OCCURRENCE_DATE);
                    });
                else
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(a.OCCURRENCE_DATE) - <any>new Date(b.OCCURRENCE_DATE);
                    });
                break;
            case 'LAWSUIT_NO':
                if (event.getValue())
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(b.LAWSUIT_NO_YEAR) - <any>new Date(a.LAWSUIT_NO_YEAR)
                    });
                else
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(a.LAWSUIT_NO_YEAR) - <any>new Date(b.LAWSUIT_NO_YEAR)
                    });
                break;
            case 'LAWSUIT_DATE':
                if (event.getValue())
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(b.LAWSUIT_DATE) - <any>new Date(a.LAWSUIT_DATE)
                    });
                else
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(a.LAWSUIT_DATE) - <any>new Date(b.LAWSUIT_DATE)
                    });
                break;
            case 'PROVE_NO':
                if (event.getValue())
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(b.PROVE_NO_YEAR) - <any>new Date(a.PROVE_NO_YEAR)
                    });
                else
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(a.PROVE_NO_YEAR) - <any>new Date(b.PROVE_NO_YEAR)
                    });
                break;
            case 'RECEIVE_DOC_DATE':
                if (event.getValue())
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(b.RECEIVE_DOC_DATE) - <any>new Date(a.RECEIVE_DOC_DATE)
                    });
                else
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(a.RECEIVE_DOC_DATE) - <any>new Date(b.RECEIVE_DOC_DATE)
                    });
                break;
            case 'COMPARE_NO':
                if (event.getValue())
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(b.COMPARE_NO_YEAR) - <any>new Date(a.COMPARE_NO_YEAR)
                    });
                else
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(a.COMPARE_NO_YEAR) - <any>new Date(b.COMPARE_NO_YEAR)
                    });
                break;
            case 'COMPARE_DATE':
                if (event.getValue())
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(b.COMPARE_DATE) - <any>new Date(a.COMPARE_DATE) 
                    });
                else
                    this.Reduction.sort((a, b) => {
                        return <any>new Date(a.COMPARE_DATE) - <any>new Date(b.COMPARE_DATE) 
                    });
                break;
            default:
                break;
        }
        this.reIndex();
        this.ReductionList = this.Reduction.slice(0, this.paginage.RowsPerPageOptions[0]);
    }

  reIndex() {
        this.Reduction.map((m, i) => {
            m.RowsId = i + 1;
        })
    }

  myDatePickerCompareFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  myDatePickerCompareToOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  public onCompareDateToChanged(event) {
    if (event.jsdate) {
      var d = new Date(event.jsdate);
      this.myDatePickerCompareFromOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
          end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
        }]
      }
    } else {
      this.myDatePickerCompareFromOptions = {
        disableDateRanges: [this.getDisCurrDateMyDatePicker()]
      }
    }
  }

  public onCompareDateFromChanged(event) {
    if (event.jsdate) {
      this.COMPARE_DATE_TO = '';
      var d = new Date(event.jsdate);
      d.setDate(d.getDate() - 1);
      this.myDatePickerCompareToOptions = {
        disableDateRanges: [{
          begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
          end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
        }, this.getDisCurrDateMyDatePicker()]
      }
    } else {
      this.COMPARE_DATE_TO = '';
      this.myDatePickerCompareToOptions = {
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

}
