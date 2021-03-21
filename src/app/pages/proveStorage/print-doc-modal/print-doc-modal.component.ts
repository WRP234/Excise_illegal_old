import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { PreloaderService } from "../../../shared/preloader/preloader.component";
import { ProveStorageService } from '../proveStorage.service';

@Component({
  selector: 'app-print-doc-modal',
  templateUrl: './print-doc-modal.component.html',
  styleUrls: ['./print-doc-modal.component.scss']
})
export class PrintDocModalComponent implements OnInit {

  constructor(private preLoaderService: PreloaderService,
    private fb: FormBuilder,
    private proveStorageService: ProveStorageService
  ) { }

  @Input() EvidenceInID: string;

  @Output() d = new EventEmitter();
  @Output() c = new EventEmitter();

  FG: FormGroup;

  get PrintDoc(): FormArray {
    return this.FG.get('PrintDoc') as FormArray;
  }

  ngOnInit() {
    this.FG = this.fb.group({
      PrintDoc: this.fb.array([
        this.fb.group({
          IsChecked: new FormControl(false),
          DocName: new FormControl('บันทึกการนำส่งของกลาง แบบ ขก.1'),
          DocType: 'ILG60_00_11_001',
          DocTypeName: new FormControl('แบบฟอร์ม')
        }),

        this.fb.group({
          IsChecked: new FormControl(false),
          DocName: new FormControl('บันทึกการตรวจรับของกลางเพื่อเก็บรักษา ขก.2'),
          DocType: 'ILG60_00_11_002',
          DocTypeName: new FormControl('แบบฟอร์ม')
        })
      ])
    });
  }

  async onPrint() {
    await this.preLoaderService.setShowPreloader(true);
    await this.PrintDoc.value.forEach(o => {

      if (o.DocType == 'ILG60_00_11_001' && o.IsChecked == true) {
        this.proveStorageService.ILG60_00_11_001(this.EvidenceInID)
          .subscribe((x) => this.displayReport(x));
      }

      else if (o.DocType == 'ILG60_00_11_002' && o.IsChecked == true) {
        this.proveStorageService.ILG60_00_11_002(this.EvidenceInID)
          .subscribe((x) => this.displayReport(x))
      }
    });

    await this.preLoaderService.setShowPreloader(false);
  }

  private displayReport(pdf: Blob) {
    const file = new Blob([pdf], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  }

  dismiss(e: any) {
    this.d.emit(e);
  }

  close(e: any) {
    this.c.emit(e);
  }

}
