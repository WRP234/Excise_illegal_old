import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MainMasterService } from 'app/services/main-master.service';
import { InvestgateService, InvestgateDetailService } from '../services';
import { LoaderService } from 'app/core/loader/loader.service';
import { Subject } from 'rxjs';

enum SORTING { ASC, DESC }

@Component({
    selector: 'app-printdoc-modal',
    templateUrl: './printdoc-modal.component.html'
})
export class PrintdocModalComponent implements OnInit, OnDestroy {


    sort = SORTING.ASC;
    sorting = SORTING;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    @Input() investCode: string;
    @Input() investDetailId: string;

    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();

    FG: FormGroup;

    get PrintDoc(): FormArray {
        return this.FG.get('PrintDoc') as FormArray;
    }

    constructor(
        private s_masmain: MainMasterService,
        private s_invest: InvestgateService,
        private s_investDetail: InvestgateDetailService,
        private loaderService: LoaderService,
        private fb: FormBuilder
    ) { }

    async ngOnInit() {
        this.FG = this.fb.group({
            PrintDoc: this.fb.array([])
        })

        if (this.investCode) {
            this.s_invest.InvestigategetByCon(this.investCode)
                .takeUntil(this.destroy$)
                .subscribe(x => {
                    console.log(x)

                    x.InvestigateDetail.map(y => {
                        this.PrintDoc.push(
                            this.fb.group({
                                IsChecked: false,
                                InvestigateDetailID: y.INVESTIGATE_DETAIL_ID,
                                DocName: `รายงานการสืบสวนครั้งที่ ${y.INVESTIGATE_SEQUENCE}`,
                                DocType: 0,
                                DocTypeName: 'แบบฟอร์ม'
                            })
                        )
                    })

                })

        } else if (this.investDetailId) {
            this.loaderService.show()
            let invD = await this.s_investDetail.InvestigateDetailgetByCon(this.investDetailId).then(x => {
                if (!this.checkResponse(x)) return;

                this.PrintDoc.push(
                    this.fb.group({
                        IsChecked: false,
                        InvestigateDetailID: this.investDetailId,
                        DocName: `รายงานการสืบสวนครั้งที่ ${x.INVESTIGATE_SEQUENCE}`,
                        DocType: 0,
                        DocTypeName: 'แบบฟอร์ม'
                    })
                )
            })

            let doc = await this.s_masmain.MasDocumentMaingetAll('3', this.investDetailId).then(x => {

                if (!this.checkResponse(x)) return;

                x.filter(y => y.IsActive == 1)
                    .map(y => {
                        this.PrintDoc.push(
                            this.fb.group({
                                IsChecked: false,
                                InvestigateDetailID: this.investDetailId,
                                DocName: y.DataSource,
                                DocType: 3,
                                DocTypeName: 'เอกสารแนบภายใน'
                            })
                        )
                    })
            })

            Promise.all([invD, doc])

            this.loaderService.hide();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    checkResponse(res: any) {
        switch (res.IsSuccess) {
            case 'False':
            case false:
                return false;
            default:
                return true;
        }
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
            _print.map(x => {
                this.s_invest.InvestigateDetailgetByCon(x.InvestigateDetailID)
                    .subscribe(x => {
                        const file = new Blob([x], { type: 'application/pdf' });
                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                    })
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
