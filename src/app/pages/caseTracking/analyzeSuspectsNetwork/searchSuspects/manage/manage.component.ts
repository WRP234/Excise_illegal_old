import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchSuspectsService } from '../../analyze-services/searchSuspects.service';
import { PERSON_INFO, IFileList } from '../../analyze-models/searchSuspects-models'
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, ControlContainer } from '@angular/forms';
import { PreloaderService } from '../../../../../shared/preloader/preloader.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { toLocalShort } from 'app/config/dateFormat';
import { Document, ImageDocument, FileType } from '../../analyze-models/searchSuspects-models'
import swal from 'sweetalert2';
import { Message } from '../../../../../config/message';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ManageComponent implements OnInit {

  /* ***detali*** */
  @ViewChild('MistreatDetail') MistreatDetail: ElementRef;
  modal: any

  public PERSON_ID: string;

  /* ***PERSON_INFO*** */
  PERSON_INFO = <PERSON_INFO>{
    PERSON_TYPE: '',
    ENTITY_TYPE: '',
    GENDER_TYPE: '',
    ID_CARD: '',
    TITLE_NAME_TH: '',
    FIRST_NAME: '',
    MIDDLE_NAME: '',
    LAST_NAME: '',
    OTHER_NAME: '',
    BIRTH_DATE: '',
    BLOOD_TYPE: '',
    RACE_NAME_TH: '',
    NATIONALITY_NAME_TH: '',
    MARITAL_STATUS: '',
    RELIGION_NAME_TH: '',
    CAREER: '',
    TEL_NO: '',
    MISTREAT_NO: '',
    EMAIL: ''
  }
  FOREIGNER_INFO = {
    PASSPORT_NO: '',
    COUNTRY_NAME_TH: '',
    PASSPORT_DATE_IN: '',
    PASSPORT_DATE_OUT: '',
    VISA_TYPE: ''
  }
  COMPANY_INFO = {
    COMPANY_REGISTRATION_NO: '',
    COMPANY_FOUND_DATE: '',
    COMPANY_LICENSE_NO: '',
    COMPANY_LICENSE_DATE_FROM: '',
    COMPANY_LICENSE_DATE_TO: '',
    EXCISE_REGISTRATION_NO: '',
    ID_CARD: ''
  }
  PERSON_RELATIONSHIPS: any[] = [];
  ADDRESS_INFO: any[] = []
  ARREST_LAWBREAKER_DETAILS: any[] = []

  // PERSON_TYPE_ARR: any = [];
  PERSON_TYPE_ARR: any;
  ENTITY_TYPE_ARR: any;
  GENDER_TYPE_ARR: any;
  // = new Array<PERSON_INFO>();

  // SearchSuspects_Form: FormGroup;

  //   get PERSON_INFO(): FormArray {
  //     return this.SearchSuspects_Form.get('PERSON_INFO') as FormArray;
  // }


  constructor(private activeRoute: ActivatedRoute,
    private searchSuspectsService: SearchSuspectsService,
    private fb: FormBuilder,
    private ngbModel: NgbModal,
    private preloaderService: PreloaderService,
    private router: Router) { }

  ngOnInit() {
    // this.createForm();
    this.ActivatedRoute();

  }

  ActivatedRoute() {
    this.activeRoute.params.subscribe(p => {
      let code = p['code']
      let mode = p['mode']
      if (mode == 'R') {
        this.getByID(code);
      }
      else if (mode == 'NEW') {
        this.PERSON_TYPE_ARR = ["คนไทย", "คนต่างชาติ"]
        this.ENTITY_TYPE_ARR = ["บุคคลธรรมดา", "นิติบุคคล"]
        this.GENDER_TYPE_ARR = ["ชาย", "หญิง"]
      }
    });
  }

  async getByID(code: string) {
    await this.preloaderService.setShowPreloader(true);
    this.PERSON_ID = code;
    await this.searchSuspectsService.PersonDetailgetByPersonId(this.PERSON_ID).subscribe(list => {
      this.createPersonInfoForm(list);
      this.createForeignerInfoForm(list.FOREIGNER_INFO);
      this.createCompanyInfoForm(list.COMPANY_INFO);
      this.createRelationshipsInfoForm(list.PERSON_RELATIONSHIPS);
      this.createAddressInfoForm(list.PERSON_ADDRESSES);
      this.createArstLawbkDetailForm(list.ARREST_LAWBREAKER_DETAILS);


      // this.PERSON_INFO.at(0).patchValue({
      //   FIRST_NAME: list.FIRST_NAME
      // })
      // this.PERSON_INFO = list.PERSON_INFO
      // console.log('this.PERSON_INFO :', this.PERSON_INFO)
      this.preloaderService.setShowPreloader(false);
    })

    // await this.searchSuspectsService.GetDocumentByCon(11, code).subscribe(async res => {
    //   this.fileList = [];
    //   let temp: any;
    //   temp = res;
    //   temp.map(m => {
    //     if (m.IS_ACTIVE === "1") {
    //       let f = m;
    //       let idx = f.FILE_PATH.lastIndexOf('.');
    //       let FILE_TYPE = (idx < 1) ? "" : f.FILE_PATH.substr(idx + 1);
    //       switch (FILE_TYPE) {
    //         case FileType.xlsx:
    //         case FileType.xls:
    //           m.IMAGE_SHOW = ImageDocument.xlsx;
    //           break;

    //         case FileType.doc:
    //         case FileType.docx:
    //           m.IMAGE_SHOW = ImageDocument.docx;
    //           break;

    //         case FileType.pdf:
    //           m.IMAGE_SHOW = ImageDocument.pdf;
    //           break;
    //       }
    //       this.fileList.push(m);
    //     }
    //   })
    //   this.preloaderService.setShowPreloader(false);
    // })

  }

  //  private createForm() {
  //   this.SearchSuspects_Form = this.fb.group({
  //     PERSON_INFO: this.fb.array([this.createPersonInfoForm()]),
  //   })
  //  }


  async createPersonInfoForm(list) {
    // let _person_type = await list.PERSON_INFO.PERSON_TYPE;
    // if (_person_type == 0) { this.PERSON_TYPE_ARR = 'คนไทย' }
    // else if (_person_type == 1) { this.PERSON_TYPE_ARR = 'คนต่างชาติ' }

    // let _entity_type = await list.PERSON_INFO.ENTITY_TYPE;
    // if (_entity_type == 0) { this.ENTITY_TYPE_ARR = 'บุคคลธรรมดา' }
    // else if (_entity_type == 1) { this.ENTITY_TYPE_ARR = 'นิติบุคคล' }

    // let _gender_type = await list.PERSON_INFO.GENDER_TYPE;
    // if (_gender_type == 0) { this.GENDER_TYPE_ARR = 'หญิง' }
    // else if (_gender_type == 1) { this.GENDER_TYPE_ARR = 'ชาย' }

    let _person_info = await list.PERSON_INFO;
    this.PERSON_INFO = await <PERSON_INFO>{
      PERSON_TYPE: _person_info.PERSON_TYPE,
      ENTITY_TYPE: _person_info.ENTITY_TYPE,
      GENDER_TYPE: _person_info.GENDER_TYPE,
      ID_CARD: _person_info.ID_CARD,
      TITLE_NAME_TH: _person_info.TITLE_NAME_TH,
      FIRST_NAME: _person_info.FIRST_NAME,
      MIDDLE_NAME: _person_info.MIDDLE_NAME,
      LAST_NAME: _person_info.LAST_NAME,
      OTHER_NAME: _person_info.OTHER_NAME,
      BIRTH_DATE: _person_info.BIRTH_DATE == null ? '' : this.searchSuspectsService.setDateStruct(_person_info.BIRTH_DATE.slice(0, 10)),
      BLOOD_TYPE: _person_info.BLOOD_TYPE,
      RACE_NAME_TH: _person_info.RACE_NAME_TH,
      NATIONALITY_NAME_TH: _person_info.NATIONALITY_NAME_TH,
      MARITAL_STATUS: _person_info.MARITAL_STATUS,
      RELIGION_NAME_TH: _person_info.RELIGION_NAME_TH,
      CAREER: _person_info.CAREER,
      TEL_NO: _person_info.TEL_NO,
      MISTREAT_NO: _person_info.MISTREAT_NO,
      EMAIL: _person_info.EMAIL

    }
  }

  async createForeignerInfoForm(list) {
    this.FOREIGNER_INFO = await {
      PASSPORT_NO: list.PASSPORT_NO,
      COUNTRY_NAME_TH: list.COUNTRY_NAME_TH,
      PASSPORT_DATE_IN: list.PASSPORT_DATE_IN,
      PASSPORT_DATE_OUT: list.PASSPORT_DATE_OUT,
      VISA_TYPE: list.VISA_TYPE
    }
  }

  async createCompanyInfoForm(list) {
    this.COMPANY_INFO = await {
      COMPANY_REGISTRATION_NO: list.COMPANY_REGISTRATION_NO,
      COMPANY_FOUND_DATE: list.COMPANY_FOUND_DATE,
      COMPANY_LICENSE_NO: list.COMPANY_LICENSE_NO,
      COMPANY_LICENSE_DATE_FROM: list.COMPANY_LICENSE_DATE_FROM,
      COMPANY_LICENSE_DATE_TO: list.COMPANY_LICENSE_DATE_TO,
      EXCISE_REGISTRATION_NO: list.EXCISE_REGISTRATION_NO,
      ID_CARD: list.ID_CARD
    }
  }

  async createRelationshipsInfoForm(list) {
    if (list.length) {
      this.PERSON_RELATIONSHIPS = await list;
    }
  }
  async createAddressInfoForm(list) {
    this.ADDRESS_INFO = await list;
  }

  async createArstLawbkDetailForm(list) {
    this.ARREST_LAWBREAKER_DETAILS = await list;
    this.ARREST_LAWBREAKER_DETAILS.map((m, i) => {
      m.OCCURRENCE_DATE = this.searchSuspectsService.setDateStruct(this.ARREST_LAWBREAKER_DETAILS[i].OCCURRENCE_DATE.slice(0, 10));
    })
  }

  clickSuspectsNetwork() {
    this.router.navigate([`/suspectsAnalyze/suspectsNetwork/${this.PERSON_ID}`]);
  }

  clickViewMistreatDetail() {
    this.modal = this.ngbModel.open(this.MistreatDetail, { size: 'lg', centered: true });
  }

  // setDateStruct(date) {
  //   let months = this.searchSuspectsService.I18N_VALUES.months;
  //   let temp = date = new Date(date);
  //   let CompDate = `${temp.getUTCDate()} ${months[temp.getMonth()]} ${temp.getUTCFullYear() + 543}`;
  //   return CompDate;
  // }

  // ##################################Document##################################
  fileList: Document[] = []
  owlOption = {
    items: 5,
    nav: true,
    dots: false,
    slideBy: 5,
    margin: 10,
    responsiveClass: true
  }

  openModal(e) {
    this.modal = this.ngbModel.open(e, { size: 'lg', centered: true });
  }
  deleteItem(i: number) {
    const doc = this.fileList[i];
    if (!doc.DOCUMENT_ID) {
      this.fileList.splice(i, 1);
      return;
    }
    swal({
      title: '',
      text: 'ยืนยันการลบรายการหรือไม่',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm!'
    }).then((result) => {
      if (result.value) {
        this.preloaderService.setShowPreloader(true);
        this.searchSuspectsService.DocumentupdDelete({ DOCUMENT_ID: doc.DOCUMENT_ID })
          .subscribe(x => {
            let iSuccess: any;
            iSuccess = x;
            if (iSuccess.IsSuccess === "True") {
              swal('', Message.delComplete, 'success');
              this.fileList.splice(i, 1);
              this.preloaderService.setShowPreloader(false);
            } else {
              swal('', Message.delFail, 'error');
              this.preloaderService.setShowPreloader(false);
            }
          });
      }
    })
  }

  Output(event: Document) {
    this.fileList = [...this.fileList, event]
    // this.fileList.map(m => {
    //     m.IsNewItem = true
    // })
  }
  // ##################################End Document##################################

}
