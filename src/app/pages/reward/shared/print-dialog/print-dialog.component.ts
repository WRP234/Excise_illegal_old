import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  Inject
} from '@angular/core';
import { CONFIG } from './CONFIG';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasDocumentMainService } from '../../services/master/MasDocumentMain.service';
import { NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, FormArray, FormGroupName } from '@angular/forms';
import { PreloaderService } from "../../../../shared/preloader/preloader.component";
import { RewardService } from '../../reward.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss'],
})
export class PrintDialogComponent extends CONFIG implements OnInit {


  printDoc: any[]
  sort = 'asc';
  public data: any
  isCheck = ''
  // PrintDoc = [];
  // printDocData = [];

  constructor(
    private ActiveModal: NgbActiveModal,
    private preLoaderService: PreloaderService,
    private fb: FormBuilder,
    private rewardService: RewardService
  ) {
    super();
  }
  @Output() d = new EventEmitter();
  @Output() c = new EventEmitter();

  // FG: FormGroup;
  // get PrintDoc(): FormArray {
  //   return this.FG.get('PrintDoc') as FormArray;
  // }
  async ngOnInit() {

    this.printDoc = this.data;

    console.log("reward data : ",this.data)

    // this.preLoaderService.setShowPreloader(true);
    // this.FG = this.fb.group({
    //   PrintDoc: this.printDoc1
    // this.fb.array([
    //   this.fb.group({
    //     chkbox: 1,
    //     IsChecked: new FormControl(false),
    //     DocName: new FormControl('คำข้องขอรับเงินสินบน รว.3'),
    //     DocType: 0,
    //     DocTypeName: new FormControl('แบบฟอร์ม')
    // })
    // ])
    // })
    // this.PrintDoc.push(
    // this.fb.group({ 
    //     chkbox: 2,
    //     IsChecked: new FormControl(false),
    //     DocName: new FormControl('แบบฟอร์มหนังสือมอบอำนาจ รว.10'),
    //     DocType: 0,
    //     DocTypeName: new FormControl('แบบฟอร์ม')
    // })
    // )
    this.preLoaderService.setShowPreloader(false);
  }

  sortPrintDoc() {
    // tslint:disable-next-line:triple-equals
    this.sort = this.sort == 'asc' ? 'desc' : 'asc';
    this.printDoc.sort((a, b) => {
      return -1; // asc
    });
  }
  isChecked = true;
  afterChk = [];

  onSelect(index) {
    console.log("onSelect")
    if (this.printDoc[index].checked == false) {
      this.printDoc[index].checked = true;
    } else if (this.printDoc[index].checked == true) {
      this.printDoc[index].checked = false;
    }
  }

  async onPrint(f: any) {
    console.log("onPrint")
    // let _print = this.PrintDoc.value.filter(x => x.IsChecked == true && x.DocType == 0)

    // var tempChkbox = this.FG.value.printDoc
    // for (var i = 0; i < tempChkbox.length; i++) {
    //   if (tempChkbox[i].IsChecked == true) {
    //     this.printDoc[i].checked = true
    //   }
    // }

    // this.FG = this.fb.group({
    //   PrintDoc: this.printDoc
    // })


    for (var i = 0; i < this.printDoc.length; i++) {
      if (this.printDoc[i].checked == true && this.printDoc[i].TypeName == 'RB') {
        this.rewardService.RewardReport08_001(this.printDoc[i].RequestBribeID).subscribe(x => {
          const file = new Blob([x], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.preLoaderService.setShowPreloader(false);
        })
        // console.log("คำร้องขอรับเงินสินบน : ", this.printDoc[i].DocName, "RequestBribeID : ", this.printDoc[i].RequestBribeID)
      }
      if (this.printDoc[i].checked == true && this.printDoc[i].TypeName == 'RR') {
        console.log("คำร้องขอรับเงินรางวัล : ", this.printDoc[i].DocName, "RequestRewardID : ", this.printDoc[i].RequestRewardID)
      }
      if (this.printDoc[i].checked == true && this.printDoc[i].TypeName == 'RV4') {
        console.log("RV4 : ", this.printDoc[i].DocName, "RequestBribeID : ", this.printDoc[i].RequestBribeID)
        this.rewardService.RewardReport09_001(this.printDoc[i].RequestBribeID).subscribe(x => {
          const file = new Blob([x], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.preLoaderService.setShowPreloader(false);
        })
      }
        if (this.printDoc[i].checked == true && this.printDoc[i].TypeName == 'RV5') {
          this.rewardService.RewardReport09_002(this.printDoc[i].RequestBribeID).subscribe(x => {
            const file = new Blob([x], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            this.preLoaderService.setShowPreloader(false);
          })
        }
        if (this.printDoc[i].checked == true && this.printDoc[i].TypeName == 'RV7') {
          this.rewardService.RewardReport09_003(this.printDoc[i].RequestBribeID).subscribe(x => {
            const file = new Blob([x], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            this.preLoaderService.setShowPreloader(false);
          })
        }
        if (this.printDoc[i].checked == true && this.printDoc[i].TypeName == 'RV8') {
          this.rewardService.RewardReport09_004(this.printDoc[i].RequestBribeID).subscribe(x => {
            const file = new Blob([x], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            this.preLoaderService.setShowPreloader(false);
          })
        }
      }
    

    // window.open();
    // this.preLoaderService.setShowPreloader(true);
    // let _print = this.PrintDoc.value.filter(x => x.IsChecked == true && x.DocType == 0)
    // if (_print.length) {
    //   var tempChkbox = this.FG.value.PrintDoc
    //   for (var i = 0; i < tempChkbox.length; i++) {
    //     if (tempChkbox[i].IsChecked == true) {
    //       var selected = tempChkbox[i].chkbox;
    //       // console.log("selected : ", selected)
    //       if (selected == 1) {
    //         console.log("selected 1")
    //         let reqBribeID = localStorage.getItem('ReqDTL')
    //         // console.log("reqBribeId+++ : ",reqBribeDTL)
    //         this.rewardService.RewardReport08_001(reqBribeID).subscribe(x => {
    //           const file = new Blob([x], { type: 'application/pdf' });
    //           const fileURL = URL.createObjectURL(file);
    //           window.open(fileURL);
    //           this.preLoaderService.setShowPreloader(false);
    //         })
    //       }
    //       if (selected == 2) {
    //         console.log("selected 2")
    //         let reqBribeID = localStorage.getItem('ReqDTL')
    //         this.rewardService.RewardReport08_002(reqBribeID).subscribe(x => {
    //           const file = new Blob([x], { type: 'application/pdf' });
    //           const fileURL = URL.createObjectURL(file);
    //           window.open(fileURL);
    //           this.preLoaderService.setShowPreloader(false);
    //         })
    //         this.preLoaderService.setShowPreloader(false);
    //       }
    //     }
    //   }
    // }

  }
  closeDialog() {
    this.ActiveModal.close();
  }
}
