import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy, TemplateRef } from '@angular/core';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, NgForm, FormArray, FormBuilder, FormControlName, Form, ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { toLocalShort, setZero } from 'app/config/dateFormat';
import { CurrencyPipe } from '@angular/common';
import swal from 'sweetalert2';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { saveAs } from 'file-saver';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { Observable, of, generate } from 'rxjs';
import { MasOfficeModel, MasOfficeModel_New } from '../../../models/mas-office.model';
import { MainMasterService } from '../../../services/main-master.service';
import { CommentStmt } from '@angular/compiler';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import { async } from '@angular/core/testing';
import { ignoreElements } from 'rxjs-compat/operator/ignoreElements';
import { PrintDocModalComponent } from '../../reward/printdoc-modal/printdoc-modal.component';
import { param } from 'jquery';
import { TargetService } from '../target.service';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {

  constructor
    (
      private router: Router,
      private activeRoute: ActivatedRoute,
      private navService: NavigationService,
      private ngbModal: NgbModal,
      private fb: FormBuilder,
      private currencyPipe: CurrencyPipe,
      private preloader: PreloaderService,
      private mainMasterService: MainMasterService,
      private targetService: TargetService,
  ) { }

  form_Collapse1: FormGroup;
  createButton: boolean = false;
  printButton: boolean = false;
  editButton: boolean = false;
  deleteButton: boolean = false;
  saveButton: boolean = false;
  saveEditButton: boolean = false;
  cancelButton: boolean = false;
  showEditField = false;
  setFormTable = false;
  mode: any;
  code: any;
  officecode : any;
  
  YEAR_I : any;
  YEAR_II : any;
  YEAR_III : any;

  ngOnInit() {
    this.preloader.setShowPreloader(true);
    localStorage.setItem('programcode', 'ILG60-99-01');
    this.officecode = localStorage.getItem("officeCode");

    const _date = new Date;
    const yy = _date.getFullYear()+544;
    this.YEAR_I = yy;

    const _date_I = new Date;
    const yy_I = _date_I.getFullYear()+543;
    this.YEAR_II = yy_I;

    const _date_II = new Date;
    const yy_II = _date_II.getFullYear()+542;
    this.YEAR_III = yy_II;
    
    this.setForm();
  }

  setForm(){
    this.activeRoute.params.subscribe(p => {
      this.mode = p.mode;
      this.code = p.code;
      if (this.mode == 'C') {
        this.createButton = false;
        this.printButton = false;
        this.editButton = false;
        this.deleteButton = false;
        this.saveButton = true;
        this.saveEditButton = false;
        this.cancelButton = true;
        this.showEditField = false;
        this.setFormControl();
        this.load_modeC();
      }else if(this.mode == 'R'){
        this.printButton = true;
        this.editButton = true;
        this.deleteButton = true;
        this.saveButton = false;
        this.saveEditButton = false;
        this.cancelButton = false;
        this.showEditField = true;
        this.collapse1 = new BehaviorSubject<Boolean>(true);
        this.collapse2 = new BehaviorSubject<Boolean>(true);
      }
    });
  }

  setFormControl(){
    this.form_Collapse1 = this.fb.group({
      TARGET_CODE: new FormControl(""),
      YEAR: new FormControl(""),
      SEQUENCE: new FormControl(""),
      OFFICE_NAME: new FormControl(""),
      OFFICE_CODE: new FormControl(""),
      OFFICE_ID: new FormControl(""),
      LAWSUIT_TYPE: new FormControl(""),
      PRODUCT_GROUP: new FormControl(""),
      SUM_QTY: new FormControl(""),
      SUM_FINE: new FormControl(""),
      QTY_FINE: new FormControl(""),
      FIRST_MONTH: new FormControl(1),
      LAST_MONTH: new FormControl(1),
      form_Table : this.fb.array([])
    });
    let control = this.form_Collapse1.get("form_Table") as FormArray;
    for(var i=0; i<12; i++){ control.push(this.setTable_oldNull(i));}
  }

  
  private setTable_oldNull(e): FormGroup {
    let MONTH_TH;
    if(e == 0){ MONTH_TH = 'ตุลาคม'};
    if(e == 1){ MONTH_TH = 'พฤศจิกายน'};
    if(e == 2){ MONTH_TH = 'ธันวาคม'};
    if(e == 3){ MONTH_TH = 'มกราคม'};
    if(e == 4){ MONTH_TH = 'กุมภาพันธ์'};
    if(e == 5){ MONTH_TH = 'มีนาคม'};
    if(e == 6){ MONTH_TH = 'เมษายน'};
    if(e == 7){ MONTH_TH = 'พฤษภาคม'};
    if(e == 8){ MONTH_TH = 'มิถุนายน'};
    if(e == 9){ MONTH_TH = 'กรกฎาคม'};
    if(e == 10){ MONTH_TH = 'สิงหาคม'};
    if(e == 11){ MONTH_TH = 'กันยายน'};
    
    let control = [];
    control.push({
      ITEM_DETAIL_ID: new FormControl(0),
      ITEM_ID: new FormControl(0),
      OLD_QTY: new FormControl(0),
      QTY_CASE: new FormControl(0),
      QTY_CASE_PERCENT: new FormControl(0),
      OLD_FINE: new FormControl(0),
      FINE: new FormControl(0),
      FINE_PIPE: new FormControl(0),
      FINE_PERCENT: new FormControl(0),
      TREASURY_MONEY: new FormControl(0),
      TREASURY_MONEY_PIPE: new FormControl(0),
      MONTH: new FormControl(e),
      MONTH_TH : new FormControl(MONTH_TH),
      OLD_BRIBE: new FormControl(0),
      BRIBE: new FormControl(0),
      BRIBE_PIPE: new FormControl(0),
      OLD_REWARD: new FormControl(0),
      REWARD: new FormControl(0),
      REWARD_PIPE: new FormControl(0),
      OLD_TREASURY: new FormControl(0),
    })
    return this.fb.group(control[0]);
  }

  async load_modeC(){
    let params = { TEXT_SEARCH : this.officecode };
    let off = await this.targetService.MasOfficegetByCon("MasOfficegetByCon",params);
    await this.form_Collapse1.patchValue({
      TARGET_CODE: 'Auto Generate',
      YEAR: '',
      SEQUENCE: '',
      OFFICE_CODE : off.RESPONSE_DATA[0].OFFICE_CODE,
      OFFICE_NAME : off.RESPONSE_DATA[0].OFFICE_NAME,
      OFFICE_ID : off.RESPONSE_DATA[0].OFFICE_ID,
      LAWSUIT_TYPE: '',
      PRODUCT_GROUP: '',
      SUM_QTY: '',
      SUM_FINE: '',
      QTY_FINE: '',
      FIRST_MONTH: '',
      LAST_MONTH: '',
    });
    // this.form_Collapse1.controls['QTY_FINE'].disable();
    // this.form_Collapse1.controls['FIRST_MONTH'].disable();
    // this.form_Collapse1.controls['LAST_MONTH'].disable();
    this.preloader.setShowPreloader(false);
  }

  async onSelect(e: any, type: string) {
    const ev = e.target.value;
    let control = this.form_Collapse1.get("form_Table") as FormArray;
    let SEQUENCE = this.form_Collapse1.controls['SEQUENCE'];
    let LAWSUIT_TYPE = this.form_Collapse1.controls['LAWSUIT_TYPE'];
    let PRODUCT_GROUP = this.form_Collapse1.controls['PRODUCT_GROUP'];
    let YEAR = this.form_Collapse1.controls['YEAR'];

    switch (type) {
      case 'LAWSUIT_TYPE':
        if(ev == 0){
          PRODUCT_GROUP.disable();
          YEAR.disable();
          PRODUCT_GROUP.setValue('');
          YEAR.setValue('');
        }else{
          if(LAWSUIT_TYPE.invalid){
            PRODUCT_GROUP.disable();
          }else{PRODUCT_GROUP.enable();}
        }
        break;

      case 'PRODUCT_GROUP':
        if(ev == 0){
          LAWSUIT_TYPE.enable();
          YEAR.disable();
          YEAR.setValue('');
        }else{
          if(PRODUCT_GROUP.invalid){
            LAWSUIT_TYPE.enable();
          }else{
            LAWSUIT_TYPE.disable()
            YEAR.enable()
          }
        }
        break;

      case 'YEAR':
        if(ev == 0){
          PRODUCT_GROUP.enable();
          LAWSUIT_TYPE.disable();
          YEAR.setValue('');
          SEQUENCE.setValue('');
          this.setFormTable = false;
       }else{
          this.preloader.setShowPreloader(true);
          if(YEAR.invalid){
            PRODUCT_GROUP.enable();
            SEQUENCE.setValue('');
            this.setFormTable = false;
          }else{
            PRODUCT_GROUP.disable();
            LAWSUIT_TYPE.disable();

            let aa = await this.targetService.TargetDetailgetByCon("TargetDetailgetByCon",{ACCOUNT_OFFICE_CODE : '040901'});
            let Target = aa[0].TARGET_ID;
            let OLD_QTY;
            let SUM_FINE;
                      
            aa.map(m=>{
              if(Target >= m.TARGET_ID){
                Target = Target;
                OLD_QTY = m.OLD_QTY;
                SUM_FINE = m.SUM_FINE;
              }else{
                Target = m.TARGET_ID;
                OLD_QTY = m.OLD_QTY;
                SUM_FINE = m.SUM_FINE;
              }
            });
            this.form_Collapse1.controls['SUM_QTY'].setValue(OLD_QTY);
            this.form_Collapse1.controls['SUM_FINE'].setValue(SUM_FINE);

            let TargetList = [];
            let old_TargetList = [];
            let params = { TEXT_SEARCH : '',OFFICE_CODE: '040901'};
            let res = await this.targetService.TargetListgetByKeywords("TargetListgetByKeyword",params);
            res.map(m=>{
              //real year
              if(m.BUDGET_YEAR == YEAR.value){ if(m.PRODUCT_GROUP_NAME == PRODUCT_GROUP.value){ if(m.LAWSUIT_TYPE_TARGET == (LAWSUIT_TYPE.value-1)){ TargetList.push(m); }}};
              //old year
              if(m.BUDGET_YEAR == (YEAR.value-1)){ if(m.PRODUCT_GROUP_NAME == PRODUCT_GROUP.value){ if(m.LAWSUIT_TYPE_TARGET == (LAWSUIT_TYPE.value-1)){ old_TargetList.push(m); }}}
            });

            await this.set_realYear(TargetList);
            await this.set_oldYear(old_TargetList);
            
            this.setFormTable = true;

            this.preloader.setShowPreloader(false);
          }
       }
        break;

      default:
        // console.log("")
        break;
    }
  }

  async set_realYear(TargetList){
    let control = this.form_Collapse1.get("form_Table") as FormArray;
    let SEQUENCE = this.form_Collapse1.controls['SEQUENCE'];
    let temp;
    let tempList = [];

    if(TargetList.length == 0){
      SEQUENCE.setValue(1);
      for(var i=0 ; i< 12; i++){
        control.at(i).get('QTY_CASE').setValue(0);
        control.at(i).get('FINE').setValue(0);
        control.at(i).get('BRIBE').setValue(0);
        control.at(i).get('REWARD').setValue(0);
        control.at(i).get('TREASURY_MONEY').setValue(0);
        control.at(i).get('FINE_PIPE').setValue(0);
        control.at(i).get('TREASURY_MONEY_PIPE').setValue(0);
        control.at(i).get('BRIBE_PIPE').setValue(0);
        control.at(i).get('REWARD_PIPE').setValue(0);
      }
    }else{
      temp = TargetList[0].SEQUENCE;
      tempList = TargetList[0];
      
      TargetList.map(m=>{
        if(temp >= m.SEQUENCE){
          temp = temp;
          tempList = tempList;
        }else{
          temp = m.SEQUENCE;
          tempList = m;
        }
      });
      SEQUENCE.setValue(temp+1);
    }
    
    let list = [];
    list.push(tempList);
    if(list.length !== 0){
      let res = await this.targetService.getByCon("TargetgetByCon",{ ITEM_ID: list[0].ITEM_ID ,OFFICE_CODE: '040901'});
      res.map((m,i)=>{
        control.at(i).get('QTY_CASE').setValue(m.QTY_CASE);
        control.at(i).get('FINE').setValue(m.FINE);
        control.at(i).get('BRIBE').setValue(m.BRIBE);
        control.at(i).get('REWARD').setValue(m.REWARD);
        control.at(i).get('TREASURY_MONEY').setValue(m.TREASURY_MONEY);
        control.at(i).get('FINE_PIPE').setValue(this.formatMoney(m.FINE));
        control.at(i).get('TREASURY_MONEY_PIPE').setValue(this.formatMoney(m.TREASURY_MONEY));
        control.at(i).get('BRIBE_PIPE').setValue(this.formatMoney(m.BRIBE));
        control.at(i).get('REWARD_PIPE').setValue(this.formatMoney(m.REWARD));
      });
    }
  }

  async set_oldYear(old_TargetList){
    let control = this.form_Collapse1.get("form_Table") as FormArray;
    let old_temp;
    let old_tempList = [];

    if(old_TargetList.length == 0){
      old_tempList = [];
      for(var i=0 ; i< 12; i++){
        control.at(i).get('OLD_QTY').setValue(0);
        control.at(i).get('OLD_FINE').setValue(0);
        control.at(i).get('OLD_BRIBE').setValue(0);
        control.at(i).get('OLD_REWARD').setValue(0);
        control.at(i).get('OLD_TREASURY').setValue(0);
      }
    }else{
      old_temp = old_TargetList[0].SEQUENCE;
      old_tempList = old_TargetList[0];

      old_TargetList.map(m=>{
        if(old_temp >= m.SEQUENCE){
          old_temp = old_temp;
          old_tempList = old_tempList;
        }else{
          old_temp = m.SEQUENCE;
          old_tempList = m;
        }
      });
    }

    let old_list = [];
    old_list.push(old_tempList);
    if(old_list.length !== 0){
      let res = await this.targetService.getByCon("TargetgetByCon",{ ITEM_ID: old_list[0].ITEM_ID ,OFFICE_CODE: '040901'});
      res.map((m,i)=>{
        control.at(i).get('OLD_QTY').setValue(m.QTY_CASE);
        control.at(i).get('OLD_FINE').setValue(m.FINE);
        control.at(i).get('OLD_BRIBE').setValue(m.BRIBE);
        control.at(i).get('OLD_REWARD').setValue(m.REWARD);
        control.at(i).get('OLD_TREASURY').setValue(m.TREASURY_MONEY);
      });
    }
  }



  ////////////////////////////////////////////////////////////////////////////////table/////////////////////////////////////////////////////////////////////////
  chk1 = false;
  chk2 = false;
  QTY = false;
  FINE = false;

  showButton(e,v,c){
    let chk = e.target.checked;
    if(chk == true){
      switch (v) {
        case 'chk1':
          // this.form_Collapse1.controls['QTY_FINE'].enable();
          // this.form_Collapse1.controls['FIRST_MONTH'].enable();
          // this.form_Collapse1.controls['LAST_MONTH'].enable();
          // this.chk1 = true;

          switch (c){
            case 'QTY': this.QTY = true;
            break;
            case 'FINE': this.FINE = true;
            break;
          }

        break;
        case 'chk2':
          this.chk2 = true;
        break;
      }
    }else{
      switch (v) {
        case 'chk1':
          // this.form_Collapse1.controls['QTY_FINE'].disable();
          // this.form_Collapse1.controls['FIRST_MONTH'].disable();
          // this.form_Collapse1.controls['LAST_MONTH'].disable();
          // this.form_Collapse1.controls['QTY_FINE'].setValue('');
          // this.form_Collapse1.controls['FIRST_MONTH'].setValue('');
          // this.form_Collapse1.controls['LAST_MONTH'].setValue('');
          // this.chk1 = false;
          switch (c){
            case 'QTY': this.QTY = false;
            break;
            case 'FINE': this.FINE = false;
            break;
          }
        break;
        case 'chk2':
          this.chk2 = false;
        break;
      }
    }
  }

  setCalPer(){
    const control = this.form_Collapse1.get("form_Table") as FormArray;
    let FIRST_MONTH = this.form_Collapse1.get("FIRST_MONTH").value;
    let LAST_MONTH = this.form_Collapse1.get("LAST_MONTH").value;
    // console.log("this.FINE : ",this.QTY);
    // console.log("this.FINE : ",this.FINE);
    let num = (this.form_Collapse1.getRawValue().QTY_FINE)/100;
    let sum = num * control.at(0).get("FINE").value;
    let total = control.at(0).get("FINE").value - sum;
    
    console.log("num : ",num);
    console.log("FINE : ",control.at(0).get("FINE").value);
    console.log("sum : ",sum);
    console.log("total : ",total);

    if(FIRST_MONTH == '' || LAST_MONTH == ''){
      console.log("not first : ",FIRST_MONTH);
      console.log("not last : ",LAST_MONTH);
    }else{

      console.log("first : ",FIRST_MONTH);
      console.log("last : ",LAST_MONTH);
    }


    // const FINE_PIPE = control.at(i).get("FINE_PIPE");
    // const TREASURY_MONEY_PIPE = control.at(i).get("TREASURY_MONEY_PIPE");
    // const BRIBE_PIPE = control.at(i).get("BRIBE_PIPE");
    // const REWARD_PIPE = control.at(i).get("REWARD_PIPE");

    // const FINE = control.at(i).get("FINE");
    // const BRIBE = control.at(i).get("BRIBE");
    // const REWARD = control.at(i).get("REWARD");
    // const TREASURY_MONEY = control.at(i).get("TREASURY_MONEY");
    
    if(this.QTY == true){

    }
    if(this.FINE == true){
      
    }
  }

  transformTotal(value,e,i){
    // console.log(value,e,i)
    switch (e) {
      case 'QTY_CASE': 
      break;
      case 'FINE': this.setCal(value,i);
      break;
      case 'TREASURY_MONEY': this.setCal_T(value,i);
      break;
      case 'BRIBE': this.setCal_B(value,i);
      break;
      case 'REWARD': this.setCal_R(value,i);
      break;
    }
  }

  setCal(e, i) {
    const value = `${e.FINE_PIPE}`.replace(/\,/g, "");
    const control = this.form_Collapse1.get("form_Table") as FormArray;

    const FINE_PIPE = control.at(i).get("FINE_PIPE");
    const TREASURY_MONEY_PIPE = control.at(i).get("TREASURY_MONEY_PIPE");
    const BRIBE_PIPE = control.at(i).get("BRIBE_PIPE");
    const REWARD_PIPE = control.at(i).get("REWARD_PIPE");

    const FINE = control.at(i).get("FINE");
    const BRIBE = control.at(i).get("BRIBE");
    const REWARD = control.at(i).get("REWARD");
    const TREASURY_MONEY = control.at(i).get("TREASURY_MONEY");
    
    
    FINE_PIPE.setValue(this.formatMoney(value.replace(/\,/g, "")),{ emitEvent: false });

    FINE.setValue(this.convert_money(parseFloat(value)));
    BRIBE.setValue(this.convert_BRIBE_MONEY(parseFloat(value)));
    REWARD.setValue(this.convert_REWARD_MONEY(parseFloat(value)));
    TREASURY_MONEY.setValue(this.convert_TREASURY_MONEY(parseFloat(value)));

    let T = this.convert_Calculator(this.convert_TREASURY_MONEY(parseFloat(value)));
    let B = this.convert_Calculator(this.convert_BRIBE_MONEY(parseFloat(value)));
    let R = this.convert_Calculator(this.convert_REWARD_MONEY(parseFloat(value)));

    TREASURY_MONEY_PIPE.setValue(this.formatMoney(T.replace(/\,/g, "")),{ emitEvent: false });
    BRIBE_PIPE.setValue(this.formatMoney(B.replace(/\,/g, "")),{ emitEvent: false });
    REWARD_PIPE.setValue(this.formatMoney(R.replace(/\,/g, "")),{ emitEvent: false });

    // console.log("/////////////////////////////////////////////////////////////////////////////");

    console.log("FINE :",control.at(i).get("FINE").value);
    console.log("BRIBE :",control.at(i).get("BRIBE").value);
    console.log("REWARD :",control.at(i).get("REWARD").value);
    console.log("TREASURY_MONEY :",control.at(i).get("TREASURY_MONEY").value);
  }

  setCal_T(e,i) {
    const value = `${e.TREASURY_MONEY_PIPE}`.replace(/\,/g, "");
    const control = this.form_Collapse1.get("form_Table") as FormArray;
    const TREASURY_MONEY_PIPE = control.at(i).get("TREASURY_MONEY_PIPE");
    const TREASURY_MONEY = control.at(i).get("TREASURY_MONEY");
    TREASURY_MONEY_PIPE.setValue(this.formatMoney(value.replace(/\,/g, "")),{ emitEvent: false });
    TREASURY_MONEY.setValue(parseFloat(value));
    console.log("TREASURY_MONEY :",control.at(i).get("TREASURY_MONEY").value);
  }

  setCal_R(e, i) {
    const value = `${e.REWARD_PIPE}`.replace(/\,/g, "");
    const control = this.form_Collapse1.get("form_Table") as FormArray;
    const REWARD_PIPE = control.at(i).get("REWARD_PIPE");
    const REWARD = control.at(i).get("REWARD");
    REWARD_PIPE.setValue(this.formatMoney(value.replace(/\,/g, "")),{ emitEvent: false });
    REWARD.setValue(parseFloat(value));
    console.log("REWARD :",control.at(i).get("REWARD").value);
  }

  setCal_B(e, i) {
    const value = `${e.BRIBE_PIPE}`.replace(/\,/g, "");
    const control = this.form_Collapse1.get("form_Table") as FormArray;
    const BRIBE_PIPE = control.at(i).get("BRIBE_PIPE");
    const BRIBE = control.at(i).get("BRIBE");
    BRIBE_PIPE.setValue(this.formatMoney(value.replace(/\,/g, "")),{ emitEvent: false });
    BRIBE.setValue(parseFloat(value));
    console.log("BRIBE :",control.at(i).get("BRIBE").value);
  }9

  formatMoney(value) {
    const temp = `${value}`.replace(/\,/g, "");
    return this.currencyPipe.transform(temp).replace("$", "");
  }

  convert_Calculator(m) {
    const temp = `${m}`.replace(/\,/g, "");
    return this.currencyPipe.transform(temp).replace("$", "");
  }

  total_OLD_QTY(): number {
    var total = 0;    
    const control = this.form_Collapse1.get("form_Table") as FormArray;

    for(var i=0 ; i< control.getRawValue().length;i++){
      total += control.at(i).get("OLD_QTY").value;
    }
    return total;
  }
  
  total_QTY_CASE(): number {
    var total = 0;    
    const control = this.form_Collapse1.get("form_Table") as FormArray;
    for(var i=0 ; i< control.getRawValue().length;i++){
      total += control.at(i).get("QTY_CASE").value;
    }
    return total;
  }

  total_OLD_FINE(): number {
    var total = 0;    
    const control = this.form_Collapse1.get("form_Table") as FormArray;
    for(var i=0 ; i< control.getRawValue().length;i++){
      total += control.at(i).get("OLD_FINE").value;
    }
    return total;
  }

  total_FINE(): number {
    var total = 0;    
    const control = this.form_Collapse1.get("form_Table") as FormArray;
    for(var i=0 ; i< control.getRawValue().length;i++){
      total += control.at(i).get("FINE").value;
    }
    return total;
  }

  total_OLD_TREASURY(): number {
    var total = 0;    
    const control = this.form_Collapse1.get("form_Table") as FormArray;
    for(var i=0 ; i< control.getRawValue().length;i++){
      total += control.at(i).get("OLD_TREASURY").value;
    }
    return total;
  }

  total_TREASURY_MONEY(): number {
    var total = 0;    
    const control = this.form_Collapse1.get("form_Table") as FormArray;
    for(var i=0 ; i< control.getRawValue().length;i++){
      total += control.at(i).get("TREASURY_MONEY").value;
    }
    return total;
  }

  total_BRIBE(): number {
    var total = 0;    
    const control = this.form_Collapse1.get("form_Table") as FormArray;
    for(var i=0 ; i< control.getRawValue().length;i++){
      total += control.at(i).get("BRIBE").value;
    }
    return total;
  }

  total_REWARD(): number {
    var total = 0;    
    const control = this.form_Collapse1.get("form_Table") as FormArray;
    for(var i=0 ; i< control.getRawValue().length;i++){
      total += control.at(i).get("REWARD").value;
    }
    return total;
  }

  convert_money(m): number {
    var money = m;
    var BRIBE_MONEY = money * 0.2;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money * 0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money * 0.6;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY + REWARD_MONEY) + TREASURY_MONEY;
    var total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
    var cal = 0;

    if (total > money) {
      cal = total - money;
      var a1 = total_BRIBE_MONEY - cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return money;
    } else if (total < money) {
      cal = money - total;
      var a1 = total_REWARD_MONEY + cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return money;
    } else {
      return money;
    }
  }

  cal_FINE(v,i) {
    let control = this.form_Collapse1.get("form_Table") as FormArray;
    let TREASURY_MONEY = control.at(i).get('TREASURY_MONEY');
    let BRIBE = control.at(i).get('BRIBE');
    let REWARD = control.at(i).get('REWARD');
    let cal = v.FINE;

    if(v.FINE == 0){
      TREASURY_MONEY.setValue(0);
      BRIBE.setValue(0);
      REWARD.setValue(0);
    }else{
      TREASURY_MONEY.setValue(this.convert_TREASURY_MONEY(cal));
      BRIBE.setValue(this.convert_BRIBE_MONEY(cal));
      REWARD.setValue(this.convert_REWARD_MONEY(cal));
    }
  }

  convert_BRIBE_MONEY(m): number {
    var money = m;
    var BRIBE_MONEY = money * 0.2;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money * 0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money * 0.6;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY + REWARD_MONEY) + TREASURY_MONEY;
    var total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
    var cal = 0;

    if (total > money) {
      cal = total - money;
      var a1 = total_BRIBE_MONEY - cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_BRIBE_MONEY;
    } else if (total < money) {
      cal = money - total;
      var a1 = total_REWARD_MONEY + cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_BRIBE_MONEY;
    } else {
      return total_BRIBE_MONEY;
    }
  }

  convert_REWARD_MONEY(m): number {
    var money = m;
    var BRIBE_MONEY = money * 0.2;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money * 0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money * 0.6;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY + REWARD_MONEY) + TREASURY_MONEY;
    var total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
    var cal = 0;

    if (total > money) {
      cal = total - money;
      var a1 = total_BRIBE_MONEY - cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_REWARD_MONEY;
    } else if (total < money) {
      cal = money - total;
      var a1 = total_REWARD_MONEY + cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_REWARD_MONEY;
    } else {
      return total_REWARD_MONEY;
    }
  }

  convert_TREASURY_MONEY(m): number {
    var money = m;
    var BRIBE_MONEY = money * 0.2;
    var total_BRIBE_MONEY = parseFloat(BRIBE_MONEY.toFixed(2));
    var REWARD_MONEY = money * 0.2;
    var total_REWARD_MONEY = parseFloat(REWARD_MONEY.toFixed(2));
    var TREASURY_MONEY = money * 0.6;
    var total_TREASURY_MONEY = parseFloat(TREASURY_MONEY.toFixed(2));
    var sum = (BRIBE_MONEY + REWARD_MONEY) + TREASURY_MONEY;
    var total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
    var cal = 0;

    if (total > money) {
      cal = total - money;
      var a1 = total_BRIBE_MONEY - cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_BRIBE_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_TREASURY_MONEY;
    } else if (total < money) {
      cal = money - total;
      var a1 = total_REWARD_MONEY + cal;
      var a2 = parseFloat(a1.toFixed(2));
      total_REWARD_MONEY = a2;
      total = (total_BRIBE_MONEY + total_REWARD_MONEY) + total_TREASURY_MONEY;
      return total_TREASURY_MONEY;
    } else {
      return total_TREASURY_MONEY;
    }
  }

  ngOnDestroy() {}

  ///////////////////////////////////////////////////////////////////////// toggleCollapse //////////////////////////////////////////////////////////////////////////////////////////
  collapse1 = new BehaviorSubject<Boolean>(true);
  collapse2 = new BehaviorSubject<Boolean>(true);
  toggleCollapse(event: BehaviorSubject<Boolean>): void {if (event.getValue()) {event.next(false);} else {event.next(true);}}


 ///////////////////////////////////////////////////////////////////////// Save Function//////////////////////////////////////////////////////////////////////////////////////////
 
 clickSave(){
  console.log("form_Collapse1 : ",this.form_Collapse1.getRawValue());
 }

 clickCancel(){
  location.reload();
 }

}
