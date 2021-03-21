import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, FormGroupName } from '@angular/forms';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { ReductionService } from '../reduction.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

enum SORTING { ASC, DESC }

@Component({
  selector: 'app-print-doc-modal',
  templateUrl: './print-doc-modal.component.html',
  styleUrls: ['./print-doc-modal.component.scss'],
})

export class PrintDocModalComponent implements OnInit {

  check: any = {};
  sort = SORTING.ASC;
  sorting = SORTING;

  isCheck = '';
  // printDoc = [];
  // printDocData = [];
  printDoc: any[];
  // sort = 'asc';
  public data: any;

  FG: FormGroup;
    get PrintDoc(): FormArray {
      return this.FG.get('printDoc') as FormArray;
    }

  @Output() d = new EventEmitter();
  @Output() c = new EventEmitter();

  constructor(private preLoaderService: PreloaderService,
    private fb: FormBuilder,
    private reductionService: ReductionService,
    private ActiveModal: NgbActiveModal, ) { }

  async ngOnInit() {

    this.printDoc = this.data;
    console.log('Adjust printDoc : ', this.printDoc);
    // this.preLoaderService.setShowPreloader(true);
    // this.FG = this.fb.group({
    //   PrintDoc: this.fb.array([
    //     this.fb.group({
    //       chkbox: 1,
    //       IsChecked: new FormControl(false),
    //       DocName: new FormControl('คำร้องขอรับเงินรางวัลกรณีคดีถึงที่สุด โดยการเปรียบเทียบคดี รว. 4'),
    //       DocType: 0,
    //       DocTypeName: new FormControl('แบบฟอร์ม')
    //     })
    //   ])
    // })
    // this.PrintDoc.push(
    //   this.fb.group({
    //     chkbox: 2,
    //     IsChecked: new FormControl(false),
    //     DocName: new FormControl('คำร้องขอรับเงินรางวัลกรณีคดีถึงที่สุด โดยการพิพากษา รว. 5 '),
    //     DocType: 0,
    //     DocTypeName: new FormControl('แบบฟอร์ม')
    //   })
    // )
    // this.PrintDoc.push(
    //   this.fb.group({
    //     chkbox: 3,
    //     IsChecked: new FormControl(false),
    //     DocName: new FormControl('รายงานการจับกุมดำเนินคดีของเจ้าพนักงาน รว.7'),
    //     DocType: 0,
    //     DocTypeName: new FormControl('แบบฟอร์ม')
    //   })
    // )
    // this.PrintDoc.push(
    //   this.fb.group({
    //     chkbox: 4,
    //     IsChecked: new FormControl(false),
    //     DocName: new FormControl('แบบฟอร์มตารางการแบ่งจ่ายเงินสินบนรางวัล รว.8'),
    //     DocType: 0,
    //     DocTypeName: new FormControl('แบบฟอร์ม')
    //   })
    // )
    // this.preLoaderService.setShowPreloader(false);
  }

  onPrint(form) {
    this.preLoaderService.setShowPreloader(true);
    const _print = this.printDoc.filter(x => x.checked === true);
    console.log(_print);

    for (let i = 0; i < _print.length; i++ ) {
      this.reductionService.ReductionReport(1).subscribe(x => {
        const file = new Blob([x], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.preLoaderService.setShowPreloader(false);
      })
    }

    // if (_print.length) {
    //   const tempChkbox = this.FG.value.printDoc
    //   for (let i = 0; i < tempChkbox.length; i++) {
    //     if (tempChkbox[i].checked === true) {
    //       const selected = tempChkbox[i].chkbox;
    //       const RequestBribeID = ''
    //       if (selected == 1) {
    //         console.log("1")
    //         this.reductionService.ReductionReport(RequestBribeID).subscribe(x => {
    //           const file = new Blob([x], { type: 'application/pdf' });
    //           const fileURL = URL.createObjectURL(file);
    //           window.open(fileURL);
    //           this.preLoaderService.setShowPreloader(false);
    //         })
    //       }
    //       if (selected == 2) {
    //         console.log("2")
    //         this.reductionService.ReductionReport2(RequestBribeID).subscribe(x => {
    //           const file = new Blob([x], { type: 'application/pdf' });
    //           const fileURL = URL.createObjectURL(file);
    //           window.open(fileURL);
    //           this.preLoaderService.setShowPreloader(false);
    //         })
    //       }
    //       if (selected == 3) {
    //         console.log("3")
    //         this.reductionService.ReductionReport3(RequestBribeID).subscribe(x => {
    //           const file = new Blob([x], { type: 'application/pdf' });
    //           const fileURL = URL.createObjectURL(file);
    //           window.open(fileURL);
    //           this.preLoaderService.setShowPreloader(false);
    //         })
    //       }
    //       if (selected == 4) {
    //         console.log("4")
    //         this.reductionService.ReductionReport4(RequestBribeID).subscribe(x => {
    //           const file = new Blob([x], { type: 'application/pdf' });
    //           const fileURL = URL.createObjectURL(file);
    //           window.open(fileURL);
    //           this.preLoaderService.setShowPreloader(false);
    //         })
    //       }
    //     }
    //   }
    // }
    console.log('onPrint eiei');

  }

  onSelect(index) {
    this.printDoc[index].checked = !this.printDoc[index].checked;

    console.log(this.printDoc);
  }

  dismiss(e: any) {
    this.d.emit(e);
    this.ActiveModal.close();
  }


  // close(e: any) {
  //   this.c.emit(e);
  // }

}
