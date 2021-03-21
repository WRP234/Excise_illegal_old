import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, FormGroupName } from '@angular/forms';
import { PreloaderService } from "../../../shared/preloader/preloader.component";
import { NoticeService } from "../notice.service"
@Component({
  selector: 'app-print-doc-modal',
  templateUrl: './print-doc-modal.component.html',
  styleUrls: ['./print-doc-modal.component.scss']
})
export class PrintDocModalComponent implements OnInit {

  // printDoc = [
  //   {
  //     DocName: 'ใบแจ้งความนำจับตามแบบ รว.1',
  //     DocType: 'แบบฟอร์ม'
  //   }, {
  //     DocName: 'ใบแจ้งความนำจับตามแบบ รว.1',
  //     DocType: 'เอกสารแนบภายใน'
  //   }, {
  //     DocName: 'ภาพหน้าจอแสดงข้อความจากผู้แจ้งความ',
  //     DocType: 'หลักฐานการแจ้งความ'
  //   }
  // ]
  constructor(private preLoaderService: PreloaderService,
    private fb: FormBuilder,
    private noticeService: NoticeService) { }
  @Input() NoticeCode: string;
  @Input() IS_AUTHORITY: number;

  @Output() d = new EventEmitter();
  @Output() c = new EventEmitter();
  FG: FormGroup;
  get PrintDoc(): FormArray {
    return this.FG.get('PrintDoc') as FormArray;
  }

  isCheck = ''
  printDoc = [];
  printDocData = [];
  async ngOnInit() {
    this.preLoaderService.setShowPreloader(false);
    this.FG = this.fb.group({
      PrintDoc: this.fb.array([])
    })

    if (this.IS_AUTHORITY === 0)
      this.PrintDoc.push(
        this.fb.group({
          chkbox: 2,
          IsChecked: new FormControl(true),
          DocName: new FormControl('ใบแจ้งความนำจับ รว.2'),
          DocType: 0,
          DocTypeName: new FormControl('แบบฟอร์ม')
        })
      )

    else if (this.IS_AUTHORITY === 1)
      this.PrintDoc.push(
        this.fb.group({
          chkbox: 1,
          IsChecked: new FormControl(true),
          DocName: new FormControl('ใบแจ้งความนำจับ รว.1'),
          DocType: 0,
          DocTypeName: new FormControl('แบบฟอร์ม')
        })
      )

  }


  async onPrint(f: any) {
    await this.preLoaderService.setShowPreloader(true);
    let _print = this.PrintDoc.value.filter(x => x.IsChecked == true && x.DocType == 0)
    if (_print.length) {
      var tempChkbox = this.FG.value.PrintDoc
      for (var i = 0; i < tempChkbox.length; i++) {
        if (tempChkbox[i].IsChecked == true) {
          var selected = tempChkbox[i].chkbox;
          if (selected == 1) {
            await this.noticeService.printRV1(this.NoticeCode).subscribe(x => {
              const file = new Blob([x], { type: 'application/pdf' });
              const fileURL = URL.createObjectURL(file);
              window.open(fileURL);
              this.preLoaderService.setShowPreloader(false);
            }, (() => { this.preLoaderService.setShowPreloader(false); }))
          } else if (selected == 2) {
            await this.noticeService.printRV2(this.NoticeCode).subscribe(x => {
              const file = new Blob([x], { type: 'application/pdf' });
              const fileURL = URL.createObjectURL(file);
              window.open(fileURL);
              this.preLoaderService.setShowPreloader(false);
            }, (() => { this.preLoaderService.setShowPreloader(false); }))
          }
        }
      }
      // this.preLoaderService.setShowPreloader(false);
    }
  }

  dismiss(e: any) {
    this.d.emit(e);
  }

  close(e: any) {
    this.c.emit(e);
  }

}
