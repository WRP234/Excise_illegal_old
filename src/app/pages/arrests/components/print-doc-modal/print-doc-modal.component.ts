import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { MainMasterService } from 'app/services/main-master.service';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { ArrestService } from '../../services';
enum SORTING { ASC, DESC }

@Component({
  selector: 'app-Arrestprint-doc-modal',
  templateUrl: './print-doc-modal.component.html',
  styleUrls: ['./print-doc-modal.component.scss']
})
export class PrintDocModalComponent implements OnInit {

  sort = SORTING.ASC;
  sorting = SORTING;

  @Input() arrestCode: string;

  @Output() d = new EventEmitter();
  @Output() c = new EventEmitter();

  FG: FormGroup;

  get PrintDoc(): FormArray {
    return this.FG.get('PrintDoc') as FormArray;
  }

  constructor(
    private s_masmain: MainMasterService,
    private s_arrest: ArrestService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.FG = this.fb.group({
      PrintDoc: this.fb.array([
        this.fb.group({
          IsChecked: new FormControl(false),
          DocName: new FormControl('บันทึกจับกุม (ส.ส. 2/39)'),
          DocType: 0,
          DocTypeName: new FormControl('แบบฟอร์ม')
        })
      ])
    })

    // this.s_masmain.MasDocumentMaingetAll('3', this.arrestCode).then(x => {
    //   x.filter(y => y.IsActive == 1)
    //     .map(y => {
    //       this.PrintDoc.push(
    //         this.fb.group({
    //           IsChecked: false,
    //           DocName: y.DataSource,
    //           DocType: 3,
    //           DocTypeName: 'เอกสารแนบภายใน'
    //         })
    //       )
    //     })
    // })
  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.FG.setControl(formControl, itemFormArray);
    }
  }

  sortPrintDoc() {
    this.sort = (this.sort == SORTING.ASC ? SORTING.DESC : SORTING.ASC);
    let sort = this.PrintDoc.value.sort(() => -1);
    this.PrintDoc.value.map(() => this.PrintDoc.removeAt(0));
    this.setItemFormArray(sort, 'PrintDoc');
  }

  onPrint() {
    let _print = this.PrintDoc.value.filter(x => x.DocType == 0)
    if (_print.length) {
      this.s_arrest.ArrestReportgetByCon(this.arrestCode)
        .subscribe(x => {
          const file = new Blob([x], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
    }
  }

  dismiss(e: any) {
    this.d.emit(e);
  }

  close(e: any) {
    this.c.emit(e);
  }

}
