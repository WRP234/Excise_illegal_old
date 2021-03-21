import { Component, ChangeDetectionStrategy, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import 'rxjs/add/observable/of';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Injectable, isDevMode } from "@angular/core";
import swal from 'sweetalert2';
import { MainMasterService } from '../../../services/main-master.service';
import { PreloaderService } from 'app/shared/preloader/preloader.component';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { FineService } from '../fine.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { toLocalShort, setZero } from 'app/config/dateFormat';
import { FnParam } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './ILG60_O_05_00_02_03.html',
  styleUrls: ['./ILG60_O_05_00_02_03.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ILG60_O_05_00_02_03 {
  constructor(
    private mainMasterService: MainMasterService,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private preloader: PreloaderService,
    private fineService: FineService,
  ) { }

  controlForm: FormGroup;
  NAME: string;
  PAYMENT_FINE: number;
  PAYMENT_TIME: any;
  PAYMENT_DATE: any;
  approve: any;
  APPROVE_OFFICE_CODE: any;
  typeheadOffice: any;
  // showEditField : boolean = true;

  APPROVE_TYPE: any;
  APPROVE_DATE: any;
  APPROVE_TIME: any;
  COMMAND_DATE: any;
  COMMAND_TIME: any;
  COMMAND_NO: any;
  COMPARE_REASON: any;
  FACT: any;
  IS_APPROVE: any;
  CompareStaffDetail: any;
  APPROVE_OFFICE_NAME: any;
  IS_AGREE: any;
  REMARK_NOT_APPROVE: any;
  REMARK_NOT_AGREE: any;
  showEditField: any;

  get CompareStaff(): FormArray {
    return this.controlForm.get('COMPARE_STAFF') as FormArray;
  }

  async ngOnInit() {
    this.preloader.setShowPreloader(true);

    if (this.COMMAND_NO == "") {
      this.controlForm = this.fb.group({
        NAME: new FormControl(this.NAME, Validators.required),
        PAYMENT_FINE: new FormControl(this.PAYMENT_FINE, Validators.required),
        IS_APPROVE: new FormControl(0, Validators.required),
        REMARK_NOT_AGREE: new FormControl("", Validators.required),
        REMARK_NOT_APPROVE: new FormControl("", Validators.required),
        IS_AGREE: new FormControl(0, Validators.required),
        PAYMENT_DATE: new FormControl(this.PAYMENT_DATE, Validators.required),
        PAYMENT_TIME: new FormControl(this.PAYMENT_TIME, Validators.required),
        APPROVE_DATE: new FormControl(this.toDatePickerFormat(new Date()), Validators.required),
        APPROVE_TIME: new FormControl(this.getTimeNow(new Date()), Validators.required),
        COMMAND_DATE: new FormControl(this.toDatePickerFormat(new Date()), Validators.required),
        COMMAND_TIME: new FormControl(this.getTimeNow(new Date()), Validators.required),
        APPROVE_OFFICE_NAME: new FormControl(this.APPROVE_OFFICE_NAME, Validators.required),
        COMPARE_REASON: new FormControl(""),
        COMMAND_NO: new FormControl(""),
        APPROVE_TYPE: new FormControl(0, Validators.required),
        FACT: new FormControl(""),
        COMPARE_STAFF: this.fb.array([this.set_null_CONTRIBUTOR_ID32(), this.set_CONTRIBUTOR_ID33()
          , this.set_CONTRIBUTOR_ID84(), this.set_CONTRIBUTOR_ID85()]),
        STAFF_1: new FormControl(true, Validators.required),
        APPROVE_OFFICE_CODE: new FormControl(this.APPROVE_OFFICE_CODE, Validators.required),
        APPROVE_OFFICE_ID: new FormControl(this.APPROVE_OFFICE_ID, Validators.required),
      });
      this.setOfficeStore();
      this.preloader.setShowPreloader(false);
    } else {
      let setstaff = true;
      if (this.APPROVE_TYPE == 1) { setstaff = true; } else { setstaff = false; }
      this.controlForm = this.fb.group({
        NAME: new FormControl(this.NAME, Validators.required),
        PAYMENT_FINE: new FormControl(this.PAYMENT_FINE, Validators.required),
        IS_APPROVE: new FormControl(this.IS_APPROVE, Validators.required),
        REMARK_NOT_AGREE: new FormControl(this.REMARK_NOT_AGREE, Validators.required),
        REMARK_NOT_APPROVE: new FormControl(this.REMARK_NOT_APPROVE, Validators.required),
        IS_AGREE: new FormControl(this.IS_AGREE, Validators.required),
        PAYMENT_DATE: new FormControl(this.PAYMENT_DATE, Validators.required),
        PAYMENT_TIME: new FormControl(this.PAYMENT_TIME, Validators.required),
        APPROVE_DATE: new FormControl(this.APPROVE_DATE, Validators.required),
        APPROVE_TIME: new FormControl(this.APPROVE_TIME, Validators.required),
        COMMAND_DATE: new FormControl(this.COMMAND_DATE, Validators.required),
        COMMAND_TIME: new FormControl(this.COMMAND_TIME, Validators.required),
        APPROVE_OFFICE_NAME: new FormControl(this.APPROVE_OFFICE_NAME, Validators.required),
        COMPARE_REASON: new FormControl(this.COMPARE_REASON),
        COMMAND_NO: new FormControl(this.COMMAND_NO),
        APPROVE_TYPE: new FormControl(this.APPROVE_TYPE, Validators.required),
        FACT: new FormControl(this.FACT),
        COMPARE_STAFF: this.fb.array([this.set_null_CONTRIBUTOR_ID32(), this.set_CONTRIBUTOR_ID33()
          , this.set_CONTRIBUTOR_ID84(), this.set_CONTRIBUTOR_ID85()]),
        STAFF_1: new FormControl(setstaff, Validators.required),
        APPROVE_OFFICE_CODE: new FormControl(this.APPROVE_OFFICE_CODE, Validators.required),
        APPROVE_OFFICE_ID: new FormControl(this.APPROVE_OFFICE_ID, Validators.required),
      });
      let staff = <FormArray>this.controlForm.controls.COMPARE_STAFF;
      staff.at(0).patchValue(this.CompareStaffDetail[2]);
      staff.at(1).patchValue(this.CompareStaffDetail[3]);
      staff.at(2).patchValue(this.CompareStaffDetail[4]);
      staff.at(3).patchValue(this.CompareStaffDetail[5]);

      this.preloader.setShowPreloader(false);
    }

    this.preloader.setShowPreloader(false);
  }


  /////////////////////////////////////////////////setOffice/////////////////////////////////////////////////
  APPROVE_OFFICE_ID: any;
  private async setOfficeStore() {
    let officeCode = localStorage.getItem("officeCode");
    for (let l of this.typeheadOffice) {
      let code = l.OFFICE_CODE;
      if (officeCode == code) {
        this.controlForm.patchValue({
          APPROVE_OFFICE_CODE: l.OFFICE_CODE || '',
          // OFFICE_NAME: l.OFFICE_NAME,
          APPROVE_OFFICE_NAME: l.OFFICE_SHORT_NAME,
          APPROVE_OFFICE_ID: l.OFFICE_ID
        }); break;
      }
    }
  }

  isReq_APPROVE_OFFICE_NAME = false;
  isReq_COMMAND_NO = false;
  isReq_FACT = false;
  isReq_COMPARE_REASON = false;
  isReq_Staff0 = false;
  isReq_Staff1 = false;
  isReq_Staff2 = false;
  isReq_Staff3 = false;
  isReq_IS_APPROVE = false;
  isReq_IS_IS_AGREE = false;


  require(e) {
    switch (e) {
      case 'isReq_APPROVE_OFFICE_NAME': this.isReq_APPROVE_OFFICE_NAME = false; break;
      // case 'isReq_COMMAND_NO' : this.isReq_COMMAND_NO = false; break;
      // case 'isReq_FACT' : this.isReq_FACT = false; break;
      // case 'isReq_COMPARE_REASON' : this.isReq_COMPARE_REASON = false; break;
      case 'isReq_Staff0': this.isReq_Staff0 = false; break;
      case 'isReq_Staff1': this.isReq_Staff1 = false; break;
      case 'isReq_Staff2': this.isReq_Staff2 = false; break;
      case 'isReq_Staff3': this.isReq_Staff3 = false; break;
      case 'isReq_IS_APPROVE': this.isReq_IS_APPROVE = false; break;
      case 'isReq_IS_IS_AGREE': this.isReq_IS_IS_AGREE = false; break;
    }
  }
  // isReq_PAYMENT_AMOUNT = false;
  onSubmit() {

    // if( this.controlForm.get('COMPARE_REASON').invalid){
    //   this.isReq_COMPARE_REASON = true;
    //   this._swal('กรุณาระบุข้อมูล "เหตุผลที่เปรียบเทียบคดีและ/หรือจัดการของกลาง"')}
    // else {
    //   this.isReq_COMPARE_REASON = false;
    // }

    // if( this.controlForm.get('FACT').invalid){
    //     this.isReq_FACT = true;
    //     this._swal('กรุณาระบุข้อมูล "ข้อเท็จจริงเกี่ยวกับความผิดโดยละเอียด"')}
    // else {
    //   this.isReq_FACT = false;
    // }

    // if( this.controlForm.get('COMMAND_NO').invalid){
    //     this.isReq_COMMAND_NO = true;
    //     this._swal('กรุณาระบุข้อมูล "เลขที่คำสั่งกรมฯ"')}
    // else {
    //   this.isReq_COMMAND_NO = false;
    // }

    var s1 = 0; var s2 = 0; var s3 = 0; var s4 = 0;

    if (this.controlForm.get("COMMAND_TIME").invalid) {
      this._swal('กรุณาระบุข้อมูล "เวลาที่ออกคำสั่ง"')
    } else {
      s2 = 1;
    }

    if (this.controlForm.get("COMMAND_DATE").invalid) {
      this._swal('กรุณาระบุข้อมูล "วันที่ออกคำสั่ง"')
    } else {
      s1 = 1;
    }

    if (this.controlForm.get("APPROVE_TIME").invalid) {
      this._swal('กรุณาระบุข้อมูล "เวลาที่จัดทำรายงานฯ"')
    } else {
      s4 = 1;
    }

    if (this.controlForm.get("APPROVE_DATE").invalid) {
      this._swal('กรุณาระบุข้อมูล "วันที่จัดทำรายงานฯ"')
    } else {
      s3 = 1;
    }

    if (this.controlForm.get('APPROVE_OFFICE_NAME').invalid) {
      this.isReq_APPROVE_OFFICE_NAME = true;
      this._swal('กรุณาระบุข้อมูล "หน่วยงานเปรียบเทียบ"')
    }
    else {
      this.isReq_APPROVE_OFFICE_NAME = false;
    }

    if (this.controlForm.get('COMPARE_REASON').valid &&
      this.controlForm.get('FACT').valid &&
      this.controlForm.get('COMMAND_NO').valid &&
      this.controlForm.get('APPROVE_OFFICE_NAME').valid &&
      s1 == 1 && s2 == 1 && s3 == 1 && s4 == 1
    ) {
      if (this.controlForm.get('APPROVE_TYPE').value == 0) {
        this.activeModal.close(this.controlForm.value);
      } else {

        if (this.controlForm.get('APPROVE_TYPE').value == 1) {
          if (this.CompareStaff.value[2].IS_ACTIVE == 0) { this.isReq_Staff2 = true; this._swal('กรุณาระบุข้อมูล "ผู้มีอำนาจอนุมัติ"'); } else { this.isReq_Staff2 = false; }
          if (this.CompareStaff.value[1].IS_ACTIVE == 0) { this.isReq_Staff1 = true; this._swal('กรุณาระบุข้อมูล "ผู้พิจารณาเห็นชอบ"'); } else { this.isReq_Staff1 = false; }
          if (this.CompareStaff.value[0].IS_ACTIVE == 0) { this.isReq_Staff0 = true; this._swal('กรุณาระบุข้อมูล "ผู้เสนอพิจารณาเห็นชอบ"'); } else { this.isReq_Staff0 = false; }

          var a1 = 0; var a2 = 0;
          if (this.controlForm.get("IS_APPROVE").value == 0 && this.controlForm.get("REMARK_NOT_APPROVE").value == "") {
            this._swal('กรุณาระบุข้อมูล "เหตุผลในการไม่อนุมัติ"'); a1 = 0; this.isReq_IS_APPROVE = true;
          } else { a1 = 1; this.isReq_IS_APPROVE = false; }

          if (this.controlForm.get("IS_AGREE").value == 0 && this.controlForm.get("REMARK_NOT_AGREE").value == "") {
            this._swal('กรุณาระบุข้อมูล "เหตุผลในการไม่เห็นชอบ"'); a1 = 0; this.isReq_IS_IS_AGREE = true;
          } else { a2 = 1; this.isReq_IS_IS_AGREE = false; }

          if (this.CompareStaff.value[0].IS_ACTIVE == 1 && this.CompareStaff.value[1].IS_ACTIVE == 1 && this.CompareStaff.value[2].IS_ACTIVE == 1 && a1 == 1 && a2 == 1) { this.activeModal.close(this.controlForm.value); }

        } else if (this.controlForm.get('APPROVE_TYPE').value == 2) {
          if (this.CompareStaff.value[2].IS_ACTIVE == 0) { this.isReq_Staff2 = true; this._swal('กรุณาระบุข้อมูล "ผู้มีอำนาจอนุมัติ"'); } else { this.isReq_Staff2 = false; }
          if (this.CompareStaff.value[1].IS_ACTIVE == 0) { this.isReq_Staff1 = true; this._swal('กรุณาระบุข้อมูล "ผู้พิจารณาเห็นชอบ"'); } else { this.isReq_Staff1 = false; }
          if (this.CompareStaff.value[0].IS_ACTIVE == 0) { this.isReq_Staff0 = true; this._swal('กรุณาระบุข้อมูล "ผู้เสนอพิจารณาเห็นชอบ"'); } else { this.isReq_Staff0 = false; }

          var a1 = 0; var a2 = 0;
          if (this.controlForm.get("IS_APPROVE").value == 0 && this.controlForm.get("REMARK_NOT_APPROVE").value == "") {
            this._swal('กรุณาระบุข้อมูล "เหตุผลในการไม่อนุมัติ"'); a1 = 0; this.isReq_IS_APPROVE = true;
          } else { a1 = 1; this.isReq_IS_APPROVE = false; }

          if (this.controlForm.get("IS_AGREE").value == 0 && this.controlForm.get("REMARK_NOT_AGREE").value == "") {
            this._swal('กรุณาระบุข้อมูล "เหตุผลในการไม่เห็นชอบ"'); a1 = 0; this.isReq_IS_IS_AGREE = true;
          } else { a2 = 1; this.isReq_IS_IS_AGREE = false; }

          if (this.CompareStaff.value[0].IS_ACTIVE == 1 && this.CompareStaff.value[1].IS_ACTIVE == 1 && this.CompareStaff.value[2].IS_ACTIVE == 1 && a1 == 1 && a2 == 1) { this.activeModal.close(this.controlForm.value); }

        } else if (this.controlForm.get('APPROVE_TYPE').value == 3) {
          if (this.CompareStaff.value[2].IS_ACTIVE == 0) { this.isReq_Staff2 = true; this._swal('กรุณาระบุข้อมูล "ผู้มีอำนาจอนุมัติ"'); } else { this.isReq_Staff2 = false; }
          if (this.CompareStaff.value[1].IS_ACTIVE == 0) { this.isReq_Staff1 = true; this._swal('กรุณาระบุข้อมูล "ผู้พิจารณาเห็นชอบ"'); } else { this.isReq_Staff1 = false; }
          if (this.CompareStaff.value[0].IS_ACTIVE == 0) { this.isReq_Staff0 = true; this._swal('กรุณาระบุข้อมูล "ผู้เสนอพิจารณาเห็นชอบ"'); } else { this.isReq_Staff0 = false; }

          var a1 = 0; var a2 = 0;
          if (this.controlForm.get("IS_APPROVE").value == 0 && this.controlForm.get("REMARK_NOT_APPROVE").value == "") {
            this._swal('กรุณาระบุข้อมูล "เหตุผลในการไม่อนุมัติ"'); a1 = 0; this.isReq_IS_APPROVE = true;
          } else { a1 = 1; this.isReq_IS_APPROVE = false; }

          if (this.controlForm.get("IS_AGREE").value == 0 && this.controlForm.get("REMARK_NOT_AGREE").value == "") {
            this._swal('กรุณาระบุข้อมูล "เหตุผลในการไม่เห็นชอบ"'); a1 = 0; this.isReq_IS_IS_AGREE = true;
          } else { a2 = 1; this.isReq_IS_IS_AGREE = false; }

          if (this.CompareStaff.value[0].IS_ACTIVE == 1 && this.CompareStaff.value[1].IS_ACTIVE == 1 && this.CompareStaff.value[2].IS_ACTIVE == 1 && a1 == 1 && a2 == 1) { this.activeModal.close(this.controlForm.value); }

        } else if (this.controlForm.get('APPROVE_TYPE').value == 4) {
          if (this.CompareStaff.value[2].IS_ACTIVE == 0) { this.isReq_Staff2 = true; this._swal('กรุณาระบุข้อมูล "ผู้มีอำนาจอนุมัติ"'); } else { this.isReq_Staff2 = false; }
          if (this.CompareStaff.value[1].IS_ACTIVE == 0) { this.isReq_Staff1 = true; this._swal('กรุณาระบุข้อมูล "ผู้พิจารณาเห็นชอบ"'); } else { this.isReq_Staff1 = false; }
          if (this.CompareStaff.value[0].IS_ACTIVE == 0) { this.isReq_Staff0 = true; this._swal('กรุณาระบุข้อมูล "ผู้เสนอพิจารณาเห็นชอบ ลำดับที่ 2"'); } else { this.isReq_Staff0 = false; }
          if (this.CompareStaff.value[3].IS_ACTIVE == 0) { this.isReq_Staff3 = true; this._swal('กรุณาระบุข้อมูล "ผู้เสนอพิจารณาเห็นชอบ ลำดับที่ 1"'); } else { this.isReq_Staff3 = false; }

          var a1 = 0; var a2 = 0;
          if (this.controlForm.get("IS_APPROVE").value == 0 && this.controlForm.get("REMARK_NOT_APPROVE").value == "") {
            this._swal('กรุณาระบุข้อมูล "เหตุผลในการไม่อนุมัติ"'); a1 = 0; this.isReq_IS_APPROVE = true;
          } else { a1 = 1; this.isReq_IS_APPROVE = false; }

          if (this.controlForm.get("IS_AGREE").value == 0 && this.controlForm.get("REMARK_NOT_AGREE").value == "") {
            this._swal('กรุณาระบุข้อมูล "เหตุผลในการไม่เห็นชอบ"'); a1 = 0; this.isReq_IS_IS_AGREE = true;
          } else { a2 = 1; this.isReq_IS_IS_AGREE = false; }

          if (this.CompareStaff.value[0].IS_ACTIVE == 1 && this.CompareStaff.value[1].IS_ACTIVE == 1 && this.CompareStaff.value[2].IS_ACTIVE == 1 && this.CompareStaff.value[3].IS_ACTIVE == 1 && a1 == 1 && a2 == 1) { this.activeModal.close(this.controlForm.value); }

        }

      }
    }

  }

  cancel() {
    swal({
      type: 'warning',
      text: "ยืนยันการทำรายการหรือไม่" + ' ?',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: true,

    }).then((result) => {
      // console.log("ยกเลิกการทำรายการ : ",result.value)
      if (result.value == true) {
        var cancel = "cancel"
        this.activeModal.close(cancel);
      }
    })
  }

  dismiss() {
    this.activeModal.close();
  }

  _swal(isReq_RECEIPT_BOOK_NO) {
    swal({
      type: 'warning',
      text: isReq_RECEIPT_BOOK_NO,
      confirmButtonText: 'ตกลง',
      buttonsStyling: true,
    })
  }

  ////////////////////////////////////////////////////check////////////////////////////////////////
  iS_CHECK(event, e) {
    if (event.target.checked == true && e == 1) {
      const control = this.controlForm;
      control.patchValue({
        APPROVE_TYPE: 1,
        IS_APPROVE: 1,
        IS_AGREE: 1,
        REMARK_NOT_AGREE: "",
        REMARK_NOT_APPROVE: "",
      });
      this.deleteContri(0); this.deleteContri(1); this.deleteContri(2); this.deleteContri(3);
    }
    else if (event.target.checked == true && e == 2) {
      const control = this.controlForm;
      control.patchValue({
        APPROVE_TYPE: 2,
        IS_APPROVE: 1,
        IS_AGREE: 1,
        REMARK_NOT_AGREE: "",
        REMARK_NOT_APPROVE: "",
      });
      this.deleteContri(0); this.deleteContri(1); this.deleteContri(2); this.deleteContri(3);
    }
    else if (event.target.checked == true && e == 3) {
      const control = this.controlForm;
      control.patchValue({
        APPROVE_TYPE: 3,
        IS_APPROVE: 1,
        IS_AGREE: 1,
        REMARK_NOT_AGREE: "",
        REMARK_NOT_APPROVE: "",
      });
      this.deleteContri(0); this.deleteContri(1); this.deleteContri(2); this.deleteContri(3);
    }
    else if (event.target.checked == true && e == 4) {
      const control = this.controlForm;
      control.patchValue({
        APPROVE_TYPE: 4,
        IS_APPROVE: 1,
        IS_AGREE: 1,
        REMARK_NOT_AGREE: "",
        REMARK_NOT_APPROVE: "",
      });
      this.deleteContri(0); this.deleteContri(1); this.deleteContri(2); this.deleteContri(3);
    }
    else if (event.target.checked == false) {
      const control = this.controlForm;
      control.patchValue({
        APPROVE_TYPE: 0,
        IS_APPROVE: 0,
        IS_AGREE: 0,
        REMARK_NOT_AGREE: "",
        REMARK_NOT_APPROVE: "",
      });
      this.deleteContri(0); this.deleteContri(1); this.deleteContri(2); this.deleteContri(3);
    }
    console.log("check : ", this.controlForm.getRawValue())
  }

  /////////////////////////////////////////////////////time/////////////////////////////////////////
  toDatePickerFormat(d: any) {
    return { date: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }, formatted: toLocalShort(d.toString()).replace(/ /g, ' ') };
  }

  getTimeNow(d: any = new Date, isZero: any = null) {
    let h = d.getHours().toString();
    let m = d.getMinutes().toString();
    if ((+h) < 10) { h = '0' + h; }
    if ((+m) < 10) m = '0' + m;
    return h + ':' + m + '';
  }

  //////////////////////////////////////////////////office////////////////////////////////////////
  isReq_OffName = new BehaviorSubject<boolean>(false);
  isReq_OFFICE_NAME = false;
  serachOffice = (text3$: Observable<string>) =>
    text3$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term === '' ? []
        : this.typeheadOffice
          .filter(v =>
            (`${v.OFFICE_NAME || ''} ${v.OFFICE_SHORT_NAME || ''}`.toLowerCase().indexOf(term.toLowerCase()) > -1)
          ).slice(0, 10));

  formatterOffice1 = (x: { OFFICE_SHORT_NAME: string }) => x.OFFICE_SHORT_NAME
  formatterOffice2 = (x: { OFFICE_SHORT_NAME: string }) => x.OFFICE_SHORT_NAME

  selectItemOffice(e) {
    this.controlForm.patchValue({
      APPROVE_OFFICE_NAME: e.item.OFFICE_SHORT_NAME,
      APPROVE_OFFICE_CODE: e.item.OFFICE_CODE,
      APPROVE_OFFICE_ID: e.item.OFFICE_ID
    });
  }

  blurSelectItemOffice(input) {
    let val = input.value
    if (!val) {
      this.controlForm.patchValue({
        APPROVE_OFFICE_NAME: "",
        APPROVE_OFFICE_CODE: "",
        APPROVE_OFFICE_ID: ""
      });
    }
  }

  //////////////////////////////////////////////////check//////////////////////////////////////////
  check(e) {
    // console.log(e)
    if (e == 'check1') {
      this.controlForm.patchValue({
        APPROVE_TYPE: 1,
        STAFF_1: true
      })
      this.CompareStaff.at(0).patchValue({
        FULL_NAME: "",
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
        CONTRIBUTOR_ID: 32,
        IS_ACTIVE: 0
      })
    } else if (e == 'check2') {
      this.controlForm.patchValue({
        APPROVE_TYPE: 2,
        STAFF_1: false
      })
    } else if (e == 'check3') {
      this.controlForm.patchValue({
        APPROVE_TYPE: 3,
        STAFF_1: false
      })
    } else if (e == 'check4') {
      this.controlForm.patchValue({
        APPROVE_TYPE: 4,
        STAFF_1: false
      })
    } else if (e == 'IS_AGREE1') {
      this.controlForm.patchValue({
        IS_AGREE: 1,
      })
    } else if (e == 'IS_AGREE2') {
      this.controlForm.patchValue({
        IS_AGREE: 0,
      })
    } else if (e == 'IS_APPROVE1') {
      this.controlForm.patchValue({
        IS_APPROVE: 1,
      })
    } else if (e == 'IS_APPROVE2') {
      this.controlForm.patchValue({
        IS_APPROVE: 0,
      })
    }

  }
  //////////////////////////////////////////////////staff//////////////////////////////////////////    
  searching = false;
  searchFailed = false;
  public searchStaff = (text2$: Observable<string>) =>
    text2$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.fineService.MasStaffgetByCon_Search({ TEXT_SEARCH: term })
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          })
      )
      .do(() => this.searching = false);

  formatterStaff = (x: { TITLE_SHORT_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
    `${x.TITLE_SHORT_NAME_TH || ''}${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`

  deleteContri(i) {
    var _ContributorID;
    if (i == 0) { _ContributorID = 32; }
    else if (i == 1) { _ContributorID = 33; }
    else if (i == 2) { _ContributorID = 84; }
    else if (i == 3) { _ContributorID = 85; }
    // swal({
    //   type: 'warning',
    //   text: "ยืนยันการทำรายการหรือไม่" + ' ?',
    //   showCancelButton: true,
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'ตกลง',
    //   cancelButtonText: 'ยกเลิก',
    //   buttonsStyling: true,

    // }).then((result) => {
    //   console.log("ยกเลิกการทำรายการ : ",result.value)
    //   if (result.value == true){
    this.CompareStaff.at(i).patchValue({
      FULL_NAME: "",
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
      CONTRIBUTOR_ID: _ContributorID,
      IS_ACTIVE: 0
    });
    //   console.log("staff : ",this.CompareStaff.getRawValue())
    //   }else{
    //   console.log("staff : ",this.CompareStaff.getRawValue())
    //   }
    // })
  }

  selectItemStaff(e, i) {
    var _ContributorID;
    if (i == 0) { _ContributorID = 32; }
    else if (i == 1) { _ContributorID = 33; }
    else if (i == 2) { _ContributorID = 84; }
    else if (i == 3) { _ContributorID = 85; }
    this.CompareStaff.at(i).patchValue({
      COMPARE_ID: "",
      CONTRIBUTOR_ID: _ContributorID,
      BIRTH_DATE: e.item.BIRTH_DATE,
      FIRST_NAME: e.item.FIRST_NAME,
      ID_CARD: e.item.ID_CARD,
      IS_ACTIVE: e.item.IS_ACTIVE,
      LAST_NAME: e.item.LAST_NAME,
      FULL_NAME: `${e.item.TITLE_SHORT_NAME_TH || ''}${e.item.FIRST_NAME || ''} ${e.item.LAST_NAME || ''}`,
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
    })
  }

  deleteStaff(e, i) {
    // if(this.CompareStaff.at(i).get('FULL_NAME').value == null){
    //   console.log("yes")
    // }else{
    //   console.log(this.CompareStaff.at(i).get('FULL_NAME').value)
    // }
  }

  private set_CONTRIBUTOR_ID32(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl('', Validators.required),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(32),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  private set_null_CONTRIBUTOR_ID32(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl('', Validators.required),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(32),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }
  private set_CONTRIBUTOR_ID33(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl('', Validators.required),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(33),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  private set_CONTRIBUTOR_ID84(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl('', Validators.required),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(84),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  private set_CONTRIBUTOR_ID85(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl('', Validators.required),
      STAFF_ID: new FormControl(''),
      COMPARE_ID: new FormControl(''),
      COMPARE_DETAIL_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      TITLE_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      ID_CARD: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      LAST_NAME: new FormControl(''),
      AGE: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENTATION_POS_CODE: new FormControl(''),
      REPRESENTATION_POS_NAME: new FormControl(''),
      REPRESENTATION_POS_LEVEL: new FormControl(''),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(''),
      REPRESENTATION_DEPT_CODE: new FormControl(''),
      REPRESENTATION_DEPT_NAME: new FormControl(''),
      REPRESENTATION_DEPT_LEVEL: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      STATUS: new FormControl(''),
      REMARK: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(85),
      IS_ACTIVE: new FormControl(0)
    }
    return this.fb.group(CompareFormControl)
  }

  ///////////////////////////////////////////////////////////////////////// set time //////////////////////////////////////////////////////////////////////////////////////////
  public setFormatTimeControl(event: any, formControl: string, formGroup: FormGroup) {
    let str = event.target.value;
    let str_unSub = event.target.value;
    let substr: any[] = []
    let mm: string = '';
    let ss: string = '';
    substr = str.split(':');
    mm = substr[0] == undefined ? '' : substr[0].slice(0, 2);
    ss = substr[1] == undefined ? '' : substr[1].slice(0, 2);
    const K = event.keyCode;

    if (!/([0-9])$/.test(event.target.value))
      formGroup.controls[formControl].setValue(str_unSub.slice(0, str_unSub.length - 1));

    switch (true) {
      // NumPad 96-105
      case K >= 96 && K <= 105:
        if (str.length == 2)
          formGroup.controls[formControl].setValue(`${mm}:${ss}`);
        else if (str.length == 3)
          formGroup.controls[formControl].setValue(`${mm}:${str_unSub.substring(2)}`);
        break;
      // KeyPad 96-105
      case (K >= 48 && K <= 57):
        if (str.length == 2)
          formGroup.controls[formControl].setValue(`${mm}:${ss}`);
        else if (str.length == 3)
          formGroup.controls[formControl].setValue(`${mm}:${str_unSub.substring(2)}`);
        break;
      // backspace 8
      case K == 8:
        break;
      //delete 46
      case K == 46:
        break;
      default:
        break;
    }
  }

  ///////////////////////////////////////////////////////////////////////// myDatePicker //////////////////////////////////////////////////////////////////////////////////////////
  myDatePickerOccurrenceFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: false,
    height: '30px'
  };
}
