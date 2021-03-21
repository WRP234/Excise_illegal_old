import { NgModule } from '@angular/core';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PreloaderService } from '../../../../shared/preloader/preloader.component';
import swal from 'sweetalert2';
import { NavigationService } from "../../../../shared/header-navigation/navigation.service";
import { MasterService } from '../../masters.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Message } from '../../../../config/message';
import { pagination } from '../../../../config/pagination';

@Component({
    selector: 'app-staff-modal',
    templateUrl: './staff-modal.component.html',
    styleUrls: ['./staff-modal.component.scss']
})

export class StaffModalComponent implements OnInit {
    advSearch: any;
    showDataList = [];
    paginage = pagination;
    dataList = [];
    printDoc = [];
    selectAllChb: any;

    isOpen = false;
    isCheckAll = false;
    document = new Array<Document>();

    @Output() c = new EventEmitter();

    //@Input() dataList = [];
    // @Input() ArrestCode: string;
    // @Input() IndictmentID: string;

    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    constructor(
        private _router: Router,
        private MasService: MasterService,
        private preloader: PreloaderService,
        private navService: NavigationService
    ) {
        this.advSearch = this.navService.showAdvSearch;
    }

    ngOnInit() {
        this.clickSearch({ TEXT_SEARCH: "" });
    }

    clickSearch(Textsearch: any) {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            ...Textsearch,
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

    onSave() {
        let _staff = this.showDataList.filter(x => x.IsCheck == true)
        if (_staff.length) {
            this.passEntry.emit(_staff);
        }
    }

    setAdvSearch() {
        this.advSearch.next(!this.advSearch.getValue());
    }

    onAdvSearch(form: any) {
        this.preloader.setShowPreloader(true);

        form.value.STATUS = "1";

        this.MasService.getByConAdv("MasStaffgetByConAdv", form.value).then(list => {
            if (list.SUCCESS) {
                this.onSearchComplete(list.RESPONSE_DATA);
                this.preloader.setShowPreloader(false);
            } else {
                this.showDataList = [];
                swal('', list.MSG, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (err: HttpErrorResponse) => {
            swal('', err.message, 'error');
            this.preloader.setShowPreloader(false);
        });
    }

    ShowAlertNoRecord() {
        swal({
            title: '',
            text: Message.noRecord,
            type: 'warning',
            confirmButtonText: 'ตกลง'
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

    selectedChkAll() {
        for (var i = 0; i < this.showDataList.length; i++) {
            this.showDataList[i].IsCheck = this.selectAllChb;
        }
    }

    checkIfAllChbSelected() {
        this.selectAllChb = this.showDataList.every(function (item: any) {
            return item.IsCheck == true;
        });
    }

    dismiss(e: any) {
        this.passEntry.emit(e);
    }

    close(e: any) {
        this.c.emit(e);
    }
}
