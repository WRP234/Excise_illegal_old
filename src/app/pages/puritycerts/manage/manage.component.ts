import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterService } from '../../arrests/services';
import { ManageConfig } from './manage.config';
import { IMyDateModel, IMyOptions } from 'mydatepicker';
import { PuritycertService } from '../puritycert.service';
import { toLocalShort, setZero, MyDatePickerOptions, convertDateForSave, compareDate, toLocalNumeric, setZeroHours, getDateMyDatepicker, setDateMyDatepicker } from '../../../config/dateFormat';
import { Observable } from 'rxjs';
import {
  ArrestStaffService
} from '../services/arrest-staff.service';
import { Message } from '../../../config/message';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { mergeMap, map, catchError, mapTo } from 'rxjs/operators';
import { LoaderService } from '../../../core/loader/loader.service';
import { merge } from 'rxjs/observable/merge';



@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent extends ManageConfig implements OnInit {
  office;
  officeCode;
  date ;
  time;
  result = [];
  docs:any = [];
  request ;
  id = null ;
  months: any[];
  monthsTh: any[];
  public searching = this.s_MasMaster.searching;
  public searchFailed = this.s_MasMaster.searchFailed;
  serachOffice = this.s_MasMaster.serachOffice;
  public myDatePickerOptions = MyDatePickerOptions;
  private titleNames: any;
  private office_id: any;
  private uploadForm: FormGroup;
  constructor(
    private modelService: NgbModal,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private s_MasMaster: MasterService,
    private puritycertService: PuritycertService,
    private s_Staff: ArrestStaffService,
    private loaderService: LoaderService,
    private router: Router,


  ) {
    super();
  }

  ngOnInit() {

    this.uploadForm = this.fb.group({
      FILE: [''],
      DOCUMENT_NAME: '',
      DOCUMENT_OLD_NAME: '',
      DOCUMENT_TYPE: '',
      FOLDER: '',
      REFERENCE_CODE: ''
    });

    this.officeCode = localStorage.getItem('officeCode');
    const body = {
      'TEXT_SEARCH': this.officeCode,
      'OFFICE_ID': null
    };
    this.s_MasMaster.MasOfficegetByCon(body).toPromise().then( office => {
      // console.log(office);
      this.PuritycertFG.patchValue({
        OFFICE_CODE:  office[0].OFFICE_CODE,
        OFFICE_NAME:  office[0].OFFICE_NAME,
        OFFICE_ID :  office[0].OFFICE_ID
      });
      this.office_id = office[0].OFFICE_ID

    });



    const dateDefault = setDateMyDatepicker(new Date());
    this.date = dateDefault;
    // this.time = i.getTime();
    this.time  = `${setZero((new Date).getHours())}:${setZero((new Date).getMinutes())}`;

    this.months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    this.monthsTh = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
    this.activeRoute.params.subscribe(p => {

      this.PuritycertFG = this.createForm();
      // console.log(p);
      this.mode = p['mode'];

      console.log(this.mode);
      switch (this.mode) {
        case this.ModeAction.R:
          const puritycert_id = JSON.parse(p['code']);
          const body = {
            PURITYCERT_ID: puritycert_id.PURITYCERT_ID,
          };
          const body2 = {
            DOCUMENT_TYPE: 12,
            REFERENCE_CODE: puritycert_id.PURITYCERT_ID
          };
          this.id = puritycert_id.PURITYCERT_ID;
          console.log( this.id);
          this.puritycertService.PuritycertByCon(body).then(item => {
            console.log(item);
            if (item['IsSuccess'] === 'True') {
              // this.setArrestFormItem(item , null);
              this.puritycertService.GetDocumentByCon(body2).toPromise().then(Doc => {
              // @ts-ignore
                this.docs = Doc;
                // tslint:disable-next-line:no-shadowed-variable
              Doc = this.docs.filter(item => item.IS_ACTIVE === "1" );
              this.setArrestFormItem(item , Doc);
              });
            }
          });
          break;

      }
    });
    this.setButton();
  }



  setArrestFormItem(item , Doc) {

    this.ILG60_03_02_00_00_E13$.next(item.PuritycertList.PuritycertStaff);
    this.result.push(item.PuritycertList);
    this.ILG60_03_02_00_00_E25$.next(item.PuritycertList.PuritycerrtMasGuiltbase);
    this.ILG60_03_02_00_00_E28$.next(Doc);



    const Data = item.PuritycertList;

    const i = new Date(Data.PURITYCERT_DATE);
    const j = i.toString().split(' ',5);

    console.log(j);
    const date = {
      date: {
        year: i.getFullYear(),
        month: (i.getMonth()) + 1,
        day: i.getDate()
      }
    };
    // console.log(date);

    this.PuritycertFG.patchValue({
      OFFICE_CODE: Data.OFFICE_CODE,
      OFFICE_NAME: Data.OFFICE_NAME ,
      OFFICE_ID : Data.OFFICE_ID,
      PURITYCERT_DATE: date,
      PURITYCERT_TIME:  j[4].substring(0, 5),
      REQUEST_BEFORE : Data.REASON_BEFORE,
      REQUEST_AFTER : Data.REASON_AFTER,
      BEHAVIOR_1 : Data.BOOKING,
      PURITYCERT_CODE: Data.PURITYCERT_CODE,
    });


  }

  formatDate(date: string) {
    if (date) {
      let tmps = date.split(' ')[0].split('-');
      return tmps[2] + ' ' + this.monthsTh[parseInt(tmps[1]) - 1] + ' ' + +(parseInt(tmps[0]));
    }
    return '';
  }

  clickDelete() {
    swal({
      title: '',
      text: Message.confirmAction,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm!'
    }).then((result) => {
      if (result.value) {
        let body = {
          PURITYCERT_ID: this.id
        };
        this.puritycertService.PuritycertupdDelete(body).then(item => {
          console.log(item);
          if ( item['isSuccess'] === "True") {
            this.router.navigate([`puritycerts/list`]);
          } else {
            swal('', Message.cannotDeleteRec, 'warning');
            return false;
          }
        });

      }
    });
  }

  clickEdit() {
    this.mode = 'E';
    if (this.mode === this.ModeAction.E) {
      this.setButton();
    }
  }

  setButton() {
    if (this.mode === this.ModeAction.C) {
      // set false
      this.btn_onPrint.next(false);
      this.btn_onEdit.next(false);
      this.btn_onDelete.next(false);
      this.isEdit = false;
      // set true
      this.btn_onSave.next(true);
      this.btn_onCancel.next(true);
    } else if (this.mode === this.ModeAction.R) {
      // set false
      this.btn_onSave.next(false);
      this.btn_onCancel.next(false);
      // set true
      this.btn_onPrint.next(true);
      this.btn_onEdit.next(true);
      this.btn_onDelete.next(true);
      this.isEdit = true;
    } else if (this.mode === this.ModeAction.E) {
      // set false
      this.btn_onPrint.next(false);
      this.btn_onEdit.next(false);
      this.btn_onDelete.next(false);
      this.isEdit = false;
      // set true
      this.btn_onSave.next(true);
      this.btn_onCancel.next(true);
      console.log(this.mode);
    }
  }

  public createForm(): FormGroup {
    return new FormGroup({
      OFFICE_CODE: new FormControl(null),
      OFFICE_NAME: new FormControl(null),
      PURITYCERT_DATE: new FormControl( this.date ),
      PURITYCERT_TIME: new FormControl(this.time),

      ArrestStaff: this.fb.array([]),

      ArrestLocale: this.fb.array([]),
      ArrestLawbreaker: this.fb.array([]),
      ArrestProduct: this.fb.array([]),
      ArrestNotice: this.fb.array([]),
      ARREST_ID: new FormControl(null),
      OFFICE_ID: new FormControl(null),
      ARREST_CODE: new FormControl(null),
      ARREST_DATE: new FormControl(null),
      ARREST_TIME: new FormControl(null),

      OCCURRENCE_DATE: new FormControl(null),
      OCCURRENCE_TIME: new FormControl(null),

      PURITYCERT_CODE: new FormControl('Auto Generate'),
      PURITYCERT_ID: new FormControl(null),

      REQUEST_CODE: new FormControl(null),
      SEARCH_WARRANT_ID: new FormControl(null),

      BEHAVIOR_1: new FormControl(null),
      BEHAVIOR_2: new FormControl(null),
      BEHAVIOR_3: new FormControl(null),
      BEHAVIOR_4: new FormControl(null),
      BEHAVIOR_5: new FormControl(null),
      TESTIMONY: new FormControl(null),

      IS_REQUEST_BEFORE: new FormControl(false),
      REQUEST_BEFORE: new FormControl(null),

      IS_REQUEST_AFTER: new FormControl(false),
      REQUEST_AFTER: new FormControl(null),

      IS_LAWSUIT_COMPLETE: new FormControl(null),
      IS_ACTIVE: new FormControl(null),
      CREATE_DATE: new FormControl(null),
      CREATE_USER_ACCOUNT_ID: new FormControl(null),
      UPDATE_DATE: new FormControl(null),
      UPDATE_USER_ACCOUNT_ID: new FormControl(null),
    })
  }

  selectItemOffice(e) {
    console.log(e);
    this.PuritycertFG.patchValue({
      OFFICE_CODE:  e.item.OFFICE_CODE,
      OFFICE_NAME: e.item.OFFICE_NAME,
      OFFICE_ID : e.item.OFFICE_ID

    })
  }

  openModal(e) {
    this.modal = this.modelService.open(e, { size: 'lg', centered: true });
  }
  onSDateChange(event: IMyDateModel) {
    console.log(event);
    let date = new Date(event.jsdate);
    date.setHours(0, -date.getTimezoneOffset(), 0, 0);
  }

  public clickSave() {
    const Puritycert = Object.assign({}, this.PuritycertFG.value);
    // let arDate = this.getDateMyDatepicker(Puritycert.ARREST_DATE) as Date;
    // let ocDate = this.getDateMyDatepicker(Puritycert.OCCURRENCE_DATE) as Date;
    // const acHours = parseInt(Arrest.ARREST_TIME.split('.')[0]);
    // const acMin = parseInt(Arrest.ARREST_TIME.split('.')[1]);
    // const ocHours = parseInt(Arrest.OCCURRENCE_TIME.split('.')[0]);
    // const ocMin = parseInt(Arrest.OCCURRENCE_TIME.split('.')[1]);
    // arDate.setHours(acHours, acMin);
    // ocDate.setHours(ocHours, ocMin);

    // Arrest.ARREST_DATE = this.toDateTZ(arDate);
    // Arrest.OCCURRENCE_DATE = this.toDateTZ(ocDate);
    Puritycert.IS_REQUEST = Puritycert.IS_REQUEST ? 1 : 0;
    // this.showLoader();
    // let result = [];
    // let zip$ = new Observable<any>();
    this.request = new Observable<any>();

    switch (this.mode) {
      case this.ModeAction.C:
        this.request = this.PuritycertInsert(Puritycert);
        // .pipe(
        //     map(ARREST_CODE => Arrest.ARREST_CODE = ARREST_CODE),
        //     mergeMap(() => this.ArrestInsert(Arrest))
        //   .finally(() => {
        //     this.onEnd();
        //   });
        break;
      case this.ModeAction.E:
        this.request = this.PuritycertInsert(Puritycert);
        // .pipe(
        //     map(ARREST_CODE => Arrest.ARREST_CODE = ARREST_CODE),
        //     mergeMap(() => this.ArrestInsert(Arrest))
        //   .finally(() => {
        //     this.onEnd();
        //   });
        break;

      // case this.ModeAction.R:
      //     request = this.ArrestUpdate(Arrest);
      //     break;
    }

    // zip$ = Observable.zip(request)
    //     .pipe(map(x => { return result = [...result, ...x]; }))

    // forkJoin(zip$)
    //     .subscribe(x => {
    //         console.log(x);
    //         if (x.filter(o => o['IsSuccess'] == 'False')) {
    //             swal('', Message.saveFail, 'warning');
    //         } else {
    //             swal('', Message.saveComplete, 'success');
    //         }
    //     }, () => {
    //         swal('', Message.saveFail, 'warning');
    //     })
  }

  public clickCancel() {
    swal({
      title: '',
      text: Message.confirmAction,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm!'
    }).then((result) => {
      if (result.value) {
        // this.onCancel();
        this.router.navigate([`puritycerts/list`]);
      }
    })
  }

  PuritycertInsert(Arrest: any) {
    let insert = Object.assign({}, Arrest);


    // const ArrestStaff = this.filterAction(this.ILG60_03_02_00_00_E13$.getValue(), this.Action.ADD);
    // const Arrestguiltbase_id_list = this.filterAction(this.ILG60_03_02_00_00_E25$.getValue(), this.Action.ADD);
    const ArrestStaff = this.ILG60_03_02_00_00_E13$.getValue();
    const Arrestguiltbase_id_list = this.ILG60_03_02_00_00_E25$.getValue();
    // const ArrestDocuments = this.filterAction(this.ILG60_03_02_00_00_E28$.getValue(), 'ADD');

    insert = { ...insert, ArrestStaff };
    insert = { ...insert, ArrestLocale: this.ILG60_03_02_00_00_E18$.getValue() };
    insert = { ...insert, Arrestguiltbase_id_list };
    insert = { ...insert, ArrestDocuments: this.ILG60_03_02_00_00_E28$ };
    // insert = { ...insert, ArrestProduct };

    console.log(insert);
    // console.log(ArrestStaff);

    if (insert.ArrestStaff.length > 0 && insert.ArrestLocale.length > 0 && insert.Arrestguiltbase_id_list.length  > 0) {

      const item1 = [];
      for (let i in ArrestStaff) {
        const body1 = {
          STAFF_ID: ArrestStaff[i].STAFF_ID,
          PURITYCERT_ID:  this.id,
          STAFF_REF_ID: ArrestStaff[i].STAFF_REF_ID,
          TITLE_ID: ArrestStaff[i].TITLE_ID,
          STAFF_CODE: ArrestStaff[i].STAFF_CODE,
          ID_CARD: ArrestStaff[i].ID_CARD,
          STAFF_TYPE: ArrestStaff[i].STAFF_TYPE,
          TITLE_NAME_TH: ArrestStaff[i].TITLE_NAME_TH,
          TITLE_NAME_EN: ArrestStaff[i].TITLE_NAME_EN,
          TITLE_SHORT_NAME_TH: ArrestStaff[i].TITLE_SHORT_NAME_TH,
          TITLE_SHORT_NAME_EN: ArrestStaff[i].TITLE_SHORT_NAME_EN,
          FIRST_NAME: ArrestStaff[i].FIRST_NAME,
          LAST_NAME: ArrestStaff[i].LAST_NAME,
          AGE: ArrestStaff[i].AGE,
          OPERATION_POS_CODE: ArrestStaff[i].OPERATION_POS_CODE,
          OPREATION_POS_NAME: ArrestStaff[i].OPREATION_POS_NAME,
          OPREATION_POS_LEVEL: ArrestStaff[i].OPREATION_POS_LEVEL,
          OPERATION_POS_LEVEL_NAME: ArrestStaff[i].OPERATION_POS_LEVEL_NAME,
          OPERATION_DEPT_CODE: ArrestStaff[i].OPERATION_DEPT_CODE,
          OPERATION_DEPT_NAME: ArrestStaff[i].OPERATION_DEPT_NAME,
          OPERATION_DEPT_LEVEL: ArrestStaff[i].OPERATION_DEPT_LEVEL,
          OPERATION_UNDER_DEPT_CODE: ArrestStaff[i].OPERATION_UNDER_DEPT_CODE,
          OPERATION_UNDER_DEPT_NAME: ArrestStaff[i].OPERATION_UNDER_DEPT_NAME,
          OPERATION_UNDER_DEPT_LEVEL: ArrestStaff[i].OPERATION_UNDER_DEPT_LEVEL,
          OPERATION_WORK_DEPT_CODE: ArrestStaff[i].OPERATION_WORK_DEPT_CODE,
          OPERATION_WORK_DEPT_NAME: ArrestStaff[i].OPERATION_WORK_DEPT_NAME,
          OPERATION_WORK_DEPT_LEVEL: ArrestStaff[i].OPERATION_WORK_DEPT_LEVEL,
          OPERATION_OFFICE_CODE: ArrestStaff[i].OPERATION_OFFICE_CODE,
          OPERATION_OFFICE_NAME: ArrestStaff[i].OPERATION_OFFICE_NAME,
          OPERATION_OFFICE_SHORT_NAME: ArrestStaff[i].OPERATION_OFFICE_SHORT_NAME,
          MANAGEMENT_POS_CODE: ArrestStaff[i].MANAGEMENT_POS_CODE,
          MANAGEMENT_POS_NAME: ArrestStaff[i].MANAGEMENT_POS_NAME,
          MANAGEMENT_POS_LEVEL: ArrestStaff[i].MANAGEMENT_POS_LEVEL,
          MANAGEMENT_POS_LEVEL_NAME: ArrestStaff[i].MANAGEMENT_POS_LEVEL_NAME,
          MANAGEMENT_DEPT_CODE: ArrestStaff[i].MANAGEMENT_DEPT_CODE,
          MANAGEMENT_DEPT_NAME: ArrestStaff[i].MANAGEMENT_DEPT_NAME,
          MANAGEMENT_DEPT_LEVEL: ArrestStaff[i].MANAGEMENT_DEPT_LEVEL,
          MANAGEMENT_UNDER_DEPT_CODE: ArrestStaff[i].MANAGEMENT_UNDER_DEPT_CODE,
          MANAGEMENT_UNDER_DEPT_NAME: ArrestStaff[i].MANAGEMENT_UNDER_DEPT_NAME,
          MANAGEMENT_UNDER_DEPT_LEVEL: ArrestStaff[i].MANAGEMENT_UNDER_DEPT_LEVEL,
          MANAGEMENT_WORK_DEPT_CODE: ArrestStaff[i].MANAGEMENT_WORK_DEPT_CODE,
          MANAGEMENT_WORK_DEPT_NAME: ArrestStaff[i].MANAGEMENT_WORK_DEPT_NAME,
          MANAGEMENT_WORK_DEPT_LEVEL: ArrestStaff[i].MANAGEMENT_WORK_DEPT_LEVEL,
          MANAGEMENT_OFFICE_CODE: ArrestStaff[i].MANAGEMENT_OFFICE_CODE,
          MANAGEMENT_OFFICE_NAME: ArrestStaff[i].MANAGEMENT_OFFICE_NAME,
          MANAGEMENT_OFFICE_SHORT_NAME: ArrestStaff[i].MANAGEMENT_OFFICE_SHORT_NAME,
          REPRESENT_POS_CODE: ArrestStaff[i]['REPRESENT_POS_CODE'],
          REPRESENT_POS_NAME: ArrestStaff[i]['REPRESENT_POS_NAME'],
          REPRESENT_POS_LEVEL: ArrestStaff[i]['REPRESENT_POS_LEVEL'],
          REPRESENT_POS_LEVEL_NAME: ArrestStaff[i]['REPRESENT_POS_LEVEL_NAME'],
          REPRESENT_DEPT_CODE: ArrestStaff[i]['REPRESENT_DEPT_CODE'],
          REPRESENT_DEPT_NAME: ArrestStaff[i]['REPRESENT_DEPT_NAME'],
          REPRESENT_DEPT_LEVEL: ArrestStaff[i]['REPRESENT_DEPT_LEVEL'],
          REPRESENT_UNDER_DEPT_CODE: ArrestStaff[i]['REPRESENT_UNDER_DEPT_CODE'],
          REPRESENT_UNDER_DEPT_NAME: ArrestStaff[i]['REPRESENT_UNDER_DEPT_NAME'],
          REPRESENT_UNDER_DEPT_LEVEL: ArrestStaff[i]['REPRESENT_UNDER_DEPT_LEVEL'],
          REPRESENT_WORK_DEPT_CODE: ArrestStaff[i].REPRESENT_WORK_DEPT_CODE,
          REPRESENT_WORK_DEPT_NAME: ArrestStaff[i].REPRESENT_WORK_DEPT_NAME,
          REPRESENT_WORK_DEPT_LEVEL: ArrestStaff[i].REPRESENT_WORK_DEPT_LEVEL,
          REPRESENT_OFFICE_CODE: ArrestStaff[i].REPRESENT_OFFICE_CODE,
          REPRESENT_OFFICE_NAME: ArrestStaff[i].REPRESENT_OFFICE_NAME,
          REPRESENT_OFFICE_SHORT_NAME: ArrestStaff[i].REPRESENT_OFFICE_SHORT_NAME,
          STATUS: ArrestStaff[i].STATUS,
          REMARK: ArrestStaff[i].REMARK,
          CONTRIBUTOR_ID: ArrestStaff[i].CONTRIBUTOR_ID,
          IS_ACTIVE: ArrestStaff[i].IS_ACTIVE
        };
        item1.push(body1);
      }
      // console.log(item1);




      const item2 = [];
      for (let j in Arrestguiltbase_id_list) {
        if (Arrestguiltbase_id_list[j].IS_ACTIVE === undefined){
          Arrestguiltbase_id_list[j].IS_ACTIVE = 1;
        }
        const body2 = {
          INDICTMENT_ID: null,
          PURITYCERT_ID: this.id,
          GUILTBASE_ID: Arrestguiltbase_id_list[j].GUILTBASE_ID,
          IS_ACTIVE: Arrestguiltbase_id_list[j].IS_ACTIVE
        };
        item2.push(body2);
      }
      console.log(item2);

      // console.log(this.PuritycertFG.value.PURITYCERT_DATE);
      if (this.mode === this.ModeAction.C && this.PuritycertFG.value.PURITYCERT_DATE) {
        this.date = (this.PuritycertFG.value.PURITYCERT_DATE.date.year + 543)+'-'+(this.PuritycertFG.value.PURITYCERT_DATE.date.month)+'-'+this.PuritycertFG.value.PURITYCERT_DATE.date.day + " " + this.PuritycertFG.value.PURITYCERT_TIME+':00' ;
        // this.date = new Date(this.date);
        console.log(this.date)
      } else if (this.mode === this.ModeAction.E && this.PuritycertFG.value.PURITYCERT_DATE) {
        this.date = (this.PuritycertFG.value.PURITYCERT_DATE.date.year)+'-'+(this.PuritycertFG.value.PURITYCERT_DATE.date.month)+'-'+this.PuritycertFG.value.PURITYCERT_DATE.date.day + " " + this.PuritycertFG.value.PURITYCERT_TIME+':00' ;
        // this.date = new Date(this.date);
      }

      const person = insert.ArrestLocale[0];
      const body3 = {
        PURITYCERT_ID: this.id ,
        SUB_DISTRICT_ID: person.SUB_DISTRICT_ID,
        ARREST_ID: null,
        OFFICE_ID: this.PuritycertFG.value.OFFICE_ID,
        OFFICE_CODE: this.PuritycertFG.value.OFFICE_CODE,
        OFFICE_NAME:  this.PuritycertFG.value.OFFICE_NAME,
        PURITYCERT_CODE: this.PuritycertFG.value.PURITYCERT_CODE,
        PURITYCERT_DATE: this.date,
        GPS: person.GPS,
        ADDRESS_NO: person.ADDRESS_NO,
        VILLAGE_NO: person.VILLAGE_NO,
        BUILDING_NAME: person.BUILDING_NAME,
        ROOM_NO: person.ROOM_NO,
        FLOOR: person.FLOOR,
        VILLAGE_NAME: person.VILLAGE_NAME,
        ALLEY: person.ALLEY,
        LANE: person.LANE,
        ROAD: person.ROAD,
        PERSON_TITLE_NAME_TH: person.person_title_id,
        PERSON_TITLE_NAME_EN: null,
        PERSON_TITLE_SHORT_NAME_TH: null,
        PERSON_TITLE_SHORT_NAME_EN: null,
        PERSON_FIRST_NAME: person.person_first_name,
        PERSON_MIDDLE_NAME: null,
        PERSON_LAST_NAME: person.person_last_name,
        PERSON_OTHER_NAME: null,
        PERSON_ID_CARD: person.person_id_card,
        PERSON_AGE: person.person_age,
        PERSON_CAREER: person.person_career,
        PERSON_POSITION: person.person_position,
        PERSON_DESC: null,
        PERSON_EMAIL: null,
        PERSON_TEL_NO: null,
        PERSON_STATUS: person.person_status,
        REASON_BEFORE: this.PuritycertFG.value.REQUEST_BEFORE,
        REASON_AFTER: this.PuritycertFG.value.REQUEST_AFTER,
        BOOKING: this.PuritycertFG.value.BEHAVIOR_1,
        IS_ARREST: 0,
        IS_ACTIVE: person.IS_ACTIVE,
        PuritycertStaff : [],
        PuritycertIndictment : item2

      };

      // console.log(body3)
      const body4 = {
        PURITYCERT_ID: this.id ,
        SUB_DISTRICT_ID: person.SUB_DISTRICT_ID,
        ARREST_ID: null,
        OFFICE_ID: this.PuritycertFG.value.OFFICE_ID,
        OFFICE_CODE: this.PuritycertFG.value.OFFICE_CODE,
        OFFICE_NAME:  this.PuritycertFG.value.OFFICE_NAME,
        PURITYCERT_CODE: this.PuritycertFG.value.PURITYCERT_CODE,
        PURITYCERT_DATE: this.date,
        GPS: person.GPS,
        ADDRESS_NO: person.ADDRESS_NO,
        VILLAGE_NO: person.VILLAGE_NO,
        BUILDING_NAME: person.BUILDING_NAME,
        ROOM_NO: person.ROOM_NO,
        FLOOR: person.FLOOR,
        VILLAGE_NAME: person.VILLAGE_NAME,
        ALLEY: person.ALLEY,
        LANE: person.LANE,
        ROAD: person.ROAD,
        PERSON_TITLE_NAME_TH: person.person_title_id,
        PERSON_TITLE_NAME_EN: null,
        PERSON_TITLE_SHORT_NAME_TH: null,
        PERSON_TITLE_SHORT_NAME_EN: null,
        PERSON_FIRST_NAME: person.person_first_name,
        PERSON_MIDDLE_NAME: null,
        PERSON_LAST_NAME: person.person_last_name,
        PERSON_OTHER_NAME: null,
        PERSON_ID_CARD: person.person_id_card,
        PERSON_AGE: person.person_age,
        PERSON_CAREER: person.person_career,
        PERSON_POSITION: person.person_position,
        PERSON_DESC: null,
        PERSON_EMAIL: null,
        PERSON_TEL_NO: null,
        PERSON_STATUS: person.person_status,
        REASON_BEFORE: this.PuritycertFG.value.REQUEST_BEFORE,
        REASON_AFTER: this.PuritycertFG.value.REQUEST_AFTER,
        BOOKING: this.PuritycertFG.value.BEHAVIOR_1,
        IS_ARREST: 0,
        IS_ACTIVE: person.IS_ACTIVE,
        PuritycertStaff : ArrestStaff,
        PuritycertIndictment : item2

      };

      if (this.mode === this.ModeAction.C) {
        // console.log('C');
        let paramiter = {
          RUNNING_OFFICE_CODE : this.officeCode ,
          RUNNING_TABLE: 'OPS_PURITYCERT'
        };

        this.puritycertService.TransactionRunninggetByCon(paramiter).then( async res => {
          // console.log(res);
          if (res.length > 0) {
            let paramiters1 = {
              RUNNING_ID : res[0].RUNNING_ID
            };
            this.puritycertService.TransactionRunningupdByCon(paramiters1).then( async  res1 => {
              // console.log(res1)
            })

          } else {
            let paramiter2 = {
              RUNNING_OFFICE_ID: this.office_id,
              RUNNING_OFFICE_CODE: this.officeCode,
              RUNNING_TABLE: "OPS_PURITYCERT",
              RUNNING_PREFIX: "SC"};
            this.puritycertService.TransactionRunninginsAll(paramiter2).then(async res2 => {
              // console.log(res2)
            })
          }

          if ( res ) {
            console.log(body4);
            this.puritycertService.PurityinsAll(body4).then( async resp => {
              if (resp['isSuccess'] === 'False') {
                swal('', Message.checkData, 'warning');
                return false;
              } else {
                await insert.ArrestDocuments.value.map(async doc => {

                  this.uploadForm.get('FILE').setValue(doc.FILE);
                  this.uploadForm.get('DOCUMENT_NAME').setValue(doc.DOCUMENT_NAME);
                  this.uploadForm.get('DOCUMENT_OLD_NAME').setValue(doc.DOCUMENT_OLD_NAME);
                  this.uploadForm.get('DOCUMENT_TYPE').setValue(doc.DOCUMENT_TYPE);

                  this.uploadForm.get('FOLDER').setValue(doc.FOLDER);
                  this.uploadForm.get('REFERENCE_CODE').setValue( resp['PURITYCERT_ID']);

                  const formData = new FormData();
                  formData.append('FILE', this.uploadForm.get('FILE').value);
                  formData.append('DOCUMENT_NAME', this.uploadForm.get('DOCUMENT_NAME').value);
                  formData.append('DOCUMENT_OLD_NAME', this.uploadForm.get('DOCUMENT_OLD_NAME').value);
                  formData.append('DOCUMENT_TYPE', this.uploadForm.get('DOCUMENT_TYPE').value);
                  formData.append('FOLDER', this.uploadForm.get('FOLDER').value);
                  formData.append('REFERENCE_CODE', this.uploadForm.get('REFERENCE_CODE').value);

                  await this.puritycertService.DocumentinsAll(formData).subscribe(docIsSuccess => {
                    console.log(docIsSuccess);
                    if (!docIsSuccess) {
                      resp['isSuccess'] = false;
                      return false;
                    }
                  }, () => {
                    resp['isSuccess'] = false;
                    return false;
                  });
                });
                this.id = resp['PURITYCERT_ID'];

                const bodyC = {
                  PURITYCERT_ID: resp['PURITYCERT_ID'],
                };
                swal('', Message.saveComplete, 'success');
                this.mode = 'R';
                this.setButton();
                setTimeout(() => {
                  this.router.navigate(['/puritycerts/manage/R/' +  JSON.stringify(bodyC) ])
                } , 1000);
              }
            });
          }
        });

      } else if (this.mode === this.ModeAction.E) {
        // console.log('E');
        this.puritycertService.PuritycertupdByCon(body3).then(async resp => {
          if (resp['isSuccess'] === 'False') {
            swal('', Message.checkData, 'warning');
            return false;
          } else {
            for (let k = 0 ; k < item1.length ; k++) {
              console.log(item1[k].STAFF_ID);
              if (item1[k].STAFF_ID !== '') {
                this.puritycertService.PuritycertStaffupdByCon(item1[k]).then( res => {
                  // console.log(res);
                });
              } else {
                this.puritycertService.PuritycertStaffinsAll(item1[k]).then( res => {
                  // console.log(res);
                });
              }
            }
            await insert.ArrestDocuments.value.map(async doc => {
              this.uploadForm.get('FILE').setValue(doc.FILE);
              this.uploadForm.get('DOCUMENT_NAME').setValue(doc.DOCUMENT_NAME);
              this.uploadForm.get('DOCUMENT_OLD_NAME').setValue(doc.DOCUMENT_OLD_NAME);
              this.uploadForm.get('DOCUMENT_TYPE').setValue(doc.DOCUMENT_TYPE);

              this.uploadForm.get('FOLDER').setValue(doc.FOLDER);
              this.uploadForm.get('REFERENCE_CODE').setValue( this.id);

              const formData = new FormData();
              formData.append('FILE', this.uploadForm.get('FILE').value);
              formData.append('DOCUMENT_NAME', this.uploadForm.get('DOCUMENT_NAME').value);
              formData.append('DOCUMENT_OLD_NAME', this.uploadForm.get('DOCUMENT_OLD_NAME').value);
              formData.append('DOCUMENT_TYPE', this.uploadForm.get('DOCUMENT_TYPE').value);
              formData.append('FOLDER', this.uploadForm.get('FOLDER').value);
              formData.append('REFERENCE_CODE', this.uploadForm.get('REFERENCE_CODE').value);

              await this.puritycertService.DocumentinsAll(formData).subscribe(docIsSuccess => {
                console.log(docIsSuccess);
                if (!docIsSuccess) {
                  resp['isSuccess'] = false;
                  return false;
                }
              }, () => {
                resp['isSuccess'] = false;
                return false;
              });
            });
            swal('', Message.saveComplete, 'success');
            this.mode = 'R';
            this.setButton();
          }
        });
      }

    } else {

      if (!insert.ArrestStaff.length) {
        swal('', Message.checkStaff, 'warning');
        return false;
      }
      if (!insert.ArrestLocale.length ) {
        swal('', Message.checkLocale, 'warning');
        return false;
      }
      if (!insert.Arrestguiltbase_id_list.length) {
        swal('', Message.alertSelectGuiltbase, 'warning');
        return false;
      }

      // console.log('ไม่เข้าเงื่อนไช');
      // swal('', Message.checkData, 'warning');
      // return false;
    }


  }

  private onEnd(): void {
    this.hideLoader();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  filterAction = (form: any[], action: string) =>
    form.filter(x => x['ACTION'] === action);


}
