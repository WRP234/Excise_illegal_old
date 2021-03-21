import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from '../../masters.service';
import { HttpErrorResponse } from '@angular/common/http';
import { pagination } from '../../../../config/pagination';
import { Message } from '../../../../config/message';
import { toLocalShort, compareDate, setZeroHours } from '../../../../config/dateFormat';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { SidebarService } from '../../../../shared/sidebar/sidebar.component';
import { PreloaderService } from '../../../../shared/preloader/preloader.component';
import { MatAutocomplete } from '@angular/material';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationService } from "../../../../shared/header-navigation/navigation.service";
import { BehaviorSubject } from '../../../../../../node_modules/rxjs';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {

    advSearch: any;
    dataList = [];
    showDataList = [];
    paginage = pagination;
    modal: any;
    IS_ACTIVE: any;

    // ----- Model ------ //
    //@ViewChild('EvidenceTypeModel') evidenceTypeModel: ElementRef;

    constructor(
        private _router: Router,
        private navService: NavigationService,
        private sidebarService: SidebarService,
        private MasService: MasterService,
        private preloader: PreloaderService,
        private ngbModel: NgbModal
    ) {
        this.navService.showAdvSearch = new BehaviorSubject<Boolean>(true);
        this.advSearch = this.navService.showAdvSearch;
    }

    async ngOnInit() {
        localStorage.setItem('programcode', 'ILG60-99-15');
        this.sidebarService.setVersion('Masters 0.0.0.2');

        this.clickSearch({ TEXT_SEARCH: "" });
        
        this.IS_ACTIVE = "";
    }

    ngOnDestroy(): void { }


    clickView(masterID: string) {
        this._router.navigate([`/msTitle/manage/R/${masterID}`]);
    }


    clickNew = () => this._router.navigate([`/msTitle/manage/C/NEW`]);

    clickSearch(Textsearch: any) {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            ...Textsearch,
            TITLE_ID: ""
        }

        this.MasService.getByKeyword("MasTitlegetByCon", paramsOther).then(list => {
            if(list.SUCCESS){
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

    setAdvSearch() {
        this.advSearch.next(!this.advSearch.getValue());
    }

    onAdvSearch(form: any) {
        this.preloader.setShowPreloader(true);

        this.MasService.getByConAdv("MasTitlegetByConAdv", form.value).then(list => {
            if(list.SUCCESS){
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

        await list.map((item) => {
            switch (item.IS_ACTIVE) {
                case 0:
                    item.TxtStatus = "ไม่ใช้งาน";
                    break;
                case 1:
                    item.TxtStatus = "ใช้งาน";
                    break;
            }

            switch (item.TITLE_TYPE) {
                case 1:
                    item.TxtType = "บุคคลธรรมดา";
                    break;
                case 2:
                    item.TxtType = "นิติบุคคล";
                    break;
            }
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
}
