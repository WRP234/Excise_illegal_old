import { Component,ChangeDetectionStrategy, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';

  @Component({
    selector: 'app-input-dialog',
    templateUrl: './ILG60_O_05_00_02_01.html',
    styleUrls: ['./ILG60_O_05_00_02_01.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class ILG60_O_05_00_02_01 {
    constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,) {}
    controlForm: FormGroup;
    NAME : string;
    INSURANCE : string;
    GAURANTEE : string;
    INSURANCE_CHECKBOX : number;
    GAURANTEE_CHECKBOX : number;
    isReq_INSURANCE = false;
    isReq_GAURANTEE = false;
    showEditField : any;
    async ngOnInit() {
    if(this.INSURANCE_CHECKBOX == 0 && this.GAURANTEE_CHECKBOX == 0){
        this.controlForm = this.fb.group({
            NAME : new FormControl(this.NAME, Validators.required),
            INSURANCE : new FormControl({value: '', disabled: false}, Validators.required),
            GAURANTEE : new FormControl({value: '', disabled: true}, Validators.required),
            INSURANCE_CHECKBOX : new FormControl(1, Validators.requiredTrue),
            GAURANTEE_CHECKBOX : new FormControl(0, Validators.requiredTrue),
        })
    }
    else if(this.INSURANCE_CHECKBOX == 1 && this.GAURANTEE_CHECKBOX == 0){
        this.controlForm = this.fb.group({
            NAME : new FormControl(this.NAME, Validators.required),
            INSURANCE : new FormControl({value: this.INSURANCE, disabled: false}, Validators.required),
            GAURANTEE : new FormControl({value: this.GAURANTEE, disabled: true}, Validators.required),
            INSURANCE_CHECKBOX : new FormControl(1, Validators.requiredTrue),
            GAURANTEE_CHECKBOX : new FormControl(0, Validators.requiredTrue),
        })
    }else if(this.GAURANTEE_CHECKBOX == 1 && this.INSURANCE_CHECKBOX == 0){
        this.controlForm = this.fb.group({
            NAME : new FormControl(this.NAME, Validators.required),
            INSURANCE : new FormControl({value: this.INSURANCE, disabled: true}, Validators.required),
            GAURANTEE : new FormControl({value: this.GAURANTEE, disabled: false}, Validators.required),
            INSURANCE_CHECKBOX : new FormControl(0, Validators.requiredTrue),
            GAURANTEE_CHECKBOX : new FormControl(1, Validators.requiredTrue),
        })
    }

    // console.log("controlForm: ",this.controlForm)
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
        var form = [];
        if (this.controlForm.get('INSURANCE_CHECKBOX').value == 1 && this.controlForm.get('INSURANCE').value == ''){
          this._swal('กรุณาระบุข้อมูล "ประกัน"');
          this.isReq_INSURANCE = true;
        }else if (this.controlForm.get('GAURANTEE_CHECKBOX').value == 1 && this.controlForm.get('GAURANTEE').value == ''){
          this._swal('กรุณาระบุข้อมูล "ประกันและหลักประกัน"');
          this.isReq_GAURANTEE = true;
        }else{
        if (this.controlForm.get('INSURANCE_CHECKBOX').value == 1){
        form.push({
            INSURANCE : this.controlForm.get('INSURANCE').value,
            GAURANTEE : "",
            INSURANCE_CHECKBOX : 1,
            GAURANTEE_CHECKBOX : 0,
        })
        this.activeModal.close(form);
        }else if (this.controlForm.get('GAURANTEE_CHECKBOX').value == 1){
        form.push({
            INSURANCE : "",
            GAURANTEE : this.controlForm.get('GAURANTEE').value,
            INSURANCE_CHECKBOX : 0,
            GAURANTEE_CHECKBOX : 1,
        })
        this.activeModal.close(form);
        }}
    }

    dismiss(){
      this.activeModal.close();
    }

    cancel(){
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
        if (result.value == true){
        //   var cancel = "cancel"
        //   this.activeModal.close(cancel);\
        var form = [];
        form.push({
            INSURANCE : "",
            GAURANTEE : "",
            INSURANCE_CHECKBOX : 0,
            GAURANTEE_CHECKBOX : 0,
        })
        this.activeModal.close(form);
        }
      })
    }
    testCheck1(e){
        // console.log("IS_INSURANCE = 1",e.target.checked)
        this.isReq_GAURANTEE = false;
        const control =  this.controlForm;
        control.patchValue({
          INSURANCE_CHECKBOX : 1,
          GAURANTEE_CHECKBOX : 0,
          GAURANTEE : ''
        })

        control.get('INSURANCE').enable();
        control.get('GAURANTEE').disable();
        // console.log(this.compareForm.getRawValue())
      }
    
    testCheck2(e){
        // console.log("IS_GAURANTEE = 1",e.target.checked)
        this.isReq_INSURANCE = false;
        const control =  this.controlForm;
        control.patchValue({
          INSURANCE_CHECKBOX : 0,
          GAURANTEE_CHECKBOX : 1,
          INSURANCE : ''
        })
        control.get('INSURANCE').disable();
        control.get('GAURANTEE').enable();
        // console.log(this.compareForm.getRawValue())
      }
}
