import { Component,ChangeDetectionStrategy, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { invalid } from 'moment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable, of } from 'rxjs';
import { ReductionService } from '../reduction.service';
import { PreloaderService } from 'app/shared/preloader/preloader.component';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { appConfig } from '../../../app.config';

  @Component({
    selector: 'app-input-dialog',
    templateUrl: './ILG60_O_08_00_02_01.html',
    styleUrls: ['./ILG60_O_08_00_02_01.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class ILG60_O_08_00_02_01 {
    constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private currencyPipe : CurrencyPipe,
    private reductionService : ReductionService,
    private preloader: PreloaderService,
    private http: HttpClient,
    ) { }
    controlForm: FormGroup;
    item : any;
    isReq_NEW_RECEIPT_BOOK_NO = false;
    isReq_NEW_RECEIPT_NO = false;
    isReq_REASON = false;
    COMPARE_ID : any;
    COMPARE_DETAIL_ID: any;
    showEditField : any;
    SetDetail : any;

    get PaymentDetail(): FormArray {
      return this.controlForm.get('PAYMENT_DETAIL') as FormArray;
    }

    async ngOnInit() {
      if (this.item.IS_UP == 0){
        this.controlForm = this.fb.group({
          NAME : new FormControl(this.item.NAME),
          PAYMENT_FINE : new FormControl(this.item.PAYMENT_FINE),
          OLD_PAYMENT_FINE : new FormControl(this.item.OLD_PAYMENT_FINE),
          DIFFERENCE_PAYMENT_FINE : new FormControl(this.item.DIFFERENCE_PAYMENT_FINE),
          // RECEIPT_BOOK_NO : new FormControl(this.item.RECEIPT_BOOK_NO),
          // RECEIPT_NO : new FormControl(this.item.RECEIPT_NO),
          NEW_RECEIPT_BOOK_NO : new FormControl(''),
          NEW_RECEIPT_NO : new FormControl(''),
          RECEIPT_TYPE : new FormControl(0),
          REASON : new FormControl(''),
          IS_UP : new FormControl(1),
          PAYMENT_DETAIL: this.fb.array([this.setPayment()]),
          setStaff: this.fb.array([this.set_CONTRIBUTOR_ID86()]),
        })
      }else{
        if (this.item.setStaff.length == 0){
          this.controlForm = this.fb.group({
            NAME : new FormControl(this.item.NAME),
            PAYMENT_FINE : new FormControl(this.item.PAYMENT_FINE),
            OLD_PAYMENT_FINE : new FormControl(this.item.OLD_PAYMENT_FINE),
            DIFFERENCE_PAYMENT_FINE : new FormControl(this.item.DIFFERENCE_PAYMENT_FINE),
            // RECEIPT_BOOK_NO : new FormControl(this.item.RECEIPT_BOOK_NO),
            // RECEIPT_NO : new FormControl(this.item.RECEIPT_NO),
            NEW_RECEIPT_BOOK_NO : new FormControl(this.item.NEW_RECEIPT_BOOK_NO),
            NEW_RECEIPT_NO : new FormControl(this.item.NEW_RECEIPT_NO),
            RECEIPT_TYPE : new FormControl(this.item.RECEIPT_TYPE),
            REASON : new FormControl(this.item.REASON),
            IS_UP : new FormControl(this.item.IS_UP),
            PAYMENT_DETAIL: this.fb.array([]),
            setStaff: this.fb.array([this.set_CONTRIBUTOR_ID86()]),
          });
          this.RECEIPT_NO = this.item.NEW_RECEIPT_NO;
        }else{
          this.controlForm = this.fb.group({
            NAME : new FormControl(this.item.NAME),
            PAYMENT_FINE : new FormControl(this.item.PAYMENT_FINE),
            OLD_PAYMENT_FINE : new FormControl(this.item.OLD_PAYMENT_FINE),
            DIFFERENCE_PAYMENT_FINE : new FormControl(this.item.DIFFERENCE_PAYMENT_FINE),
            // RECEIPT_BOOK_NO : new FormControl(this.item.RECEIPT_BOOK_NO),
            // RECEIPT_NO : new FormControl(this.item.RECEIPT_NO),
            NEW_RECEIPT_BOOK_NO : new FormControl(this.item.NEW_RECEIPT_BOOK_NO),
            NEW_RECEIPT_NO : new FormControl(this.item.NEW_RECEIPT_NO),
            RECEIPT_TYPE : new FormControl(this.item.RECEIPT_TYPE),
            REASON : new FormControl(this.item.REASON),
            IS_UP : new FormControl(this.item.IS_UP),
            PAYMENT_DETAIL: this.fb.array([]),
            setStaff: this.fb.array([]),
          });
          this.RECEIPT_NO = this.item.NEW_RECEIPT_NO;
          this.item.setStaff.map(m=>{this.setStaff.push(this.fb.group(m));});
        }
      }
      this.setPayments(this.item.PAYMENT_DETAIL);
    }

    
  conVNUMFIVE(e){
    if (e == ''){this.controlForm.get('NEW_RECEIPT_BOOK_NO').setValue(`${"00001"}`);}
    else if (e == "0"){this.controlForm.get('NEW_RECEIPT_BOOK_NO').setValue(`${"00001"}`);}
    else if (e == "00"){this.controlForm.get('NEW_RECEIPT_BOOK_NO').setValue(`${"00001"}`);}
    else if (e == "000"){this.controlForm.get('NEW_RECEIPT_BOOK_NO').setValue(`${"00001"}`);}
    else if (e == "0000"){this.controlForm.get('NEW_RECEIPT_BOOK_NO').setValue(`${"00001"}`);}
    else if (e == "00000"){this.controlForm.get('NEW_RECEIPT_BOOK_NO').setValue(`${"00001"}`);}
    else if (e.length == 5){this.controlForm.get('NEW_RECEIPT_BOOK_NO').setValue(`${e}`);}
    else if (e.length == 4){this.controlForm.get('NEW_RECEIPT_BOOK_NO').setValue(`${"0"}${e}`);}
    else if (e.length == 3){this.controlForm.get('NEW_RECEIPT_BOOK_NO').setValue(`${"00"}${e}`);}
    else if (e.length == 2){this.controlForm.get('NEW_RECEIPT_BOOK_NO').setValue(`${"000"}${e}`);}
    else if (e.length == 1){this.controlForm.get('NEW_RECEIPT_BOOK_NO').setValue(`${"0000"}${e}`);}
    else if (e.length == 0){this.controlForm.get('NEW_RECEIPT_BOOK_NO').setValue(`${"00001"}`);}
  }

  conVNUMTWO(e){
    if (e == ''){this.controlForm.get('NEW_RECEIPT_NO').setValue(`${"01"}`);}
    else if (e == "0"){this.controlForm.get('NEW_RECEIPT_NO').setValue(`${"01"}`);}
    else if (e == "00"){this.controlForm.get('NEW_RECEIPT_NO').setValue(`${"01"}`);}
    else if (e.length == 2){this.controlForm.get('NEW_RECEIPT_NO').setValue(`${e}`);}
    else if (e.length == 1){this.controlForm.get('NEW_RECEIPT_NO').setValue(`${"0"}${e}`);}
    else if (e.length == 0){this.controlForm.get('NEW_RECEIPT_NO').setValue(`${"01"}`);}
  }

    check(e){
      if(e == '0'){
        console.log("MANUAL")
        this.controlForm.get("RECEIPT_TYPE").setValue(0);
        this.controlForm.get("NEW_RECEIPT_BOOK_NO").setValue('');
        this.controlForm.get("NEW_RECEIPT_NO").setValue('');
        this.controlForm.get("REASON").setValue('');
        this.isReq_NEW_RECEIPT_BOOK_NO = false;
        this.isReq_NEW_RECEIPT_NO = false;
        this.isReq_REASON = false;
      }else{
        console.log("AUTO")
        this.controlForm.get("RECEIPT_TYPE").setValue(1);
        this.controlForm.get("NEW_RECEIPT_BOOK_NO").setValue('');
        this.controlForm.get("NEW_RECEIPT_NO").setValue('Auto Generate');
        this.controlForm.get("REASON").setValue('');
        this.isReq_NEW_RECEIPT_BOOK_NO = false;
        this.isReq_NEW_RECEIPT_NO = false;
        this.isReq_REASON = false;
      }

    }

    setText: any;
    RECEIPT_NO : any;
    async signature() {
      console.log("ลงลายมือชื่อ");
      const param = {
        "receipt_no": this.RECEIPT_NO,
        "SystemId": "systemid",
        "UserName": "my_username",
        "Password": "bbbbb",
        "IpAddress": "10.11.1.10",
        "Operation": "1",
        "RequestData":
        {
          // "UserName": "wannapa_j",
          // "OffCode": "100300"
          "UserName": localStorage.getItem("UserName"),
          "OffCode": localStorage.getItem("officeCode")
        }
      }
      this.preloader.setShowPreloader(true);
      await this.ReportForm06_002(param).then(x => {
        const file = new Blob([x], { type: 'application/pdf' });
        const params = {
          pdfFile: file,
          textFile: "undefined",
          saveFile: "true",
          docName: this.RECEIPT_NO,
          docTitle: "xcs",
          docAccount: "LAW_RECEIPT",
          docType: "",
          pin: "Suthee#1",
          id: localStorage.getItem("UserName"),
          // id: "wannapa_j",
          system: "",
          // officeCode: "100300",
          officeCode: localStorage.getItem("officeCode"),
          fileType: "ใบเสร็จรับเงินคดี",
          sendMail: "false",
          signDataList: [
            {
              page: "1",
              x: "75",
              y: "100",
              w: "100",
              h: "20",
              isCorporate: "false"
            }
          ]
        }
        this.reductionService.MultiplePage("MultiplePage", [params]).then(async list => {
          console.log("listtt : ",await list)
          const linkSource = await list.data.dataFile;
          const did = await list.data.id;

          if (await list.status == "SUCCESS"){
          var objbuilder = '';
          objbuilder += ('<object width="100%" height="100%" data="data:application/pdf;base64,');
          objbuilder += (linkSource);
          objbuilder += ('" type="application/pdf" class="internal">');
          objbuilder += ('<embed src="data:application/pdf;base64,');
          objbuilder += (linkSource);
          objbuilder += ('" type="application/pdf"  />');
          objbuilder += ('</object>');
          // this.imageSource = objbuilder;
          var win = window.open("#", "_blank");
          var title = "ใบเสร็จรับชำระค่าปรับ.pdf";
          win.document.write('<html><title>' + title + '</title><body style="margin-top: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">');
          win.document.write(objbuilder);
          win.document.write('</body></html>');
          
          this.preloader.setShowPreloader(false);
            swal({
              type: 'success',
              text: "ลงลายเซ็นดิจิตอลในเอกสารสำเร็จ",
              confirmButtonText: 'ตกลง',
              buttonsStyling: true,
            }).then(e=>{
              this.preloader.setShowPreloader(true);
              this.set_update_CompareMapping(this.SetDetail,did);
            })
            this.setText = false;
            this.activeModal.close(this.setText);
          }else{
            swal({
              type: 'warning',
              text: "ลงลายเซ็นดิจิตอลในเอกสารไม่สำเร็จ",
              confirmButtonText: 'ตกลง',
              buttonsStyling: true,
            })
          }
          this.preloader.setShowPreloader(false);
        },(error) => {
          console.log("err : ",error)
          swal({
            type: 'warning',
            text: "ลงลายเซ็นดิจิตอลในเอกสารไม่สำเร็จ",
            confirmButtonText: 'ตกลง',
            buttonsStyling: true,
          })
          this.preloader.setShowPreloader(false);
        }
        )
      }).catch(e=>{
        swal({
          type: 'warning',
          text: "ลงลายเซ็นดิจิตอลในเอกสารไม่สำเร็จ",
          confirmButtonText: 'ตกลง',
          buttonsStyling: true,
        })
        this.preloader.setShowPreloader(false);
      });
    }
    
  set_update_CompareMapping(value,did){
      var CompareDetail = {
        COMPARE_DETAIL_ID: value.COMPARE_DETAIL_ID,
        COMPARE_MAPPING_ID: value.COMPARE_MAPPING_ID,
        RECEIPT_OFFICE_ID: value.RECEIPT_OFFICE_ID || '',
        APPROVE_OFFICE_ID: value.APPROVE_OFFICE_ID || '',
        MISTREAT_NO: value.MISTREAT_NO || '',
        OLD_PAYMENT_FINE: parseFloat(value.OLD_PAYMENT_FINE) || '',
        PAYMENT_FINE: parseFloat(value.PAYMENT_FINE) || '',
        DIFFERENCE_PAYMENT_FINE: parseFloat(value.DIFFERENCE_PAYMENT_FINE) || '',
        TREASURY_MONEY: parseFloat(value.TREASURY_MONEY) || '',
        BRIBE_MONEY: parseFloat(value.BRIBE_MONEY) || '',
        REWARD_MONEY: parseFloat(value.REWARD_MONEY) || '',
        PAYMENT_FINE_DUE_DATE: value.PAYMENT_FINE_DUE_DATE || '',
        PAYMENT_VAT_DUE_DATE: value.PAYMENT_VAT_DUE_DATE || '',
        INSURANCE: value.INSURANCE || '',
        GAURANTEE: value.GAURANTEE || '',
        PAYMENT_DATE: value.PAYMENT_DATE || '',
        RECEIPT_TYPE: value.RECEIPT_TYPE || '',
        RECEIPT_BOOK_NO: value.RECEIPT_BOOK_NO || '',
        RECEIPT_NO: value.RECEIPT_NO || '',
        RECEIPT_OFFICE_CODE: value.RECEIPT_OFFICE_CODE || '',
        RECEIPT_OFFICE_NAME: value.RECEIPT_OFFICE_NAME || '',
        APPROVE_OFFICE_CODE: value.APPROVE_OFFICE_CODE || '',
        APPROVE_OFFICE_NAME: value.APPROVE_OFFICE_NAME || '',
        APPROVE_DATE: value.APPROVE_DATE || '',
        APPROVE_TYPE: value.APPROVE_TYPE || '',
        COMMAND_NO: value.COMMAND_NO || '',
        COMMAND_DATE: value.COMMAND_DATE || '',
        REMARK_NOT_AGREE: value.REMARK_NOT_AGREE || '',
        REMARK_NOT_APPROVE: value.REMARK_NOT_APPROVE || '',
        FACT: value.FACT || '',
        COMPARE_REASON: value.COMPARE_REASON || '',
        ADJUST_REASON: value.ADJUST_REASON || '',
        COMPARE_TYPE: value.COMPARE_TYPE || '',
        IS_REQUEST: value.IS_REQUEST,
        IS_TEMP_RELEASE: value.IS_TEMP_RELEASE,
        IS_INSURANCE: value.IS_INSURANCE,
        IS_GAURANTEE: value.IS_GAURANTEE,
        IS_PAYMENT: value.IS_PAYMENT,
        IS_REVENUE: value.IS_REVENUE,
        IS_AGREE: value.IS_AGREE,
        IS_APPROVE: value.IS_APPROVE,
        IS_AUTHORITY: value.IS_AUTHORITY,
        DID : did,
        IS_ACTIVE: value.IS_ACTIVE,
        CompareStaff : [],
        CompareDetailPayment : [],
        CompareDetailFine : [],
        ComparePayment: [],
      }
      this.set_update_CompareDetail(CompareDetail,did);
  }
  
  set_update_CompareDetail(list,did){
    this.reductionService.CompareDetailupdByCon("CompareDetailupdByCon",list).then(res=>{
      this.preloader.setShowPreloader(false);
      console.log("CompareDetailupdByCon : ",res)
      if(res.IsSuccess == "True"){
        location.reload();
      }else{
        swal({
          type: 'warning',
          text: 'ไม่สามารถอัพเดทข้อมูล DID : '+did+'<br />กรุณาติดต่อแอดมิน',
          confirmButtonText: 'ตกลง',
          buttonsStyling: true,
        }).then(e=>{
          location.reload();
        })
      }
    })
  }

    private httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    async ReportForm06_002(params: any) {
      console.log('1')
      const url = `${appConfig.apiReport}/ILG60_00_06_002.aspx`;
      return this.http.post(url, params, { ...this.httpOptions, responseType: "blob" }).map(res => res).toPromise()
    }

    get setStaff(): FormArray {return this.controlForm.get('setStaff') as FormArray;}
    ///////////////////////////////////////////////////////////////////////// my cal //////////////////////////////////////////////////////////////////////////////////////////
    transformTotal(e,i,j) {
      const value = `${e.PAYMENT_FINE_PIPE}`.replace(/\,/g, "");
      console.log(value," : ",i)
      const payment = this.controlForm.get("PAYMENT_DETAIL") as FormArray;
      const PAYMENT_FINE = payment.at(i).get("PAYMENT_FINE");
      const FINE_PIPE = this.controlForm.get("PAYMENT_DETAIL") as FormArray;
      const PAYMENT_FINE_PIPE = FINE_PIPE.at(i).get("PAYMENT_FINE_PIPE");
      PAYMENT_FINE_PIPE.setValue(
        this.formatMoney(value.replace(/\,/g, "")), 
      {emitEvent: false})

      PAYMENT_FINE.setValue(
        this.convert_money(parseFloat(value))
      )

    }

    formatMoney(value) {
      console.log("value",value)
      const temp = `${value}`.replace(/\,/g, "");
      return this.currencyPipe.transform(temp).replace("$", "");
    }

    convert_money(m) : number{
      var money = m;
        return money;
    }

    set_payment() : number{
      var total = 0;
      const payment = this.controlForm.get("PAYMENT_DETAIL") as FormArray;
      
      for (var i=0;i<payment.value.length;i++){
        total += parseFloat(payment.at(i).get("PAYMENT_FINE").value);
      }
  
      return total;
    }

    private setPayment(): FormGroup {
        const control = {
          PAYMENT_TYPE : new FormControl(1),
          REFFERENCE_NO : new FormControl(""),
          PAYMENT_FINE : new FormControl(this.item.DIFFERENCE_PAYMENT_FINE,Validators.required),
          PAYMENT_FINE_PIPE : new FormControl(this.convert_Calculator(this.item.DIFFERENCE_PAYMENT_FINE),Validators.required),
          PAYMENT_BANK : new FormControl("",Validators.required),
          PAYMENT_CODE : new FormControl("",Validators.required),
      }
      return this.fb.group(control)
    }

    private setPayments(e) {
      let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
      for(var i=0;i<e.length;i++){
      control.push(this.fb.group({
          PAYMENT_TYPE : new FormControl(e[i].PAYMENT_TYPE),
          REFFERENCE_NO : new FormControl(e[i].REFFERENCE_NO),
          PAYMENT_FINE : new FormControl(e[i].PAYMENT_FINE,Validators.required),
          PAYMENT_FINE_PIPE : new FormControl(e[i].PAYMENT_FINE_PIPE,Validators.required),
          PAYMENT_BANK : new FormControl(e[i].PAYMENT_BANK,Validators.required),
          PAYMENT_CODE : new FormControl(e[i].PAYMENT_CODE,Validators.required),
      }));
      }
    }

    addPayment() {
      let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
      var num = 0;
      control.push(
        this.fb.group({
          PAYMENT_TYPE : new FormControl(1),
          REFFERENCE_NO : new FormControl(""),
          PAYMENT_FINE : new FormControl(num,Validators.required),
          PAYMENT_FINE_PIPE : new FormControl(this.convert_Calculator(num),Validators.required),
          PAYMENT_BANK : new FormControl(""),
          PAYMENT_CODE : new FormControl(""),
        })
      )
    }

    set_PAYMENT_TYPE(value,i){
      if (this.PaymentDetail.at(i).get("PAYMENT_TYPE").value == 1){
      this.PaymentDetail.at(i).get("REFFERENCE_NO").setValue('');
      this.PaymentDetail.at(i).get("PAYMENT_BANK").setValue('');
      this.PaymentDetail.at(i).get("PAYMENT_CODE").setValue('');
      }
    }

    convert_Calculator(m){
      console.log(m)
      const temp = `${m}`.replace(/\,/g, "");
      return this.currencyPipe.transform(temp).replace("$", "");
    }
  
    deletePayment(index) {
      if (index == 0){
        this._swal('ไม่สามารถลบข้อมูลได้');
        console.log("this.PaymentDetail.value.length",this.PaymentDetail.value.length)
      }
      else{
      let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
      control.removeAt(index)}
    }
    
    _swal(e){
      swal({
        type: 'warning',
        text: e,
        confirmButtonText: 'ตกลง',
        buttonsStyling: true,
      })
    }
    setIsPeq(e){
      switch (e){
        case 'isReq_REASON' :
          if(this.controlForm.get("REASON").value == ""){this.isReq_REASON = true;} else{this.isReq_REASON = false;}
        break;
        case 'isReq_NEW_RECEIPT_BOOK_NO' :
          if(this.controlForm.get("NEW_RECEIPT_BOOK_NO").value == ""){this.isReq_NEW_RECEIPT_BOOK_NO = true;} else{this.isReq_NEW_RECEIPT_BOOK_NO = false;}
        break;
        case 'isReq_NEW_RECEIPT_NO' :
          if(this.controlForm.get("NEW_RECEIPT_NO").value == ""){this.isReq_NEW_RECEIPT_NO = true;} else{this.isReq_NEW_RECEIPT_NO = false;}
        break;
      }
    }
    onSubmit(){
      if(this.controlForm.get("RECEIPT_TYPE").value == 1 || this.controlForm.get("RECEIPT_TYPE").value == '1'){
        if (this.controlForm.get("REASON").value == ""){
          this.isReq_NEW_RECEIPT_BOOK_NO = false;
          this.isReq_NEW_RECEIPT_NO = false;
          this.isReq_REASON = true;
          this._swal('กรุณาระบุข้อมูล "เหตุผลในการปรับ"');
        }else if(this.controlForm.get("DIFFERENCE_PAYMENT_FINE").value !== this.set_payment()){
              this._swal("จำนวนเงินที่ชำระเกินจากค่าปรับ");
        }else{
                this.activeModal.close(this.controlForm.value);
        }
      }else if (this.controlForm.get("RECEIPT_TYPE").value == 0 || this.controlForm.get("RECEIPT_TYPE").value == '0'){
        if (this.controlForm.get("NEW_RECEIPT_BOOK_NO").value == ""){
          this.isReq_NEW_RECEIPT_BOOK_NO = true;
          this.isReq_NEW_RECEIPT_NO = false;
          this.isReq_REASON = false;
          this._swal('กรุณาระบุข้อมูล "ใบเสร็จเล่มที่"');
        }else if (this.controlForm.get("NEW_RECEIPT_NO").value == ""){
          this.isReq_NEW_RECEIPT_BOOK_NO = false;
          this.isReq_NEW_RECEIPT_NO = true;
          this.isReq_REASON = false;
          this._swal('กรุณาระบุข้อมูล "ใบเสร็จเลขที่"');
        }else if (this.controlForm.get("REASON").value == ""){
          this.isReq_NEW_RECEIPT_BOOK_NO = false;
          this.isReq_NEW_RECEIPT_NO = false;
          this.isReq_REASON = true;
          this._swal('กรุณาระบุข้อมูล "เหตุผลในการปรับ"');
        }else if(this.controlForm.get("DIFFERENCE_PAYMENT_FINE").value !== this.set_payment()){
              this._swal("จำนวนเงินที่ชำระเกินจากค่าปรับ");
        }else{
                this.activeModal.close(this.controlForm.value);
        }
      }
      
    }

    dismiss() {

        swal({
            type: 'warning',
            text: "ยืนยันการทำรายการหรือไม่" + ' ?',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            buttonsStyling: true,
      
          }).then((result) => {
            this.activeModal.close('dismiss');
          });
    }

  /////////////////////////////////////////////////////////////////////////// Bank //////////////////////////////////////////////////////////////////////////////////////////
  BANKING : any;
  isReq_Bank = new BehaviorSubject<boolean>(false);
  serachBank = (text3$: Observable<string>) =>
        text3$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.BANKING
                    .filter(v =>
                        (`${v.BANK_NAME || ''} ${v.BANK_CODE || ''}`.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    ).slice(0, 10));

  formatterBank = (x: { BANK_NAME: string }) => x.BANK_NAME

  selectItemBank(e,i) {
    console.log(e.item)
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    control.at(i).get("PAYMENT_BANK").setValue(e.item.BANK_NAME);
    control.at(i).get("PAYMENT_CODE").setValue(e.item.BANK_CODE);
  }                

  blurSelectItemBank(input,i) {
    let val = input.value
    if (!val) {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    control.at(i).get("PAYMENT_BANK").setValue("");
    control.at(i).get("PAYMENT_CODE").setValue("");
    }
  }

  ////////////////////////////////////////////////////////////////////////// SEARCH STAFF //////////////////////////////////////////////////////////////////////////////////////////
  searching = false;
  searchFailed = false;
  public searchStaff = (text2$: Observable<string>) =>
    text2$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.reductionService.MasStaffgetByCon_Search({ TEXT_SEARCH: term })
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          })
      )
      .do(() => this.searching = false);

  formatterStaff = (x: { TITLE_SHORT_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
      `${x.TITLE_SHORT_NAME_TH || ''}${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`

  selectItemStaff(e, i) {
    this.setStaff.at(i).patchValue({
      COMPARE_ID : "",
      COMPARE_DETAIL_ID: "",
      CONTRIBUTOR_ID: 86,
      BIRTH_DATE: e.item.BIRTH_DATE,
      FIRST_NAME: e.item.FIRST_NAME,
      ID_CARD: e.item.ID_CARD,
      IS_ACTIVE: 1,
      LAST_NAME: e.item.LAST_NAME,
      FULL_NAME: `${e.item.TITLE_SHORT_NAME_TH || ' '}${e.item.FIRST_NAME || ''} ${e.item.LAST_NAME || ''}`,
      MANAGEMENT_DEPT_CODE: e.item.MANAGEMENT_DEPT_CODE,
      MANAGEMENT_DEPT_LEVEL: e.item.MANAGEMENT_DEPT_LEVEL,
      MANAGEMENT_DEPT_NAME: e.item.MANAGEMENT_DEPT_NAME,
      MANAGEMENT_OFFICE_CODE: e.item.MANAGEMENT_OFFICE_CODE,
      MANAGEMENT_OFFICE_NAME: e.item.MANAGEMENT_OFFICE_NAME,
      MANAGEMENT_OFFICE_SHORT_NAME: e.item.MANAGEMENT_OFFICE_SHORT_NAME,
      MANAGEMENT_POS_CODE: e.item.MANAGEMENT_POS_CODE,
      MANAGEMENT_POS_LEVEL: e.item.MANAGEMENT_POS_LEVEL,
      MANAGEMENT_POS_LEVEL_NAME: e.item.MANAGEMENT_POS_LEVEL_NAME,
      MANAGEMENT_POS_NAME: e.item.MANAGEMENT_POS_NAME,
      MANAGEMENT_UNDER_DEPT_CODE: e.item.MANAGEMENT_UNDER_DEPT_CODE,
      MANAGEMENT_UNDER_DEPT_LEVEL: e.item.MANAGEMENT_UNDER_DEPT_LEVEL,
      MANAGEMENT_UNDER_DEPT_NAME: e.item.MANAGEMENT_UNDER_DEPT_NAME,
      MANAGEMENT_WORK_DEPT_CODE: e.item.MANAGEMENT_WORK_DEPT_CODE,
      MANAGEMENT_WORK_DEPT_LEVEL: e.item.MANAGEMENT_WORK_DEPT_LEVEL,
      MANAGEMENT_WORK_DEPT_NAME: e.item.MANAGEMENT_WORK_DEPT_NAME,
      OPERATION_DEPT_CODE: e.item.OPERATION_DEPT_CODE,
      OPERATION_DEPT_LEVEL: e.item.OPERATION_DEPT_LEVEL,
      OPERATION_DEPT_NAME: e.item.OPERATION_DEPT_NAME,
      OPERATION_OFFICE_CODE: e.item.OPERATION_OFFICE_CODE,
      OPERATION_OFFICE_NAME: e.item.OPERATION_OFFICE_NAME,
      OPERATION_OFFICE_SHORT_NAME: e.item.OPERATION_OFFICE_SHORT_NAME,
      OPERATION_POS_CODE: e.item.OPERATION_POS_CODE,
      OPERATION_POS_LEVEL_NAME: e.item.OPERATION_POS_LEVEL_NAME,
      OPERATION_UNDER_DEPT_CODE: e.item.OPERATION_UNDER_DEPT_CODE,
      OPERATION_UNDER_DEPT_LEVEL: e.item.OPERATION_UNDER_DEPT_LEVEL,
      OPERATION_UNDER_DEPT_NAME: e.item.OPERATION_UNDER_DEPT_NAME,
      OPERATION_WORK_DEPT_CODE: e.item.OPERATION_WORK_DEPT_CODE,
      OPERATION_WORK_DEPT_LEVEL: e.item.OPERATION_WORK_DEPT_LEVEL,
      OPERATION_WORK_DEPT_NAME: e.item.OPERATION_WORK_DEPT_NAME,
      OPREATION_POS_LEVEL: e.item.OPREATION_POS_LEVEL,
      OPREATION_POS_NAME: e.item.OPREATION_POS_NAME,
      REMARK: e.item.REMARK,
      REPRESENT_DEPT_CODE: e.item.REPRESENT_DEPT_CODE,
      REPRESENT_DEPT_LEVEL: e.item.REPRESENT_DEPT_LEVEL,
      REPRESENT_DEPT_NAME: e.item.REPRESENT_DEPT_NAME,
      REPRESENT_OFFICE_CODE: e.item.REPRESENT_OFFICE_CODE,
      REPRESENT_OFFICE_NAME: e.item.REPRESENT_OFFICE_NAME,
      REPRESENT_OFFICE_SHORT_NAME: e.item.REPRESENT_OFFICE_SHORT_NAME,
      REPRESENT_POS_CODE: e.item.REPRESENT_POS_CODE,
      REPRESENT_POS_LEVEL: e.item.REPRESENT_POS_LEVEL,
      REPRESENT_POS_LEVEL_NAME: e.item.REPRESENT_POS_LEVEL_NAME,
      REPRESENT_POS_NAME: e.item.REPRESENT_POS_NAME,
      REPRESENT_UNDER_DEPT_CODE: e.item.REPRESENT_UNDER_DEPT_CODE,
      REPRESENT_UNDER_DEPT_LEVEL: e.item.REPRESENT_UNDER_DEPT_LEVEL,
      REPRESENT_UNDER_DEPT_NAME: e.item.REPRESENT_UNDER_DEPT_NAME,
      REPRESENT_WORK_DEPT_CODE: e.item.REPRESENT_WORK_DEPT_CODE,
      REPRESENT_WORK_DEPT_LEVEL: e.item.REPRESENT_WORK_DEPT_LEVEL,
      REPRESENT_WORK_DEPT_NAME: e.item.REPRESENT_WORK_DEPT_NAME,
      STAFF_CODE: e.item.STAFF_CODE,
      STAFF_ID: e.item.STAFF_ID,
      STAFF_TYPE: e.item.STAFF_TYPE,
      STATUS: e.item.STATUS,
      TITLE_ID: e.item.TITLE_ID,
      TITLE_NAME_EN: e.item.TITLE_NAME_EN,
      TITLE_NAME_TH: e.item.TITLE_NAME_TH,
      TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN,
      TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH,
    });
  }

  deleteContri(i){
      this.setStaff.at(i).patchValue({
        FULL_NAME:"",
        STAFF_ID: "",
        COMPARE_ID: "",
        COMPARE_DETAIL_ID: "",
        STAFF_REF_ID: "",
        TITLE_ID: "",
        STAFF_CODE: "",
        ID_CARD: "",
        STAFF_TYPE: "",
        TITLE_NAME_TH: "",
        TITLE_NAME_EN: "",
        TITLE_SHORT_NAME_TH: "",
        TITLE_SHORT_NAME_EN: "",
        FIRST_NAME: "",
        LAST_NAME: "",
        AGE: "",
        OPERATION_POS_CODE: "",
        OPREATION_POS_NAME: "",
        OPREATION_POS_LEVEL: "",
        OPERATION_POS_LEVEL_NAME: "",
        OPERATION_DEPT_CODE: "",
        OPERATION_DEPT_NAME: "",
        OPERATION_DEPT_LEVEL: "",
        OPERATION_UNDER_DEPT_CODE: "",
        OPERATION_UNDER_DEPT_NAME: "",
        OPERATION_UNDER_DEPT_LEVEL: "",
        OPERATION_WORK_DEPT_CODE: "",
        OPERATION_WORK_DEPT_NAME: "",
        OPERATION_WORK_DEPT_LEVEL: "",
        OPERATION_OFFICE_CODE: "",
        OPERATION_OFFICE_NAME: "",
        OPERATION_OFFICE_SHORT_NAME: "",
        MANAGEMENT_POS_CODE: "",
        MANAGEMENT_POS_NAME: "",
        MANAGEMENT_POS_LEVEL: "",
        MANAGEMENT_POS_LEVEL_NAME: "",
        MANAGEMENT_DEPT_CODE: "",
        MANAGEMENT_DEPT_NAME: "",
        MANAGEMENT_DEPT_LEVEL: "",
        MANAGEMENT_UNDER_DEPT_CODE: "",
        MANAGEMENT_UNDER_DEPT_NAME: "",
        MANAGEMENT_UNDER_DEPT_LEVEL: "",
        MANAGEMENT_WORK_DEPT_CODE: "",
        MANAGEMENT_WORK_DEPT_NAME: "",
        MANAGEMENT_WORK_DEPT_LEVEL: "",
        MANAGEMENT_OFFICE_CODE: "",
        MANAGEMENT_OFFICE_NAME: "",
        MANAGEMENT_OFFICE_SHORT_NAME: "",
        REPRESENTATION_POS_CODE: "",
        REPRESENTATION_POS_NAME: "",
        REPRESENTATION_POS_LEVEL: "",
        REPRESENTATION_POS_LEVEL_NAME: "",
        REPRESENTATION_DEPT_CODE: "",
        REPRESENTATION_DEPT_NAME: "",
        REPRESENTATION_DEPT_LEVEL: "",
        REPRESENTATION_UNDER_DEPT_CODE: "",
        REPRESENTATION_UNDER_DEPT_NAME: "",
        REPRESENTATION_UNDER_DEPT_LEVEL: "",
        REPRESENT_WORK_DEPT_CODE: "",
        REPRESENT_WORK_DEPT_NAME: "",
        REPRESENT_WORK_DEPT_LEVEL: "",
        REPRESENT_OFFICE_CODE: "",
        REPRESENT_OFFICE_NAME: "",
        REPRESENT_OFFICE_SHORT_NAME: "",
        STATUS: "",
        REMARK: "",
        CONTRIBUTOR_ID: 86,
        IS_ACTIVE: 0
      });
  }

  private set_CONTRIBUTOR_ID86(): FormGroup { //ผู้รับชำระ
    const staff = JSON.parse(localStorage.getItem("staffInfo"));
    // console.log(staff);
    var title;
    if (staff.TITLE_SHORT_NAME_TH == '' || staff.TITLE_SHORT_NAME_TH == null){
      title = staff.TITLE_NAME_TH;
    }else{ title = staff.TITLE_SHORT_NAME_TH }

    const CompareFormControl = {
        FULL_NAME: new FormControl(title+staff.FIRST_NAME+" "+staff.LAST_NAME),
        STAFF_ID: new FormControl(staff.STAFF_ID || ''),
        COMPARE_ID: new FormControl(this.COMPARE_ID || ''),
        COMPARE_DETAIL_ID: new FormControl(this.COMPARE_DETAIL_ID || ''),
        STAFF_REF_ID: new FormControl(staff.STAFF_REF_ID || ''),
        TITLE_ID: new FormControl(staff.TITLE_ID || ''),
        STAFF_CODE: new FormControl(staff.STAFF_CODE || ''),
        ID_CARD: new FormControl(staff.ID_CARD || ''),
        STAFF_TYPE: new FormControl(staff.STAFF_TYPE || ''),
        TITLE_NAME_TH: new FormControl(staff.TITLE_NAME_TH || ''),
        TITLE_NAME_EN: new FormControl(staff.TITLE_NAME_EN || ''),
        TITLE_SHORT_NAME_TH: new FormControl(staff.TITLE_SHORT_NAME_TH || ''),
        TITLE_SHORT_NAME_EN: new FormControl(staff.TITLE_SHORT_NAME_EN || ''),
        FIRST_NAME: new FormControl(staff.FIRST_NAME || ''),
        LAST_NAME: new FormControl(staff.LAST_NAME || ''),
        AGE: new FormControl(staff.AGE || ''),
        OPERATION_POS_CODE: new FormControl(staff.OPERATION_POS_CODE || ''),
        OPREATION_POS_NAME: new FormControl(staff.OPREATION_POS_NAME || ''),
        OPREATION_POS_LEVEL: new FormControl(staff.OPREATION_POS_LEVEL || ''),
        OPERATION_POS_LEVEL_NAME: new FormControl(staff.OPERATION_POS_LEVEL_NAME || ''),
        OPERATION_DEPT_CODE: new FormControl(staff.OPERATION_DEPT_CODE || ''),
        OPERATION_DEPT_NAME: new FormControl(staff.OPERATION_DEPT_NAME || ''),
        OPERATION_DEPT_LEVEL: new FormControl(staff.OPERATION_DEPT_LEVEL || ''),
        OPERATION_UNDER_DEPT_CODE: new FormControl(staff.OPERATION_UNDER_DEPT_CODE || ''),
        OPERATION_UNDER_DEPT_NAME: new FormControl(staff.OPERATION_UNDER_DEPT_NAME || ''),
        OPERATION_UNDER_DEPT_LEVEL: new FormControl(staff.OPERATION_UNDER_DEPT_LEVEL || ''),
        OPERATION_WORK_DEPT_CODE: new FormControl(staff.OPERATION_WORK_DEPT_CODE || ''),
        OPERATION_WORK_DEPT_NAME: new FormControl(staff.OPERATION_WORK_DEPT_NAME || ''),
        OPERATION_WORK_DEPT_LEVEL: new FormControl(staff.OPERATION_WORK_DEPT_LEVEL || ''),
        OPERATION_OFFICE_CODE: new FormControl(staff.OPERATION_OFFICE_CODE || ''),
        OPERATION_OFFICE_NAME: new FormControl(staff.OPERATION_OFFICE_NAME || ''),
        OPERATION_OFFICE_SHORT_NAME: new FormControl(staff.OPERATION_OFFICE_SHORT_NAME || ''),
        MANAGEMENT_POS_CODE: new FormControl(staff.MANAGEMENT_POS_CODE || ''),
        MANAGEMENT_POS_NAME: new FormControl(staff.MANAGEMENT_POS_NAME || ''),
        MANAGEMENT_POS_LEVEL: new FormControl(staff.MANAGEMENT_POS_LEVEL || ''),
        MANAGEMENT_POS_LEVEL_NAME: new FormControl(staff.MANAGEMENT_POS_LEVEL_NAME || ''),
        MANAGEMENT_DEPT_CODE: new FormControl(staff.MANAGEMENT_DEPT_CODE || ''),
        MANAGEMENT_DEPT_NAME: new FormControl(staff.MANAGEMENT_DEPT_NAME || ''),
        MANAGEMENT_DEPT_LEVEL: new FormControl(staff.MANAGEMENT_DEPT_LEVEL || ''),
        MANAGEMENT_UNDER_DEPT_CODE: new FormControl(staff.MANAGEMENT_UNDER_DEPT_CODE || ''),
        MANAGEMENT_UNDER_DEPT_NAME: new FormControl(staff.MANAGEMENT_UNDER_DEPT_NAME || ''),
        MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(staff.MANAGEMENT_UNDER_DEPT_LEVEL || ''),
        MANAGEMENT_WORK_DEPT_CODE: new FormControl(staff.MANAGEMENT_WORK_DEPT_CODE || ''),
        MANAGEMENT_WORK_DEPT_NAME: new FormControl(staff.MANAGEMENT_WORK_DEPT_NAME || ''),
        MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(staff.MANAGEMENT_WORK_DEPT_LEVEL || ''),
        MANAGEMENT_OFFICE_CODE: new FormControl(staff.MANAGEMENT_OFFICE_CODE || ''),
        MANAGEMENT_OFFICE_NAME: new FormControl(staff.MANAGEMENT_OFFICE_NAME || ''),
        MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(staff.MANAGEMENT_OFFICE_SHORT_NAME || ''),
        REPRESENTATION_POS_CODE: new FormControl(staff.REPRESENTATION_POS_CODE || ''),
        REPRESENTATION_POS_NAME: new FormControl(staff.REPRESENTATION_POS_NAME || ''),
        REPRESENTATION_POS_LEVEL: new FormControl(staff.REPRESENTATION_POS_LEVEL || ''),
        REPRESENTATION_POS_LEVEL_NAME: new FormControl(staff.REPRESENTATION_POS_LEVEL_NAME || ''),
        REPRESENTATION_DEPT_CODE: new FormControl(staff.REPRESENTATION_DEPT_CODE || ''),
        REPRESENTATION_DEPT_NAME: new FormControl(staff.REPRESENTATION_DEPT_NAME || ''),
        REPRESENTATION_DEPT_LEVEL: new FormControl(staff.REPRESENTATION_DEPT_LEVEL || ''),
        REPRESENTATION_UNDER_DEPT_CODE: new FormControl(staff.REPRESENTATION_UNDER_DEPT_CODE || ''),
        REPRESENTATION_UNDER_DEPT_NAME: new FormControl(staff.REPRESENTATION_UNDER_DEPT_NAME || ''),
        REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(staff.REPRESENTATION_UNDER_DEPT_LEVEL || ''),
        REPRESENT_WORK_DEPT_CODE: new FormControl(staff.REPRESENT_WORK_DEPT_CODE || ''),
        REPRESENT_WORK_DEPT_NAME: new FormControl(staff.REPRESENT_WORK_DEPT_NAME || ''),
        REPRESENT_WORK_DEPT_LEVEL: new FormControl(staff.REPRESENT_WORK_DEPT_LEVEL || ''),
        REPRESENT_OFFICE_CODE: new FormControl(staff.REPRESENT_OFFICE_CODE || ''),
        REPRESENT_OFFICE_NAME: new FormControl(staff.REPRESENT_OFFICE_NAME || ''),
        REPRESENT_OFFICE_SHORT_NAME: new FormControl(staff.REPRESENT_OFFICE_SHORT_NAME || ''),
        STATUS: new FormControl(staff.STATUS || ''),
        REMARK: new FormControl(staff.REMARK || ''),
        CONTRIBUTOR_ID: new FormControl(86),
        IS_ACTIVE: new FormControl(1)
    }
    return this.fb.group(CompareFormControl);
  }

  deleteStaff(){}

}
