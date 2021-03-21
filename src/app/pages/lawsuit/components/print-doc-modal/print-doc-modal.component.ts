import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { PreloaderService } from "../../../../shared/preloader/preloader.component";
import { LawsuitService } from "../../lawsuit.service";
import { MainMasterService } from 'app/services/main-master.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
enum SORTING { ASC, DESC }
@Component({
  selector: 'app-print-lawsuit-modal',
  templateUrl: './print-doc-modal.component.html',
  styleUrls: ['./print-doc-modal.component.scss']
})
export class PrintLawsuitModalComponent implements OnInit {

  sort = SORTING.ASC;
  sorting = SORTING;

  private indictmentID: number;
  private lawsuitID: number;

  private isCheckAll = false;

  constructor(
    private lawsuitService: LawsuitService,
    private activatedRoute: ActivatedRoute,
    private preLoaderService: PreloaderService,
    private s_masmain: MainMasterService,
    private fb: FormBuilder
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.indictmentID = params['IndictmentID'];
      this.lawsuitID = params['LawsuitID'];
    });
  }

  isCheck = ''
  printDoc = [];
  printDocData = [];

  @Input() IndictmentID: string;
  @Input() ArrestCode: string;
  @Input() LawsuitID: string;
  @Input() LAWSUIT_TYPE: any;
  @Input() IS_LAWSUIT: any;

  @Output() d = new EventEmitter();
  @Output() c = new EventEmitter();

  FG: FormGroup;
  get PrintDoc(): FormArray {
    return this.FG.get('PrintDoc') as FormArray;
  }

  async ngOnInit() {
    this.preLoaderService.setShowPreloader(true);
    this.FG = this.fb.group({
      PrintDoc: this.fb.array([
        this.fb.group({
          IsChecked: new FormControl(false),
          DocName: new FormControl('บันทึกรับคำกล่าวโทษ ส.ส.1/55'),
          DocType: 0,
          DocTypeName: new FormControl('แบบฟอร์ม'),
          IndexReport: 0
        }),
        this.fb.group({
          IsChecked: new FormControl(false),
          DocName: new FormControl('บันทึกคำให้การของผู้กล่าวโทษ ส.ส.2/54'),
          DocType: 0,
          DocTypeName: new FormControl('แบบฟอร์ม'),
          IndexReport: 1
        })
      ])
    });

    if (this.IS_LAWSUIT != 0)
      if (this.LAWSUIT_TYPE == 1) {
        this.PrintDoc.push(
          this.fb.group({
            IsChecked: new FormControl(false),
            DocName: new FormControl('แบบฟอร์มคำร้องขอให้เปรียบเทียบคดี คด.1'),
            DocType: 0,
            DocTypeName: new FormControl('แบบฟอร์ม'),
            IndexReport: 2
          })
        )
      }

    this.preLoaderService.setShowPreloader(false);
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
    let _print = this.PrintDoc.value.filter(x => x.IsChecked == true && x.DocType == 0)
    if (_print.length) {
      this.preLoaderService.setShowPreloader(true);

      for (let p of _print) {

        if (p.IndexReport === 0) {
          this.lawsuitService.ILG60_00_04_001(this.lawsuitID).subscribe(x => {
            const file = new Blob([x], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            this.preLoaderService.setShowPreloader(false);
          }, () => {
            this.printError();
            this.preLoaderService.setShowPreloader(false);
          });

        } else if (p.IndexReport === 1) {
          this.lawsuitService.ILG60_00_04_002(this.ArrestCode).subscribe(x => {
            const file = new Blob([x], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            this.preLoaderService.setShowPreloader(false);
          }, () => {
            this.printError();
            this.preLoaderService.setShowPreloader(false);
          });

        } else if (p.IndexReport === 2) {
          this.lawsuitService.ILG60_00_06_004(this.lawsuitID).subscribe(x => {
            const file = new Blob([x], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            this.preLoaderService.setShowPreloader(false);
          }, () => {
            this.printError();
            this.preLoaderService.setShowPreloader(false);
          });

        }

      }
    }
  }

  checkAll() {
    const p = this.PrintDoc.value
      .reduce((a, c) =>
        [...a, {
          ...c,
          IsChecked: this.isCheckAll
        }], []);

    this.setItemFormArray(p, 'PrintDoc');
  }

  checkOne() {
    console.log('PrintDoc : ', this.PrintDoc.value)
    const isChanged = this.PrintDoc.value.every(s => s.IsChecked == true);
    this.isCheckAll = isChanged;
  }

  printError = () => swal({
    title: '',
    text: "พบปัญหาในการพิมพ์รายงาน",
    type: 'error',
    confirmButtonText: 'ตกลง'
  });

  dismiss(e: any) {
    this.d.emit(e);
  }

  close(e: any) {
    this.c.emit(e);
  }

}
