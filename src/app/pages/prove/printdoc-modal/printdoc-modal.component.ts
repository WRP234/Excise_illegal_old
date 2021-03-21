import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProveService } from '../prove.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import swal from 'sweetalert2';


@Component({
    selector: 'app-printdoc-modal',
    templateUrl: './printdoc-modal.component.html',
    styleUrls: ['./printdoc-modal.component.scss']
})

export class PrintDocModalComponent implements OnInit {
    printDoc = [];

    isOpen = false;
    isCheckAll = false;
    document = new Array<Document>();

    @Input() PROVE_ID: string;
    @Input() PROVE_IS_OUTSIDE: string;

    @Output() passEntry: EventEmitter<any> = new EventEmitter();
    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();

    constructor(
        private proveService: ProveService,
        private preloader: PreloaderService
    ) { }

    ngOnInit() {
        this.printDoc = [
            {
                IsChecked: false,
                DocName: 'บันทึกการตรวจรับของกลาง',
                DocType: 0,
                DocTypeName: 'แบบฟอร์ม',
                ReportName: 'ILG60-00-05-001'
            },
            {
                IsChecked: false,
                DocName: 'บัญชีของกลางและรายการการตรวจพิสูจน์ของกลาง ส.ส.2/4',
                DocType: 0,
                DocTypeName: 'แบบฟอร์ม',
                ReportName: 'ILG60-00-05-002'
            }
        ];

        if (this.PROVE_IS_OUTSIDE) {
            this.printDoc.push({
                IsChecked: false,
                DocName: 'บันทึกการตรวจพิสูจน์นอกที่ทำการ',
                DocType: 0,
                DocTypeName: 'แบบฟอร์ม',
                ReportName: 'ILG60_00_05_003'
            });
        }

        if (this.printDoc.length == 1) {
            this.printDoc = this.printDoc
                .filter(f => f.ReportName == "ILG60-00-05-002")
                .reduce((a, c) => [...a, {
                    ...c,
                    IsChecked: true
                }], []);
        }
    }

    checkAll() {
        this.printDoc = this.printDoc
            .reduce((a, c) =>
                [...a, {
                    ...c,
                    IsChecked: this.isCheckAll
                }], []);
    }

    checkOne() {
        const isChanged = this.printDoc.every(s => s.IsChecked == true);
        this.isCheckAll = isChanged;
    }

    onPrint(f: any) {
        this.printDoc.filter(x => x.ReportName == "ILG60-00-05-001" && x.IsChecked == true).map(item => {
            this.preloader.setShowPreloader(true);
            this.proveService.ILG60_00_05_001(this.PROVE_ID)
                .subscribe(x => {
                    this.displayReport(x);
                    this.preloader.setShowPreloader(false);
                }, (error) => {
                    this.reportError(error);
                    this.preloader.setShowPreloader(false);
                    return false;
                });
        });

        this.printDoc.filter(x => x.ReportName == "ILG60-00-05-002" && x.IsChecked == true).map(item => {
            this.preloader.setShowPreloader(true);
            this.proveService.ILG60_00_05_002(this.PROVE_ID)
                .subscribe(x => {
                    this.displayReport(x);
                    this.preloader.setShowPreloader(false);
                }, (error) => {
                    this.reportError(error);
                    this.preloader.setShowPreloader(false);
                    return false;
                });
        });

        this.printDoc.filter(x => x.ReportName == "ILG60_00_05_003" && x.IsChecked == true).map(item => {
            this.preloader.setShowPreloader(true);
            this.proveService.ILG60_00_05_003(this.PROVE_ID)
                .subscribe(x => {
                    this.displayReport(x);
                    this.preloader.setShowPreloader(false);
                }, (error) => {
                    this.reportError(error);
                    this.preloader.setShowPreloader(false);
                    return false;
                });
        });
    }

    private displayReport(pdf: Blob) {
        const file = new Blob([pdf], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
    }

    private reportError(errMsg) {
        console.error(errMsg);
        swal({
            title: '',
            text: "พบปัญหาในการพิมพ์รายงาน",
            type: 'error',
            confirmButtonText: 'ตกลง'
        });
    }

    dismiss(e: any) {
        this.d.emit(e);
    }
    close(e: any) {
        this.c.emit(e);
    }
}
