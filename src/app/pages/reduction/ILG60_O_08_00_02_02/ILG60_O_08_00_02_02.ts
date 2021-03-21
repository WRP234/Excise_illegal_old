import { Component,ChangeDetectionStrategy, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { invalid } from 'moment';
import { ReductionService } from '../reduction.service';
import { Observable, of } from 'rxjs';

  @Component({
    selector: 'app-input-dialog',
    templateUrl: './ILG60_O_08_00_02_02.html',
    styleUrls: ['./ILG60_O_08_00_02_02.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class ILG60_O_08_00_02_02 {
    constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private currencyPipe : CurrencyPipe,
    private reductionService : ReductionService,
    ) { }
    controlForm: FormGroup;
    item : any;
    isReq_REASON = false;
    showEditField : any;

    async ngOnInit() {
      console.log("this.item : ",this.item)
      if (this.item.IS_DOWN == 0){
        this.controlForm = this.fb.group({
          NAME : new FormControl(this.item.NAME),
          PAYMENT_FINE : new FormControl(this.item.PAYMENT_FINE),
          OLD_PAYMENT_FINE : new FormControl(this.item.OLD_PAYMENT_FINE),
          DIFFERENCE_PAYMENT_FINE : new FormControl(this.item.DIFFERENCE_PAYMENT_FINE),
          RECEIPT_BOOK_NO : new FormControl(this.item.RECEIPT_BOOK_NO),
          RECEIPT_NO : new FormControl(this.item.RECEIPT_NO),
          // NEW_RECEIPT_BOOK_NO : new FormControl('',Validators.required),
          // NEW_RECEIPT_NO : new FormControl('',Validators.required),
          REASON : new FormControl('',Validators.required),
          IS_DOWN : new FormControl(1),
          RECEIPT_TYPE : new FormControl(this.item.RECEIPT_TYPE),
          setStaff: this.fb.array([this.set_CONTRIBUTOR_ID86()]),
        });
      }else{
        if (this.item.setStaff.length == 0){
          this.controlForm = this.fb.group({
            NAME : new FormControl(this.item.NAME),
            PAYMENT_FINE : new FormControl(this.item.PAYMENT_FINE),
            OLD_PAYMENT_FINE : new FormControl(this.item.OLD_PAYMENT_FINE),
            DIFFERENCE_PAYMENT_FINE : new FormControl(this.item.DIFFERENCE_PAYMENT_FINE),
            RECEIPT_BOOK_NO : new FormControl(this.item.RECEIPT_BOOK_NO),
            RECEIPT_NO : new FormControl(this.item.RECEIPT_NO),
            // NEW_RECEIPT_BOOK_NO : new FormControl(this.item.NEW_RECEIPT_BOOK_NO,Validators.required),
            // NEW_RECEIPT_NO : new FormControl(this.item.NEW_RECEIPT_NO,Validators.required),
            REASON : new FormControl(this.item.REASON,Validators.required),
            IS_DOWN : new FormControl(this.item.IS_DOWN),
            RECEIPT_TYPE : new FormControl(this.item.RECEIPT_TYPE),
            setStaff: this.fb.array([this.set_CONTRIBUTOR_ID86()]),
          });
        }else{
          this.controlForm = this.fb.group({
            NAME : new FormControl(this.item.NAME),
            PAYMENT_FINE : new FormControl(this.item.PAYMENT_FINE),
            OLD_PAYMENT_FINE : new FormControl(this.item.OLD_PAYMENT_FINE),
            DIFFERENCE_PAYMENT_FINE : new FormControl(this.item.DIFFERENCE_PAYMENT_FINE),
            RECEIPT_BOOK_NO : new FormControl(this.item.RECEIPT_BOOK_NO),
            RECEIPT_NO : new FormControl(this.item.RECEIPT_NO),
            // NEW_RECEIPT_BOOK_NO : new FormControl(this.item.NEW_RECEIPT_BOOK_NO,Validators.required),
            // NEW_RECEIPT_NO : new FormControl(this.item.NEW_RECEIPT_NO,Validators.required),
            REASON : new FormControl(this.item.REASON,Validators.required),
            IS_DOWN : new FormControl(this.item.IS_DOWN),
            RECEIPT_TYPE : new FormControl(this.item.RECEIPT_TYPE),
            setStaff: this.fb.array([]),
          });
          this.item.setStaff.map(m=>{this.setStaff.push(this.fb.group(m));});
        }
      }
    }

  setIsPeq(e){
      switch (e){
        case 'isReq_REASON' :
          if(this.controlForm.get("REASON").value == ""){this.isReq_REASON = true;} else{this.isReq_REASON = false;}
        break;
      }
    }

  get setStaff(): FormArray {return this.controlForm.get('setStaff') as FormArray;}

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
  deleteStaff(){} 
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

    COMPARE_ID : any;
    COMPARE_DETAIL_ID : any;

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
    
    _swal(e){
      swal({
        type: 'warning',
        text: e,
        confirmButtonText: 'ตกลง',
        buttonsStyling: true,
      })
    }

    onSubmit(){
      console.log("this.controlForm | index :  ",this.controlForm.getRawValue());

      if (this.controlForm.get("REASON").invalid){
        this.isReq_REASON = true;
        this._swal('กรุณาระบุข้อมูล "เหตุผลในการปรับ"');
      }else{
              this.activeModal.close(this.controlForm.value);
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

    dismisss(){
      this.activeModal.close();
    }

}
