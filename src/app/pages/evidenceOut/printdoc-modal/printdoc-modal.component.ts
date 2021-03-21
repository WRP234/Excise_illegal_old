import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EvidenceOutService } from '../evidenceOut.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import swal from 'sweetalert2';

@Component({
    selector: 'app-printdoc-modal',
    templateUrl: './printdoc-modal.component.html',
    styleUrls: ['./printdoc-modal.component.scss']
})

export class PrintDocModalComponent implements OnInit {
    printDoc = [
        {
            IsChecked: false,
            DocName: 'ใบเสร็จชำระภาษี',
            DocType: 1,
            DocTypeName: 'เอกสารแนบภายใน',
            EvidenceType: "11"
        },
        {
            IsChecked: false,
            DocName: 'หนังสือแจ้งคืน',
            DocType: 1,
            DocTypeName: 'เอกสารแนบภายใน',
            EvidenceType: "11"
        },
        {
            IsChecked: false,
            DocName: 'รายการบัญชีของกลางเพื่อพิจารณาเห็นชอบ',
            DocType: 0,
            DocTypeName: 'แบบฟอร์ม',
            EvidenceType: "12"
        },
        {
            IsChecked: false,
            DocName: 'หนังสือพิจรณาเห็นชอบ',
            DocType: 1,
            DocTypeName: 'เอกสารแนบภายใน',
            EvidenceType: "12"
        },
        {
            IsChecked: false,
            DocName: 'รายการบัญชีของกลางเพื่อพิจารณาอนุมัติ',
            DocType: 0,
            DocTypeName: 'แบบฟอร์ม',
            EvidenceType: "13"
        },
        {
            IsChecked: false,
            DocName: 'รายงานผลการขายทอดตลาด',
            DocType: 1,
            DocTypeName: 'เอกสารแนบภายใน',
            EvidenceType: "13"
        },
        {
            IsChecked: false,
            DocName: 'รายการบัญชีของกลางเพื่อพิจารณาอนุมัติ',
            DocType: 0,
            DocTypeName: 'แบบฟอร์ม',
            EvidenceType: "14"
        },
        {
            IsChecked: false,
            DocName: 'รายงานผลการทำลายของกลาง',
            DocType: 1,
            DocTypeName: 'เอกสารแนบภายใน',
            EvidenceType: "14"
        },
        {
            IsChecked: false,
            DocName: 'บันทึกรับมอบของกลางจากคณะกรรมการเก็บรักษาของกลาง',
            DocType: 0,
            DocTypeName: 'แบบฟอร์ม',
            EvidenceType: "15"
        },
        {
            IsChecked: false,
            DocName: 'บันทึกรับมอบของกลางจากคณะกรรมการเก็บรักษาของกลาง',
            DocType: 1,
            DocTypeName: 'เอกสารแนบภายใน',
            EvidenceType: "15"
        },
        {
            IsChecked: false,
            DocName: 'หนังสือนำส่ง',
            DocType: 1,
            DocTypeName: 'แบบฟอร์ม',
            EvidenceType: "16"
        },
        {
            IsChecked: false,
            DocName: 'หนังสืออนุมัติ',
            DocType: 1,
            DocTypeName: 'เอกสารแนบภายใน',
            EvidenceType: "16"
        }
    ]

    @Input() moduleType: string;

    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();

    constructor(
        private EviOutService: EvidenceOutService,
        private preloader: PreloaderService
    ) { }

    ngOnInit() {
        this.printDoc = this.printDoc.filter(x => x.EvidenceType == this.moduleType);
    }

    /*onPrint(f: any) {
        let _print = this.printDoc.filter(x => x.IsChecked == true && x.DocType == 0)
        if (_print.length) {
            this.preloader.setShowPreloader(true);
            debugger
            this.revenueService.RevenueReportgetByCon(this.RevenueID)
                .subscribe(x => {
                    // const blob = new Blob([x], { type: "application/pdf" });
                    // const link = document.createElement('a');
                    // link.href = window.URL.createObjectURL(blob);
                    // link.download = `${this.RevenueID}.pdf`;
                    // link.click();
                    const file = new Blob([x], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    
                    this.preloader.setShowPreloader(false);
                }, (error) => {
                    console.error(error);
                    swal({
                        title: '',
                        text: "พบปัญหาในการพิมพ์รายงาน",
                        type: 'error',
                        confirmButtonText: 'ตกลง'
                    });

                    this.preloader.setShowPreloader(false);
                    return false;
                });
        }
        else {
            swal({
                title: '',
                text: "กรุณาเลือกเอกสารที่ต้องการพิมพ์ !!!",
                type: 'warning',
                confirmButtonText: 'ตกลง'
            });
            //alert("กรุณาเลือกเอกสารที่ต้องการพิมพ์ !!!");
        }
    }
*/
    dismiss(e: any) {
        this.d.emit(e);
    }

    close(e: any) {
        this.c.emit(e);
    }
}
