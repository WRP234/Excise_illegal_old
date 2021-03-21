import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ImageDocument as imgDoc, FileType } from '../../entities';
import { IAttrachFile, IArrestDocument } from '../../models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ilg60-o-02-00-02-00',
  templateUrl: './ilg60-o-02-00-02-00.component.html',
  styleUrls: ['./ilg60-o-02-00-02-00.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg60O02000200Component implements OnInit {

  constructor() { }

  DOCUMENT_OLD_NAME: string;
  DOCUMENT_TYPE: string;
  DOCUMENT_NAME: string;
  FILE_TYPE: string;
  FILE: File;
  CONTENT: ArrayBuffer | string;
  IMAGE_SHOW: ArrayBuffer | string;
  IMAGE_TYPE: string = 'document';
  Dropdown_Show: boolean = false;
  ReqImgType: boolean = false;


  @Output() d = new EventEmitter();
  @Output() Output = new EventEmitter<IArrestDocument>();

  ngOnInit() {
    let element = document.getElementById('fileUpload') as HTMLElement;
    element.click();
  }

  public OnSelect = (e: any) => {
    this.Output.emit({
      // DATA_SOURCE: null,
      // DOCUMENT_ID: null,
      // DOCUMENT_OLD_NAME: this.DOCUMENT_OLD_NAME,
      // DOCUMENT_NAME: this.DOCUMENT_NAME,
      // DOCUMENT_TYPE: '3',
      // FILE_TYPE: this.FILE_TYPE,
      // FOLDER: 'Document',
      // IS_ACTIVE: 1,
      // REFERENCE_CODE: null,
      // CONTENT: this.CONTENT,
      // IMAGE_SHOW: this.IMAGE_SHOW
      FILE: this.FILE,
      DATA_SOURCE: null,
      DOCUMENT_ID: null,
      DOCUMENT_OLD_NAME: this.DOCUMENT_OLD_NAME,
      DOCUMENT_NAME: this.DOCUMENT_NAME,
      DOCUMENT_TYPE: '3',
      FILE_TYPE: this.FILE_TYPE,
      FOLDER: 'document',
      IS_ACTIVE: 1,
      REFERENCE_CODE: null,
      IMAGE_SHOW: this.IMAGE_SHOW
    })
    this.d.emit(e);
  };

  public dismiss = (e: any) => {
    this.d.emit(e);
  };

  onFileChange(event: any) {
    let f = event.target.files[0] as File;
    const allowedExtensionsImg = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    // if (f.name.match(allowedExtensionsImg) && f.size > 1024) {
    //   swal('', 'ขนาดของไฟล์เอกสาร/รูปภาพ ไม่เกิน 1 MB', 'warning');
    //   // , วีดิโอไม่เกิน 10 MB
    // }

    let idx = f.name.lastIndexOf('.');

    const Checked = this.DuplicateFileSize(f.size, (idx < 1) ? "" : f.name.substr(idx + 1));
    if (Checked) {
      this.FILE = f;
      this.FILE_TYPE = (idx < 1) ? "" : f.name.substr(idx + 1);
      this.DOCUMENT_OLD_NAME = f.name;
      this.DOCUMENT_NAME = f.name;
      let reader = new FileReader();

      switch (this.FILE_TYPE) {
        case FileType.xlsx:
        case FileType.xls:
          this.IMAGE_SHOW = imgDoc.xlsx;
          break;

        case FileType.doc:
        case FileType.docx:
          this.IMAGE_SHOW = imgDoc.docx;
          break;

        case FileType.pdf:
          this.IMAGE_SHOW = imgDoc.pdf;
          break;

        default:
          if (f.name.match(allowedExtensionsImg)) {
            reader.onload = () => {
              this.IMAGE_SHOW = reader.result;
              this.ReqImgType = true;
              this.Dropdown_Show = true;
            };
            reader.readAsDataURL(f);
          };
          break;
      }
    } else {
      swal({
        text: 'ไฟล์ที่เลือกมีขนาดเกินกำหนด',
        type: 'warning',
        confirmButtonText: 'ตกลง',
      }).then(t => {
        if (t.value)
          this.dismiss('Save click');
      })
    }

  }

  changeImgType() {
    if (this.IMAGE_TYPE != 'document') {
      this.ReqImgType = false;
    }
  }

  DuplicateFileSize(fileSize: any, fileType: string): boolean {
    const fileSizeMB = Number((fileSize / 1048576).toFixed(2));
    switch (fileType.toLocaleLowerCase()) {
      case FileType.mp4:
      case FileType.mov:
      case FileType.avi:
      case FileType.m4v:
      case FileType.mpg:
      case FileType.mpeg:
      case FileType.jpg:
      case FileType.jpeg:
      case FileType.png:
      case FileType.gif:
        if (fileSizeMB > 200.00)
          return false;
        break;
      default:
        if (fileSizeMB > 1.00)
          return false;
        break;
    }
    return true
  }


}
