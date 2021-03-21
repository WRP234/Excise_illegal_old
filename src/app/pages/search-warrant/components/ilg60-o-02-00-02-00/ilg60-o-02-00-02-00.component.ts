import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ImageDocument as imgDoc, FileType } from '../../entities';
import { IAttrachFile, IArrestDocument } from '../../models';

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
  CONTENT: ArrayBuffer | string;
  IMAGE_SHOW: string;

  IMAGE_TYPE: String;

  @Output() d = new EventEmitter();
  @Output() Output = new EventEmitter<IArrestDocument>();

  ngOnInit() {
    let element = document.getElementById('fileUpload') as HTMLElement;
    element.click();
  }

  public dismiss = (e: any) => {
    this.Output.emit({
      DATA_SOURCE: null,
      DOCUMENT_ID: null,
      DOCUMENT_OLD_NAME: this.DOCUMENT_OLD_NAME,
      DOCUMENT_NAME: this.DOCUMENT_NAME,
      DOCUMENT_TYPE: '3',
      FILE_TYPE: this.FILE_TYPE,
      FOLDER: 'Document',
      IS_ACTIVE: 1,
      REFERENCE_CODE: null,
      CONTENT: this.CONTENT,
      IMAGE_SHOW: this.IMAGE_SHOW
    })
    this.d.emit(e);
  };

  onFileChange(event: any) {
    let f = event.target.files[0];
    let idx = f.name.lastIndexOf('.');
    this.FILE_TYPE = (idx < 1) ? "" : f.name.substr(idx + 1);
    this.DOCUMENT_OLD_NAME = f.name;
    this.DOCUMENT_NAME = f.name;
    // const allowedExtensionsImg = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
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
    }

    let reader = new FileReader();
    reader.onload = () => {
      this.CONTENT = reader.result;
    };

    reader.readAsDataURL(f);
  }
}
