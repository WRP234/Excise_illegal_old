import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewChecked, AfterViewInit, OnDestroy } from '@angular/core';
import { Ilg6003020000E28Config } from './ilg60-03-02-00-00-e28.config';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IArrestDocument } from '../../models';
import { LocalStoreage as LS, ArrayForm as AF } from '../../entities';
import swal from 'sweetalert2';
import { ArrestDocumentService } from '../../services';
import { Message } from '../../../../config/message';

@Component({
  selector: 'app-ilg60-03-02-00-00-e28',
  templateUrl: './ilg60-03-02-00-00-e28.component.html',
  styleUrls: ['./ilg60-03-02-00-00-e28.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg6003020000E28Component extends Ilg6003020000E28Config implements OnInit, OnDestroy {

  owlOption = {
    items: 5,
    nav: true,
    dots: false,
    slideBy: 5,
    margin: 10,
    responsiveClass: true
  };

  ngOnDestroy(): void {
    this.destroy();
  }

  constructor(
    private modelService: NgbModal,
    private s_Document: ArrestDocumentService
  ) {
    super();
    this.destroy();
  }

  private destroy() {
    // this.destroy$.next();
    // this.destroy$.complete();
    localStorage.removeItem(LS.TrashArrestDocument);
  }

  fileList: IArrestDocument[] = []

  ngOnInit() {
  }

  openModal(e) {
    this.modal = this.modelService.open(e, { size: 'lg', centered: true });
  }

  deleteItem(i: number) {
    if (this.isEdit) return;
    
    const doc = this.fileList[i];
    if (!doc.DOCUMENT_ID) {
      this.fileList.splice(i, 1);
      return;
    } 

    this.s_Document.DocumentupdDelete({ DOCUMENT_ID: doc.DOCUMENT_ID })
      .subscribe(x => {
        this.fileList.splice(i, 1);
      }, () => {
        swal('', Message.delFail, 'error');
      });
  }

  Ilg60O02000200_Output(event: IArrestDocument) {
    this.fileList = [...this.fileList, event]
  }
}
