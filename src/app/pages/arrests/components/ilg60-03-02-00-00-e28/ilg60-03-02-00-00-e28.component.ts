import { Component, OnInit, ViewEncapsulation, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Ilg6003020000E28Config } from './ilg60-03-02-00-00-e28.config';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IArrestDocument } from '../../models';
import { LocalStoreage as LS, ArrayForm as AF, FileType, ImageDocument as imgDoc } from '../../entities';
import swal from 'sweetalert2';
import { ArrestDocumentService } from '../../services';
import { Message } from '../../../../config/message';
import { takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { filter } from 'rxjs-compat/operator/filter';

@Component({
  selector: 'app-ilg60-03-02-00-00-e28',
  templateUrl: './ilg60-03-02-00-00-e28.component.html',
  styleUrls: ['./ilg60-03-02-00-00-e28.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg6003020000E28Component extends Ilg6003020000E28Config implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.destroy();
  }

  constructor(
    private modelService: NgbModal,
    private s_Document: ArrestDocumentService,
    private chRef: ChangeDetectorRef
  ) {
    super();
    this.destroy();
  }

  private destroy() {
    // this.destroy$.next();
    // this.destroy$.complete();
    localStorage.removeItem(LS.TrashArrestDoucment);
  }

  owlOption = {
    items: 5,
    nav: true,
    dots: false,
    slideBy: 5,
    margin: 10,
    responsiveClass: true
  }

  fileList: any[] = []

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    switch (this.mode) {
      case this.ModeAction.C:
        break;

      case this.ModeAction.R:
        this.inputData
          .pipe(takeUntil(this.destroy$))
          .subscribe(x => {
            if (!x.length) {
              this.ILG60_03_02_00_00_E28.next(true);
              return;
            } else {
              this.fileList = x.map(o => {
                let idx = o.DOCUMENT_OLD_NAME.lastIndexOf('.');
                const FILE_TYPE = (idx < 1) ? "" : o.DOCUMENT_OLD_NAME.substr(idx + 1);
                let IMAGE_SHOW;
                switch (FILE_TYPE) {
                  case FileType.xlsx:
                  case FileType.xls:
                    IMAGE_SHOW = imgDoc.xlsx;
                    break;

                  case FileType.doc:
                  case FileType.docx:
                    IMAGE_SHOW = imgDoc.docx;
                    break;

                  case FileType.pdf:
                    IMAGE_SHOW = imgDoc.pdf;
                    break;
                  case FileType.jpg:
                  case FileType.jpeg:
                  case FileType.png:
                  case FileType.gif:
                    IMAGE_SHOW = this.s_Document.getImage(o.DOCUMENT_ID);
                    break;
                }
                return { ...o, FILE_TYPE, IMAGE_SHOW, ACTION: this.Action.EDIT };
              }).filter(f => f.IS_ACTIVE == 1);

              this.ILG60_03_02_00_00_E28.next(true);

              this.emitValue(this.fileList);

              this.chRef.markForCheck();
            }

          })
        break;
    }

  }

  openModal(e) {
    this.modal = this.modelService.open(e, { size: 'lg', centered: true });
  }

  deleteItem(i: number) {
    if (this.isEdit) return;
    swal({
      title: '',
      text: 'ยืนยันการลบรายการหรือไม่',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        const doc = this.fileList[i];
        if (!doc.DOCUMENT_ID) {
          this.fileList.splice(i, 1);
          return;
        }

        this.TempDocDel.push(doc);

        this.delDoc.emit(this.TempDocDel);

        this.fileList.splice(i, 1);
      }
    })
  }

  emitValue(value: any[]) {
    const obj = Object.assign([], value);
    this.Output.emit(obj)
  }


  Ilg60O02000200_Output(event: IArrestDocument) {
    this.fileList = [...this.fileList, { ...event, ACTION: this.Action.ADD }];
    this.emitValue(this.fileList);
  }

  DownloadItem(item) {
    // this.preloader.setShowPreloader(true);
    this.s_Document.downloadFile(item.DOCUMENT_ID)
      .subscribe((data) => this.handleDownload(data, item));
  }

  handleDownload(data: any, item: any) {
    // this.preloader.setShowPreloader(false);
    var blob = URL.createObjectURL(new Blob([data], { type: '*/*' }));
    saveAs(blob, item.DOCUMENT_NAME);
  }
}
