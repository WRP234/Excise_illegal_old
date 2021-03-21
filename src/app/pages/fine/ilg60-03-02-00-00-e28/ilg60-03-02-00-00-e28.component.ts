import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewChecked, AfterViewInit, Input } from '@angular/core';
import { Ilg6003020000E28Config } from './ilg60-03-02-00-00-e28.config';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IAttrachFile } from '../models/attrach-file';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-ilg60-03-02-00-00-e28',
  templateUrl: './ilg60-03-02-00-00-e28.component.html',
  styleUrls: ['./ilg60-03-02-00-00-e28.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg6003020000E28Component implements OnInit {
  modal: any;
  @Input() isEdit: boolean;

  constructor(
    private modelService: NgbModal
  ) {
    
  }

  collapse = new BehaviorSubject<Boolean>(false);
  toggleCollapse(event: BehaviorSubject<Boolean>): void {
    // console.log(event)
    if (event.getValue()) {
        event.next(false);
    } else {
        event.next(true);
    }
  }


  owlOption = {
    items: 5,
    nav: true,
    dots: false,
    slideBy: 5,
    margin: 10,
    responsiveClass: true
  }

  images = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  addfile =  { FILE_NAME: 'เพิ่มเอกสารแนบ', IMAGE: 'assets/images/document/add-file.png' };
  fileList: IFileList[] = [
    // { FILE_NAME: 'สส.2/53.docx', IMAGE: 'assets/images/document/doc-file.png' },
    // { FILE_NAME: 'สส.2/53.xls', IMAGE: 'assets/images/document/xlsx-file.png' },
    // { FILE_NAME: 'ใบเสร็จชำระเงิน.pdf', IMAGE: 'assets/images/document/pdf-file.png' },
    // { FILE_NAME: 'ใบเสร็จชำระเงิน.docx', IMAGE: 'assets/images/document/doc-file.png' }
  ]

  ngOnInit() {
  }

  openModal(e) {
    this.modal = this.modelService.open(e, { size: 'lg', centered: true });
  }

  deleteItem(i: number) {
    if (this.isEdit) return;
    this.fileList.splice(i, 1);
  }

  Ilg60O02000200_Output(event: IAttrachFile) {
    this.fileList = [...this.fileList, {
      FILE_NAME: event.FILE_NAME,
      IMAGE: event.IMAGE_SHOW
    }]
  }
}

interface IFileList {
  FILE_NAME: string;
  IMAGE: string;
}
