import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EvidenceService } from '../evidenceIn.service';
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
            DocName: 'บันทึกการตรวจรับของกลางเพื่อเก็บรักษา',
            DocType: 0,
            DocTypeName: 'แบบฟอร์ม'
        },
        {
            IsChecked: false,
            DocName: 'บันทึกการตรวจรับของกลางเพื่อเก็บรักษา',
            DocType: 0,
            DocTypeName: 'เอกสารแนบภายใน'
        }
    ]

    @Input() RevenueID: string;

    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();

    constructor(
        private EviService: EvidenceService,
        private preloader: PreloaderService
    ) { }

    ngOnInit() {
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
