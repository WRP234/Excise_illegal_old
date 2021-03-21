import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Ilg6003020000E13Config } from './ilg60-03-02-00-00-e13.config';
import { MasStaffService } from '../../services/mas-staff.service';
import { ArrestStaff, ArrestStaffVariable } from '../../model';

@Component({
  selector: 'app-ilg60-03-02-00-00-e13',
  templateUrl: './ilg60-03-02-00-00-e13.component.html',
  styleUrls: ['./ilg60-03-02-00-00-e13.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg6003020000E13Component extends Ilg6003020000E13Config implements OnInit, AfterViewInit {

  searchStaff = this.s_masStaff.searchStaff;
  staffDefult = [];
  staff_raf_id ;
  staff_id;
  constructor(
    private fb: FormBuilder,
    private s_masStaff: MasStaffService
  ) {
    super();
  }



  ngOnInit() {
    this.PuritycertFG = this.fb.group({
      ArrestStaff: this.fb.array([])
    });

    this.staff_raf_id = localStorage.getItem('staffCode');
    this.staff_id = localStorage.getItem('UserAccountID');

    setTimeout(() => {
      if (this.inputData.value.length > 0) {
        console.log(this.inputData);
        for (let i = 0 ; i < this.inputData.value.length ; i++) {
          const staff = { ...ArrestStaffVariable, ACTION: this.Action.ADD  };
          const newObj = [...this.ArrestStaff.value, staff];
          this.setItemFormArray(newObj, 'ArrestStaff');
          const data = this.inputData.value[i];
          this.ArrestStaff.at(i).patchValue(data , data.STAFF_REF_ID = parseInt(this.staff_raf_id)
            // TITLE_NAME_TH : data.TITLE_NAME_TH,
            // FIRST_NAME: data.FIRST_NAME,
            // LAST_NAME: data.LAST_NAME,
            // OPREATION_POS_NAME: data.OPREATION_POS_NAME,
            // OPERATION_DEPT_NAME: data.OPERATION_DEPT_NAME,
            // STAFF_REF_ID :  parseInt(this.staff_raf_id),
          );
        }
        this.Output.emit( this.ArrestStaff.value);
        console.log(this.ArrestStaff.value);
      } else {
        let body = {
          TEXT_SEARCH: "",
          STAFF_ID: this.staff_id
        };

        this.s_masStaff.MasStaffgetByCon(body).toPromise().then(res => {
          this.staffDefult =  res;
          if ( this.staffDefult.length > 0) {
            for (let i = 0 ; i < this.staffDefult.length ; i++) {
              const staff = { ...ArrestStaffVariable, ACTION: this.Action.ADD  };
              const newObj = [...this.ArrestStaff.value, staff];
              this.setItemFormArray(newObj, 'ArrestStaff');
              const data = this.staffDefult[i];

              this.ArrestStaff.at(i).patchValue(data , data.STAFF_REF_ID = parseInt(this.staff_raf_id)
              );
            }
          }
          this.Output.emit( this.ArrestStaff.value);
          console.log(this.ArrestStaff.value);
        });
      }
    },1000);

  }

  formChange() {
    this.ArrestStaff.valueChanges.subscribe((x: ArrestStaff[]) => {
      const obj = Object.assign([], x);
      this.Output.emit(obj)
    })
  }

  ngAfterViewInit(): void {
    // this.ngOnInit()
    // const adv: IMasStaffgetByConAdv = {
    //   STAFF_CODE: '',
    //   STAFF_NAME: null,
    //   OFFICE_NAME: null,
    //   ID_CARD: null,
    //   STATUS: 1
    // }
    // this.s_masStaff.MasStaffgetByConAdv(adv)
    //   .subscribe(x => {
    //     if (!x.length) return;
    //     let obj = x

    //     // const data = this.inputData.getValue();
    //     // if (data.length) {
    //     //   obj = data
    //     //   // .filter(o => o.CONTRIBUTOR_ID !== 14);
    //     // }

    //     obj = obj.reduce((accu, curr) =>
    //       [...accu, { ...curr, ACTION: this.Action.ADD, CONTRIBUTOR_ID: 14 }],
    //       []);

    //     this.Output.emit(obj)

    //     this.setItemFormArray(obj, 'ArrestStaff');
    //   })
  }

  addStaff() {
    const staff = { ...ArrestStaffVariable, ACTION: this.Action.ADD };
    const newObj = [...this.ArrestStaff.value, staff];
    this.setItemFormArray(newObj, 'ArrestStaff');
    this.formChange();
  }

  selectItemStaff(event: any, i: number) {
    this.staff_raf_id = localStorage.getItem('staffCode');
    event.item.STAFF_ID = '' ;

    const staff = this.ArrestStaff.at(i);
    if (staff.value.STAFF_REF_ID) {
      event.item.STAFF_ID = staff.value.STAFF_ID
    }
    // console.log(staff.value);
    const item = Object.assign(staff.value, event.item);
    this.ArrestStaff.at(i).patchValue(item , item.STAFF_REF_ID = this.staff_raf_id  );
    this.Output.emit(this.ArrestStaff.value);
    console.log(this.ArrestStaff.value);
  }



  onDeleteStaff(i: number) {
    this.ArrestStaff.removeAt(i);
    // this.ArrestStaff.at(i).patchValue({
    //   ACTION: this.Action.DELETE,
    //   IS_ACTIVE: 0
    // });
    this.Output.emit(this.ArrestStaff.value);
  }

  onUndoDeleteStaff(i: number) {
    console.log(i);
    let row = this.ArrestStaff.at(i);
    const STAFF_ID = row.get('STAFF_ID');

    row.get('IS_ACTIVE').patchValue(1);

    if (STAFF_ID != null && typeof Number(STAFF_ID.value) === 'number') {
      row.get('ACTION').patchValue(this.Action.EDIT);
    } else {
      row.get('ACTION').patchValue(this.Action.ADD);
    }
    this.Output.emit(this.ArrestStaff.value);
  }

  private setItemFormArray(array: any[], formControl: string) {

    if (array !== undefined && array.length) {
      // console.log(array.length)
      // console.log(array)
      if (array.length === 1) {
        array.forEach(item => item.CONTRIBUTOR_ID = 5);
      }
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      // console.log(itemFormArray);
      this.PuritycertFG.setControl(formControl, itemFormArray);
    }
  }

}
