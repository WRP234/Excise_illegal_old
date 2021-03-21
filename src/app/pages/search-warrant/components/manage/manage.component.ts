import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import swal from 'sweetalert2'
import { Message } from 'app/config/message';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageConfig } from './manage.config';
import { MasStaffService, MasterService, SearchWarrantService } from '../../services';
import { Observable } from 'rxjs/';
import { merge } from 'rxjs/observable/merge';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { LoaderService } from '../../../../core/loader/loader.service';
import { UpdDelete } from '../../models/upd-delete';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchWarrant } from '../../models/search-warrant';
import { InsAll } from '../../models/ins-all';
import { UpdByCon } from '../../models/upd-by-con';
import { setDateMyDatepicker, convertDateForSave, getDateMyDatepicker, setZero } from '../../../../config/dateFormat';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent extends ManageConfig implements OnInit {

  public selectedEntry: any;
  advSearch: any;
  showAdvSearch = new BehaviorSubject<Boolean>(true);
  statusMode = false;
  modal: any;
  COURT_ALL: any[] = [];
  @ViewChild('printDocModal') printDocModel: ElementRef;
  formData: any;
  public SearchMasCourtList = [];
  public lawsuitArrestFormDialog: any = {};
  public SearchWarrantFG: FormGroup;
  searchWarrantRequestInsAll: InsAll;
  searchWarrantRequestUpdByCon: UpdByCon;
  searchWarrant: SearchWarrant;

  searchLocale = this.s_MasMaster.searchLocale;
  searchStaff = this.s_masStaff.searchStaff;
  searchMasTitle = this.s_MasMaster.searchMasTitle;

  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
    showClearDateBtn: true,
    height: '30px'
  };

  DIS_PAST_COURT_NAME: boolean;
  CONTRIBUTOR = [
    { value: 0, text: 'ผู้ร้อง' },
    { value: 1, text: 'ผู้ยื่นคำร้อง' },
    { value: 2, text: 'ผู้สอบสวน/สอบสวน' },
    { value: 3, text: 'หัวหน้าชุดเข้าตรวจค้น' }
  ]

  get SearchWarrantStaff(): FormArray {
    return this.SearchWarrantFG.get('searchWarrantStaff') as FormArray;
  }

  // get searchWarrantConsider(): FormArray {
  //   return this.SearchWarrantFG.get('searchWarrantConsider') as FormArray;
  // }

  private consider0Checked: boolean;
  private consider1Checked: boolean;
  private isConsiderChecked: boolean;
  private searchWarrantCheck1Checked: boolean;
  private searchWarrantCheck1_1Checked: boolean;
  private searchWarrantCheck1_2Checked: boolean;
  private searchWarrantCheck1_3Checked: boolean;
  private searchWarrantCheck2Checked: boolean;
  private searchWarrantCheck2_1Checked: boolean;
  private searchWarrantCheck2_2Checked: boolean;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private searchWarrantService: SearchWarrantService,
    private loaderService: LoaderService,
    private ngbModel: NgbModal,
    private s_MasMaster: MasterService,
    private s_masStaff: MasStaffService,
  ) {
    super();
  }

  ngOnInit() {
    // console.log('SearchWarrantStaff : ', this.SearchWarrantStaff)
    this.advSearch = this.showAdvSearch;
    this.activeRoute.params.subscribe(p => {
      this.mode = p['mode'];
      const f = { REQUEST_ID: Object.assign(p['code']) };
      this.formData = Object.assign(p['code']);
      // this.createForm();
      this.showLoader();
      this.createSWForm();
      this.getMasCourt();
      this.onEnd();
      if (this.mode === this.ModeAction.R) {
        this.enableBtnEdit();
        this.statusMode = true;
        this.searchWarrantService.searchWarrantRequestGetByCon(f).subscribe(x => {
          this.searchWarrant = x;
          this.setSearchWarrantFG(x);
        });
      } else {
        this.statusMode = false;
        //##### Set Dis ARREAT_WARRANT #####
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREAT_WARRANT_NO').disable({ onlySelf: true });
        // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_NO_YEAR').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE_TIME').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_COURT_NAME').disable({ onlySelf: true });
        //##### End #####
        this.enableBtnCreate();
        this.onChangeCourtConsiderAlready(false);
      }
    });
  }

  enableBtnCreate() {
    this.btn_onPrint.next(false);
    this.btn_onEdit.next(false);
    this.btn_onDelete.next(false);
    // this.isEdit = false;
    this.btn_onSave.next(true);
    this.btn_onCancel.next(true);
  }

  enableBtnEdit() {
    this.btn_onSave.next(false);
    this.btn_onCancel.next(false);
    this.btn_onPrint.next(true);
    this.btn_onEdit.next(true);
    this.btn_onDelete.next(true);
    // this.isEdit = true;
  }

  setAdvSearch() {
    if (this.showAdvSearch.getValue()) {
      this.showAdvSearch.next(false);
    } else {
      this.showAdvSearch.next(true);
    }
  }

  onSelectionChange(entry: FormGroup) {
    this.selectedEntry = entry.value;
  }
  createSWForm() {
    let newDate = new Date;
    let reqTime = this.mode == 'C' ? `${setZero((newDate).getHours())}:${setZero((newDate).getMinutes())}` : null;
    let reqDate = this.mode == 'C' ? setDateMyDatepicker(newDate) : null;
    let CREATE_DATE = this.mode == 'C' ? `${newDate.getFullYear()}-${setZero(newDate.getMonth() + 1)}-${setZero(newDate.getDate())} ${setZero((newDate).getHours())}:${setZero((newDate).getMinutes())}:${setZero((newDate).getSeconds())}.${newDate.getMilliseconds()}` : null;
    let NowYear = this.mode == 'C' ? newDate.getFullYear() + 543 : '';

    this.SearchWarrantFG = this.formBuilder.group({
      ADDRESS_NO: new FormControl(''),
      ALLEY: new FormControl(''),
      BUILDING_NAME: new FormControl(''),
      CREATE_DATE: new FormControl(CREATE_DATE),
      CREATE_USER_ACCOUNT_ID: new FormControl(''),
      FLOOR: new FormControl(''),
      GPS: new FormControl(''),
      IS_ACTIVE: new FormControl(''),
      IS_CONSIDER: new FormControl(''),
      JUDGE_FIRST_NAME: new FormControl(''),
      JUDGE_LAST_NAME: new FormControl(''),
      JUDGE_TITLE_ID: new FormControl(''),
      JUDGE_TITLE_NAME_EN: new FormControl(''),
      JUDGE_TITLE_NAME_TH: new FormControl(''),
      JUDGE_TITLE_SHORT_NAME_EN: new FormControl(''),
      JUDGE_TITLE_SHORT_NAME_TH: new FormControl(''),
      LANE: new FormControl(''),
      PAST_COMMAND: new FormControl(''),
      PAST_COURT_ID: new FormControl(''),
      PAST_COURT_NAME: new FormControl(''),
      PAST_REQUEST_REASON: new FormControl(''),
      PERSON_AGE: new FormControl(''),
      PERSON_TYPE: new FormControl(''),//CTs
      PERSON_CAREER: new FormControl(''),
      PERSON_DESC: new FormControl(''),
      PERSON_EMAIL: new FormControl(''),
      PERSON_FIRST_NAME: new FormControl(''),
      PERSON_ID_CARD: new FormControl(''),
      PERSON_LAST_NAME: new FormControl(''),
      PERSON_MIDDLE_NAME: new FormControl(''),
      PERSON_OTHER_NAME: new FormControl(''),
      PERSON_POSITION: new FormControl(''),
      PERSON_TEL_NO: new FormControl(''),
      PERSON_TITLE_ID: new FormControl(''),
      PERSON_TITLE_NAME_EN: new FormControl(''),
      PERSON_TITLE_NAME_TH: new FormControl(''),
      PERSON_TITLE_SHORT_NAME_EN: new FormControl(''),
      PERSON_TITLE_SHORT_NAME_TH: new FormControl(''),
      PRESENT_COURT_ID: new FormControl(''),
      PRESENT_COURT_NAME: new FormControl(''),
      REQUEST_CHECK_1: new FormControl(''),
      REQUEST_CHECK_2: new FormControl(''),
      REQUEST_CHECK_3: new FormControl(''),
      REQUEST_CHECK_4: new FormControl(''),
      REQUEST_CHECK_5: new FormControl(''),
      REQUEST_CHECK_EVER: new FormControl(0),
      REQUEST_CHECK_TO_FINISH: new FormControl(''),
      REQUEST_CODE: new FormControl('SW9080060000001'),
      REQUEST_DATE: new FormControl(setDateMyDatepicker(CREATE_DATE)),
      REQUEST_DATE_TIME: new FormControl(reqTime),//CTs
      REQUEST_DATE_FROM: new FormControl(''),
      REQUEST_TIME_FROM: new FormControl(''),
      REQUEST_DATE_TO: new FormControl(''),
      REQUEST_TIME_TO: new FormControl(''),
      REQUEST_ID: new FormControl(''),
      REQUEST_NO: new FormControl(''),
      REQUEST_NO_YEAR: new FormControl(setDateMyDatepicker(CREATE_DATE)),
      REQUEST_NO_YEAR_TEXT: new FormControl(NowYear),
      REQUEST_REASON: new FormControl(''),
      ROAD: new FormControl(''),
      ROOM_NO: new FormControl(''),
      SUB_DISTRICT_ID: new FormControl(''),
      UPDATE_DATE: new FormControl(''),
      UPDATE_USER_ACCOUNT_ID: new FormControl(''),
      VILLAGE_NAME: new FormControl(''),
      VILLAGE_NO: new FormControl(''),

      //CONSIDER_DECIDE_NO_YEAR,CONSIDER_UNDECIDE_NO_YEAR,ARREST_WARRANT_NO_YEAR,SEARCH_WARRANT_NO_YEAR
      searchWarrantConsider: this.formBuilder.group({
        CONSIDER_COMMAND: new FormControl(''),
        CONSIDER_DATE: new FormControl(''),
        CONSIDER_DATE_TIME: new FormControl(''), //CTs
        CONSIDER_DECIDE_NO: new FormControl(''),
        CONSIDER_DECIDE_NO_YEAR: new FormControl(),
        CONSIDER_ID: new FormControl(''),
        CONSIDER_UNDECIDE_NO: new FormControl(''),
        CONSIDER_UNDECIDE_NO_YEAR: new FormControl(),
        CONSIDER_WITNESS_QTY: new FormControl(''),
        IS_ACTIVE: new FormControl(''),
        IS_APPROVE: new FormControl(1),
        REMARK_NOT_APPROVE: new FormControl(''),
        REQUEST_ID: new FormControl(''),

        searchWarrant: this.formBuilder.group({
          ARREAT_WARRANT_NO: new FormControl(''),
          ARREST_ID: new FormControl(''),
          ARREST_WARRANT_COURT_ID: new FormControl(''),
          ARREST_WARRANT_COURT_NAME: new FormControl(''),
          ARREST_WARRANT_DATE: new FormControl(''),
          ARREST_WARRANT_NO_YEAR: new FormControl(),
          CONSIDER_ID: new FormControl(''),
          IS_ACTIVE: new FormControl(''),
          IS_ARREST: new FormControl(''),
          SEARCH_WARRANT_CHECK_1: new FormControl(''),
          SEARCH_WARRANT_CHECK_1_1: new FormControl(''),
          SEARCH_WARRANT_CHECK_1_2: new FormControl(''),
          SEARCH_WARRANT_CHECK_1_3: new FormControl(''),
          SEARCH_WARRANT_CHECK_1_DESC: new FormControl(''),
          SEARCH_WARRANT_CHECK_2: new FormControl(''),
          SEARCH_WARRANT_CHECK_2_1: new FormControl(''),
          SEARCH_WARRANT_CHECK_2_2: new FormControl(''),
          SEARCH_WARRANT_CHECK_2_DESC: new FormControl(''),
          SEARCH_WARRANT_CHECK_TO_FINISH: new FormControl(''),
          SEARCH_WARRANT_DATE: new FormControl(setDateMyDatepicker(CREATE_DATE)),
          SEARCH_WARRANT_DATE_TIME: new FormControl(reqTime),//CTs
          SEARCH_WARRANT_DATE_FROM: new FormControl(setDateMyDatepicker(CREATE_DATE)),
          SEARCH_WARRANT_DATE_TO: new FormControl(setDateMyDatepicker(CREATE_DATE)),
          SEARCH_WARRANT_ID: new FormControl(''),
          SEARCH_WARRANT_NO: new FormControl(''),
          SEARCH_WARRANT_NO_YEAR: new FormControl(setDateMyDatepicker(CREATE_DATE)),
          SEARCH_WARRANT_NO_YEAR_TEXT: new FormControl(reqTime), //CTs
          SEARCH_WARRANT_RESULT: new FormControl(''),
          SEARCH_WARRANT_SEND_DESC_TO: new FormControl(''),
          SEARCH_WARRANT_SEND_TO: new FormControl(''),
          //####### CUSTOMS ########
          SEARCH_WARRANT_TIME_FROM: new FormControl(reqTime),//CTs
          SEARCH_WARRANT_TIME_TO: new FormControl(reqTime),//CTs
          ARREST_WARRANT_DATE_TIME: new FormControl(reqTime)//CTs
        })

      }),

      searchWarrantStaff: this.formBuilder.array([this.createStaffForm(), this.createStaffForm(), this.createStaffForm(), this.createStaffForm()]),

    })
    console.log('this.forSaveFG : ', this.SearchWarrantFG)
  }

  private createStaffForm(): FormGroup {
    return this.formBuilder.group({
      AGE: new FormControl(''),
      CONTRIBUTOR_ID: new FormControl(''),
      FIRST_NAME: new FormControl(''),
      ID_CARD: new FormControl(''),
      IS_ACTIVE: new FormControl(''),
      LAST_NAME: new FormControl(''),
      MANAGEMENT_DEPT_CODE: new FormControl(''),
      MANAGEMENT_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_DEPT_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_CODE: new FormControl(''),
      MANAGEMENT_OFFICE_NAME: new FormControl(''),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(''),
      MANAGEMENT_POS_CODE: new FormControl(''),
      MANAGEMENT_POS_LEVEL: new FormControl(''),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(''),
      MANAGEMENT_POS_NAME: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(''),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(''),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(''),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(''),
      OPERATION_DEPT_CODE: new FormControl(''),
      OPERATION_DEPT_LEVEL: new FormControl(''),
      OPERATION_DEPT_NAME: new FormControl(''),
      OPERATION_OFFICE_CODE: new FormControl(''),
      OPERATION_OFFICE_NAME: new FormControl(''),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(''),
      OPERATION_POS_CODE: new FormControl(''),
      OPERATION_POS_LEVEL_NAME: new FormControl(''),
      OPERATION_UNDER_DEPT_CODE: new FormControl(''),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(''),
      OPERATION_UNDER_DEPT_NAME: new FormControl(''),
      OPERATION_WORK_DEPT_CODE: new FormControl(''),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(''),
      OPERATION_WORK_DEPT_NAME: new FormControl(''),
      OPREATION_POS_LEVEL: new FormControl(''),
      OPREATION_POS_NAME: new FormControl(''),
      REMARK: new FormControl(''),
      REPRESENT_DEPT_CODE: new FormControl(''),
      REPRESENT_DEPT_LEVEL: new FormControl(''),
      REPRESENT_DEPT_NAME: new FormControl(''),
      REPRESENT_OFFICE_CODE: new FormControl(''),
      REPRESENT_OFFICE_NAME: new FormControl(''),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(''),
      REPRESENT_POS_CODE: new FormControl(''),
      REPRESENT_POS_LEVEL: new FormControl(''),
      REPRESENT_POS_LEVEL_NAME: new FormControl(''),
      REPRESENT_POS_NAME: new FormControl(''),
      REPRESENT_UNDER_DEPT_CODE: new FormControl(''),
      REPRESENT_UNDER_DEPT_LEVEL: new FormControl(''),
      REPRESENT_UNDER_DEPT_NAME: new FormControl(''),
      REPRESENT_WORK_DEPT_CODE: new FormControl(''),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(''),
      REPRESENT_WORK_DEPT_NAME: new FormControl(''),
      REQUEST_ID: new FormControl(''),
      STAFF_CODE: new FormControl(''),
      STAFF_ID: new FormControl(''),
      STAFF_REF_ID: new FormControl(''),
      STAFF_TYPE: new FormControl(''),
      STATUS: new FormControl(''),
      TITLE_ID: new FormControl(''),
      TITLE_NAME_EN: new FormControl(''),
      TITLE_NAME_TH: new FormControl(''),
      TITLE_SHORT_NAME_EN: new FormControl(''),
      TITLE_SHORT_NAME_TH: new FormControl(''),

      //Customs
      FULL_NAME: new FormControl('')
    })
  }

  createForm() {
    // this.searchWarrantFG = new FormGroup({
    //   REQUEST_CODE: new FormControl({ value: '', disabled: true }),
    //   REQUEST_NO: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_NO_YEAR: new FormControl({ value: '', disabled: this.statusMode }),
    //   PRESENT_COURT_NAME: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_DATE_FROM: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_DATE_TO: new FormControl({ value: '', disabled: this.statusMode }),
    //   JUDGE_TITLE_NAME_TH: new FormControl({ value: '', disabled: this.statusMode }),
    //   JUDGE_FIRST_NAME: new FormControl({ value: '', disabled: this.statusMode }),
    //   JUDGE_LAST_NAME: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_DATE: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_DATE_TIME: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_CHECK_TO_FINISH: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_REASON: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_CHECK_1: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_CHECK_2: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_CHECK_3: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_CHECK_4: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_CHECK_5: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_CHECK_EVER_0: new FormControl({ value: '', disabled: this.statusMode }),
    //   REQUEST_CHECK_EVER_1: new FormControl({ value: '', disabled: this.statusMode }),
    //   //
    //   PAST_COURT_NAME: new FormControl({ value: '', disabled: true }),
    //   PAST_COURT_NAME_REASON: new FormControl({ value: '', disabled: true }),
    //   PAST_COMMAND: new FormControl({ value: '', disabled: true }),
    //   //
    //   PERSON_POSITION: new FormControl({ value: '0', disabled: this.statusMode }),
    //   PERSON_TITLE_SHORT_NAME_TH: new FormControl({ value: '', disabled: this.statusMode }),
    //   PERSON_FIRST_NAME: new FormControl({ value: '', disabled: this.statusMode }),
    //   PERSON_LAST_NAME: new FormControl({ value: '', disabled: this.statusMode }),
    //   PERSON_ID_CARD: new FormControl({ value: '', disabled: this.statusMode }),
    //   PERSON_AGE: new FormControl({ value: '', disabled: this.statusMode }),
    //   PERSON_CAREER: new FormControl({ value: '', disabled: this.statusMode }),
    //   LATITUDE: new FormControl({ value: '', disabled: this.statusMode }),
    //   LONGITUDE: new FormControl({ value: '', disabled: this.statusMode }),
    //   ADDRESS_NO: new FormControl({ value: '', disabled: this.statusMode }),
    //   VILLAGE_NO: new FormControl({ value: '', disabled: this.statusMode }),
    //   BUILDING_NAME: new FormControl({ value: '', disabled: this.statusMode }),
    //   ROOM_NO: new FormControl({ value: '', disabled: this.statusMode }),
    //   FLOOR: new FormControl({ value: '', disabled: this.statusMode }),
    //   VILLAGE_NAME: new FormControl({ value: '', disabled: this.statusMode }),
    //   ALLEY: new FormControl({ value: '', disabled: this.statusMode }),
    //   LANE: new FormControl({ value: '', disabled: this.statusMode }),
    //   ROAD: new FormControl({ value: '', disabled: this.statusMode }),
    //   SUB_DISTRICT_ID: new FormControl({ value: '', disabled: this.statusMode }),
    //   COURT_CONSIDER_ALREADY: new FormControl({ value: '', disabled: this.statusMode }),
    //   CONSIDER_UNDECIDE_NO: new FormControl({ value: '', disabled: this.statusMode }),
    //   CONSIDER_UNDECIDE_NO_YEAR: new FormControl({ value: '', disabled: this.statusMode }),
    //   CONSIDER_DECIDE_NO: new FormControl({ value: '', disabled: this.statusMode }),
    //   CONSIDER_DECIDE_NO_YEAR: new FormControl({ value: '', disabled: this.statusMode }),
    //   CONSIDER_DATE: new FormControl({ value: '', disabled: this.statusMode }),
    //   CONSIDER_DATE_TIME: new FormControl({ value: '', disabled: this.statusMode }),
    //   CONSIDER_WITNESS_QTY: new FormControl({ value: '', disabled: this.statusMode }),
    //   CONSIDER_COMMAND: new FormControl({ value: '', disabled: this.statusMode }),
    //   REMARK_NOT_APPROVE: new FormControl({ value: '', disabled: this.statusMode }),
    //   IS_APPROVE: new FormControl({ value: '', disabled: true }),
    //   SEARCH_WARRANT_NO: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_NO_YEAR: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_DATE: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_DATE_TIME: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_TIME_FROM: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_TIME_TO: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_CHECK_TO_FINISH: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_CHECK_1: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_CHECK_1_DESC: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_CHECK_1_1: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_CHECK_1_2: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_CHECK_1_3: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_CHECK_2: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_CHECK_2_DESC: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_CHECK_2_1: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_CHECK_2_2: new FormControl({ value: '', disabled: this.statusMode }),
    //   ARREST_WARRANT_NO: new FormControl({ value: '', disabled: this.statusMode }),
    //   ARREST_WARRANT_NO_YEAR: new FormControl({ value: '', disabled: this.statusMode }),
    //   ARREST_WARRANT_DATE_FROM: new FormControl({ value: '', disabled: this.statusMode }),
    //   ARREST_WARRANT_DATE_TIME: new FormControl({ value: '', disabled: this.statusMode }),
    //   ARREST_WARRANT_COURT_NAME: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_SEND_TO: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_SEND_DESC_TO: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_RESULT: new FormControl({ value: '', disabled: this.statusMode }),
    //   OPREATION_POS_NAME: new FormControl({ value: '', disabled: this.statusMode }),
    //   OPREATION_OFFICE_SHORT_NAME: new FormControl({ value: '', disabled: this.statusMode }),
    //   SEARCH_WARRANT_DATE_FROM: new FormControl({ value: '', disabled: this.statusMode }),
    // });
  }

  clickSave() {
    if (this.mode === this.ModeAction.R && this.formData.toString() !== 'NEW') {
      let f = Object.assign(this.searchWarrantFG.getRawValue());
      f = { ...f };

      this.searchWarrantRequestUpdByCon = f;
      this.searchWarrantService.searchWarrantRequestUpdByCon(this.searchWarrantRequestUpdByCon).subscribe(x => {
        const objRes: any[] = x[0].response;
        console.log(objRes);
        if (objRes.filter(o => o['IsSuccess'] === 'False').length) {
          swal('', Message.saveFail, 'warning');
        } else {
          swal({
            title: '',
            text: Message.saveComplete,
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
          }).then((r) => {
            if (r) {
              this.router.navigate(['/search-warrant/list']);
            }
          });
        }
      }, () => {
        swal('', Message.saveFail, 'warning');
      });
    } else {
      let f = Object.assign(this.SearchWarrantFG.getRawValue()); //getRawValue()
      f = { ...f };
      this.searchWarrantRequestInsAll = f;

      var temp: any = this.searchWarrantRequestInsAll;
      console.log('temp.REQUEST_DATE : ', temp.REQUEST_DATE)

      //######### Set Date ############
      temp.REQUEST_DATE = temp.REQUEST_DATE ? temp.REQUEST_DATE : null;
      this.searchWarrantRequestInsAll.REQUEST_DATE = temp.REQUEST_DATE == null || undefined || '' ? '' :
        convertDateForSave(getDateMyDatepicker(temp.REQUEST_DATE)) + ' ' + this.searchWarrantRequestInsAll.REQUEST_DATE_TIME + `:${setZero((new Date()).getSeconds())}.${new Date().getMilliseconds()}`;
      temp.REQUEST_DATE_FROM = temp.REQUEST_DATE_FROM ? temp.REQUEST_DATE_FROM : null;
      this.searchWarrantRequestInsAll.REQUEST_DATE_FROM = temp.REQUEST_DATE_FROM == null || undefined || '' ? '' :
        convertDateForSave(getDateMyDatepicker(temp.REQUEST_DATE_FROM)) + ' ' + this.searchWarrantRequestInsAll.REQUEST_TIME_FROM + `:${setZero((new Date()).getSeconds())}.${new Date().getMilliseconds()}`;
      //********************* */
      temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE = temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE ? temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE : null;
      this.searchWarrantRequestInsAll.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE = temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE == null || undefined || '' ? '' :
        convertDateForSave(getDateMyDatepicker(temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE)) + ' ' + this.searchWarrantRequestInsAll.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_TIME + `:${setZero((new Date()).getSeconds())}.${new Date().getMilliseconds()}`;

      temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_FROM = temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_FROM ? temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_FROM : null;
      this.searchWarrantRequestInsAll.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_FROM = temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_FROM == null || undefined || '' ? '' :
        convertDateForSave(getDateMyDatepicker(temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_FROM)) + ' ' + this.searchWarrantRequestInsAll.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_TIME_FROM + `:${setZero((new Date()).getSeconds())}.${new Date().getMilliseconds()}`;
      temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_TO = temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_TO ? temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_TO : null;
      this.searchWarrantRequestInsAll.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_TO = temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_TO == null || undefined || '' ? '' :
        convertDateForSave(getDateMyDatepicker(temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_TO)) + ' ' + this.searchWarrantRequestInsAll.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_TIME_TO + `:${setZero((new Date()).getSeconds())}.${new Date().getMilliseconds()}`;

      temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_NO_YEAR = temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_NO_YEAR ? temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_NO_YEAR : null;
      this.searchWarrantRequestInsAll.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_NO_YEAR = temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_NO_YEAR == null || undefined || '' ? '' :
        convertDateForSave(getDateMyDatepicker(temp.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_NO_YEAR)) + ' ' + this.searchWarrantRequestInsAll.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_NO_YEAR_TEXT + `:${setZero((new Date()).getSeconds())}.${new Date().getMilliseconds()}`;

      temp.REQUEST_NO_YEAR = temp.REQUEST_NO_YEAR ? temp.REQUEST_NO_YEAR : null;
      this.searchWarrantRequestInsAll.REQUEST_NO_YEAR = temp.REQUEST_NO_YEAR == null || undefined || '' ? '' :
        convertDateForSave(getDateMyDatepicker(temp.REQUEST_NO_YEAR)) + ' ' + this.searchWarrantRequestInsAll.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_TIME + `:${setZero((new Date()).getSeconds())}.${new Date().getMilliseconds()}`;



      //######### Set REQUEST_DATE_TO ##########
      let dateFrom = this.searchWarrantRequestInsAll.REQUEST_DATE_FROM
      this.searchWarrantRequestInsAll.REQUEST_DATE_TO = `${dateFrom.slice(0, 10)} ${this.searchWarrantRequestInsAll.REQUEST_TIME_TO}:${setZero((new Date()).getSeconds())}.${new Date().getMilliseconds()}`;
      //######### Set REQUEST_NO_YEAR ##########
      const date = `${convertDateForSave(getDateMyDatepicker(new Date()))} ${setZero((new Date()).getHours())}:${setZero((new Date()).getMinutes())}:${setZero((new Date()).getSeconds())}.${new Date().getMilliseconds()}`
      // this.searchWarrantRequestInsAll.REQUEST_NO_YEAR = date;
      this.searchWarrantRequestInsAll.searchWarrantConsider.CONSIDER_DECIDE_NO_YEAR = date;
      // this.searchWarrantRequestInsAll.searchWarrantConsider.CONSIDER_UNDECIDE_NO_YEAR = date;
      // this.searchWarrantRequestInsAll.searchWarrantConsider.searchWarrant.ARREST_WARRANT_NO_YEAR = date;
      // this.searchWarrantRequestInsAll.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE = date;
      // this.searchWarrantRequestInsAll.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_NO_YEAR = date;
      // ########## Set 0 or 1 #############
      let _tempSW: any = this.searchWarrantRequestInsAll;
      this.searchWarrantRequestInsAll.REQUEST_CHECK_TO_FINISH = _tempSW.REQUEST_CHECK_TO_FINISH == true ? 1 : 0;
      this.searchWarrantRequestInsAll.REQUEST_CHECK_1 = _tempSW.REQUEST_CHECK_1 == true ? 1 : 0;
      this.searchWarrantRequestInsAll.REQUEST_CHECK_2 = _tempSW.REQUEST_CHECK_2 == true ? 1 : 0;
      this.searchWarrantRequestInsAll.REQUEST_CHECK_3 = _tempSW.REQUEST_CHECK_3 == true ? 1 : 0;
      this.searchWarrantRequestInsAll.REQUEST_CHECK_4 = _tempSW.REQUEST_CHECK_4 == true ? 1 : 0;
      this.searchWarrantRequestInsAll.REQUEST_CHECK_5 = _tempSW.REQUEST_CHECK_5 == true ? 1 : 0;
      //######### Set Staff #########
      let staffs = this.searchWarrantRequestInsAll.searchWarrantStaff;
      console.log('staffs : ', staffs)
      let _searchWarrantStaff = [];
      for (let l of staffs) {
        if (l.CONTRIBUTOR_ID != "") {
          console.log('staffs l : ', l)

          l.IS_ACTIVE = 1;
          _searchWarrantStaff.push(l);
        }
      }
      this.searchWarrantRequestInsAll.searchWarrantStaff = _searchWarrantStaff as any;
      //######### End Set Staff #########
      console.log('OnCeate  this.searchWarrantRequestInsAll : ', this.searchWarrantRequestInsAll);
      this.OnInsert();
    }
  }

  async OnInsert() {

    await this.searchWarrantService.searchWarrantRequestInsAll(this.searchWarrantRequestInsAll).subscribe(x => {
      // const objRes: any[] = x;
      // console.log(objRes);
      if (x.IsSuccess === 'False') {
        swal('', Message.saveFail, 'warning');
      } else {
        swal({
          title: '',
          text: Message.saveComplete,
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok'
        }).then((r) => {
          if (r) {
            this.router.navigate([`/searchWarrant/manage/R/${x.response.REQUEST_ID}`]);
          }
        });
      }
    }, () => {
      swal('', Message.saveFail, 'warning');
    });
  }

  clickCancel() {
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
        this.onCancel();
      }
    })
  }

  onCancel() {
    this.router.navigate(['/searchWarrant/list']);
  }

  clickDelete() {
    const REQUEST_CODE: UpdDelete = this.searchWarrantFG.get('REQUEST_CODE').value;
    this.showLoader();
    let result = [];
    let zip = new Observable<any>();
    const observe = merge(
      this.searchWarrantService.searchWarrantRequestUpdDelete(REQUEST_CODE),
    ).finally(() => this.onEnd());
    zip = Observable.zip(observe).pipe(map(x => result = [...result, ...x]));
    forkJoin(zip)
      .subscribe(x => {
        const objRes: any[] = x[0];
        console.log(objRes);
        if (objRes.filter(o => o['IsSuccess'] === 'False').length) {
          swal('', Message.saveFail, 'warning');
        } else {
          swal({
            title: '',
            text: Message.saveComplete,
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
          }).then((r) => {
            if (r) {
              this.router.navigate(['/search-warrant/list']);
            }
          });
        }
      }, () => {
        swal('', Message.saveFail, 'warning');
      });
  }

  clickEdit() {
    this.enableBtnCreate();
  }

  clickPrint() {
    this.modal = this.ngbModel.open(this.printDocModel, { size: 'lg', centered: true });
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private onEnd(): void {
    this.hideLoader();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }

  onChangeDisable(value: string) {
    if (value === 'REQUEST_CHECK_EVER_0') {
      // this.SearchWarrantFG.controls['PAST_COURT_NAME'].disable();
      this.DIS_PAST_COURT_NAME = true;
      this.SearchWarrantFG.controls['PAST_REQUEST_REASON'].disable();
      this.SearchWarrantFG.controls['PAST_COMMAND'].disable();
    } else if (value === 'REQUEST_CHECK_EVER_1') {
      // this.SearchWarrantFG.controls['PAST_COURT_NAME'].enable();
      this.DIS_PAST_COURT_NAME = false;
      this.SearchWarrantFG.controls['PAST_REQUEST_REASON'].enable();
      this.SearchWarrantFG.controls['PAST_COMMAND'].enable();
    }
    else if (value === 'CONSIDER_0') {
      // this.SearchWarrantFG.controls['IS_APPROVE'].disable();
      this.SearchWarrantFG.controls.searchWarrantConsider.get('REMARK_NOT_APPROVE').disable({ onlySelf: true });

      //####### enable searchWarrant #########
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_NO').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_NO_YEAR').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_DATE').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_DATE_TIME').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_DATE_FROM').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_TIME_FROM').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_TIME_TO').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_TO_FINISH').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_DESC').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_1').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_2').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_3').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_DESC').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_1').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_2').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREAT_WARRANT_NO').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_NO_YEAR').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE_TIME').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_COURT_NAME').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_SEND_TO').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_SEND_DESC_TO').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_RESULT').enable({ onlySelf: true });

    } else if (value === 'CONSIDER_1') {
      // this.SearchWarrantFG.controls['IS_APPROVE'].enable();
      this.SearchWarrantFG.controls.searchWarrantConsider.get('REMARK_NOT_APPROVE').enable({ onlySelf: true });


      //####### dis searchWarrant #########
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_NO').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_NO_YEAR').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_DATE').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_DATE_TIME').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_DATE_FROM').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_TIME_FROM').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_TIME_TO').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_TO_FINISH').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_DESC').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_1').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_2').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_3').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_DESC').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_1').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_2').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREAT_WARRANT_NO').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_NO_YEAR').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE_TIME').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_COURT_NAME').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_SEND_TO').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_SEND_DESC_TO').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_RESULT').disable({ onlySelf: true });


      // this.SearchWarrantFG.controls.searchWarrant.disable({ onlySelf: true });
    }
  }

  selectCheckbox(e: Event) {
    const target = e.target as HTMLInputElement;
    console.log(target.checked + ' = ' + target.id);

    if (target.id === 'IS_CONSIDER') {
      this.onChangeCourtConsiderAlready(target.checked);
    }
    //###### REQUEST_CHECK_TO_FINISH ######
    if (target.id === 'REQUEST_CHECK_TO_FINISH') {
      if (target.checked) {
        this.SearchWarrantFG.controls['REQUEST_TIME_TO'].disable();
        this.SearchWarrantFG.controls['REQUEST_TIME_TO'].patchValue('23.59');
      } else {
        this.SearchWarrantFG.controls['REQUEST_TIME_TO'].enable();
        this.SearchWarrantFG.controls['REQUEST_TIME_TO'].patchValue('');
      }
    }
    //##### SEARCH_WARRANT_CHECK_TO_FINISH #####
    if (target.id === 'SEARCH_WARRANT_CHECK_TO_FINISH') {
      if (target.checked) {
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_TIME_TO').disable({ onlySelf: true });
      } else {
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_TIME_TO').enable({ onlySelf: true });
      }
    }

    //SEARCH_WARRANT_CHECK_1
    if (target.id === 'SEARCH_WARRANT_CHECK_1') {
      if (target.checked) {
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_DESC').enable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_1').enable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_2').enable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_3').enable({ onlySelf: true });
      } else {
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_DESC').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_1').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_2').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_3').disable({ onlySelf: true });
      }
    }

    //SEARCH_WARRANT_CHECK_2 เพื่อพบ
    if (target.id === 'SEARCH_WARRANT_CHECK_2') {
      if (target.checked) {
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_DESC').enable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_1').enable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_2').enable({ onlySelf: true });
      } else {
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_DESC').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_1').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_2').disable({ onlySelf: true });

        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREAT_WARRANT_NO').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE_TIME').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_COURT_NAME').disable({ onlySelf: true });
        // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_NO_YEAR').disable({ onlySelf: true });
      }
    }

    //SEARCH_WARRANT_CHECK_2_2 บุคคลที่ถูกออกหมายจับ ตามหมายจับเลขที่
    if (target.id === 'SEARCH_WARRANT_CHECK_2_2') {
      if (target.checked) {
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREAT_WARRANT_NO').enable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE').enable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE_TIME').enable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_COURT_NAME').enable({ onlySelf: true });
        // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_NO_YEAR').enable({ onlySelf: true });
      } else {
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREAT_WARRANT_NO').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE_TIME').disable({ onlySelf: true });
        this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_COURT_NAME').disable({ onlySelf: true });
        // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_NO_YEAR').disable({ onlySelf: true });
      }
    }
  }

  onChangeCourtConsiderAlready(check: boolean) {
    if (check) {
      this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_UNDECIDE_NO').enable({ onlySelf: true });
      // this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_UNDECIDE_NO_YEAR').enable({ onlySelf: true });
      this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_DECIDE_NO').enable({ onlySelf: true });
      // this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_DECIDE_NO_YEAR').enable({ onlySelf: true });
      this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_DATE').enable({ onlySelf: true });
      this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_DATE_TIME').enable({ onlySelf: true });
      this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_WITNESS_QTY').enable({ onlySelf: true });
      this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_COMMAND').enable({ onlySelf: true });

      this.SearchWarrantFG.controls.searchWarrantConsider.get('IS_APPROVE').enable({ onlySelf: true });
      // this.SearchWarrantFG.controls.searchWarrantConsider.get('REMARK_NOT_APPROVE').enable({ onlySelf: true });//

      //####### Enable searchWarrant #########
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_NO').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_NO_YEAR').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_DATE').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_DATE_TIME').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_DATE_FROM').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_TIME_FROM').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_TIME_TO').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_TO_FINISH').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREAT_WARRANT_NO').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_NO_YEAR').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE_TIME').enable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_COURT_NAME').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_SEND_TO').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_SEND_DESC_TO').enable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_RESULT').enable({ onlySelf: true });
      //####### End Enable searchWarrant #########
    } else {
      // this.SearchWarrantFG.controls['PAST_COURT_NAME'].disable();
      this.DIS_PAST_COURT_NAME = true;
      this.SearchWarrantFG.controls['PAST_REQUEST_REASON'].disable();
      this.SearchWarrantFG.controls['PAST_COMMAND'].disable();

      this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_UNDECIDE_NO').disable({ onlySelf: true });
      // this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_UNDECIDE_NO_YEAR').disable({ onlySelf: true });
      this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_DECIDE_NO').disable({ onlySelf: true });
      // this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_DECIDE_NO_YEAR').disable({ onlySelf: true });
      this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_DATE').disable({ onlySelf: true });
      this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_DATE_TIME').disable({ onlySelf: true });
      this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_WITNESS_QTY').disable({ onlySelf: true });
      this.SearchWarrantFG.controls.searchWarrantConsider.get('CONSIDER_COMMAND').disable({ onlySelf: true });

      this.SearchWarrantFG.controls.searchWarrantConsider.get('IS_APPROVE').disable({ onlySelf: true });
      // this.SearchWarrantFG.controls.searchWarrantConsider.get('REMARK_NOT_APPROVE').disable({ onlySelf: true });//



      //####### dis searchWarrant #########
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_NO').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_NO_YEAR').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_DATE').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_DATE_TIME').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_DATE_FROM').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_TIME_FROM').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_TIME_TO').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_TO_FINISH').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1').disable({ onlySelf: true });
      // เพื่อพบและยึดสิ่งของ
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_DESC').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_1').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_2').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_1_3').disable({ onlySelf: true });
      // End เพื่อพบและยึดสิ่งของ
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2').disable({ onlySelf: true });
      //เพื่อพบ
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_DESC').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_1').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_CHECK_2_2').disable({ onlySelf: true });
      // End เพื่อพบ

      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREAT_WARRANT_NO').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_NO_YEAR').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_DATE_TIME').disable({ onlySelf: true });
      // this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('ARREST_WARRANT_COURT_NAME').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_SEND_TO').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_SEND_DESC_TO').disable({ onlySelf: true });
      this.SearchWarrantFG.get('searchWarrantConsider').get('searchWarrant').get('SEARCH_WARRANT_RESULT').disable({ onlySelf: true });
    }
  }

  isCheck() {
    // const f = Object.assign(this.formData['code']);
    // if (f.toString() === 'NEW') {
    return true;
    // }
  }

  keyPress(event) {
    const allowedRegex = /[0-9\:.]/g;
    if (!event.key.match(allowedRegex)) {
      event.preventDefault();
    }
  }

  onChangeCourt = function (data) {
    const _MasCourtList = this.MasCourtList;
    if (data) {
      const result = _MasCourtList.filter(item => (item.CourtName.includes(data))).slice(0, 10);
      this.SearchMasCourtList = result;
    }
  }

  selectCourt = function (data) {
    this.lawsuitArrestFormDialog.CourtName = data.CourtName;
    this.SearchMasCourtList = [];
  };

  setSearchWarrantFG(s: SearchWarrant) {

    this.SearchWarrantFG.reset({
      ADDRESS_NO: s.response.ADDRESS_NO,
      ALLEY: s.response.ALLEY,
      BUILDING_NAME: s.response.BUILDING_NAME,
      CREATE_DATE: s.response.CREATE_DATE,
      CREATE_USER_ACCOUNT_ID: s.response.CREATE_USER_ACCOUNT_ID,
      FLOOR: s.response.FLOOR,
      GPS: s.response.GPS,
      IS_ACTIVE: s.response.IS_ACTIVE,
      IS_CONSIDER: s.response.IS_CONSIDER,
      JUDGE_FIRST_NAME: s.response.JUDGE_FIRST_NAME,
      JUDGE_LAST_NAME: s.response.JUDGE_LAST_NAME,
      JUDGE_TITLE_ID: s.response.JUDGE_TITLE_ID,
      JUDGE_TITLE_NAME_EN: s.response.JUDGE_TITLE_NAME_EN,
      JUDGE_TITLE_NAME_TH: s.response.JUDGE_TITLE_NAME_TH,
      JUDGE_TITLE_SHORT_NAME_EN: s.response.JUDGE_TITLE_SHORT_NAME_EN,
      JUDGE_TITLE_SHORT_NAME_TH: s.response.JUDGE_TITLE_SHORT_NAME_TH,
      LANE: s.response.LANE,
      PAST_COMMAND: s.response.PAST_COMMAND,
      PAST_COURT_ID: s.response.PAST_COURT_ID,
      PAST_COURT_NAME: s.response.PAST_COURT_NAME,
      PAST_REQUEST_REASON: s.response.PAST_REQUEST_REASON,
      PERSON_AGE: s.response.PERSON_AGE,
      PERSON_CAREER: s.response.PERSON_CAREER,
      PERSON_DESC: s.response.PERSON_DESC,
      PERSON_EMAIL: s.response.PERSON_EMAIL,
      PERSON_FIRST_NAME: s.response.PERSON_FIRST_NAME,
      PERSON_ID_CARD: s.response.PERSON_ID_CARD,
      PERSON_LAST_NAME: s.response.PERSON_LAST_NAME,
      PERSON_MIDDLE_NAME: s.response.PERSON_MIDDLE_NAME,
      PERSON_OTHER_NAME: s.response.PERSON_OTHER_NAME,
      PERSON_POSITION: s.response.PERSON_POSITION,
      PERSON_TEL_NO: s.response.PERSON_TEL_NO,
      PERSON_TITLE_ID: s.response.PERSON_TITLE_ID,
      PERSON_TITLE_NAME_EN: s.response.PERSON_TITLE_NAME_EN,
      PERSON_TITLE_NAME_TH: s.response.PERSON_TITLE_NAME_TH,
      PERSON_TITLE_SHORT_NAME_EN: s.response.PERSON_TITLE_SHORT_NAME_EN,
      PERSON_TITLE_SHORT_NAME_TH: s.response.PERSON_TITLE_SHORT_NAME_TH,
      PRESENT_COURT_ID: s.response.PRESENT_COURT_ID,
      PRESENT_COURT_NAME: s.response.PRESENT_COURT_NAME,
      REQUEST_CHECK_1: s.response.REQUEST_CHECK_1,
      REQUEST_CHECK_2: s.response.REQUEST_CHECK_2,
      REQUEST_CHECK_3: s.response.REQUEST_CHECK_3,
      REQUEST_CHECK_4: s.response.REQUEST_CHECK_4,
      REQUEST_CHECK_5: s.response.REQUEST_CHECK_5,
      REQUEST_CHECK_EVER: s.response.REQUEST_CHECK_EVER,
      REQUEST_CHECK_TO_FINISH: s.response.REQUEST_CHECK_TO_FINISH,
      REQUEST_CODE: s.response.REQUEST_CODE,
      REQUEST_DATE: s.response.REQUEST_DATE.substring(0, 10),
      REQUEST_DATE_TIME: s.response.REQUEST_DATE.substring(11, 16),
      REQUEST_DATE_FROM: setDateMyDatepicker(s.response.REQUEST_DATE_FROM),
      REQUEST_TIME_FROM: s.response.REQUEST_DATE_FROM.substring(11, 16),
      REQUEST_DATE_TO: s.response.REQUEST_DATE_TO.substring(11, 16),
      REQUEST_TIME_TO: s.response.REQUEST_DATE_TO.substring(11, 16),
      REQUEST_ID: s.response.REQUEST_ID,
      REQUEST_NO: s.response.REQUEST_NO,
      REQUEST_NO_YEAR: (s.response.REQUEST_NO_YEAR + 543).toString(),
      REQUEST_NO_YEAR_TEXT: (Number(s.response.REQUEST_NO_YEAR.substring(0, 4)) + 543).toString(),
      REQUEST_REASON: s.response.REQUEST_REASON,
      ROAD: s.response.ROAD,
      ROOM_NO: s.response.ROOM_NO,
      SUB_DISTRICT_ID: s.response.SUB_DISTRICT_ID,
      UPDATE_DATE: s.response.UPDATE_DATE,
      UPDATE_USER_ACCOUNT_ID: s.response.UPDATE_USER_ACCOUNT_ID,
      VILLAGE_NAME: s.response.VILLAGE_NAME,
      VILLAGE_NO: s.response.VILLAGE_NO,

      searchWarrantConsider: s.response.searchWarrantConsider, //ยังไม่ได้แก้เวลาและอื่นๆ
      searchWarrantStaff: s.response.searchWarrantStaff
    })

    /** NoticeStaff */
    // this.setFormStaffForConID(0, 3)
    s.response.searchWarrantStaff.map(m => {
      m.FULL_NAME = m.TITLE_SHORT_NAME_TH + m.FIRST_NAME + ' ' + m.LAST_NAME;
      if (m.CONTRIBUTOR_ID == '1') { this.SearchWarrantStaff.value[0] = m }
      if (m.CONTRIBUTOR_ID == '4') { this.SearchWarrantStaff.value[1] = m }
      if (m.CONTRIBUTOR_ID == '2') { this.SearchWarrantStaff.value[2] = m }
      if (m.CONTRIBUTOR_ID == '3') { this.SearchWarrantStaff.value[3] = m }
      m.IsNewItem = false;
    })
    console.log('this.SearchWarrantFG : ', this.SearchWarrantFG)
    // this.searchWarrantFG.controls['REQUEST_CODE'].setValue(s.response.REQUEST_CODE);
    // this.searchWarrantFG.controls['REQUEST_NO'].setValue(s.response.REQUEST_NO);
    // this.searchWarrantFG.controls['REQUEST_NO_YEAR'].setValue(((+s.response.REQUEST_NO_YEAR) + 543).toString());
    // this.searchWarrantFG.controls['PRESENT_COURT_NAME'].setValue(s.response.PRESENT_COURT_NAME);
    // this.searchWarrantFG.controls['REQUEST_DATE'].setValue(setDateMyDatepicker(new Date(s.response.REQUEST_DATE.substring(0, 10))));
    // this.searchWarrantFG.controls['REQUEST_DATE_TIME'].setValue(s.response.REQUEST_DATE.substring(11, 16));
    // this.searchWarrantFG.controls['REQUEST_DATE_FROM'].setValue(s.response.REQUEST_DATE_FROM.substring(11, 16));
    // this.searchWarrantFG.controls['REQUEST_DATE_TO'].setValue(s.response.REQUEST_DATE_TO.substring(11, 16));
    // this.searchWarrantFG.controls['JUDGE_TITLE_NAME_TH'].setValue(s.response.JUDGE_TITLE_NAME_TH);
    // this.searchWarrantFG.controls['JUDGE_FIRST_NAME'].setValue(s.response.JUDGE_FIRST_NAME);
    // this.searchWarrantFG.controls['JUDGE_LAST_NAME'].setValue(s.response.JUDGE_LAST_NAME);
    // this.searchWarrantFG.controls['REQUEST_DATE'].setValue(s.response.REQUEST_DATE);
    // this.searchWarrantFG.controls['REQUEST_CHECK_TO_FINISH'].setValue(s.response.REQUEST_CHECK_TO_FINISH);
    // this.searchWarrantFG.controls['REQUEST_REASON'].setValue(s.response.REQUEST_REASON);
    // this.searchWarrantFG.controls['REQUEST_CHECK_1'].setValue(s.response.REQUEST_CHECK_1);
    // this.searchWarrantFG.controls['REQUEST_CHECK_2'].setValue(s.response.REQUEST_CHECK_2);
    // this.searchWarrantFG.controls['REQUEST_CHECK_3'].setValue(s.response.REQUEST_CHECK_3);
    // this.searchWarrantFG.controls['REQUEST_CHECK_4'].setValue(s.response.REQUEST_CHECK_4);
    // this.searchWarrantFG.controls['REQUEST_CHECK_5'].setValue(s.response.REQUEST_CHECK_5);
    // // this.searchWarrantFG.controls['REQUEST_CHECK_EVER_0'].setValue(s.response.REQUEST_CHECK_EVER_0);
    // // this.searchWarrantFG.controls['REQUEST_CHECK_EVER_1'].setValue(s.response.REQUEST_CHECK_EVER_1);
    // this.searchWarrantFG.controls['PAST_COURT_NAME'].setValue(s.response.PAST_COURT_NAME);
    // // this.searchWarrantFG.controls['PAST_COURT_NAME_REASON'].setValue(s.response.PAST_COURT_NAME_REASON);
    // this.searchWarrantFG.controls['PAST_COMMAND'].setValue(s.response.PAST_COMMAND);
    // this.searchWarrantFG.controls['PERSON_POSITION'].setValue(s.response.PERSON_POSITION);
    // this.searchWarrantFG.controls['PERSON_TITLE_SHORT_NAME_TH'].setValue(s.response.PERSON_TITLE_SHORT_NAME_TH);
    // this.searchWarrantFG.controls['PERSON_FIRST_NAME'].setValue(s.response.PERSON_FIRST_NAME);
    // this.searchWarrantFG.controls['PERSON_LAST_NAME'].setValue(s.response.PERSON_LAST_NAME);
    // this.searchWarrantFG.controls['PERSON_ID_CARD'].setValue(s.response.PERSON_ID_CARD);
    // this.searchWarrantFG.controls['PERSON_AGE'].setValue(s.response.PERSON_AGE);
    // this.searchWarrantFG.controls['PERSON_CAREER'].setValue(s.response.PERSON_CAREER);
    // this.searchWarrantFG.controls['LATITUDE'].setValue(s.response.LATITUDE);
    // this.searchWarrantFG.controls['LONGITUDE'].setValue(s.response.LONGITUDE);
    // this.searchWarrantFG.controls['ADDRESS_NO'].setValue(s.response.ADDRESS_NO);
    // this.searchWarrantFG.controls['VILLAGE_NO'].setValue(s.response.VILLAGE_NO);
    // this.searchWarrantFG.controls['BUILDING_NAME'].setValue(s.response.BUILDING_NAME);
    // this.searchWarrantFG.controls['ROOM_NO'].setValue(s.response.ROOM_NO);
    // this.searchWarrantFG.controls['FLOOR'].setValue(s.response.FLOOR);
    // this.searchWarrantFG.controls['VILLAGE_NAME'].setValue(s.response.VILLAGE_NAME);
    // this.searchWarrantFG.controls['ALLEY'].setValue(s.response.ALLEY);
    // this.searchWarrantFG.controls['LANE'].setValue(s.response.LANE);
    // this.searchWarrantFG.controls['ROAD'].setValue(s.response.ROAD);
    // this.searchWarrantFG.controls['SUB_DISTRICT_ID'].setValue(s.response.SUB_DISTRICT_ID);
    // this.searchWarrantFG.controls['CONSIDER_UNDECIDE_NO'].setValue(s.response.searchWarrantConsider.CONSIDER_UNDECIDE_NO);
    // this.searchWarrantFG.controls['CONSIDER_UNDECIDE_NO_YEAR'].setValue(((+s.response.searchWarrantConsider.CONSIDER_UNDECIDE_NO_YEAR) + 543).toString());
    // this.searchWarrantFG.controls['CONSIDER_DECIDE_NO'].setValue(s.response.searchWarrantConsider.CONSIDER_DECIDE_NO);
    // this.searchWarrantFG.controls['CONSIDER_DECIDE_NO_YEAR'].setValue(((+s.response.searchWarrantConsider.CONSIDER_DECIDE_NO_YEAR) + 543).toString());
    // this.searchWarrantFG.controls['CONSIDER_DATE'].setValue(setDateMyDatepicker(new Date(s.response.searchWarrantConsider.CONSIDER_DATE.substring(0, 10))));
    // this.searchWarrantFG.controls['CONSIDER_DATE_TIME'].setValue(s.response.searchWarrantConsider.CONSIDER_DATE.substring(11, 16));
    // this.searchWarrantFG.controls['CONSIDER_WITNESS_QTY'].setValue(s.response.searchWarrantConsider.CONSIDER_WITNESS_QTY);
    // this.searchWarrantFG.controls['CONSIDER_COMMAND'].setValue(s.response.searchWarrantConsider.CONSIDER_COMMAND);
    // this.isConsiderChecked = s.response.searchWarrantConsider.IS_CONSIDER === 0;
    // if (s.response.searchWarrantConsider.IS_APPROVE === 0) {
    //   this.consider0Checked = true;
    //   this.consider1Checked = false;
    // } else {
    //   this.consider0Checked = false;
    //   this.consider1Checked = true;
    // }
    // this.searchWarrantFG.controls['REMARK_NOT_APPROVE'].setValue(s.response.searchWarrantConsider.REMARK_NOT_APPROVE);
    // this.searchWarrantFG.controls['SEARCH_WARRANT_NO'].setValue(s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_NO);
    // this.searchWarrantFG.controls['SEARCH_WARRANT_NO_YEAR'].setValue(s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_NO_YEAR);
    // this.searchWarrantFG.controls['SEARCH_WARRANT_DATE'].setValue(setDateMyDatepicker(new Date(s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE.substring(0, 10))));
    // this.searchWarrantFG.controls['SEARCH_WARRANT_DATE_TIME'].setValue(s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE.substring(11, 16));
    // this.searchWarrantFG.controls['SEARCH_WARRANT_TIME_FROM'].setValue(s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE.substring(11, 16));
    // this.searchWarrantFG.controls['SEARCH_WARRANT_DATE_FROM'].setValue(s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_FROM.substring(0, 10));
    // this.searchWarrantFG.controls['SEARCH_WARRANT_TIME_TO'].setValue(s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_DATE_TO.substring(11, 16));
    // this.searchWarrantFG.controls['SEARCH_WARRANT_CHECK_TO_FINISH'].setValue(s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_CHECK_TO_FINISH);

    // this.searchWarrantCheck1Checked = s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_CHECK_1 === 0;
    // this.searchWarrantCheck1_1Checked = s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_CHECK_1_1 === 0;
    // this.searchWarrantCheck1_2Checked = s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_CHECK_1_2 === 0;
    // this.searchWarrantCheck1_3Checked = s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_CHECK_1_3 === 0;

    // this.searchWarrantCheck2Checked = s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_CHECK_2 === 0;
    // this.searchWarrantCheck2_1Checked = s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_CHECK_2_1 === 0;
    // this.searchWarrantCheck2_2Checked = s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_CHECK_2_2 === 0;

    // this.searchWarrantFG.controls['SEARCH_WARRANT_CHECK_1_DESC'].setValue(s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_CHECK_1_DESC);
    // this.searchWarrantFG.controls['SEARCH_WARRANT_CHECK_2_DESC'].setValue(s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_CHECK_2_DESC);
    // this.searchWarrantFG.controls['ARREST_WARRANT_NO'].setValue(s.response.searchWarrantConsider.searchWarrant.ARREST_WARRANT_NO);
    // this.searchWarrantFG.controls['ARREST_WARRANT_NO_YEAR'].setValue(s.response.searchWarrantConsider.searchWarrant.ARREST_WARRANT_NO_YEAR);
    // this.searchWarrantFG.controls['ARREST_WARRANT_DATE_FROM'].setValue(setDateMyDatepicker(new Date(s.response.searchWarrantConsider.searchWarrant.ARREST_WARRANT_DATE.substring(0, 10))));
    // this.searchWarrantFG.controls['ARREST_WARRANT_DATE_TIME'].setValue(s.response.searchWarrantConsider.searchWarrant.ARREST_WARRANT_DATE.substring(11, 16));
    // this.searchWarrantFG.controls['ARREST_WARRANT_COURT_NAME'].setValue(s.response.searchWarrantConsider.searchWarrant.ARREST_WARRANT_COURT_NAME);
    // this.searchWarrantFG.controls['SEARCH_WARRANT_SEND_TO'].setValue(s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_SEND_TO);
    // this.searchWarrantFG.controls['SEARCH_WARRANT_SEND_DESC_TO'].setValue(s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_SEND_DESC_TO);
    // this.searchWarrantFG.controls['SEARCH_WARRANT_RESULT'].setValue(s.response.searchWarrantConsider.searchWarrant.SEARCH_WARRANT_RESULT);

    // // TITLE_SHORT_NAME_TH + FIRST_NAME + LAST_NAME
    // // OPREATION_POS_NAME
    // // OPREATION_OFFICE_SHORT_NAME
  }

  selectItemLocale(event: any) {
    // this.ArrestLocale.at(0).patchValue({
    //   SUB_DISTRICT_NAME_TH: event.item.SUB_DISTRICT_NAME_TH,
    //   SUB_DISTRICT_NAME_EN: event.item.SUB_DISTRICT_NAME_EN,
    //   DISTRICT_NAME_TH: event.item.DISTRICT_NAME_TH,
    //   DISTRICT_NAME_EN: event.item.DISTRICT_NAME_EN,
    //   PROVINCE_NAME_TH: event.item.PROVINCE_NAME_TH,
    //   PROVINCE_NAME_EN: event.item.PROVINCE_NAME_EN
    // });
    this.SearchWarrantFG.patchValue({
      SUB_DISTRICT_ID: event.item.SUB_DISTRICT_ID
    })
    this.invalid.next(false);
    this.ILG60_03_02_00_00_E18.next(true);
  }

  selectPersonTitle(e: any) {
    this.SearchWarrantFG.patchValue({
      PERSON_TITLE_ID: e.item.TITLE_ID,
      PERSON_TITLE_NAME_EN: e.item.TITLE_NAME_EN,
      PERSON_TITLE_NAME_TH: e.item.TITLE_NAME_TH,
      PERSON_TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN,
      PERSON_TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH
    })
  }

  selectJudgeTitle(e: any) {
    this.SearchWarrantFG.patchValue({
      JUDGE_TITLE_ID: e.item.TITLE_ID,
      JUDGE_TITLE_NAME_EN: e.item.TITLE_NAME_EN,
      JUDGE_TITLE_NAME_TH: e.item.TITLE_NAME_TH,
      JUDGE_TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN,
      JUDGE_TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH
    })
  }

  async getMasCourt() {
    await this.s_MasMaster.MasCourtgetByConAdv('', '').subscribe(res => {
      console.log('res : ', res)
      this.COURT_ALL = res as any;
    })
  }

  serachCourt = (text3$: Observable<string>) =>
    text3$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term === '' ? []
        : this.COURT_ALL
          .filter(v =>
            (`${v.COURT_NAME || ''}`.toLowerCase().indexOf(term.toLowerCase()) > -1)
          ).slice(0, 10));

  formatterCourt = (x: { COURT_NAME: string }) => x.COURT_NAME

  selectItemCourt(e: any, type: string) {
    if (type === 'PRESENT') {
      this.SearchWarrantFG.patchValue({
        PRESENT_COURT_ID: e.item.COURT_ID,
        PRESENT_COURT_NAME: e.item.COURT_NAME,
      });
    } else if (type === 'PAST') {
      this.SearchWarrantFG.patchValue({
        PAST_COURT_ID: e.item.COURT_ID,
        PAST_COURT_NAME: e.item.COURT_NAME,
      });
    }
  }

  selectItemStaff(event: any, i: number) {
    const staff = this.SearchWarrantStaff.at(i);
    const item = Object.assign(staff.value, event.item);
    let _ContributorID;
    if (i == 0) { _ContributorID = 1; } else if (i == 1) { _ContributorID = 4; } else if (i == 2) { _ContributorID = 2; } else if (i == 3) { _ContributorID = 3; }
    item.FULL_NAME = `${item.TITLE_NAME_TH || ''}${item.FIRST_NAME || ''} ${item.LAST_NAME || ''}`
    item.CONTRIBUTOR_ID = _ContributorID;
    item.IsNewItem = true;
    this.SearchWarrantStaff.at(i).patchValue(item)
    console.log('this.SearchWarrantStaff : ', this.SearchWarrantStaff.value);
  }
  formatterStaff = (x: { TITLE_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
    `${x.TITLE_NAME_TH || ''}${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`

  deleteStaff(ev: any, i: any) {

  }

  getContributorID(conId: any) {
    let result = this.CONTRIBUTOR.find(m => m.value == conId).text;
    return result;
  }

}
