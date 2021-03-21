import {Component, OnInit, ViewEncapsulation, ViewChild, AfterViewChecked, AfterViewInit, Output, EventEmitter} from '@angular/core';
import { Ilg6003020000E28Config } from './ilg60-03-02-00-00-e28.config';
import {FormArray, FormBuilder} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PuritycertService } from '../../puritycert.service';
import swal from 'sweetalert2';
import { Message } from '../../../../config/message';
import {Document, ArrestDocument, ArrestStaffVariable} from '../../model';
import {FileType, ImageDocument} from '../../document_puritycerts/document.component';

@Component({
  selector: 'app-ilg60-03-02-00-00-e28',
  templateUrl: './ilg60-03-02-00-00-e28.component.html',
  styleUrls: ['./ilg60-03-02-00-00-e28.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg6003020000E28Component extends Ilg6003020000E28Config implements OnInit {

  private IMAGE_SHOW: ImageDocument;

  constructor(private fb: FormBuilder,
              private suspectModalService: NgbModal,
              private puritycertService: PuritycertService) {
    super();
  }
  ngOnInit() {
    setTimeout(() => {
      if (this.DocmentsList.value.length > 0) {
        // console.log(this.DocmentsList.value);
        for (let i = 0 ; i < this.DocmentsList.value.length ; i++) {
          const type = this.DocmentsList.value[i].DOCUMENT_NAME.split('.');
          this.DocmentsList.value[i].FILE_TYPE = type[type.length - 1];

          switch ( this.DocmentsList.value[i].FILE_TYPE) {
            case FileType.xlsx:
            case FileType.xls:
              this.IMAGE_SHOW = ImageDocument.xlsx;
              this.DocmentsList.value[i].IMAGE_SHOW = this.IMAGE_SHOW;
              break;

            case FileType.doc:
            case FileType.docx:
              this.IMAGE_SHOW = ImageDocument.docx;
              this.DocmentsList.value[i].IMAGE_SHOW = this.IMAGE_SHOW;
              break;

            case FileType.pdf:
              this.IMAGE_SHOW = ImageDocument.pdf;
              this.DocmentsList.value[i].IMAGE_SHOW = this.IMAGE_SHOW;
              break;
          }
          this.fileList.push(this.DocmentsList.value[i])
          // this.Output(this.DocmentsList.value[i]);
        }
        console.log(this.fileList);
      }
    } , 1000);
  }

  // ##################################Document##################################

  fileList: Document[] = [];
  owlOption = {
    items: 5,
    nav: true,
    dots: false,
    slideBy: 5,
    margin: 10,
    responsiveClass: true
  };

  openModal(e) {
    this.modal = this.suspectModalService.open(e, { size: 'lg', centered: true });
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
        // this.preloader.setShowPreloader(true);
        this.puritycertService.DocumentupdDelete({ DOCUMENT_ID: doc.DOCUMENT_ID })
          .subscribe(x => {
            let iSuccess: any;
            iSuccess = x;
            if (iSuccess.IsSuccess === "True") {
              swal('', Message.delComplete, 'success');
              this.fileList.splice(i, 1);
              // this.preloader.setShowPreloader(false);
            } else {
              swal('', Message.delFail, 'error');
              // this.preloader.setShowPreloader(false);
            }
          });
      }
    })
  }

  Output(event: Document) {
    console.log('event : ', event);
    this.fileList = [...this.fileList, event];
    // this.fileList.map(m => {
    //     m.IsNewItem = true
    // })
    console.log(this.fileList);
    this.Doc.next(this.fileList);
  }


  // fileList: Document[] = [];
  // owlOption = {
  //   items: 5,
  //   nav: true,
  //   dots: false,
  //   slideBy: 5,
  //   margin: 10,
  //   responsiveClass: true
  // };
  //
  // openModal(e) {
  //   this.modal = this.suspectModalService.open(e, { size: 'lg', centered: true });
  // }
  // deleteItem(i: number) {
  //   // if (this.isEdit) return;
  //
  //   const doc = this.fileList[i];
  //   if (!doc.DOCUMENT_ID) {
  //     this.fileList.splice(i, 1);
  //     return;
  //   }
  //   console.log(doc);
  //   this.puritycertService.DocumentupdDelete({ DOCUMENT_ID: doc.DOCUMENT_ID })
  //     .subscribe(x => {
  //       console.log(x);
  //       this.fileList.splice(i, 1);
  //     }, () => {
  //       swal('', Message.delFail, 'error');
  //     });
  // }
  // Output(event: Document) {
  //   // console.log('Output event : ', event);
  //   this.fileList = [...this.fileList, event];
  //   this.fileList.map(m => {
  //     //     m.DOCUMENT_ID = Number(this.NOTICE_CODE)
  //     //     m.DATA_SOURCE ='?'
  //     //     m.REFERENCE_CODE = '?'
  //     m.IsNewItem = true
  //   });
  //   console.log(this.fileList);
  //   // console.log('Output this.fileList : ', this.fileList);
  //   this.Doc.next(this.fileList);
  // }
  // ##################################End Document##################################


}


