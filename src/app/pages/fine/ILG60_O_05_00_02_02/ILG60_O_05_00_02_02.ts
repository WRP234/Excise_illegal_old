import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  EventEmitter,
  Output,
  Input,
} from "@angular/core";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { FormControl, Validators } from "@angular/forms";
import { FindValueOperator } from "rxjs/internal/operators/find";
import { Observable, of } from "rxjs";
import "rxjs/add/observable/of";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { appConfig } from "../../../app.config";
import { map } from "rxjs/operators";
import { Injectable, isDevMode } from "@angular/core";
import swal from "sweetalert2";
import { DomSanitizer } from "@angular/platform-browser";
// import * as jsPDF from 'jspdf';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { FineService } from "../fine.service";
import { PreloaderService } from "app/shared/preloader/preloader.component";
import { IMyDateModel, IMyOptions } from "mydatepicker-th";
import { CurrencyPipe } from "@angular/common";
import { toLocalShort, setZero } from "app/config/dateFormat";
import { MainMasterService } from "../../../services/main-master.service";
import {
  MasOfficeModel,
  MasOfficeModel_New,
} from "../../../models/mas-office.model";
import { Message } from "../../../config/message";

@Component({
  selector: "app-input-dialog",
  templateUrl: "./ILG60_O_05_00_02_02.html",
  styleUrls: ["./ILG60_O_05_00_02_02.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ILG60_O_05_00_02_02 {
  constructor(
    private mainMasterService: MainMasterService,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private ngbModal: NgbModal,
    private fineService: FineService,
    private preloader: PreloaderService,
    private currencyPipe: CurrencyPipe
  ) {}

  controlForm: FormGroup;

  COMPARE_ID: any;
  COMPARE_DETAIL_ID = "";
  searching = false;
  searchFailed = false;

  get CompareStaff(): FormArray {
    return this.controlForm.get("COMPARE_STAFF") as FormArray;
  }
  get PaymentDetail(): FormArray {
    return this.controlForm.get("PAYMENT_DETAIL") as FormArray;
  }

  NAME: any;
  RECEIPT_TYPE: any;
  PAYMENT_FINE: number;
  imageSource: any;
  CompareStaffDetail: any;

  PAYMENT_FINE_DUE_DATE: any;
  PAYMENT_FINE_DUE_DATE_TIME: any;
  PAYMENT_DATE: any;
  PAYMENT_TIME: any;
  BANKING: any;
  IS_PAYMENT: any;
  PAYMENT_DETAIL: any;
  RECEIPT_NO: any;
  RECEIPT_BOOK_NO: any;
  PAYMENT_OFFICE_NAME: any;
  PAYMENT_OFFICE_CODE: any;
  RE_OFFNAME: any;
  RE_OFFCODE: any;
  showEditField: any;
  EditField: any;
  mode: any;
  RECEIPT_OFFICE_ID: any;
  set_DID: any;
  DID: any;
  edit_payment: any;
  _aboutPayFine: any;

  async ngOnInit() {
    this.preloader.setShowPreloader(true);
    console.log("edit_payment : ", this.edit_payment);
    this.myDatePickerOccurrenceFromOptions.disableDateRanges = [
      this.getDisCurrDateMyDatePicker(this.PAYMENT_FINE_DUE_DATE),
    ];

    if (this.IS_PAYMENT == 0) {
      if (this.mode == "R" && this.showEditField == false) {
        this.EditField = false;
      } else if (this.mode == "R" && this.showEditField == true) {
        this.EditField = true;
      } else if (this.mode == "C") {
        this.EditField = false;
      }

      this.controlForm = this.fb.group({
        NAME: new FormControl(this.NAME, Validators.required),
        PAYMENT_FINE: new FormControl(this.PAYMENT_FINE, Validators.required),
        PAYMENT_FINE_PIPE: new FormControl(
          this.PAYMENT_FINE,
          Validators.required
        ),
        PAYMENT_FINE_DUE_DATE: new FormControl(
          this.PAYMENT_FINE_DUE_DATE,
          Validators.required
        ),
        PAYMENT_FINE_DUE_DATE_TIME: new FormControl(
          this.PAYMENT_FINE_DUE_DATE_TIME,
          Validators.required
        ),
        PAYMENT_DATE: new FormControl(
          this.toDatePickerFormat(new Date()),
          Validators.required
        ),
        PAYMENT_TIME: new FormControl(
          this.getTimeNow(new Date()),
          Validators.required
        ),
        COMPARE_STAFF: this.fb.array([
          this.set_CONTRIBUTOR_ID28(),
          this.set_CONTRIBUTOR_ID34(),
        ]),
        IS_CHECK: new FormControl(false, [Validators.requiredTrue]),
        PAYMENT_DETAIL: this.fb.array([this.setPayment()]),
        RECEIPT_BOOK_NO: new FormControl("", Validators.required),
        RECEIPT_NO: new FormControl("", Validators.required),
        IS_PAYMENT: new FormControl(1, Validators.required),
        signature: new FormControl(false, [Validators.requiredTrue]),
        RECEIPT_TYPE: new FormControl(this.RECEIPT_TYPE),
        PAYMENT_OFFICE_NAME: new FormControl(this.PAYMENT_OFFICE_NAME),
        PAYMENT_OFFICE_CODE: new FormControl(this.PAYMENT_OFFICE_CODE),
        RECEIPT_OFFICE_ID: new FormControl(this.RECEIPT_OFFICE_ID),
      });
      this.setOfficeStore();
      this.preloader.setShowPreloader(false);
    } else {
      if (this.mode == "R") {
        this.EditField = true;
      } else if (this.mode == "C") {
        this.EditField = false;
      }

      this.controlForm = this.fb.group({
        NAME: new FormControl(this.NAME, Validators.required),
        PAYMENT_FINE: new FormControl(this.PAYMENT_FINE, Validators.required),
        PAYMENT_FINE_PIPE: new FormControl(
          this.PAYMENT_FINE,
          Validators.required
        ),
        PAYMENT_FINE_DUE_DATE: new FormControl(
          this.PAYMENT_FINE_DUE_DATE,
          Validators.required
        ),
        PAYMENT_FINE_DUE_DATE_TIME: new FormControl(
          this.PAYMENT_FINE_DUE_DATE_TIME,
          Validators.required
        ),
        PAYMENT_DATE: new FormControl(this.PAYMENT_DATE, Validators.required),
        PAYMENT_TIME: new FormControl(this.PAYMENT_TIME, Validators.required),
        COMPARE_STAFF: this.fb.array([
          this.set_CONTRIBUTOR_ID28(),
          this.set_CONTRIBUTOR_ID34(),
        ]),
        IS_CHECK: new FormControl(false, [Validators.requiredTrue]),
        PAYMENT_DETAIL: this.fb.array([]),
        RECEIPT_BOOK_NO: new FormControl(
          this.RECEIPT_BOOK_NO,
          Validators.required
        ),
        RECEIPT_NO: new FormControl(this.RECEIPT_NO, Validators.required),
        IS_PAYMENT: new FormControl(this.IS_PAYMENT, Validators.required),
        signature: new FormControl(false, [Validators.requiredTrue]),
        RECEIPT_TYPE: new FormControl(this.RECEIPT_TYPE),
        PAYMENT_OFFICE_NAME: new FormControl(this.PAYMENT_OFFICE_NAME),
        PAYMENT_OFFICE_CODE: new FormControl(this.PAYMENT_OFFICE_CODE),
        RECEIPT_OFFICE_ID: new FormControl(this.RECEIPT_OFFICE_ID),
      });

      let staff = <FormArray>this.controlForm.controls.COMPARE_STAFF;
      staff.at(0).patchValue(this.CompareStaffDetail[0]);
      staff.at(1).patchValue(this.CompareStaffDetail[1]);
      if (this.CompareStaff.at(1).get("IS_ACTIVE").value == 1) {
        let check = { target: { checked: true } };
        this.iS_CHECK(check);
      } else {
        let check = { target: { checked: false } };
        this.iS_CHECK(check);
      }

      let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
      for (var i = 0; i < this.PAYMENT_DETAIL.length; i++) {
        control.push(this.fb.group(this.PAYMENT_DETAIL[i]));
      }
      this.preloader.setShowPreloader(false);
    }

    if (this.controlForm.get("RECEIPT_TYPE").value == 1) {
      if (this.imageSource == null) {
        this.controlForm.patchValue({ signature: false });
        swal({
          type: "warning",
          text: "ไม่พบข้อมูลลายเซ็นผู้รับชำระค่าปรับ",
          confirmButtonText: "ตกลง",
          buttonsStyling: true,
        });
      } else {
        this.controlForm.patchValue({ signature: true });
      }
    }
    this.set_payment();
    this.preloader.setShowPreloader(false);
  }

  /////////////////////////////////////////////////setOffice/////////////////////////////////////////////////
  typeheadOffice: any;
  private async setOfficeStore() {
    let officeCode = localStorage.getItem("officeCode");
    for (let l of this.typeheadOffice) {
      let code = l.OFFICE_CODE;
      if (officeCode == code) {
        this.controlForm.patchValue({
          PAYMENT_OFFICE_CODE: l.OFFICE_CODE || "",
          // OFFICE_NAME: l.OFFICE_NAME,
          PAYMENT_OFFICE_NAME: l.OFFICE_SHORT_NAME,
          RECEIPT_OFFICE_ID: l.OFFICE_ID,
        });
        break;
      }
    }
  }

  ////////////////////////////////////////////////////////////submit/////////////////////////////////////////////////////
  isReq_RECEIPT_BOOK_NO = false;
  isReq_RECEIPT_NO = false;
  isReq_FULL_NAME = false;
  isReq_REFERENCE_NO = false;
  isReq_PAYMENT_AMOUNT = false;
  onSubmit() {
    // console.log("controlFrom : ",this.controlForm.getRawValue());
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var s3 = 0;
    var s4 = 0;
    var s5 = 0;
    var s6 = 0;
    var s7 = 0;
    var s8 = 0;
    if (this.controlForm.get("RECEIPT_TYPE").value == 0) {
      if (this.set_payment() !== this.PAYMENT_FINE) {
        this._swal('"ยอดชำระเกินจากค่าปรับ"');
      } else {
        s6 = 1;
      }

      this.controlForm.get("PAYMENT_DETAIL").value.map((m, i) => {
        if (m.PAYMENT_TYPE == 1) {
          if (m.PAYMENT_FINE == 0 || m.PAYMENT_FINE == "") {
            this._swal(
              'กรุณาระบุข้อมูล "จำนวนเงิน" ของรายการชำระที่ ' + (i + 1)
            );
            s8 += 1;
          }
        } else {
          if (m.PAYMENT_FINE == 0 || m.PAYMENT_FINE == "") {
            this._swal(
              'กรุณาระบุข้อมูล "จำนวนเงิน" ของรายการชำระที่ ' + (i + 1)
            );
            s8 += 1;
          }
          if (m.REFFERENCE_NO == "" || m.REFFERENCE_NO == null) {
            this._swal(
              'กรุณาระบุข้อมูล "หมายเลขอ้างอิง" ของรายการชำระที่ ' + (i + 1)
            );
            s8 += 1;
          }
          // if (m.PAYMENT_BANK == '' || m.PAYMENT_BANK == null) {
          //   this._swal('กรุณาระบุข้อมูล "ธนาคาร" ของรายการชำระที่ ' + (i + 1));
          //   s8 += 1;
          // }
        }
      });

      if (this.controlForm.get("PAYMENT_DETAIL").value.length == 0) {
        this._swal('กรุณาระบุข้อมูล "รายการชำระค่าปรับ"');
      } else {
        s0 = 1;
      }

      if (this.CompareStaff.at(0).get("IS_ACTIVE").value == 0) {
        this.isReq_FULL_NAME = true;
        this._swal('กรุณาระบุข้อมูล "ผู้รับชำระค่าปรับ"');
      } else {
        this.isReq_FULL_NAME = false;
        s1 = 1;
      }

      if (this.controlForm.get("RECEIPT_NO").value == "") {
        this.isReq_RECEIPT_NO = true;
        this._swal('กรุณาระบุข้อมูล "ใบเสร็จเลขที่"');
      } else {
        this.isReq_RECEIPT_NO = false;
        s2 = 1;
      }

      if (this.controlForm.get("RECEIPT_BOOK_NO").value == "") {
        this.isReq_RECEIPT_BOOK_NO = true;
        this._swal('กรุณาระบุข้อมูล "ใบเสร็จเล่มที่"');
      } else {
        this.isReq_RECEIPT_BOOK_NO = false;
        s3 = 1;
      }

      if (this.controlForm.get("PAYMENT_TIME").invalid) {
        this._swal('กรุณาระบุข้อมูล "เวลาที่ชำระค่าปรับ"');
      } else {
        s4 = 1;
      }

      if (this.controlForm.get("PAYMENT_DATE").invalid) {
        this._swal('กรุณาระบุข้อมูล "วันที่ชำระค่าปรับ"');
      } else {
        s5 = 1;
      }

      if (this.controlForm.get("PAYMENT_OFFICE_NAME").invalid) {
        this._swal('กรุณาระบุข้อมูล "ที่ทำการ"');
      } else {
        s7 = 1;
      }

      if (this.controlForm.get("PAYMENT_OFFICE_NAME").invalid) {
        this._swal('กรุณาระบุข้อมูล "ที่ทำการ"');
      } else {
        s7 = 1;
      }

      if (
        s0 == 1 &&
        s1 == 1 &&
        s2 == 1 &&
        s3 == 1 &&
        s4 == 1 &&
        s5 == 1 &&
        s6 == 1 &&
        s7 == 1 &&
        s8 == 0
      ) {
        this.activeModal.close(this.controlForm.getRawValue());
      }
    } else {
      if (this.set_payment() !== this.PAYMENT_FINE) {
        this._swal('"ยอดชำระเกินจากค่าปรับ"');
      } else {
        s6 = 1;
      }

      this.controlForm.get("PAYMENT_DETAIL").value.map((m, i) => {
        if (m.PAYMENT_TYPE == 1) {
          if (m.PAYMENT_FINE == 0 || m.PAYMENT_FINE == "") {
            this._swal(
              'กรุณาระบุข้อมูล "จำนวนเงิน" ของรายการชำระที่ ' + (i + 1)
            );
            s8 += 1;
          }
        } else {
          if (m.PAYMENT_FINE == 0 || m.PAYMENT_FINE == "") {
            this._swal(
              'กรุณาระบุข้อมูล "จำนวนเงิน" ของรายการชำระที่ ' + (i + 1)
            );
            s8 += 1;
          }
          if (m.REFFERENCE_NO == "" || m.REFFERENCE_NO == null) {
            this._swal(
              'กรุณาระบุข้อมูล "หมายเลขอ้างอิง" ของรายการชำระที่ ' + (i + 1)
            );
            s8 += 1;
          }
          // if (m.PAYMENT_BANK == '' || m.PAYMENT_BANK == null) {
          //   this._swal('กรุณาระบุข้อมูล "ธนาคาร" ของรายการชำระที่ ' + (i + 1));
          //   s8 += 1;
          // }
        }
      });

      if (this.controlForm.get("PAYMENT_DETAIL").value.length == 0) {
        this._swal('กรุณาระบุข้อมูล "รายการชำระค่าปรับ"');
      } else {
        s0 = 1;
      }

      if (this.controlForm.get("PAYMENT_TIME").invalid) {
        this._swal('กรุณาระบุข้อมูล "เวลาที่ชำระค่าปรับ"');
      } else {
        s4 = 1;
      }

      if (this.controlForm.get("PAYMENT_DATE").invalid) {
        this._swal('กรุณาระบุข้อมูล "วันที่ชำระค่าปรับ"');
      } else {
        s5 = 1;
      }

      if (s0 == 1 && s4 == 1 && s5 == 1 && s6 == 1 && s8 == 0) {
        this.activeModal.close(this.controlForm.getRawValue());
      }
    }
    // this.activeModal.close(this.controlForm.getRawValue());
  }

  _swal(isReq_RECEIPT_BOOK_NO) {
    swal({
      type: "warning",
      text: isReq_RECEIPT_BOOK_NO,
      confirmButtonText: "ตกลง",
      buttonsStyling: true,
    });
  }

  dismiss() {
    this.activeModal.close();
  }

  cancel() {
    swal({
      type: "warning",
      text: "ยืนยันการทำรายการหรือไม่" + " ?",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      buttonsStyling: true,
    }).then((result) => {
      // console.log("ยกเลิกการทำรายการ : ",result.value)
      if (result.value == true) {
        var cancel = "cancel";
        this.activeModal.close(cancel);
      }
    });
  }

  cancel_payment() {
    swal({
      type: "warning",
      text: "ยืนยันการทำรายการหรือไม่" + " ?",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      buttonsStyling: true,
    }).then(async (result) => {
      if (result.value == true) {
        this.fineService
          .ReceriptNoupdDelete({ COMPARE_DETAIL_ID: this.COMPARE_DETAIL_ID })
          .then(
            (res) => {
              if (res.IsSuccess == "True") {
                var cancel = "cancel_payment";
                this.activeModal.close(cancel);
              } else {
                swal({
                  type: "warning",
                  text: Message.delFail,
                  showCancelButton: false,
                  cancelButtonColor: "#d33",
                  confirmButtonText: "ตกลง",
                  cancelButtonText: "ยกเลิก",
                  buttonsStyling: true,
                });
              }
            },
            () => {
              swal({
                type: "warning",
                text: Message.delFail,
                showCancelButton: false,
                cancelButtonColor: "#d33",
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
                buttonsStyling: true,
              });
            }
          );
      }
    });
  }

  require(e) {
    switch (e) {
      case "isReq_RECEIPT_BOOK_NO":
        this.isReq_RECEIPT_BOOK_NO = false;
        break;
      case "isReq_RECEIPT_NO":
        this.isReq_RECEIPT_NO = false;
        break;
    }
  }
  //////////////////////////////////////////////////office////////////////////////////////////////

  isReq_OffName = new BehaviorSubject<boolean>(false);
  isReq_OFFICE_NAME = false;
  serachOffice = (text3$: Observable<string>) =>
    text3$
      .debounceTime(200)
      .distinctUntilChanged()
      .map((term) =>
        term === ""
          ? []
          : this.typeheadOffice
              .filter(
                (v) =>
                  `${v.OFFICE_NAME || ""} ${v.OFFICE_SHORT_NAME || ""}`
                    .toLowerCase()
                    .indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      );

  formatterOffice1 = (x: { OFFICE_SHORT_NAME: string }) => x.OFFICE_SHORT_NAME;
  formatterOffice2 = (x: { OFFICE_SHORT_NAME: string }) => x.OFFICE_SHORT_NAME;

  selectItemOffice(e) {
    this.controlForm.patchValue({
      PAYMENT_OFFICE_NAME: e.item.OFFICE_SHORT_NAME,
      PAYMENT_OFFICE_CODE: e.item.OFFICE_CODE,
      RECEIPT_OFFICE_ID: e.item.OFFICE_ID,
    });
  }

  blurSelectItemOffice(input) {
    let val = input.value;
    if (!val) {
      this.controlForm.patchValue({
        PAYMENT_OFFICE_NAME: "",
        PAYMENT_OFFICE_CODE: "",
        RECEIPT_OFFICE_ID: "",
      });
    }
  }

  /////////////////////////////////////////////mode////////////////////////////////////////

  check(e) {
    if (e == "0") {
      this.controlForm.get("RECEIPT_TYPE").setValue(0);
      this.controlForm.get("RECEIPT_BOOK_NO").setValue("");
      this.controlForm.get("RECEIPT_NO").setValue("");
      this.controlForm
        .get("PAYMENT_DATE")
        .setValue(this.toDatePickerFormat(new Date()));
      this.controlForm
        .get("PAYMENT_TIME")
        .setValue(this.getTimeNow(new Date()));
      // this.controlForm.get("PAYMENT_OFFICE_NAME").setValue(this.RE_OFFNAME);
      // this.controlForm.get("PAYMENT_OFFICE_CODE").setValue(this.RE_OFFCODE);
      this.setOfficeStore();
      this.deleteContri(0);
      this.set_staff(this.set_CONTRIBUTOR_ID28(), 0);
      this.deleteContri(1);
      this.controlForm.get("IS_CHECK").setValue(false);
    } else if (e == "1") {
      // this.preloader.setShowPreloader(true);

      this.controlForm.get("RECEIPT_TYPE").setValue(1);
      this.controlForm.get("RECEIPT_BOOK_NO").setValue("");
      this.controlForm.get("RECEIPT_NO").setValue("Auto Generate");
      this.controlForm
        .get("PAYMENT_DATE")
        .setValue(this.toDatePickerFormat(new Date()));
      this.controlForm
        .get("PAYMENT_TIME")
        .setValue(this.getTimeNow(new Date()));
      // this.controlForm.get("PAYMENT_OFFICE_NAME").setValue(this.RE_OFFNAME);
      // this.controlForm.get("PAYMENT_OFFICE_CODE").setValue(this.RE_OFFCODE);
      this.setOfficeStore();
      this.deleteContri(0);
      this.set_staff(this.set_CONTRIBUTOR_ID28(), 0);
      this.deleteContri(1);
      this.controlForm.get("IS_CHECK").setValue(false);

      if (this.imageSource == null) {
        this.controlForm.patchValue({
          signature: false,
        });
        swal({
          type: "warning",
          text: "ไม่พบข้อมูลลายเซ็นผู้รับชำระค่าปรับ",
          confirmButtonText: "ตกลง",
          buttonsStyling: true,
        });
      } else {
        this.controlForm.patchValue({
          signature: true,
        });
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////// Bank //////////////////////////////////////////////////////////////////////////////////////////
  isReq_Bank = new BehaviorSubject<boolean>(false);
  serachBank = (text3$: Observable<string>) =>
    text3$
      .debounceTime(200)
      .distinctUntilChanged()
      .map((term) =>
        term === ""
          ? []
          : this.BANKING.filter(
              (v) =>
                `${v.BANK_NAME || ""} ${v.BANK_CODE || ""}`
                  .toLowerCase()
                  .indexOf(term.toLowerCase()) > -1
            ).slice(0, 10)
      );

  formatterBank = (x: { BANK_NAME: string }) => x.BANK_NAME;

  selectItemBank(e, i) {
    console.log(e.item);
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    e.item.BANK_NAME = e.item.BANK_NAME.trim();
    control.at(i).get("PAYMENT_BANK").setValue(e.item.BANK_NAME);
    control.at(i).get("PAYMENT_CODE").setValue(e.item.BANK_CODE);
  }

  blurSelectItemBank(input, i) {
    let val = input.value;
    if (!val) {
      let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
      control.at(i).get("PAYMENT_BANK").setValue("");
      control.at(i).get("PAYMENT_CODE").setValue("");
    }
  }

  /////////////////////////////////////////////time ////////////////////////////////////////
  getTimeNow(d: any = new Date(), isZero: any = null) {
    let h = d.getHours().toString();
    let m = d.getMinutes().toString();
    if (+h < 10) {
      h = "0" + h;
    }
    if (+m < 10) m = "0" + m;
    return h + ":" + m + "";
  }

  toDatePickerFormat(d: any) {
    return {
      date: {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
      },
      formatted: toLocalShort(d.toString()).replace(/ /g, " "),
    };
  }
  /////////////////////////////////////////////payment //////////////////////////////////////
  set_payment(): number {
    var total = 0;
    const payment = this.controlForm.get("PAYMENT_DETAIL") as FormArray;

    for (var i = 0; i < payment.value.length; i++) {
      total += parseFloat(payment.at(i).get("PAYMENT_FINE").value);
    }

    return total;
  }

  clear_PAYMENT_TYPE(e, i) {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    if (e == 1) {
      control.at(i).get("PAYMENT_BANK").setValue("");
      control.at(i).get("PAYMENT_CODE").setValue("");
      control.at(i).get("REFFERENCE_NO").setValue("");
    } else {
      control.at(i).get("PAYMENT_CODE").setValue("006");
      control.at(i).get("PAYMENT_BANK").setValue("006");
    }
  }

  private setPayment(): FormGroup {
    const control = {
      PAYMENT_ID: new FormControl(0),
      COMPARE_DETAIL_ID: new FormControl(0),
      PAYMENT_TYPE: new FormControl(1),
      REFFERENCE_NO: new FormControl(""),
      PAYMENT_FINE: new FormControl(this.PAYMENT_FINE, Validators.required),
      PAYMENT_FINE_PIPE: new FormControl(
        this.convert_Calculator(this.PAYMENT_FINE),
        Validators.required
      ),
      PAYMENT_BANK: new FormControl(""),
      PAYMENT_CODE: new FormControl(""),
      IS_ACTIVE: new FormControl(1),
    };
    return this.fb.group(control);
  }

  addPayment() {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    var num = 0;
    control.push(
      this.fb.group({
        PAYMENT_ID: new FormControl(0),
        COMPARE_DETAIL_ID: new FormControl(0),
        PAYMENT_TYPE: new FormControl(1),
        REFFERENCE_NO: new FormControl(""),
        PAYMENT_FINE: new FormControl(num, Validators.required),
        PAYMENT_FINE_PIPE: new FormControl(
          this.convert_Calculator(num),
          Validators.required
        ),
        PAYMENT_BANK: new FormControl(""),
        PAYMENT_CODE: new FormControl(""),
        IS_ACTIVE: new FormControl(1),
      })
    );
  }

  deletePayment(index) {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    control.removeAt(index);
  }

  iS_CHECK(event) {
    // console.log(event.target.checked)

    // console.log(this.compareForm.getRawValue())

    if (event.target.checked == true) {
      const control = this.controlForm;
      control.patchValue({
        IS_CHECK: true,
      });
    } else if (event.target.checked == false) {
      const control = this.controlForm;
      control.patchValue({
        IS_CHECK: false,
      });
    }
    // console.log(this.compareForm.getRawValue())
  }

  public PipeResponseData(obj: Observable<any>) {
    return obj.pipe(
      map((x) => {
        if (x == null || x == undefined) return [];

        if (x["SUCCESS"] == true) return x["RESPONSE_DATA"];

        return [];
      })
    );
  }

  public searchStaff = (text2$: Observable<string>) =>
    text2$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => (this.searching = true))
      .switchMap((term) =>
        this.fineService
          .MasStaffgetByCon_Search({ TEXT_SEARCH: term })
          .do(() => (this.searchFailed = false))
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          })
      )
      .do(() => (this.searching = false));

  formatterStaff = (x: {
    TITLE_SHORT_NAME_TH: string;
    FIRST_NAME: string;
    LAST_NAME: string;
  }) =>
    `${x.TITLE_SHORT_NAME_TH || ""}${x.FIRST_NAME || ""} ${x.LAST_NAME || ""}`;

  deleteContri(i) {
    var _ContributorID;
    if (i == 0) {
      _ContributorID = 28;
    } else if (i == 1) {
      _ContributorID = 34;
    }

    // swal({
    //   type: 'warning',
    //   text: "ยืนยันการทำรายการหรือไม่" + ' ?',
    //   showCancelButton: true,
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'ตกลง',
    //   cancelButtonText: 'ยกเลิก',
    //   buttonsStyling: true,

    // }).then((result) => {
    // console.log("ยกเลิกการทำรายการ : ",result.value)
    // if (result.value == true){
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
      IS_ACTIVE: 0,
    });
    // console.log("staff : ",this.CompareStaff.getRawValue())
    // }else{
    // console.log("staff : ",this.CompareStaff.getRawValue())
    // }
    // })
  }
  selectItemStaff(e, i) {
    var _ContributorID;
    if (i == 0) {
      _ContributorID = 28;
    } else if (i == 1) {
      _ContributorID = 34;
    }
    this.CompareStaff.at(i).patchValue({
      COMPARE_ID: "",
      CONTRIBUTOR_ID: _ContributorID || "",
      BIRTH_DATE: e.item.BIRTH_DATE || "",
      FIRST_NAME: e.item.FIRST_NAME || "",
      ID_CARD: e.item.ID_CARD || "",
      IS_ACTIVE: e.item.IS_ACTIVE || "",
      LAST_NAME: e.item.LAST_NAME || "",
      FULL_NAME:
        `${e.item.TITLE_SHORT_NAME_TH || ""}${e.item.FIRST_NAME || ""} ${
          e.item.LAST_NAME || ""
        }` || "",
      MANAGEMENT_DEPT_CODE: e.item.MANAGEMENT_DEPT_CODE || "",
      MANAGEMENT_DEPT_LEVEL: e.item.MANAGEMENT_DEPT_LEVEL || "",
      MANAGEMENT_DEPT_NAME: e.item.MANAGEMENT_DEPT_NAME || "",
      MANAGEMENT_OFFICE_CODE: e.item.MANAGEMENT_OFFICE_CODE || "",
      MANAGEMENT_OFFICE_NAME: e.item.MANAGEMENT_OFFICE_NAME || "",
      MANAGEMENT_OFFICE_SHORT_NAME: e.item.MANAGEMENT_OFFICE_SHORT_NAME || "",
      MANAGEMENT_POS_CODE: e.item.MANAGEMENT_POS_CODE || "",
      MANAGEMENT_POS_LEVEL: e.item.MANAGEMENT_POS_LEVEL || "",
      MANAGEMENT_POS_LEVEL_NAME: e.item.MANAGEMENT_POS_LEVEL_NAME || "",
      MANAGEMENT_POS_NAME: e.item.MANAGEMENT_POS_NAME || "",
      MANAGEMENT_UNDER_DEPT_CODE: e.item.MANAGEMENT_UNDER_DEPT_CODE || "",
      MANAGEMENT_UNDER_DEPT_LEVEL: e.item.MANAGEMENT_UNDER_DEPT_LEVEL || "",
      MANAGEMENT_UNDER_DEPT_NAME: e.item.MANAGEMENT_UNDER_DEPT_NAME || "",
      MANAGEMENT_WORK_DEPT_CODE: e.item.MANAGEMENT_WORK_DEPT_CODE || "",
      MANAGEMENT_WORK_DEPT_LEVEL: e.item.MANAGEMENT_WORK_DEPT_LEVEL || "",
      MANAGEMENT_WORK_DEPT_NAME: e.item.MANAGEMENT_WORK_DEPT_NAME || "",
      OPERATION_DEPT_CODE: e.item.OPERATION_DEPT_CODE || "",
      OPERATION_DEPT_LEVEL: e.item.OPERATION_DEPT_LEVEL || "",
      OPERATION_DEPT_NAME: e.item.OPERATION_DEPT_NAME || "",
      OPERATION_OFFICE_CODE: e.item.OPERATION_OFFICE_CODE || "",
      OPERATION_OFFICE_NAME: e.item.OPERATION_OFFICE_NAME || "",
      OPERATION_OFFICE_SHORT_NAME: e.item.OPERATION_OFFICE_SHORT_NAME || "",
      OPERATION_POS_CODE: e.item.OPERATION_POS_CODE || "",
      OPERATION_POS_LEVEL_NAME: e.item.OPERATION_POS_LEVEL_NAME || "",
      OPERATION_UNDER_DEPT_CODE: e.item.OPERATION_UNDER_DEPT_CODE || "",
      OPERATION_UNDER_DEPT_LEVEL: e.item.OPERATION_UNDER_DEPT_LEVEL || "",
      OPERATION_UNDER_DEPT_NAME: e.item.OPERATION_UNDER_DEPT_NAME || "",
      OPERATION_WORK_DEPT_CODE: e.item.OPERATION_WORK_DEPT_CODE || "",
      OPERATION_WORK_DEPT_LEVEL: e.item.OPERATION_WORK_DEPT_LEVEL || "",
      OPERATION_WORK_DEPT_NAME: e.item.OPERATION_WORK_DEPT_NAME || "",
      OPREATION_POS_LEVEL: e.item.OPREATION_POS_LEVEL || "",
      OPREATION_POS_NAME: e.item.OPREATION_POS_NAME || "",
      REMARK: e.item.REMARK || "",
      REPRESENT_DEPT_CODE: e.item.REPRESENT_DEPT_CODE || "",
      REPRESENT_DEPT_LEVEL: e.item.REPRESENT_DEPT_LEVEL || "",
      REPRESENT_DEPT_NAME: e.item.REPRESENT_DEPT_NAME || "",
      REPRESENT_OFFICE_CODE: e.item.REPRESENT_OFFICE_CODE || "",
      REPRESENT_OFFICE_NAME: e.item.REPRESENT_OFFICE_NAME || "",
      REPRESENT_OFFICE_SHORT_NAME: e.item.REPRESENT_OFFICE_SHORT_NAME || "",
      REPRESENT_POS_CODE: e.item.REPRESENT_POS_CODE || "",
      REPRESENT_POS_LEVEL: e.item.REPRESENT_POS_LEVEL || "",
      REPRESENT_POS_LEVEL_NAME: e.item.REPRESENT_POS_LEVEL_NAME || "",
      REPRESENT_POS_NAME: e.item.REPRESENT_POS_NAME || "",
      REPRESENT_UNDER_DEPT_CODE: e.item.REPRESENT_UNDER_DEPT_CODE || "",
      REPRESENT_UNDER_DEPT_LEVEL: e.item.REPRESENT_UNDER_DEPT_LEVEL || "",
      REPRESENT_UNDER_DEPT_NAME: e.item.REPRESENT_UNDER_DEPT_NAME || "",
      REPRESENT_WORK_DEPT_CODE: e.item.REPRESENT_WORK_DEPT_CODE || "",
      REPRESENT_WORK_DEPT_LEVEL: e.item.REPRESENT_WORK_DEPT_LEVEL || "",
      REPRESENT_WORK_DEPT_NAME: e.item.REPRESENT_WORK_DEPT_NAME || "",
      STAFF_CODE: e.item.STAFF_CODE || "",
      STAFF_ID: e.item.STAFF_ID || "",
      STAFF_TYPE: e.item.STAFF_TYPE || "",
      STATUS: e.item.STATUS || "",
      TITLE_ID: e.item.TITLE_ID || "",
      TITLE_NAME_EN: e.item.TITLE_NAME_EN || "",
      TITLE_NAME_TH: e.item.TITLE_NAME_TH || "",
      TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN || "",
      TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH || "",
    });
  }

  deleteStaff(e, i) {
    // if(this.CompareStaff.at(i).get('FULL_NAME').value == null){
    //   console.log("yes")
    // }else{
    //   console.log(this.CompareStaff.at(i).get('FULL_NAME').value)
    // }
  }

  set_staff(e, i) {
    let staff = e.value;
    var _ContributorID;
    if (i == 0) {
      _ContributorID = 28;
    } else if (i == 1) {
      _ContributorID = 34;
    }
    this.CompareStaff.at(i).patchValue({
      FULL_NAME:
        staff.TITLE_SHORT_NAME_TH + staff.FIRST_NAME + " " + staff.LAST_NAME ||
        "",
      STAFF_ID: staff.STAFF_ID || "",
      COMPARE_ID: "",
      COMPARE_DETAIL_ID: "",
      STAFF_REF_ID: staff.STAFF_REF_ID || "",
      TITLE_ID: staff.TITLE_ID || "",
      STAFF_CODE: staff.STAFF_CODE || "",
      ID_CARD: staff.ID_CARD || "",
      STAFF_TYPE: staff.STAFF_TYPE || "",
      TITLE_NAME_TH: staff.TITLE_NAME_TH || "",
      TITLE_NAME_EN: staff.TITLE_NAME_EN || "",
      TITLE_SHORT_NAME_TH: staff.TITLE_SHORT_NAME_TH || "",
      TITLE_SHORT_NAME_EN: staff.TITLE_SHORT_NAME_EN || "",
      FIRST_NAME: staff.FIRST_NAME || "",
      LAST_NAME: staff.LAST_NAME || "",
      AGE: staff.AGE || "",
      OPERATION_POS_CODE: staff.OPERATION_POS_CODE || "",
      OPREATION_POS_NAME: staff.OPREATION_POS_NAME || "",
      OPREATION_POS_LEVEL: staff.OPREATION_POS_LEVEL || "",
      OPERATION_POS_LEVEL_NAME: staff.OPERATION_POS_LEVEL_NAME || "",
      OPERATION_DEPT_CODE: staff.OPERATION_DEPT_CODE || "",
      OPERATION_DEPT_NAME: staff.OPERATION_DEPT_NAME || "",
      OPERATION_DEPT_LEVEL: staff.OPERATION_DEPT_LEVEL || "",
      OPERATION_UNDER_DEPT_CODE: staff.OPERATION_UNDER_DEPT_CODE || "",
      OPERATION_UNDER_DEPT_NAME: staff.OPERATION_UNDER_DEPT_NAME || "",
      OPERATION_UNDER_DEPT_LEVEL: staff.OPERATION_UNDER_DEPT_LEVEL || "",
      OPERATION_WORK_DEPT_CODE: staff.OPERATION_WORK_DEPT_CODE || "",
      OPERATION_WORK_DEPT_NAME: staff.OPERATION_WORK_DEPT_NAME || "",
      OPERATION_WORK_DEPT_LEVEL: staff.OPERATION_WORK_DEPT_LEVEL || "",
      OPERATION_OFFICE_CODE: staff.OPERATION_OFFICE_CODE || "",
      OPERATION_OFFICE_NAME: staff.OPERATION_OFFICE_NAME || "",
      OPERATION_OFFICE_SHORT_NAME: staff.OPERATION_OFFICE_SHORT_NAME || "",
      MANAGEMENT_POS_CODE: staff.MANAGEMENT_POS_CODE || "",
      MANAGEMENT_POS_NAME: staff.MANAGEMENT_POS_NAME || "",
      MANAGEMENT_POS_LEVEL: staff.MANAGEMENT_POS_LEVEL || "",
      MANAGEMENT_POS_LEVEL_NAME: staff.MANAGEMENT_POS_LEVEL_NAME || "",
      MANAGEMENT_DEPT_CODE: staff.MANAGEMENT_DEPT_CODE || "",
      MANAGEMENT_DEPT_NAME: staff.MANAGEMENT_DEPT_NAME || "",
      MANAGEMENT_DEPT_LEVEL: staff.MANAGEMENT_DEPT_LEVEL || "",
      MANAGEMENT_UNDER_DEPT_CODE: staff.MANAGEMENT_UNDER_DEPT_CODE || "",
      MANAGEMENT_UNDER_DEPT_NAME: staff.MANAGEMENT_UNDER_DEPT_NAME || "",
      MANAGEMENT_UNDER_DEPT_LEVEL: staff.MANAGEMENT_UNDER_DEPT_LEVEL || "",
      MANAGEMENT_WORK_DEPT_CODE: staff.MANAGEMENT_WORK_DEPT_CODE || "",
      MANAGEMENT_WORK_DEPT_NAME: staff.MANAGEMENT_WORK_DEPT_NAME || "",
      MANAGEMENT_WORK_DEPT_LEVEL: staff.MANAGEMENT_WORK_DEPT_LEVEL || "",
      MANAGEMENT_OFFICE_CODE: staff.MANAGEMENT_OFFICE_CODE || "",
      MANAGEMENT_OFFICE_NAME: staff.MANAGEMENT_OFFICE_NAME || "",
      MANAGEMENT_OFFICE_SHORT_NAME: staff.MANAGEMENT_OFFICE_SHORT_NAME || "",
      REPRESENTATION_POS_CODE: staff.REPRESENTATION_POS_CODE || "",
      REPRESENTATION_POS_NAME: staff.REPRESENTATION_POS_NAME || "",
      REPRESENTATION_POS_LEVEL: staff.REPRESENTATION_POS_LEVEL || "",
      REPRESENTATION_POS_LEVEL_NAME: staff.REPRESENTATION_POS_LEVEL_NAME || "",
      REPRESENTATION_DEPT_CODE: staff.REPRESENTATION_DEPT_CODE || "",
      REPRESENTATION_DEPT_NAME: staff.REPRESENTATION_DEPT_NAME || "",
      REPRESENTATION_DEPT_LEVEL: staff.REPRESENTATION_DEPT_LEVEL || "",
      REPRESENTATION_UNDER_DEPT_CODE:
        staff.REPRESENTATION_UNDER_DEPT_CODE || "",
      REPRESENTATION_UNDER_DEPT_NAME:
        staff.REPRESENTATION_UNDER_DEPT_NAME || "",
      REPRESENTATION_UNDER_DEPT_LEVEL:
        staff.REPRESENTATION_UNDER_DEPT_LEVEL || "",
      REPRESENT_WORK_DEPT_CODE: staff.REPRESENT_WORK_DEPT_CODE || "",
      REPRESENT_WORK_DEPT_NAME: staff.REPRESENT_WORK_DEPT_NAME || "",
      REPRESENT_WORK_DEPT_LEVEL: staff.REPRESENT_WORK_DEPT_LEVEL || "",
      REPRESENT_OFFICE_CODE: staff.REPRESENT_OFFICE_CODE || "",
      REPRESENT_OFFICE_NAME: staff.REPRESENT_OFFICE_NAME || "",
      REPRESENT_OFFICE_SHORT_NAME: staff.REPRESENT_OFFICE_SHORT_NAME || "",
      STATUS: staff.STATUS || "",
      REMARK: staff.REMARK || "",
      CONTRIBUTOR_ID: _ContributorID,
      IS_ACTIVE: 1,
    });
  }

  private set_CONTRIBUTOR_ID28(): FormGroup {
    const staff = JSON.parse(localStorage.getItem("staffInfo"));
    // console.log(staff.APPROVE_CODE);
    const CompareFormControl = {
      FULL_NAME: new FormControl(
        staff.TITLE_SHORT_NAME_TH + staff.FIRST_NAME + " " + staff.LAST_NAME ||
          "",
        Validators.required
      ),
      STAFF_ID: new FormControl(staff.STAFF_ID || ""),
      COMPARE_ID: new FormControl(""),
      COMPARE_DETAIL_ID: new FormControl(""),
      STAFF_REF_ID: new FormControl(staff.STAFF_REF_ID || ""),
      TITLE_ID: new FormControl(staff.TITLE_ID || ""),
      STAFF_CODE: new FormControl(staff.STAFF_CODE || ""),
      ID_CARD: new FormControl(staff.ID_CARD || ""),
      STAFF_TYPE: new FormControl(staff.STAFF_TYPE || ""),
      TITLE_NAME_TH: new FormControl(staff.TITLE_NAME_TH || ""),
      TITLE_NAME_EN: new FormControl(staff.TITLE_NAME_EN || ""),
      TITLE_SHORT_NAME_TH: new FormControl(staff.TITLE_SHORT_NAME_TH || ""),
      TITLE_SHORT_NAME_EN: new FormControl(staff.TITLE_SHORT_NAME_EN || ""),
      FIRST_NAME: new FormControl(staff.FIRST_NAME || ""),
      LAST_NAME: new FormControl(staff.LAST_NAME || ""),
      AGE: new FormControl(staff.AGE || ""),
      OPERATION_POS_CODE: new FormControl(staff.OPERATION_POS_CODE || ""),
      OPREATION_POS_NAME: new FormControl(staff.OPREATION_POS_NAME || ""),
      OPREATION_POS_LEVEL: new FormControl(staff.OPREATION_POS_LEVEL || ""),
      OPERATION_POS_LEVEL_NAME: new FormControl(
        staff.OPERATION_POS_LEVEL_NAME || ""
      ),
      OPERATION_DEPT_CODE: new FormControl(staff.OPERATION_DEPT_CODE || ""),
      OPERATION_DEPT_NAME: new FormControl(staff.OPERATION_DEPT_NAME || ""),
      OPERATION_DEPT_LEVEL: new FormControl(staff.OPERATION_DEPT_LEVEL || ""),
      OPERATION_UNDER_DEPT_CODE: new FormControl(
        staff.OPERATION_UNDER_DEPT_CODE || ""
      ),
      OPERATION_UNDER_DEPT_NAME: new FormControl(
        staff.OPERATION_UNDER_DEPT_NAME || ""
      ),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(
        staff.OPERATION_UNDER_DEPT_LEVEL || ""
      ),
      OPERATION_WORK_DEPT_CODE: new FormControl(
        staff.OPERATION_WORK_DEPT_CODE || ""
      ),
      OPERATION_WORK_DEPT_NAME: new FormControl(
        staff.OPERATION_WORK_DEPT_NAME || ""
      ),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(
        staff.OPERATION_WORK_DEPT_LEVEL || ""
      ),
      OPERATION_OFFICE_CODE: new FormControl(staff.OPERATION_OFFICE_CODE || ""),
      OPERATION_OFFICE_NAME: new FormControl(staff.OPERATION_OFFICE_NAME || ""),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(
        staff.OPERATION_OFFICE_SHORT_NAME || ""
      ),
      MANAGEMENT_POS_CODE: new FormControl(staff.MANAGEMENT_POS_CODE || ""),
      MANAGEMENT_POS_NAME: new FormControl(staff.MANAGEMENT_POS_NAME || ""),
      MANAGEMENT_POS_LEVEL: new FormControl(staff.MANAGEMENT_POS_LEVEL || ""),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(
        staff.MANAGEMENT_POS_LEVEL_NAME || ""
      ),
      MANAGEMENT_DEPT_CODE: new FormControl(staff.MANAGEMENT_DEPT_CODE || ""),
      MANAGEMENT_DEPT_NAME: new FormControl(staff.MANAGEMENT_DEPT_NAME || ""),
      MANAGEMENT_DEPT_LEVEL: new FormControl(staff.MANAGEMENT_DEPT_LEVEL || ""),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(
        staff.MANAGEMENT_UNDER_DEPT_CODE || ""
      ),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(
        staff.MANAGEMENT_UNDER_DEPT_NAME || ""
      ),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(
        staff.MANAGEMENT_UNDER_DEPT_LEVEL || ""
      ),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(
        staff.MANAGEMENT_WORK_DEPT_CODE || ""
      ),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(
        staff.MANAGEMENT_WORK_DEPT_NAME || ""
      ),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(
        staff.MANAGEMENT_WORK_DEPT_LEVEL || ""
      ),
      MANAGEMENT_OFFICE_CODE: new FormControl(
        staff.MANAGEMENT_OFFICE_CODE || ""
      ),
      MANAGEMENT_OFFICE_NAME: new FormControl(
        staff.MANAGEMENT_OFFICE_NAME || ""
      ),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(
        staff.MANAGEMENT_OFFICE_SHORT_NAME || ""
      ),
      REPRESENTATION_POS_CODE: new FormControl(
        staff.REPRESENTATION_POS_CODE || ""
      ),
      REPRESENTATION_POS_NAME: new FormControl(
        staff.REPRESENTATION_POS_NAME || ""
      ),
      REPRESENTATION_POS_LEVEL: new FormControl(
        staff.REPRESENTATION_POS_LEVEL || ""
      ),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(
        staff.REPRESENTATION_POS_LEVEL_NAME || ""
      ),
      REPRESENTATION_DEPT_CODE: new FormControl(
        staff.REPRESENTATION_DEPT_CODE || ""
      ),
      REPRESENTATION_DEPT_NAME: new FormControl(
        staff.REPRESENTATION_DEPT_NAME || ""
      ),
      REPRESENTATION_DEPT_LEVEL: new FormControl(
        staff.REPRESENTATION_DEPT_LEVEL || ""
      ),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(
        staff.REPRESENTATION_UNDER_DEPT_CODE || ""
      ),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(
        staff.REPRESENTATION_UNDER_DEPT_NAME || ""
      ),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(
        staff.REPRESENTATION_UNDER_DEPT_LEVEL || ""
      ),
      REPRESENT_WORK_DEPT_CODE: new FormControl(
        staff.REPRESENT_WORK_DEPT_CODE || ""
      ),
      REPRESENT_WORK_DEPT_NAME: new FormControl(
        staff.REPRESENT_WORK_DEPT_NAME || ""
      ),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(
        staff.REPRESENT_WORK_DEPT_LEVEL || ""
      ),
      REPRESENT_OFFICE_CODE: new FormControl(staff.REPRESENT_OFFICE_CODE || ""),
      REPRESENT_OFFICE_NAME: new FormControl(staff.REPRESENT_OFFICE_NAME || ""),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(
        staff.REPRESENT_OFFICE_SHORT_NAME || ""
      ),
      STATUS: new FormControl(staff.STATUS || ""),
      REMARK: new FormControl(staff.REMARK || ""),
      CONTRIBUTOR_ID: new FormControl(28),
      IS_ACTIVE: new FormControl(1),
    };
    return this.fb.group(CompareFormControl);
  }

  private set_CONTRIBUTOR_ID34(): FormGroup {
    const CompareFormControl = {
      FULL_NAME: new FormControl("", Validators.required),
      STAFF_ID: new FormControl(""),
      COMPARE_ID: new FormControl(""),
      COMPARE_DETAIL_ID: new FormControl(""),
      STAFF_REF_ID: new FormControl(""),
      TITLE_ID: new FormControl(""),
      STAFF_CODE: new FormControl(""),
      ID_CARD: new FormControl(""),
      STAFF_TYPE: new FormControl(""),
      TITLE_NAME_TH: new FormControl(""),
      TITLE_NAME_EN: new FormControl(""),
      TITLE_SHORT_NAME_TH: new FormControl(""),
      TITLE_SHORT_NAME_EN: new FormControl(""),
      FIRST_NAME: new FormControl(""),
      LAST_NAME: new FormControl(""),
      AGE: new FormControl(""),
      OPERATION_POS_CODE: new FormControl(""),
      OPREATION_POS_NAME: new FormControl(""),
      OPREATION_POS_LEVEL: new FormControl(""),
      OPERATION_POS_LEVEL_NAME: new FormControl(""),
      OPERATION_DEPT_CODE: new FormControl(""),
      OPERATION_DEPT_NAME: new FormControl(""),
      OPERATION_DEPT_LEVEL: new FormControl(""),
      OPERATION_UNDER_DEPT_CODE: new FormControl(""),
      OPERATION_UNDER_DEPT_NAME: new FormControl(""),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(""),
      OPERATION_WORK_DEPT_CODE: new FormControl(""),
      OPERATION_WORK_DEPT_NAME: new FormControl(""),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(""),
      OPERATION_OFFICE_CODE: new FormControl(""),
      OPERATION_OFFICE_NAME: new FormControl(""),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(""),
      MANAGEMENT_POS_CODE: new FormControl(""),
      MANAGEMENT_POS_NAME: new FormControl(""),
      MANAGEMENT_POS_LEVEL: new FormControl(""),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(""),
      MANAGEMENT_DEPT_CODE: new FormControl(""),
      MANAGEMENT_DEPT_NAME: new FormControl(""),
      MANAGEMENT_DEPT_LEVEL: new FormControl(""),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(""),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(""),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(""),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(""),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(""),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(""),
      MANAGEMENT_OFFICE_CODE: new FormControl(""),
      MANAGEMENT_OFFICE_NAME: new FormControl(""),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(""),
      REPRESENTATION_POS_CODE: new FormControl(""),
      REPRESENTATION_POS_NAME: new FormControl(""),
      REPRESENTATION_POS_LEVEL: new FormControl(""),
      REPRESENTATION_POS_LEVEL_NAME: new FormControl(""),
      REPRESENTATION_DEPT_CODE: new FormControl(""),
      REPRESENTATION_DEPT_NAME: new FormControl(""),
      REPRESENTATION_DEPT_LEVEL: new FormControl(""),
      REPRESENTATION_UNDER_DEPT_CODE: new FormControl(""),
      REPRESENTATION_UNDER_DEPT_NAME: new FormControl(""),
      REPRESENTATION_UNDER_DEPT_LEVEL: new FormControl(""),
      REPRESENT_WORK_DEPT_CODE: new FormControl(""),
      REPRESENT_WORK_DEPT_NAME: new FormControl(""),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(""),
      REPRESENT_OFFICE_CODE: new FormControl(""),
      REPRESENT_OFFICE_NAME: new FormControl(""),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(""),
      STATUS: new FormControl(""),
      REMARK: new FormControl(""),
      CONTRIBUTOR_ID: new FormControl(34),
      IS_ACTIVE: new FormControl(0),
    };
    return this.fb.group(CompareFormControl);
  }

  ///////////////////////////////////////////////////////////////////////// myDatePicker //////////////////////////////////////////////////////////////////////////////////////////
  myDatePickerOccurrenceFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: "dd mmm yyyy",
    showClearDateBtn: false,
    height: "30px",
  };

  getDisCurrDateMyDatePicker(date) {
    let day = date.date;
    const dis = {
      begin: { year: day.year, month: day.month, day: day.day + 1 },
      end: { year: day.year + 100, month: day.month, day: day.day + 1 },
    };
    return dis;
  }

  ///////////////////////////////////////////////////////////////////////// my cal //////////////////////////////////////////////////////////////////////////////////////////
  conVNUMFIVE(e) {
    // if (e == ''){this.controlForm.get('RECEIPT_BOOK_NO').setValue(`${"00001"}`);}
    if (e == "0") {
      this.controlForm.get("RECEIPT_BOOK_NO").setValue(`${"00001"}`);
    } else if (e == "00") {
      this.controlForm.get("RECEIPT_BOOK_NO").setValue(`${"00001"}`);
    } else if (e == "000") {
      this.controlForm.get("RECEIPT_BOOK_NO").setValue(`${"00001"}`);
    } else if (e == "0000") {
      this.controlForm.get("RECEIPT_BOOK_NO").setValue(`${"00001"}`);
    } else if (e == "00000") {
      this.controlForm.get("RECEIPT_BOOK_NO").setValue(`${"00001"}`);
    } else if (e.length == 5) {
      this.controlForm.get("RECEIPT_BOOK_NO").setValue(`${e}`);
    } else if (e.length == 4) {
      this.controlForm.get("RECEIPT_BOOK_NO").setValue(`${"0"}${e}`);
    } else if (e.length == 3) {
      this.controlForm.get("RECEIPT_BOOK_NO").setValue(`${"00"}${e}`);
    } else if (e.length == 2) {
      this.controlForm.get("RECEIPT_BOOK_NO").setValue(`${"000"}${e}`);
    } else if (e.length == 1) {
      this.controlForm.get("RECEIPT_BOOK_NO").setValue(`${"0000"}${e}`);
    }
    // else if (e.length == 0){this.controlForm.get('RECEIPT_BOOK_NO').setValue(`${"00001"}`);}

    this.checkReceriptNo();
  }

  conVNUMTWO(e) {
    // if (e == ''){this.controlForm.get('RECEIPT_NO').setValue(`${"01"}`);}
    if (e == "0") {
      this.controlForm.get("RECEIPT_NO").setValue(`${"01"}`);
    } else if (e == "00") {
      this.controlForm.get("RECEIPT_NO").setValue(`${"01"}`);
    } else if (e.length == 2) {
      this.controlForm.get("RECEIPT_NO").setValue(`${e}`);
    } else if (e.length == 1) {
      this.controlForm.get("RECEIPT_NO").setValue(`${"0"}${e}`);
    }
    // else if (e.length == 0){this.controlForm.get('RECEIPT_NO').setValue(`${"01"}`);}

    this.checkReceriptNo();
  }

  private async checkReceriptNo() {
    const rBookNo = this.controlForm.get("RECEIPT_BOOK_NO").value;
    const rNo = this.controlForm.get("RECEIPT_NO").value;

    const param = {
      RECEIPT_BOOK_NO: rBookNo ? parseInt(rBookNo) : "",
      RECEIPT_NO: rNo ? parseInt(rNo) : "",
    };

    const checkAllList = (p: any): boolean => {
      let isSame: boolean = false;
      if (this._aboutPayFine.length > 1)
        if (p.RECEIPT_BOOK_NO || p.RECEIPT_NO)
          isSame = this._aboutPayFine.some(
            (f) =>
              f["RECEIPT_BOOK_NO"] == p.RECEIPT_BOOK_NO &&
              f["RECEIPT_NO"] == p.RECEIPT_NO
          );
      return isSame;
    };

    const res = await this.fineService.CompareDetailCheckReceriptNo(param);
    console.log("res : ", res);
    console.log("checkAllList(param) : ", checkAllList(param));

    if (res || checkAllList(param)) {
      this.controlForm.get("RECEIPT_BOOK_NO").setValue("");
      this.controlForm.get("RECEIPT_NO").setValue("");
      swal({
        type: "warning",
        text: "ใบเสร็จเล่มที่ เลขที่ ซ้ำกรุณาระบุใหม่",
        confirmButtonText: "ตกลง",
        buttonsStyling: true,
      });
    }
  }

  transformTotal(e, i, j) {
    const value = `${e.PAYMENT_FINE_PIPE}`.replace(/\,/g, "");
    // console.log(value," : ",i)
    const payment = this.controlForm.get("PAYMENT_DETAIL") as FormArray;
    const PAYMENT_FINE = payment.at(i).get("PAYMENT_FINE");
    const FINE_PIPE = this.controlForm.get("PAYMENT_DETAIL") as FormArray;
    const PAYMENT_FINE_PIPE = FINE_PIPE.at(i).get("PAYMENT_FINE_PIPE");
    PAYMENT_FINE_PIPE.setValue(this.formatMoney(value.replace(/\,/g, "")), {
      emitEvent: false,
    });

    PAYMENT_FINE.setValue(this.convert_money(parseFloat(value)));
  }

  formatMoney(value) {
    // console.log("value",value)
    const temp = `${value}`.replace(/\,/g, "");
    return this.currencyPipe.transform(temp).replace("$", "");
  }

  convert_money(m): number {
    var money = m;
    return money;
  }

  convert_Calculator(m) {
    // console.log(m)
    const temp = `${m}`.replace(/\,/g, "");
    return this.currencyPipe.transform(temp).replace("$", "");
  }

  ///////////////////////////////////////////////////////////////////////// set time //////////////////////////////////////////////////////////////////////////////////////////
  public setFormatTimeControl(
    event: any,
    formControl: string,
    formGroup: FormGroup
  ) {
    let str = event.target.value;
    let str_unSub = event.target.value;
    let substr: any[] = [];
    let mm: string = "";
    let ss: string = "";
    substr = str.split(":");
    mm = substr[0] == undefined ? "" : substr[0].slice(0, 2);
    ss = substr[1] == undefined ? "" : substr[1].slice(0, 2);
    const K = event.keyCode;

    if (!/([0-9])$/.test(event.target.value))
      formGroup.controls[formControl].setValue(
        str_unSub.slice(0, str_unSub.length - 1)
      );

    switch (true) {
      // NumPad 96-105
      case K >= 96 && K <= 105:
        if (str.length == 2)
          formGroup.controls[formControl].setValue(`${mm}:${ss}`);
        else if (str.length == 3)
          formGroup.controls[formControl].setValue(
            `${mm}:${str_unSub.substring(2)}`
          );
        break;
      // KeyPad 96-105
      case K >= 48 && K <= 57:
        if (str.length == 2)
          formGroup.controls[formControl].setValue(`${mm}:${ss}`);
        else if (str.length == 3)
          formGroup.controls[formControl].setValue(
            `${mm}:${str_unSub.substring(2)}`
          );
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

  private httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  async ReportForm06_002(params: any) {
    console.log("1");
    const url = `${appConfig.apiReport}/ILG60_00_06_002.aspx`;
    return this.http
      .post(url, params, { ...this.httpOptions, responseType: "blob" })
      .map((res) => res)
      .toPromise();
  }

  ////////////////////////////////////////report//////////////////////////////////////////
  setText: any;
  async signature(r) {
    if (r == 0) {
      const param = {
        receipt_no: this.RECEIPT_NO,
        SystemId: "systemid",
        UserName: "my_username",
        Password: "bbbbb",
        IpAddress: "10.11.1.10",
        Operation: "1",
        RequestData: {
          // "UserName": "wannapa_j",
          // "OffCode": "100300"
          UserName: localStorage.getItem("UserName"),
          OffCode: localStorage.getItem("officeCode"),
        },
      };

      this.preloader.setShowPreloader(true);
      await this.ReportForm06_002(param).then((x) => {
        const file = new Blob([x], { type: "application/pdf" });
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          const linkSource = reader.result;
          var objbuilder = "";
          objbuilder += '<object width="100%" height="100%" data="';
          objbuilder += linkSource;
          objbuilder += '" type="application/pdf" class="internal">';
          objbuilder += '<embed src="';
          objbuilder += linkSource;
          objbuilder += '" type="application/pdf"  />';
          objbuilder += "</object>";
          var win = window.open("#", "_blank");
          var title = "ใบเสร็จรับชำระค่าปรับ.pdf";
          win.document.write(
            "<html><title>" +
              title +
              '</title><body style="margin-top: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">'
          );
          win.document.write(objbuilder);
          win.document.write("</body></html>");
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
        this.preloader.setShowPreloader(false);
      });
    } else {
      const param = {
        receipt_no: this.RECEIPT_NO,
        SystemId: "systemid",
        UserName: "my_username",
        Password: "bbbbb",
        IpAddress: "10.11.1.10",
        Operation: "1",
        RequestData: {
          // "UserName": "wannapa_j",
          // "OffCode": "100300"
          UserName: localStorage.getItem("UserName"),
          OffCode: localStorage.getItem("officeCode"),
        },
      };
      this.preloader.setShowPreloader(true);
      await this.ReportForm06_002(param)
        .then((x) => {
          const file = new Blob([x], { type: "application/pdf" });
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
                isCorporate: "false",
              },
            ],
          };
          this.fineService.MultiplePage("MultiplePage", [params]).then(
            async (list) => {
              if ((await list.status) == "SUCCESS") {
                const linkSource = await list.data.dataFile;
                const did = await list.data.id;
                var objbuilder = "";
                objbuilder +=
                  '<object width="100%" height="100%" data="data:application/pdf;base64,';
                objbuilder += linkSource;
                objbuilder += '" type="application/pdf" class="internal">';
                objbuilder += '<embed src="data:application/pdf;base64,';
                objbuilder += linkSource;
                objbuilder += '" type="application/pdf"  />';
                objbuilder += "</object>";
                // this.imageSource = objbuilder;
                var win = window.open("#", "_blank");
                var title = "ใบเสร็จรับชำระค่าปรับ.pdf";
                win.document.write(
                  "<html><title>" +
                    title +
                    '</title><body style="margin-top: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">'
                );
                win.document.write(objbuilder);
                win.document.write("</body></html>");

                this.preloader.setShowPreloader(false);
                swal({
                  type: "success",
                  text: "ลงลายเซ็นดิจิตอลในเอกสารสำเร็จ",
                  confirmButtonText: "ตกลง",
                  buttonsStyling: true,
                }).then((e) => {
                  this.preloader.setShowPreloader(true);
                  this.set_update_CompareMapping(this.set_DID, did);
                });
                this.setText = false;
                this.activeModal.close(this.setText);
              }
              if ((await list.status) !== "SUCCESS") {
                swal({
                  type: "warning",
                  text: "ลงลายเซ็นดิจิตอลในเอกสารไม่สำเร็จ",
                  confirmButtonText: "ตกลง",
                  buttonsStyling: true,
                });
                this.preloader.setShowPreloader(false);
              }
            },
            (error) => {
              console.log("err : ", error);
              swal({
                type: "warning",
                text: "ลงลายเซ็นดิจิตอลในเอกสารไม่สำเร็จ",
                confirmButtonText: "ตกลง",
                buttonsStyling: true,
              });
              this.preloader.setShowPreloader(false);
            }
          );
        })
        .catch((e) => {
          swal({
            type: "warning",
            text: "ลงลายเซ็นดิจิตอลในเอกสารไม่สำเร็จ",
            confirmButtonText: "ตกลง",
            buttonsStyling: true,
          });
          this.preloader.setShowPreloader(false);
        });
    }
  }

  set_update_CompareMapping(value, did) {
    var CompareDetail = {
      COMPARE_DETAIL_ID: value.COMPARE_DETAIL_ID,
      COMPARE_MAPPING_ID: value.COMPARE_MAPPING_ID,
      RECEIPT_OFFICE_ID: value.RECEIPT_OFFICE_ID || "",
      APPROVE_OFFICE_ID: value.APPROVE_OFFICE_ID || "",
      MISTREAT_NO: value.MISTREAT_NO || "",
      OLD_PAYMENT_FINE: parseFloat(value.OLD_PAYMENT_FINE) || "",
      PAYMENT_FINE: parseFloat(value.PAYMENT_FINE) || "",
      DIFFERENCE_PAYMENT_FINE: parseFloat(value.DIFFERENCE_PAYMENT_FINE) || "",
      TREASURY_MONEY: parseFloat(value.TREASURY_MONEY) || "",
      BRIBE_MONEY: parseFloat(value.BRIBE_MONEY) || "",
      REWARD_MONEY: parseFloat(value.REWARD_MONEY) || "",
      PAYMENT_FINE_DUE_DATE: value.PAYMENT_FINE_DUE_DATE || "",
      PAYMENT_VAT_DUE_DATE: value.PAYMENT_VAT_DUE_DATE || "",
      INSURANCE: value.INSURANCE || "",
      GAURANTEE: value.GAURANTEE || "",
      PAYMENT_DATE: value.PAYMENT_DATE || "",
      RECEIPT_TYPE: value.RECEIPT_TYPE || "",
      RECEIPT_BOOK_NO: value.RECEIPT_BOOK_NO || "",
      RECEIPT_NO: value.RECEIPT_NO || "",
      RECEIPT_OFFICE_CODE: value.RECEIPT_OFFICE_CODE || "",
      RECEIPT_OFFICE_NAME: value.RECEIPT_OFFICE_NAME || "",
      APPROVE_OFFICE_CODE: value.APPROVE_OFFICE_CODE || "",
      APPROVE_OFFICE_NAME: value.APPROVE_OFFICE_NAME || "",
      APPROVE_DATE: value.APPROVE_DATE || "",
      APPROVE_TYPE: value.APPROVE_TYPE || "",
      COMMAND_NO: value.COMMAND_NO || "",
      COMMAND_DATE: value.COMMAND_DATE || "",
      REMARK_NOT_AGREE: value.REMARK_NOT_AGREE || "",
      REMARK_NOT_APPROVE: value.REMARK_NOT_APPROVE || "",
      FACT: value.FACT || "",
      COMPARE_REASON: value.COMPARE_REASON || "",
      ADJUST_REASON: value.ADJUST_REASON || "",
      COMPARE_TYPE: value.COMPARE_TYPE || "",
      IS_REQUEST: value.IS_REQUEST,
      IS_TEMP_RELEASE: value.IS_TEMP_RELEASE,
      IS_INSURANCE: value.IS_INSURANCE,
      IS_GAURANTEE: value.IS_GAURANTEE,
      IS_PAYMENT: value.IS_PAYMENT,
      IS_REVENUE: value.IS_REVENUE,
      IS_AGREE: value.IS_AGREE,
      IS_APPROVE: value.IS_APPROVE,
      IS_AUTHORITY: value.IS_AUTHORITY,
      DID: did,
      IS_ACTIVE: value.IS_ACTIVE,
      CompareStaff: [],
      CompareDetailPayment: [],
      CompareDetailFine: [],
      ComparePayment: [],
    };
    this.set_update_CompareDetail(CompareDetail, did);
  }

  set_update_CompareDetail(list, did) {
    this.fineService
      .CompareDetailupdByCon("CompareDetailupdByCon", list)
      .then((res) => {
        this.preloader.setShowPreloader(false);
        console.log("CompareDetailupdByCon : ", res);
        if (res.IsSuccess == "True") {
          location.reload();
        } else {
          swal({
            type: "warning",
            text:
              "ไม่สามารถอัพเดทข้อมูล DID : " + did + "<br />กรุณาติดต่อแอดมิน",
            confirmButtonText: "ตกลง",
            buttonsStyling: true,
          }).then((e) => {
            location.reload();
          });
        }
      });
  }

  receiptNoLessThanFifty(input: number): void {
    if (input > 50) this.controlForm.get("RECEIPT_NO").setValue(`${"50"}`);
  }

  isRequired() {}
}
