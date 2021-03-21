import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProveService } from '../prove.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import swal from 'sweetalert2';
import { MasterService } from '../../masters/masters.service';
import { pagination } from '../../../config/pagination';
import { HttpErrorResponse } from '../../../../../node_modules/@angular/common/http';
import { Message } from 'app/config/message';

@Component({
    selector: 'app-pricerecommend-modal',
    templateUrl: './pricerecommend-modal.component.html',
    styleUrls: ['./pricerecommend-modal.component.scss']
})

export class PriceRecommendModalComponent implements OnInit {
    showDataList = [];
    dataList = [];

    paginage = pagination;

    isOpen = false;
    isCheckAll = false;
    document = new Array<Document>();

    @Input() PRODUCT_MODEL: any;
    // @Input() ArrestCode: string;
    // @Input() IndictmentID: string;

    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    constructor(
        private proveService: ProveService,
        private MasService: MasterService,
        private preloader: PreloaderService
    ) { }

    async ngOnInit() {
        await this.getPrice();
    }

    async getPrice() {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            STAFF_ID: ""
        }

        this.MasService.getByKeyword("MasStaffgetByCon", paramsOther).then(list => {
            if (list.SUCCESS) {
                this.onSearchComplete(list.RESPONSE_DATA);
                this.preloader.setShowPreloader(false);
            } else {
                this.showDataList = [];
                swal('', list.MSG, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (err: HttpErrorResponse) => {

            this.ShowAlertNoRecord();
            this.showDataList = [];
            this.preloader.setShowPreloader(false);
        });
    }

    async onSearchComplete(list: any) {
        this.dataList = [];

        if (!list.length) {
            this.ShowAlertNoRecord();
            this.showDataList = [];

            return false;
        }

        list.map(m => {
            m.IsCheck = false;
        })

        if (Array.isArray(list)) {
            this.dataList = list;
        } else {
            this.dataList.push(list);
        }

        // set total record
        this.paginage.TotalItems = this.dataList.length;
        this.showDataList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);
    }

    async pageChanges(event) {
        this.showDataList = await this.dataList.slice(event.startIndex - 1, event.endIndex);
    }

    ShowAlertNoRecord() {
        swal({
            title: '',
            text: Message.noRecord,
            type: 'warning',
            confirmButtonText: 'ตกลง'
        });
    }
    
    dismiss(e: any) {
        this.passEntry.emit(e);
    }
}
