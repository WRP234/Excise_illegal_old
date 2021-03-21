import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ManageConfig } from './manage.config'
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { StaffVariable } from '../models/staff';
import { takeUntil } from 'rxjs/operators';
import { ReceivedTransferService } from '../receivedTransfer.service'
import { PreloaderService } from 'app/shared/preloader/preloader.component';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ManageComponent extends ManageConfig implements OnInit {

  constructor(private activeRoute: ActivatedRoute,
    private ngbModel: NgbModal,
    private fb: FormBuilder,
    private receivedTransferService: ReceivedTransferService,
    private preloader: PreloaderService,
  ) {
    super();
    this.createFrom();
    this.createStaffFrom();
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(p => {
      this.mode = p['mode'];

      switch (this.mode) {
        case this.ModeAction.C:
          this.setStaffByLogin();

          this.enableBtnCreate();

          console.log('evidenceInOutFG : ', this.evidenceInOutFG.getRawValue())
          break;

        case this.ModeAction.R:

          this.enableBtnEdit();
          break;
      }
    });
  }

  createFrom() {
    this.evidenceInOutFG = this.fb.group({

      EvidenceOutStaff: this.fb.array([]),
      EvidenceOutItem: this.fb.array([]),
    })
  }





  // **********************************
  // ------------ Staff -----------
  // **********************************
  createStaffFrom() {
    this.STAFF_CONTRIBUTOR = [
      { value: 61, text: 'ประธานกรรมการ', is_req: true },
      { value: 62, text: 'กรรมการ', is_req: false },
      { value: 63, text: 'กรรมการและเลขานุการ', is_req: false }
    ];

    this.createFormStaffAmount(3);
  }

  createFormStaffAmount(count: number) {
    //clear befor set
    this.clearFormArray(this.EvidenceOutStaff);

    let i: number = 0;
    do {
      let staff = this.EvidenceOutStaff.controls;

      staff.push(this.createStaffForm());

      i++;
    } while (i < count);
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  private createStaffForm = (): FormGroup => this.fb.group(StaffVariable);


  setStaffByLogin() {
    const form: any = {
      STAFF_ID: parseInt(this.localUserAccountID),
      TEXT_SEARCH: ''
    }
    this.receivedTransferService.MasStaffgetByCon(form)
      .pipe(takeUntil(this.destroy$))
      .finally(() => this.preloader.setShowPreloader(false))
      .subscribe(x => {

        let arr = [...x];

        arr = arr.reduce((accu, curr) =>
          [...accu, {
            ...curr,
            ACTION: this.Action.ADD,
            NEW_ITEM: true
          }], []);

        const obj = Object.assign({}, ...arr);

        this.setStaffOfIndex(obj, 0);

        this.evidenceInOutFG.patchValue({
          OFFICE_CODE: obj['OPERATION_OFFICE_CODE']
        });

      }, (err) =>
        this.swalFn('', `MasStaffgetByCon ${err.name}`, 'warning')
          .then(() => location.reload())
      );
  }

  setStaffOfIndex(staff: any, index: number) {
    const contributorID = this.getContributorId(index);

    this.EvidenceOutStaff.at(index).patchValue({
      ...staff,
      FULL_NAME: `${staff.TITLE_SHORT_NAME_TH || ''}${staff.FIRST_NAME || ''} ${staff.LAST_NAME || ''}`,
      CONTRIBUTOR_ID: contributorID,
      ACTION: staff.ACTION,
      NEW_ITEM: staff.NEW_ITEM,
      IS_REQUIRE: this.getIsReqStaffByContributorId(contributorID)
    });
  }


  getContributorName(index: number) {
    const t = this.STAFF_CONTRIBUTOR[index];
    return t ? t.text : '';
  }

  getContributorId(index: number) {
    const t = this.STAFF_CONTRIBUTOR[index];
    return t ? t.value : '';
  }

  getIsReqStaffByContributorId(conIn: any): boolean {
    const t = this.STAFF_CONTRIBUTOR.find(f => conIn == f.value)
    return t ? t.is_req : false;
  }

  // **********************************
  // ------------ End Staff -----------
  // **********************************




  // **********************************
  // ------------ Document -----------
  // **********************************
  owlOption = {
    items: 5,
    nav: true,
    dots: false,
    slideBy: 5,
    margin: 10,
    responsiveClass: true
  }


  deleteItem(i: number) {
    // const doc = this.fileList[i];
    // this.swalFnMulti('', 'ยืนยันการลบรายการหรือไม่', 'warning')
    //   .then((result) => {
    //     if (result.value) {
    //       if (!doc.DOCUMENT_ID) {
    //         this.fileList.splice(i, 1);
    //         return;
    //       }
    //       this.docDel.push([doc.DOCUMENT_ID].reduce((acc, curr) => { return { DOCUMENT_ID: curr } }, {}));
    //       this.fileList.splice(i, 1);
    //     }
    //   })
  }

  DownloadItem(item) {
    // this.preloader.setShowPreloader(true);
    // this.EvidenceOutService.downloadFile(item.DOCUMENT_ID)
    //   .subscribe(
    //     (data) => this.handleDownload(data, item));
  }

  handleDownload(data: any, item: any) {
    // this.preloader.setShowPreloader(false);
    // var blob = URL.createObjectURL(new Blob([data], { type: '*/*' }));
    // saveAs(blob, item.DOCUMENT_NAME);
  }

  setItemDocument(event: Document) {
    this.fileList = [...this.fileList, event] as any;
  }
  // **********************************
  // ---------- End Document ----------
  // **********************************





  // **********************************
  // ------------ Function ------------
  // **********************************
  openModal(e) {
    this.modal = this.ngbModel.open(e, { size: 'lg', centered: true });
  }

  enableBtnCreate() {
    // set false
    this.btn_onPrint.next(false);
    this.btn_onEdit.next(false);
    this.btn_onDelete.next(false);
    this.isEdit = false;
    // set true
    this.btn_onSave.next(true);
    this.btn_onCancel.next(true);
  }

  enableBtnEdit() {
    // set false
    this.btn_onSave.next(false);
    this.btn_onCancel.next(false);
    // set true  
    this.btn_onPrint.next(true);
    this.btn_onEdit.next(true);
    this.btn_onDelete.next(true);
    this.isEdit = true;
  }

}
