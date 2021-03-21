import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, FormGroupName } from '@angular/forms';
import { PreloaderService } from "../../../shared/preloader/preloader.component";
import { EvidenceOutStorageService } from '../evidenceOutStorage.service';

@Component({
  selector: 'app-print-doc-modal',
  templateUrl: './print-doc-modal.component.html',
  styleUrls: ['./print-doc-modal.component.scss']
})
export class PrintDocModalComponent implements OnInit {

  constructor(private preLoaderService: PreloaderService,
    private fb: FormBuilder,
    private evidenceOutStorageService: EvidenceOutStorageService
  ) { }
  @Input() RevenueID: string;

  @Output() d = new EventEmitter();
  @Output() c = new EventEmitter();

  FG: FormGroup;

  get PrintDoc(): FormArray {
    return this.FG.get('PrintDoc') as FormArray;
  }

  async ngOnInit() {
    this.FG = this.fb.group({
      PrintDoc: this.fb.array([
        this.fb.group({
          chkbox: 1,
          IsChecked: new FormControl(false),
          DocName: new FormControl('รายงานนำส่งเงินรายได้'),
          DocType: 0,
          DocTypeName: new FormControl('แบบฟอร์ม')
        })
      ])
    })
  }

  async onPrint(f: any) {
    let _print = this.PrintDoc.value.filter(x => x.IsChecked == true && x.DocType == 0);
    if (_print.length) {
      await this.preLoaderService.setShowPreloader(true);
      var tempChkbox = this.FG.value.PrintDoc;
      // for (var i = 0; i < tempChkbox.length; i++) {
      //   if (tempChkbox[i].IsChecked == true) {
      //     this.revenueService.ILG60_00_07_001(this.RevenueID).subscribe(x => {
      //       const file = new Blob([x], { type: 'application/pdf' });
      //       const fileURL = URL.createObjectURL(file);
      //       window.open(fileURL);
      //       this.preLoaderService.setShowPreloader(false);
      //     })
      //   }
      // }
    }
  }

  dismiss(e: any) {
    this.d.emit(e);
  }

  close(e: any) {
    this.c.emit(e);
  }

}
