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
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

    advSearch: BehaviorSubject<Boolean>;
    dataList = [];
    showDataList = [];
    paginage = pagination;

    PRODUCT_GROUP_LIST = [];
    PRODUCT_GROUP_ID: string;

    PRODUCT_DUTY_LIST = [];
    PRODUCT_DUTY_CODE: string;

    PRODUCT_CATEGORY_LIST = [];
    PRODUCT_CATEGORY_ID: string;

    PRODUCT_TYPE_LIST = [];
    PRODUCT_TYPE_ID: string;

    modal: any;

    //TEMP_DEFAULTs
    public TEMP_TEXT_SEARCH: any = '';
    @ViewChild('advForm') advForm: FormGroup;

    // ----- Model ------ //
    //@ViewChild('EvidenceTypeModel') evidenceTypeModel: ElementRef;

    constructor(
        private _router: Router,
        private sidebarService: SidebarService,
        private navService: NavigationService,
        private MasService: MasterService,
        private preloader: PreloaderService,
        private ngbModel: NgbModal
    ) {
        this.advSearch = this.navService.showAdvSearch;
    }

    async ngOnInit() {
        localStorage.setItem('programcode', 'ILG60-99-06');
        this.sidebarService.setVersion('Masters 0.0.0.2');

        this.advSearch.next(true);

        this.PRODUCT_GROUP_ID = "";
        this.PRODUCT_DUTY_CODE = "";

        await this.getProductGroup();
        await this.clickSearch({ TEXT_SEARCH: "" });
    }

    ngOnDestroy(): void {
    }

    clickView(masterID: string) {
        this._router.navigate([`/msProduct/manage/R/${masterID}`]);
    }

    clickNew = () => this._router.navigate([`/msProduct/manage/C/NEW`]);

    clickSearch(Textsearch: any) {
        this.preloader.setShowPreloader(true);
        this.setDefualtInputSearch(1);

        var paramsOther = {
            ...Textsearch
        }

        this.MasService.getAPI1111("MasProductOnlygetByKeyword", paramsOther).then(list => {
            if (list) {
                this.onSearchComplete(list);
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
        this.setDefualtInputSearch(0);
        this.MasService.getAPI1111("MasProductOnlygetByConAdv", form.value).then(list => {
            if (list) {
                this.onSearchComplete(list);
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

        /** clear null string */
        list = list.map(m => {
            for (let key in m) {
                if (m[key] === 'null') {
                    m[key] = '';
                }
            }
            return m;
        });

        list = this.DateSorter(list);

        await list.map((item, i) => {
            item.index = i + 1

            if (item.CREATE_DATE)
                item.CREATE_DATE = toLocalShort(item.CREATE_DATE);

            if (item.IS_ACTIVE === 1)
                item.IS_ACTIVE_STATUS = 'ใช้งาน';
            else if (item.IS_ACTIVE === 0)
                item.IS_ACTIVE_STATUS = 'ไม่ได้ใช้งาน';
            else
                item.IS_ACTIVE_STATUS = '';

        });

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

    async getProductGroup() {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            PRODUCT_GROUP_ID: "",
            PRODUCT_GROUP_CODE: ""
        }

        await this.MasService.getAPI1111("MasProductGroupgetByCon", paramsOther).then(async list => {
            if (list) {
                this.PRODUCT_GROUP_LIST.push(...list);
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    getProductPRC() {
        // this.preloader.setShowPreloader(true);

        // this.MasService.getAPI1111("MasProductCategoryGroupPRCgetByCon", { DUTY_CODE: this.PRODUCT_GROUP_ID }).then(list => {
        //     this.PRODUCT_DUTY_LIST = [];
        //     this.PRODUCT_DUTY_LIST.push({ PRODUCT_CODE: "", DUTY_NAME: "เลือกพิกัดอัตราภาษี" });

        //     if (list) {
        //         list.forEach(element => {
        //             this.PRODUCT_DUTY_LIST.push({ PRODUCT_CODE: element.PRODUCT_CODE, DUTY_NAME: this.MappingNullData(element.LAW_DUTY_CODE) + " - " + this.MappingNullData(element.PRODUCT_NAME) });
        //         });
        //     }

        //     this.preloader.setShowPreloader(false);
        // }, (err: HttpErrorResponse) => { console.log(err); });
    }

    getProductCategory() {
        this.preloader.setShowPreloader(true);
        this.PRODUCT_CATEGORY_LIST = [];
        this.PRODUCT_TYPE_LIST = [];

        const params = {
            TEXT_SEARCH: "",
            PRODUCT_CATEGORY_CODE: "",
            PRODUCT_CATEGORY_ID: "",
            PRODUCT_GROUP_ID: this.PRODUCT_GROUP_ID
        }

        this.MasService.getAPI1111("MasProductCategorygetByCon", params).then(list => {
            if (list) {
                this.PRODUCT_CATEGORY_LIST.push(...list);
            }

            this.preloader.setShowPreloader(false);
        }, (err: HttpErrorResponse) => { console.log(err); });
    }

    getProductType() {
        this.preloader.setShowPreloader(true);
        this.PRODUCT_TYPE_LIST = [];

        const params = { PRODUCT_CATEGORY_ID: this.PRODUCT_CATEGORY_ID }

        this.MasService.getAPI1111("MasProductTypegetByCon", params).then(list => {
            if (list) {
                this.PRODUCT_TYPE_LIST.push(...list);
            }

            this.preloader.setShowPreloader(false);
        }, (err: HttpErrorResponse) => { console.log(err); });
    }

    MappingNullData(str: string) {
        return `${str == 'null' || str == null ? '' : str}`;
    }

    public DateSorter(Arr: any[] = []) {
        return Arr.sort((a, b) => {
            return <any>new Date(b.CREATE_DATE).getTime() - <any>new Date(a.CREATE_DATE).getTime();
        });
    }

    setDefualtInputSearch(type: number) {
        switch (type) {
            case 0:
                this.TEMP_TEXT_SEARCH = '';
                break;
            case 1:
                this.advForm.reset();
                break;
            default:
                break;
        }
    }


}
